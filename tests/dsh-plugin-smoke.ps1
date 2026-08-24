# DSH Plugin smoke (P1) — requires DSH on :3080
param(
  [string]$BaseUrl = "http://127.0.0.1:3080",
  [switch]$SkipInstall
)

$ErrorActionPreference = "Stop"
$sessionA = "test-session-a"
$sessionB = "test-session-b"

if (-not $SkipInstall) {
  & (Join-Path $PSScriptRoot "..\scripts\dsh-install.ps1")
  Start-Sleep -Seconds 2
}

Write-Host "[smoke] health"
$h = Invoke-RestMethod "$BaseUrl/api/mathmodeling/health"
if (-not $h.ok) { throw "health failed" }

Write-Host "[smoke] session context isolation"
Invoke-RestMethod "$BaseUrl/api/mathmodeling/context" -Method Post -ContentType "application/json" -Body (@{
  session_id = $sessionA; page = "lesson/kmeans"; model_id = "kmeans"; knowledge_unit = "feature-scaling"; lesson_step = 8
} | ConvertTo-Json) | Out-Null
Invoke-RestMethod "$BaseUrl/api/mathmodeling/context" -Method Post -ContentType "application/json" -Body (@{
  session_id = $sessionB; page = "dashboard"; model_id = $null
} | ConvertTo-Json) | Out-Null
$ctxA = Invoke-RestMethod "$BaseUrl/api/mathmodeling/context?session_id=$sessionA"
$ctxB = Invoke-RestMethod "$BaseUrl/api/mathmodeling/context?session_id=$sessionB"
if ($ctxA.context.model_id -ne "kmeans") { throw "session A context wrong" }
if ($ctxB.context.model_id) { throw "session B context leaked model_id" }

Write-Host "[smoke] registry/kmeans"
$km = Invoke-RestMethod "$BaseUrl/api/mathmodeling/registry/kmeans"
if ($km.model.use_when.Count -lt 1) { throw "use_when empty" }

Write-Host "[smoke] quiz submit + mastery"
$before = Invoke-RestMethod "$BaseUrl/api/mathmodeling/mastery?user_id=demo&item_type=ku&item_id=centroid"
$sub = Invoke-RestMethod "$BaseUrl/api/mathmodeling/quiz/submit" -Method Post -ContentType "application/json" -Body (@{
  quiz_id = "kmeans:q1"; selected = "B"; item_type = "ku"; item_id = "centroid"; user_id = "demo"; session_id = $sessionA
} | ConvertTo-Json)
if (-not $sub.correct) { throw "expected correct answer B" }
$after = Invoke-RestMethod "$BaseUrl/api/mathmodeling/mastery?user_id=demo&item_type=ku&item_id=centroid"
if ($after.mastery[0].score -le $before.mastery[0].score) { throw "mastery did not increase" }

Write-Host "[smoke] tutor offline"
$tutor = Invoke-RestMethod "$BaseUrl/api/mathmodeling/tutor/offline?session_id=$sessionA&message=为什么要标准化？"
if ($tutor.reply.answer.Length -lt 10) { throw "tutor offline answer too short" }

Write-Host "[smoke] ALL PASSED"
