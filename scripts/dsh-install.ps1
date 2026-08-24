# Install @math-modeling/dsh-mathmodeling into DSH web profile (super-injector).
param(
  [string]$PluginDir = (Join-Path $PSScriptRoot "..\packages\dsh-mathmodeling"),
  [string]$Profile = "web"
)

$ErrorActionPreference = "Stop"
$PluginDir = (Resolve-Path $PluginDir).Path

Write-Host "[dsh-install] Building registry snapshot..."
Write-Host "[dsh-install] Building packages..."
Push-Location (Join-Path $PSScriptRoot "..\packages\core")
npm install --silent 2>$null; npm run build
Pop-Location
Push-Location (Join-Path $PSScriptRoot "..\packages\ui")
npm install --silent 2>$null; npm run build
Pop-Location
Push-Location $PluginDir
npm install --silent 2>$null; npm run build
Pop-Location

$NpxCheckout = "C:\Users\Administrator\AppData\Local\npm-cache\_npx\1e7f6d9597241db0"
$Ck = Join-Path $NpxCheckout "node_modules\@deepseek-ai"

if (-not (Test-Path (Join-Path $PluginDir "lib\index.js"))) {
  throw "Plugin lib/index.js missing — build failed?"
}

# Junction bare imports → scoped DSH deps (precompiled package pattern)
$Nm = Join-Path $PluginDir "node_modules"
New-Item -ItemType Directory -Force -Path $Nm | Out-Null
foreach ($pair in @(
    @("schemastery", "schemastery"),
    @("cordis", "cordis"),
    @("cosmokit", "cosmokit")
  )) {
  $link = Join-Path $Nm $pair[0]
  $target = Join-Path $Ck $pair[1]
  if (-not (Test-Path $target)) {
    Write-Warning "[dsh-install] scoped dep missing: $target — host may fail to load"
    continue
  }
  if (Test-Path $link) { continue }
  cmd /c mklink /J "$link" "$target" | Out-Null
  Write-Host "[dsh-install] linked $link -> $target"
}

Write-Host "[dsh-install] dev_install_package dir=$PluginDir profile=$Profile"
$PkgName = "@math-modeling/dsh-mathmodeling"
$ProfileDir = Join-Path $env:USERPROFILE ".dsh\profiles\$Profile"
$ProfilePkgPath = Join-Path $ProfileDir "package.json"

if (-not (Test-Path $ProfilePkgPath)) {
  throw "DSH profile not found: $ProfileDir"
}

# Persist: profile package.json + node_modules junction (same as dev_install_package)
$profilePkg = Get-Content $ProfilePkgPath -Raw | ConvertFrom-Json
if (-not $profilePkg.dependencies) { $profilePkg | Add-Member -NotePropertyName dependencies -NotePropertyValue (@{}) }
if (-not $profilePkg.dsh) { $profilePkg | Add-Member -NotePropertyName dsh -NotePropertyValue (@{}) }
if (-not $profilePkg.dsh.profile) { $profilePkg | Add-Member -NotePropertyName profile -NotePropertyValue (@{}) -Force }
if (-not $profilePkg.dsh.profile.bundles) { $profilePkg.dsh.profile | Add-Member -NotePropertyName bundles -NotePropertyValue @() }

$steps = @()
if (-not $profilePkg.dependencies.$PkgName) {
  $profilePkg.dependencies | Add-Member -NotePropertyName $PkgName -NotePropertyValue "link:$PluginDir" -Force
  $steps += "dependencies += $PkgName"
} else { $steps += "dependencies already present" }

if ($profilePkg.dsh.profile.bundles -notcontains $PkgName) {
  $profilePkg.dsh.profile.bundles += $PkgName
  $steps += "bundles += $PkgName"
} else { $steps += "bundles already present" }

($profilePkg | ConvertTo-Json -Depth 20) + "`n" | Set-Content -Path $ProfilePkgPath -Encoding utf8

$scopeDir = Join-Path $ProfileDir "node_modules\@math-modeling"
$linkPath = Join-Path $scopeDir "dsh-mathmodeling"
New-Item -ItemType Directory -Force -Path $scopeDir | Out-Null
if (-not (Test-Path $linkPath)) {
  cmd /c mklink /J "$linkPath" "$PluginDir" | Out-Null
  $steps += "profile node_modules link created"
} else { $steps += "profile node_modules link exists" }

# Re-enable plugin if profile cordis.patch disabled it
$ProfilePatchPath = Join-Path $ProfileDir "cordis.patch.yml"
if (Test-Path $ProfilePatchPath) {
  $lines = Get-Content $ProfilePatchPath
  $filtered = @()
  for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    if ($line -match 'dsh-mathmodeling' -and $line -match 'disabled:\s*true') { continue }
    if ($line -match '^- id: dsh-mathmodeling\s*$' -and ($i + 1) -lt $lines.Count -and $lines[$i + 1] -match 'disabled:\s*true') {
      $i++
      continue
    }
    $filtered += $line
  }
  if ($filtered.Count -ne $lines.Count) {
    $filtered | Set-Content -Path $ProfilePatchPath -Encoding utf8
    $steps += "re-enabled dsh-mathmodeling in profile patch"
  }
}

# Hot load via super-injector HTTP API (when DSH is running)
$BaseUrl = "http://127.0.0.1:3080"
try {
  $body = @{ dir = $PluginDir } | ConvertTo-Json
  $resp = Invoke-RestMethod -Uri "$BaseUrl/super-injector/api/inject" -Method Post -ContentType "application/json" -Body $body -TimeoutSec 30
  $steps += "hot inject: $($resp.result)"
} catch {
  Write-Warning "[dsh-install] hot inject skipped (DSH may be offline): $_"
  $steps += "hot inject skipped — restart DSH or run inject when online"
}

Write-Host ($steps -join "`n")
Write-Host "[dsh-install] Done. Refresh DSH browser to load client module."
