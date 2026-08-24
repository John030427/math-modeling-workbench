# Disable MathModel Harness spike — restore shipped ui-layout
param(
  [string]$Profile = "web"
)

$ErrorActionPreference = "Stop"
$ProfileDir = Join-Path $env:USERPROFILE ".dsh\profiles\$Profile"
$ProfilePkgPath = Join-Path $ProfileDir "package.json"
$PkgName = "@math-modeling/harness-spike"

$profilePkg = Get-Content $ProfilePkgPath -Raw | ConvertFrom-Json
$profilePkg.dsh.profile.bundles = @($profilePkg.dsh.profile.bundles | Where-Object { $_ -ne $PkgName })
if ($profilePkg.dependencies.$PkgName) {
  $profilePkg.dependencies.Remove($PkgName)
}
($profilePkg | ConvertTo-Json -Depth 20) + "`n" | Set-Content -Path $ProfilePkgPath -Encoding utf8

$linkPath = Join-Path $ProfileDir "node_modules\@math-modeling\harness-spike"
if (Test-Path $linkPath) {
  Remove-Item $linkPath -Force -ErrorAction SilentlyContinue
}

Write-Host "[harness-disable] Removed $PkgName from profile. Restart DSH to restore ui-layout."
