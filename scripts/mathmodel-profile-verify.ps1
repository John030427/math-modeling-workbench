# Verify the mathmodel profile composition (dump-config) and optional live health.
param(
  [string]$ProfileName = "mathmodel",
  [int]$LivePort = 0
)

$ErrorActionPreference = "Stop"

$binCandidates = Get-ChildItem "$env:USERPROFILE\AppData\Local\npm-cache\_npx\*\node_modules\@deepseek-ai\dsh\lib\bin.js" -ErrorAction SilentlyContinue |
  Sort-Object LastWriteTime -Descending
if (-not $binCandidates) { throw "DSH installation not found" }
$DshBin = $binCandidates[0].FullName

Write-Host "[mm-verify] DSH version:" (& node $DshBin --version)

$tmp = New-TemporaryFile
& node $DshBin --profile $ProfileName --dump-config 2>$null | Out-File $tmp -Encoding utf8
$dump = Get-Content $tmp -Raw
Remove-Item $tmp -Force

$fail = @()
foreach ($must in @("@math-modeling/mathmodel-suite", "@math-modeling/mathmodel-shell", "@math-modeling/dsh-mathmodeling", "@deepseek-ai/dsh-web-app")) {
  if ($dump -notmatch [regex]::Escape($must)) { $fail += "missing: $must" }
}
# ui-layout may appear in the composed tree ONLY as disabled by the suite patch
$lines = $dump -split "`r?`n"
$uiIdx = ($lines | Select-String -Pattern '^- id: ui-layout' | Select-Object -First 1).LineNumber
if (-not $uiIdx) {
  # absent entirely = fine
} else {
  $window = ($lines[($uiIdx - 1)..([Math]::Min($uiIdx + 2, $lines.Count - 1))] -join "`n")
  if ($window -notmatch 'disabled:\s*true') { $fail += "ui-layout composed WITHOUT disabled marker" }
}
if ($dump -match "linxin666|dshmarket|thinking-counter|openviking|vision-toolkit") { $fail += "community/user plugins leaked into product profile" }

if ($fail.Count -gt 0) {
  Write-Host "[mm-verify] FAIL:"
  $fail | ForEach-Object { Write-Host "  - $_" }
  exit 1
}
Write-Host "[mm-verify] dump-config composition OK (suite + shell + domain present; ui-layout & community plugins absent)"

if ($LivePort -gt 0) {
  $base = "http://127.0.0.1:$LivePort"
  foreach ($path in @("/api/mathmodeling/suite-health", "/api/mathmodeling/shell-v2/health", "/api/mathmodeling/health")) {
    $h = Invoke-RestMethod "$base$path" -TimeoutSec 10
    if (-not $h.ok) { throw "health failed: $path" }
  }
  Write-Host "[mm-verify] live health OK on :$LivePort"
}
Write-Host "[mm-verify] PASS"
