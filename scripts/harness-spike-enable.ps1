# Enable MathModel Harness spike (experiment — reverts via harness-spike-disable.ps1)
param(
  [string]$HarnessDir = (Join-Path $PSScriptRoot "..\packages\harness-spike"),
  [string]$Profile = "web"
)

$ErrorActionPreference = "Stop"
$HarnessDir = (Resolve-Path $HarnessDir).Path
$ProfileDir = Join-Path $env:USERPROFILE ".dsh\profiles\$Profile"
$ProfilePkgPath = Join-Path $ProfileDir "package.json"
$ProfilePatchPath = Join-Path $ProfileDir "cordis.patch.yml"

Push-Location $HarnessDir
npm install --silent 2>$null
npm run build
Pop-Location

$PkgName = "@math-modeling/harness-spike"
$profilePkg = Get-Content $ProfilePkgPath -Raw | ConvertFrom-Json
if (-not $profilePkg.dependencies) { $profilePkg | Add-Member -NotePropertyName dependencies -NotePropertyValue (@{}) }
if ($profilePkg.dependencies.$PkgName) {
  $profilePkg.dependencies.$PkgName = "link:$HarnessDir"
} else {
  $profilePkg.dependencies | Add-Member -NotePropertyName $PkgName -NotePropertyValue "link:$HarnessDir" -Force
}
if ($profilePkg.dsh.profile.bundles -notcontains $PkgName) {
  $profilePkg.dsh.profile.bundles += $PkgName
}
($profilePkg | ConvertTo-Json -Depth 20) + "`n" | Set-Content -Path $ProfilePkgPath -Encoding utf8

$scopeDir = Join-Path $ProfileDir "node_modules\@math-modeling"
$linkPath = Join-Path $scopeDir "harness-spike"
New-Item -ItemType Directory -Force -Path $scopeDir | Out-Null
if (-not (Test-Path $linkPath)) {
  cmd /c mklink /J "$linkPath" "$HarnessDir" | Out-Null
}

# Re-enable mathmodeling plugin if profile disabled it
$patchLines = Get-Content $ProfilePatchPath
$filtered = @()
for ($i = 0; $i -lt $patchLines.Count; $i++) {
  if ($patchLines[$i] -match '^- id: dsh-mathmodeling\s*$' -and ($i + 1) -lt $patchLines.Count -and $patchLines[$i + 1] -match 'disabled:\s*true') {
    $i++
    continue
  }
  $filtered += $patchLines[$i]
}
if ($filtered.Count -ne $patchLines.Count) {
  $filtered | Set-Content -Path $ProfilePatchPath -Encoding utf8
  Write-Host "[harness-enable] re-enabled dsh-mathmodeling in profile patch"
}

Write-Host "[harness-enable] Added $PkgName to profile bundles. Restart DSH web profile to load layout."
Write-Host "[harness-enable] ui-layout will be disabled via harness-spike bundle patch."
