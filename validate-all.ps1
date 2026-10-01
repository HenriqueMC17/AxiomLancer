# ==============================================================================
# AXIOM LANCER - MONOREPO QUALITY GATE DETERMINÍSTICO (.agente-core STANDARDS)
# Execução sequencial estrita: Typecheck -> Unit Tests -> Production Build
# ==============================================================================

$ErrorActionPreference = "Stop"

function Write-Step([string]$title) {
    Write-Host ""
    Write-Host "=====================================================================" -ForegroundColor Cyan
    Write-Host "[AXIOM QUALITY GATE] $title" -ForegroundColor Green
    Write-Host "=====================================================================" -ForegroundColor Cyan
}

$startTime = Get-Date

try {
    # 1. Verificação Estática de Tipagem (TypeScript Strict Mode)
    Write-Step "Passo 1/3: Verificacao de Tipos Estaticos (turbo run typecheck)"
    npm run typecheck
    if ($LASTEXITCODE -ne 0) { throw "Falha na verificacao estatica de tipos." }

    # 2. Execução da Suíte Completa de Testes Automatizados (Vitest)
    Write-Step "Passo 2/3: Suite de Testes Automatizados Unitarios (turbo run test)"
    npm run test
    if ($LASTEXITCODE -ne 0) { throw "Falha na suite de testes unitarios." }

    # 3. Compilação de Produção Turborepo
    Write-Step "Passo 3/3: Build de Producao Monorepo (turbo run build)"
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Falha no build de producao dos workspaces." }

    $elapsedSec = [math]::Round(((Get-Date) - $startTime).TotalSeconds, 2)
    Write-Host ""
    Write-Host "=====================================================================" -ForegroundColor Green
    Write-Host "AXIOM LANCER QUALITY GATE APROVADO COM 100% DE SUCESSO! ($elapsedSec s)" -ForegroundColor Green
    Write-Host "=====================================================================" -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host ""
    Write-Host "=====================================================================" -ForegroundColor Red
    Write-Host "FALHA NO QUALITY GATE: $_" -ForegroundColor Red
    Write-Host "=====================================================================" -ForegroundColor Red
    Write-Host ""
    exit 1
}
