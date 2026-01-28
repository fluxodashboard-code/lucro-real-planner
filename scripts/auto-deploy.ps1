<#
Auto-deploy PowerShell script for Windows
Usage:
  .\scripts\auto-deploy.ps1 -Version 0.0.4 -Notes "Descrição curta" -RepoOwner fluxodashboard-code -RepoName lucro-real-planner

What it does:
 - Ensures node dependencies are installed (`npm install`)
 - Runs `node scripts/update-version.js` to update package.json and public/version.json
 - Runs `npm run build`
 - Runs `npx electron-builder --win --publish=never` to generate EXE
 - Commits changes, creates tag, pushes to GitHub
 - Installs GitHub CLI (`gh`) if missing, prompts you to auth via browser
 - Creates a GitHub release and uploads the EXE

Note: Run from project root in PowerShell with appropriate permissions.
#>
param(
    [Parameter(Mandatory=$true)][string]$Version,
    [Parameter(Mandatory=$false)][string]$Notes = "Release $Version",
    [Parameter(Mandatory=$false)][string]$RepoOwner = "fluxodashboard-code",
    [Parameter(Mandatory=$false)][string]$RepoName = "lucro-real-planner"
)

function Run($cmd) {
    Write-Host "-> $cmd" -ForegroundColor Cyan
    $proc = Start-Process -FilePath "powershell" -ArgumentList "-NoProfile -Command $cmd" -Wait -NoNewWindow -PassThru
    if ($proc.ExitCode -ne 0) {
        throw "Command failed: $cmd (exit $($proc.ExitCode))"
    }
}

try {
    Write-Host "== Auto-deploy: v$Version ==" -ForegroundColor Green

    # 1) Install node deps
    Write-Host "1) Installing npm dependencies..." -ForegroundColor Yellow
    Run "npm install"

    # 2) Update version
    Write-Host "2) Updating version files..." -ForegroundColor Yellow
    Run "node scripts/update-version.js $Version \"$Notes\""

    # 3) Build web bundle
    Write-Host "3) Building web assets..." -ForegroundColor Yellow
    Run "npm run build"

    # 4) Build EXE
    Write-Host "4) Building EXE (electron-builder)... this may take several minutes" -ForegroundColor Yellow
    Run "npx electron-builder --win --publish=never"

    # 5) Git add/commit/tag
    Write-Host "5) Git: add, commit, tag" -ForegroundColor Yellow
    Run "git add ."
    Run "git commit -m \"v$Version: $Notes\""
    Run "git tag -a v$Version -m \"$Notes\""

    # 6) Push
    Write-Host "6) Pushing to remote..." -ForegroundColor Yellow
    Run "git push origin main"
    Run "git push origin v$Version"

    # 7) Ensure gh CLI
    Write-Host "7) Ensuring GitHub CLI (gh) is available..." -ForegroundColor Yellow
    $ghPath = (Get-Command gh -ErrorAction SilentlyContinue)
    if (-not $ghPath) {
        Write-Host "gh not found. Installing via winget..." -ForegroundColor Yellow
        Run "winget install --id GitHub.cli -e --source winget"
        $env:Path += ";C:\Program Files\GitHub CLI\"
    }

    # authenticate if needed
    Write-Host "Checking gh auth status..." -ForegroundColor Yellow
    $auth = & gh auth status 2>&1
    if ($LASTEXITCODE -ne 0 -or $auth -match "not logged in") {
        Write-Host "Please authenticate gh in the browser (a prompt will open)." -ForegroundColor Yellow
        & gh auth login --web
        if ($LASTEXITCODE -ne 0) { throw "gh auth login failed" }
    }

    # 8) Create release and upload EXE
    $exeName = "dist\Lucro Real Planner $Version.exe"
    if (-not (Test-Path $exeName)) {
        # try matching file name pattern
        $found = Get-ChildItem -Path dist -Filter "*.exe" | Where-Object { $_.Name -like "*${Version}*.exe" } | Select-Object -First 1
        if ($found) { $exeName = $found.FullName }
    }

    if (-not (Test-Path $exeName)) {
        throw "Release EXE not found in dist/ (expected: $exeName). Build step may have failed."
    }

    Write-Host "8) Creating GitHub release and uploading $exeName" -ForegroundColor Yellow
    $repoArg = "$RepoOwner/$RepoName"
    & gh release create v$Version "$exeName" --title "v$Version" --notes "$Notes" --repo $repoArg
    if ($LASTEXITCODE -ne 0) { throw "gh release create failed" }

    Write-Host "\n✅ Deploy completo: v$Version" -ForegroundColor Green
    Write-Host "Release: https://github.com/$RepoOwner/$RepoName/releases/tag/v$Version" -ForegroundColor Cyan

} catch {
    Write-Host "\n❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
