# Desabilitar code signing completamente
Write-Host "Configurando ambiente para build SEM assinatura..." -ForegroundColor Green

# Limpar TODAS as variáveis de signing
$env:CSC_IDENTITY_AUTO_DISCOVERY = "false"
$env:WIN_CSC_LINK = ""
$env:WIN_CSC_KEY_PASSWORD = ""
$env:CSC_LINK = ""
$env:CSC_KEY_PASSWORD = ""
$env:CSC_FOR_PULL_REQUEST = "true"

# Criar fake signtool.exe no diretório atual
$fakeSigntool = @'
@echo off
REM Fake signtool - retorna sucesso imediatamente
exit /b 0
'@
Set-Content -Path "signtool.exe" -Value $fakeSigntool -Encoding ASCII
Write-Host "Fake signtool.exe criado" -ForegroundColor Cyan

# Colocar diretório atual no PATH primeiro
$env:PATH = "$(Get-Location);$env:PATH"

Write-Host "Iniciando build do Electron..." -ForegroundColor Yellow
npx electron-builder --win --publish=never

Write-Host "`nBuild concluído!" -ForegroundColor Green
Get-ChildItem -Path "dist" -Filter "*.exe" | ForEach-Object { 
    $sizeMB = [math]::Round($_.Length/1MB, 2)
    Write-Host "  - $($_.Name): $sizeMB MB" -ForegroundColor Green
}
