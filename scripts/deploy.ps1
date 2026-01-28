# Script de Deploy para PowerShell
# Uso: .\scripts\deploy.ps1 -Version "0.0.3" -Description "Descrição da mudança"

param(
    [string]$Version = "0.0.3",
    [string]$Description = "Versão inicial"
)

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║        🚀 DEPLOY AUTOMÁTICO - Lucro Real Planner      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$steps = @(
    @{ Name = "📝 Atualizando versão"; Command = "node scripts/update-version.js $Version ""$Description""" },
    @{ Name = "🏗️  Compilando React/TypeScript"; Command = "npm run build" },
    @{ Name = "📦 Gerando EXE com Electron"; Command = "npx electron-builder --win --publish=never" },
    @{ Name = "📦 Adicionando arquivos ao Git"; Command = "git add ." },
    @{ Name = "💾 Fazendo commit"; Command = "git commit -m ""v$Version`: $Description""" },
    @{ Name = "🏷️  Criando tag"; Command = "git tag -a v$Version -m ""$Description""" },
    @{ Name = "📤 Fazendo push para GitHub"; Command = "git push origin main" },
    @{ Name = "🔖 Enviando tag para GitHub"; Command = "git push origin v$Version" }
)

$currentStep = 0
$failed = $false

foreach ($step in $steps) {
    $currentStep++
    Write-Host "[$currentStep/$($steps.Length)] $($step.Name)" -ForegroundColor Yellow
    Write-Host "   `$ $($step.Command)" -ForegroundColor Gray
    
    try {
        Invoke-Expression $step.Command
        Write-Host "   ✅ Sucesso!`n" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ Erro ao executar: $($step.Command)`n" -ForegroundColor Red
        $failed = $true
        break
    }
}

Write-Host ""

if (-not $failed) {
    Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║                  ✨ DEPLOY COMPLETO!                   ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Host "✅ Versão v$Version publicada com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📚 Próximos passos:" -ForegroundColor Cyan
    Write-Host "   1. Vá para: https://github.com/fluxodashboard-code/lucro-real-planner/releases" -ForegroundColor White
    Write-Host "   2. Clique na release v$Version" -ForegroundColor White
    Write-Host "   3. Clique ""Edit""" -ForegroundColor White
    Write-Host "   4. Upload do arquivo: dist/Lucro Real Planner.exe" -ForegroundColor White
    Write-Host ""
    Write-Host "🎉 Usuários receberão notificação de atualização automaticamente!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Red
    Write-Host "║                    ❌ DEPLOY FALHOU                    ║" -ForegroundColor Red
    Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Red
    Write-Host ""
    Write-Host "Erro na etapa $currentStep" -ForegroundColor Red
    exit 1
}
