$env:CSC_IDENTITY_AUTO_DISCOVERY = "false"
$env:WIN_CSC_LINK = ""
$env:CSC_LINK = ""

Write-Host "Gerando build sem assinatura de código..." -ForegroundColor Green
npx electron-builder --win --publish=never
