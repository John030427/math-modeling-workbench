# Shell V2 smoke — API layer checks (H3 browser layer needs real browser)
param(
  [string]$BaseUrl = "http://127.0.0.1:3080"
)

$ErrorActionPreference = "Stop"

Write-Host "[shell-v2-smoke] shell health"
$h = Invoke-RestMethod "$BaseUrl/api/mathmodeling/shell-v2/health"
if (-not $h.ok -or $h.shell -ne 'shell-v2') { throw "shell-v2 health failed" }

Write-Host "[shell-v2-smoke] mathmodeling health (workbench provider)"
$m = Invoke-RestMethod "$BaseUrl/api/mathmodeling/health"
if (-not $m.ok) { throw "mathmodeling health failed" }

Write-Host "[shell-v2-smoke] registry (dashboard data source)"
$r = Invoke-RestMethod "$BaseUrl/api/mathmodeling/registry"
if (-not $r.models -or $r.models.Count -lt 1) { throw "registry empty" }

Write-Host "[shell-v2-smoke] tutor offline (H4 skill path)"
$t = Invoke-RestMethod "$BaseUrl/api/mathmodeling/tutor/offline?session_id=shellv2-test&message=为什么要标准化？"
if ($t.reply.answer.Length -lt 5) { throw "tutor offline failed" }

Write-Host "[shell-v2-smoke] PASS (API layer). H1/H3 need browser verification."
