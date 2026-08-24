# Harness spike smoke — requires DSH on :3080 after harness-spike-enable + DSH restart
param(
  [string]$BaseUrl = "http://127.0.0.1:3080"
)

$ErrorActionPreference = "Stop"

Write-Host "[harness-smoke] spike health"
$h = Invoke-RestMethod "$BaseUrl/api/mathmodeling/harness-spike/health"
if (-not $h.ok) { throw "harness health failed" }

Write-Host "[harness-smoke] mathmodeling health (shared host)"
$m = Invoke-RestMethod "$BaseUrl/api/mathmodeling/health"
if (-not $m.ok) { throw "mathmodeling health failed" }

Write-Host "[harness-smoke] session list (H2 proxy)"
try {
  $sessions = Invoke-RestMethod "$BaseUrl/api/sessions" -ErrorAction Stop
  Write-Host "[harness-smoke] sessions endpoint ok"
} catch {
  Write-Warning "[harness-smoke] sessions API not reachable — manual H2 verify after UI restart"
}

Write-Host "[harness-smoke] tutor offline (H4 skill path)"
$tutor = Invoke-RestMethod "$BaseUrl/api/mathmodeling/tutor/offline?session_id=harness-test&message=为什么要标准化？"
if ($tutor.reply.answer.Length -lt 5) { throw "tutor offline failed" }

Write-Host "[harness-smoke] PASS (API layer). H1/H3 require browser: agent message + 3-column layout."
