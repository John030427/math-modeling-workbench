# Create/refresh the dedicated mathmodel product profile (idempotent).
# Web profile is NOT touched. See MATHMODEL_PROFILE_PHASE3_PLAN.md P3-1.
param(
  [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path,
  [string]$ProfileName = "mathmodel"
)

$ErrorActionPreference = "Stop"
$ProfileDir = Join-Path $env:USERPROFILE ".dsh\profiles\$ProfileName"
New-Item -ItemType Directory -Force -Path $ProfileDir | Out-Null

$MathmodelingDir = Join-Path $RepoRoot "packages\dsh-mathmodeling"
$ShellV2Dir = Join-Path $RepoRoot "packages\shell-v2"
foreach ($d in @($MathmodelingDir, $ShellV2Dir)) {
  if (-not (Test-Path (Join-Path $d "package.json"))) { throw "missing package.json in $d (build first)" }
}

# ── package.json: bundles + link dependencies ──
$pkg = [ordered]@{
  name     = "dsh-profile-$ProfileName"
  private  = $true
  dsh      = @{
    profile = @{
      bundles = @(
        "@deepseek-ai/dsh-base",
        "@deepseek-ai/dsh-web-app",
        "@math-modeling/dsh-mathmodeling",
        "@math-modeling/shell-v2"
      )
    }
  }
  dependencies = [ordered]@{
    "@math-modeling/dsh-mathmodeling" = "link:$MathmodelingDir"
    "@math-modeling/shell-v2"         = "link:$ShellV2Dir"
  }
}
$json = ($pkg | ConvertTo-Json -Depth 20) + "`n"
[System.IO.File]::WriteAllText((Join-Path $ProfileDir "package.json"), $json, [System.Text.UTF8Encoding]::new($false))

# ── patch layer: Shell V2 owns root → ui-layout off (product bundles have no
#    thinking-counter, so the footer race does not apply here) ──
$patch = @"
# MathModel product profile — Shell V2 owns root
- id: ui-layout
  disabled: true
"@
[System.IO.File]::WriteAllText((Join-Path $ProfileDir "cordis.patch.yml"), $patch + "`n", [System.Text.UTF8Encoding]::new($false))

# ── pnpm workspace config (same shape as web profile) ──
$ws = @"
packages:
  - .

nodeLinker: hoisted
autoInstallPeers: false
"@
[System.IO.File]::WriteAllText((Join-Path $ProfileDir "pnpm-workspace.yaml"), $ws + "`n", [System.Text.UTF8Encoding]::new($false))

# ── install deps ──
Push-Location $ProfileDir
try {
  $pnpm = Get-Command pnpm -ErrorAction SilentlyContinue
  if ($pnpm) {
    pnpm install --no-frozen-lockfile 2>&1 | Select-Object -Last 3
  } else {
    Write-Host "[mm-profile] pnpm not found, falling back to npm"
    npm install --no-audit --no-fund 2>&1 | Select-Object -Last 3
  }
} finally {
  Pop-Location
}

# ── verify junctions resolve ──
foreach ($rel in @("@math-modeling\dsh-mathmodeling", "@math-modeling\shell-v2")) {
  $p = Join-Path $ProfileDir "node_modules\$rel"
  if (-not (Test-Path (Join-Path $p "package.json"))) { throw "dependency not resolvable: $rel" }
}

Write-Host "[mm-profile] profile '$ProfileName' ready at $ProfileDir"
Write-Host "[mm-profile] start with: node <dsh-bin> --profile $ProfileName web --port 3100 --no-open"
