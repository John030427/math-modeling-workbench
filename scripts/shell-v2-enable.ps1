# Enable MathModel Shell V2 (experiment — reverts via shell-v2-disable.ps1)
param(
  [string]$ShellDir = (Join-Path $PSScriptRoot "..\packages\shell-v2"),
  [string]$Profile = "web"
)

$ErrorActionPreference = "Stop"
$ShellDir = (Resolve-Path $ShellDir).Path
$ProfileDir = Join-Path $env:USERPROFILE ".dsh\profiles\$Profile"
$ProfilePkgPath = Join-Path $ProfileDir "package.json"
$ProfilePatchPath = Join-Path $ProfileDir "cordis.patch.yml"

Push-Location $ShellDir
npm install --silent 2>$null
npm run build
Pop-Location

$PkgName = "@math-modeling/shell-v2"
$OldSpike = "@math-modeling/harness-spike"
$profilePkg = Get-Content $ProfilePkgPath -Raw | ConvertFrom-Json

# Defensive: never let the old spike coexist with V2 (both would claim root)
if ($profilePkg.dsh.profile.bundles -contains $OldSpike) {
  $profilePkg.dsh.profile.bundles = @($profilePkg.dsh.profile.bundles | Where-Object { $_ -ne $OldSpike })
  Write-Host "[shell-v2-enable] removed stale $OldSpike from bundles"
}
if ($profilePkg.dependencies.PSObject.Properties.Name -contains $OldSpike) {
  $profilePkg.dependencies.PSObject.Properties.Remove($OldSpike)
}

if (-not $profilePkg.dependencies) { $profilePkg | Add-Member -NotePropertyName dependencies -NotePropertyValue (@{}) }
if ($profilePkg.dependencies.$PkgName) {
  $profilePkg.dependencies.$PkgName = "link:$ShellDir"
} else {
  $profilePkg.dependencies | Add-Member -NotePropertyName $PkgName -NotePropertyValue "link:$ShellDir" -Force
}
if ($profilePkg.dsh.profile.bundles -notcontains $PkgName) {
  $profilePkg.dsh.profile.bundles += $PkgName
}
$json = ($profilePkg | ConvertTo-Json -Depth 20) + "`n"
[System.IO.File]::WriteAllText($ProfilePkgPath, $json, [System.Text.UTF8Encoding]::new($false))

$scopeDir = Join-Path $ProfileDir "node_modules\@math-modeling"
$linkPath = Join-Path $scopeDir "shell-v2"
New-Item -ItemType Directory -Force -Path $scopeDir | Out-Null
if (-not (Test-Path $linkPath)) {
  cmd /c mklink /J "$linkPath" "$ShellDir" | Out-Null
}

# Profile patch contract while V2 owns root:
#   ui-layout OFF (V2 replaces it), thinking-counter OFF (footer race aborts boot),
#   dsh-mathmodeling ON (workbench/tutor provider).
$patchText = if (Test-Path $ProfilePatchPath) { Get-Content $ProfilePatchPath -Raw } else { "" }
$needUiLayout = $patchText -notmatch '(?m)^- id: ui-layout\s*$'
$needCounter  = $patchText -notmatch '- id: dsh-thinking-counter'
if ($needUiLayout -or $needCounter) {
  $append = "`n# ── MathModel Shell V2 ──`n"
  if ($needUiLayout) { $append += "- id: ui-layout`n  disabled: true`n" }
  # thinking-counter registers sidebar.footer.action without slots.inject;
  # under a custom root it races the sidebar parent and aborts the whole GUI.
  if ($needCounter) { $append += "- id: dsh-thinking-counter`n  disabled: true`n" }
  Add-Content -Path $ProfilePatchPath -Value $append -Encoding utf8
  Write-Host "[shell-v2-enable] profile patch updated (ui-layout/thinking-counter)"
}

# Re-enable dsh-mathmodeling if a stale disabled marker exists
$patchLines = Get-Content $ProfilePatchPath
$filtered = New-Object System.Collections.Generic.List[string]
for ($i = 0; $i -lt $patchLines.Count; $i++) {
  if ($patchLines[$i] -match '^- id: dsh-mathmodeling\s*$' -and ($i + 1) -lt $patchLines.Count -and $patchLines[$i + 1] -match 'disabled:\s*true') {
    $i++
    continue
  }
  $filtered.Add($patchLines[$i])
}
if ($filtered.Count -ne $patchLines.Count) {
  $filtered | Set-Content -Path $ProfilePatchPath -Encoding utf8
  Write-Host "[shell-v2-enable] re-enabled dsh-mathmodeling in profile patch"
}

Write-Host "[shell-v2-enable] Added $PkgName to profile bundles. Restart DSH web profile (or hot-assemble via super-injector) to activate."
