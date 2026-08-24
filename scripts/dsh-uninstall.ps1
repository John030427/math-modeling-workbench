# Uninstall @math-modeling/dsh-mathmodeling from DSH web profile.
param(
  [string]$Match = "dsh-mathmodeling",
  [string]$Profile = "web"
)

$ErrorActionPreference = "Stop"
Write-Host "[dsh-uninstall] match=$Match profile=$Profile"

$BaseUrl = "http://127.0.0.1:3080"
try {
  $body = @{ match = $Match } | ConvertTo-Json
  $resp = Invoke-RestMethod -Uri "$BaseUrl/super-injector/api/uninstall" -Method Post -ContentType "application/json" -Body $body -TimeoutSec 30
  Write-Host $resp.result
} catch {
  Write-Warning "[dsh-uninstall] hot uninstall skipped: $_"
}

# Remove from profile package.json + junction
$PkgName = "@math-modeling/dsh-mathmodeling"
$ProfileDir = Join-Path $env:USERPROFILE ".dsh\profiles\$Profile"
$ProfilePkgPath = Join-Path $ProfileDir "package.json"
if (Test-Path $ProfilePkgPath) {
  $profilePkg = Get-Content $ProfilePkgPath -Raw | ConvertFrom-Json
  if ($profilePkg.dependencies.PSObject.Properties.Name -contains $PkgName) {
    $profilePkg.dependencies.PSObject.Properties.Remove($PkgName)
  }
  if ($profilePkg.dsh.profile.bundles) {
    $profilePkg.dsh.profile.bundles = @($profilePkg.dsh.profile.bundles | Where-Object { $_ -ne $PkgName })
  }
  ($profilePkg | ConvertTo-Json -Depth 20) + "`n" | Set-Content -Path $ProfilePkgPath -Encoding utf8
}

$linkPath = Join-Path $ProfileDir "node_modules\@math-modeling\dsh-mathmodeling"
if (Test-Path $linkPath) { Remove-Item $linkPath -Force -Recurse -ErrorAction SilentlyContinue }

Write-Host "[dsh-uninstall] Done. Refresh DSH browser."
