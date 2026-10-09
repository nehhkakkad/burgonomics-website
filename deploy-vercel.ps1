<#
  Deploy to the CLIENT's Vercel account.

  Their GitHub is NOT involved. This uses a deploy token they generate
  once in their own Vercel dashboard (Settings -> Access Tokens), which
  you paste into the file .vercel-token (git-ignored, never committed).

  Setup (once):
    1. Put their token in  .vercel-token  (this folder, plain text)
    2. Edit $Team below to their Vercel team slug
       -> they find it at vercel.com -> Settings -> General -> Team slug
       (a personal account's slug is just their username)

  Usage:
    .\deploy-vercel.ps1
#>

$ErrorActionPreference = "Stop"

# --- CHANGE THIS to their team slug -------------------------------------
$Team     = "THEIR-TEAM-SLUG"
$Project  = "burgonomics-website"
# -------------------------------------------------------------------------

$tokenFile = Join-Path $PSScriptRoot ".vercel-token"
if (-not (Test-Path $tokenFile)) {
  Write-Host "Missing .vercel-token" -ForegroundColor Red
  Write-Host "1. Ask them: Vercel -> Settings -> Access Tokens -> Generate"
  Write-Host "2. Save the token as a file named .vercel-token next to this script"
  exit 1
}
$Token = (Get-Content $tokenFile -Raw).Trim()
if ([string]::IsNullOrWhiteSpace($Token)) { Write-Host ".vercel-token is empty" -ForegroundColor Red; exit 1 }

Set-Location $PSScriptRoot

# Sanity checks before we touch production
Write-Host "==> Lint" -ForegroundColor Cyan
npm run lint
if ($LASTEXITCODE -ne 0) { Write-Host "Lint failed - not deploying." -ForegroundColor Red; exit 1 }

Write-Host "==> Build" -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "Build failed - not deploying." -ForegroundColor Red; exit 1 }

# Link this folder to THEIR project (overwrites local .vercel/project.json)
Write-Host "==> Link to $Team/$Project" -ForegroundColor Cyan
vercel link --yes --scope $Team --project $Project --token $Token --non-interactive
if ($LASTEXITCODE -ne 0) { Write-Host "Link failed - check the team slug." -ForegroundColor Red; exit 1 }

# Ship it
Write-Host "==> Deploy to production" -ForegroundColor Cyan
vercel deploy --prod --yes --token $Token --scope $Team --project $Project --non-interactive
if ($LASTEXITCODE -ne 0) { Write-Host "Deploy failed." -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "Live: https://$Project.vercel.app  (and their custom domain)" -ForegroundColor Green