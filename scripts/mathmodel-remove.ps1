# Remove the mathmodel product entirely: stop the instance, delete the profile dir.
# The `web` profile is NEVER touched.
param(
  [string]$ProfileName = "mathmodel",
  [int]$Port = 3100
)

$ErrorActionPreference = "Stop"

$conn = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($conn) {
  $pidToStop = $conn.OwningProcess
  Write-Host "[mm-remove] stopping pid $pidToStop on :$Port"
  Stop-Process -Id $pidToStop -Force -ErrorAction SilentlyContinue
  Start-Sleep -Seconds 1
} else {
  Write-Host "[mm-remove] nothing listening on :$Port"
}

$ProfileDir = Join-Path $env:USERPROFILE ".dsh\profiles\$ProfileName"
if (Test-Path $ProfileDir) {
  Remove-Item $ProfileDir -Recurse -Force
  Write-Host "[mm-remove] removed $ProfileDir"
} else {
  Write-Host "[mm-remove] profile dir not present"
}
Write-Host "[mm-remove] done. web profile untouched."
