# Create/refresh the dedicated mathmodel product profile from profiles/mathmodel-template.
# Idempotent. Never touches the `web` profile. (MATHMODEL_PROFILE_PHASE3_PLAN.md P2)
param(
  [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path,
  [string]$ProfileName = "mathmodel"
)

$ErrorActionPreference = "Stop"
$ProfileDir = Join-Path $env:USERPROFILE ".dsh\profiles\$ProfileName"
$TemplateDir = Join-Path $RepoRoot "profiles\mathmodel-template"

# ── 1. detect DSH installation + version ──
$binCandidates = Get-ChildItem "$env:USERPROFILE\AppData\Local\npm-cache\_npx\*\node_modules\@deepseek-ai\dsh\lib\bin.js" -ErrorAction SilentlyContinue |
  Sort-Object LastWriteTime -Descending
if (-not $binCandidates) { throw "DSH installation not found in npx cache" }
$DshBin = $binCandidates[0].FullName
$DshVersion = (& node $DshBin --version) 2>$null
Write-Host "[mm-init] DSH detected: version=$DshVersion path=$DshBin"

# ── 2. build product packages before linking ──
Push-Location (Join-Path $RepoRoot "packages\mathmodel-shell")
npm install --no-audit --no-fund 2>&1 | Out-Null
npm run build 2>&1 | Select-Object -Last 1
Pop-Location
Push-Location (Join-Path $RepoRoot "packages\dsh-mathmodeling")
npm run build 2>&1 | Select-Object -Last 1
Pop-Location

# ── 3. materialize profile dir from template ──
New-Item -ItemType Directory -Force -Path $ProfileDir | Out-Null
foreach ($f in @("package.json", "cordis.patch.yml", "pnpm-workspace.yaml")) {
  $text = Get-Content (Join-Path $TemplateDir $f) -Raw
  $text = $text.Replace("__MM_REPO__", ($RepoRoot -replace '\\', '/'))
  [System.IO.File]::WriteAllText((Join-Path $ProfileDir $f), $text, [System.Text.UTF8Encoding]::new($false))
}

# ── 4. junctions for every @math-modeling package (hoisted-resolution guarantee) ──
$scopeDir = Join-Path $ProfileDir "node_modules\@math-modeling"
New-Item -ItemType Directory -Force -Path $scopeDir | Out-Null
foreach ($pkg in @("mathmodel-suite", "mathmodel-shell", "dsh-mathmodeling")) {
  $linkPath = Join-Path $scopeDir $pkg
  $target = Join-Path $RepoRoot "packages\$pkg"
  if (-not (Test-Path $linkPath)) {
    cmd /c mklink /J "$linkPath" "$target" | Out-Null
    Write-Host "[mm-init] junction: $pkg"
  }
}

# ── 5. install ──
Push-Location $ProfileDir
try {
  if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    pnpm install --no-frozen-lockfile 2>&1 | Select-Object -Last 2
  } else {
    npm install --no-audit --no-fund 2>&1 | Select-Object -Last 2
  }
} finally {
  Pop-Location
}

# ── 6. resolution check ──
foreach ($pkg in @("mathmodel-suite", "mathmodel-shell", "dsh-mathmodeling")) {
  $p = Join-Path $ProfileDir "node_modules\@math-modeling\$pkg\package.json"
  if (-not (Test-Path $p)) { throw "dependency not resolvable after install: @math-modeling/$pkg" }
}
Write-Host "[mm-init] profile '$ProfileName' ready. Next: scripts/mathmodel-profile-verify.ps1, then scripts/mathmodel-start.ps1"
