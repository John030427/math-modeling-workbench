# Disable MathModel Shell V2 — restore stock DSH layout (ui-layout back on)
param(
  [string]$Profile = "web"
)

$ErrorActionPreference = "Stop"
$ProfileDir = Join-Path $env:USERPROFILE ".dsh\profiles\$Profile"
$ProfilePkgPath = Join-Path $ProfileDir "package.json"
$ProfilePatchPath = Join-Path $ProfileDir "cordis.patch.yml"
$PkgName = "@math-modeling/shell-v2"

$profilePkg = Get-Content $ProfilePkgPath -Raw | ConvertFrom-Json
$profilePkg.dsh.profile.bundles = @($profilePkg.dsh.profile.bundles | Where-Object { $_ -ne $PkgName })
if ($profilePkg.dependencies.PSObject.Properties.Name -contains $PkgName) {
  $profilePkg.dependencies.PSObject.Properties.Remove($PkgName)
}
$json = ($profilePkg | ConvertTo-Json -Depth 20) + "`n"
[System.IO.File]::WriteAllText($ProfilePkgPath, $json, [System.Text.UTF8Encoding]::new($false))

$linkPath = Join-Path $ProfileDir "node_modules\@math-modeling\shell-v2"
if (Test-Path $linkPath) {
  cmd /c rmdir "$linkPath" 2>$null
}

# Remove V2 markers from profile patch: ui-layout / thinking-counter come back on
if (Test-Path $ProfilePatchPath) {
  $lines = Get-Content $ProfilePatchPath
  $out = New-Object System.Collections.Generic.List[string]
  for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    if ($line -match '── MathModel Shell V2 ──') { continue }
    if ($line -match '^- id: ui-layout\s*$' -and ($i + 1) -lt $lines.Count -and $lines[$i + 1] -match 'disabled:\s*true') {
      $i++; continue
    }
    if ($line -match '^- id: dsh-thinking-counter\s*$' -and ($i + 1) -lt $lines.Count -and $lines[$i + 1] -match 'disabled:\s*true') {
      $i++; continue
    }
    $out.Add($line)
  }
  $out | Set-Content -Path $ProfilePatchPath -Encoding utf8
}

Write-Host "[shell-v2-disable] Removed $PkgName; restored ui-layout. Restart DSH for stock UI."
