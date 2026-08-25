# Disable MathModel Harness spike — restore shipped ui-layout
param(
  [string]$Profile = "web"
)

$ErrorActionPreference = "Stop"
$ProfileDir = Join-Path $env:USERPROFILE ".dsh\profiles\$Profile"
$ProfilePkgPath = Join-Path $ProfileDir "package.json"
$ProfilePatchPath = Join-Path $ProfileDir "cordis.patch.yml"
$PkgName = "@math-modeling/harness-spike"

$profilePkg = Get-Content $ProfilePkgPath -Raw | ConvertFrom-Json
$profilePkg.dsh.profile.bundles = @($profilePkg.dsh.profile.bundles | Where-Object { $_ -ne $PkgName })
if ($profilePkg.dependencies.PSObject.Properties.Name -contains $PkgName) {
  $profilePkg.dependencies.PSObject.Properties.Remove($PkgName)
}
$json = ($profilePkg | ConvertTo-Json -Depth 20) + "`n"
[System.IO.File]::WriteAllText($ProfilePkgPath, $json, [System.Text.UTF8Encoding]::new($false))

$linkPath = Join-Path $ProfileDir "node_modules\@math-modeling\harness-spike"
if (Test-Path $linkPath) {
  cmd /c rmdir "$linkPath" 2>$null
}

# Remove ui-layout / thinking-counter disabled markers from profile patch
if (Test-Path $ProfilePatchPath) {
  $lines = Get-Content $ProfilePatchPath
  $out = New-Object System.Collections.Generic.List[string]
  for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    if ($line -match 'MathModel Harness Spike|Live Gate|Disable shipped three-column|thinking-counter registers') { continue }
    if ($line -match '^- id: ui-layout\s*$' -and ($i + 1) -lt $lines.Count -and $lines[$i + 1] -match 'disabled:\s*true') {
      $i++
      continue
    }
    if ($line -match '^- id: dsh-thinking-counter\s*$' -and ($i + 1) -lt $lines.Count -and $lines[$i + 1] -match 'disabled:\s*true') {
      $i++
      continue
    }
    $out.Add($line)
  }
  $out | Set-Content -Path $ProfilePatchPath -Encoding utf8
}

Write-Host "[harness-disable] Removed $PkgName; re-enabled ui-layout. Restart DSH to restore stock UI."
