# Script de Validação Geral de Coerência e Governança do AxiomLancer Landing Page
# Padrão 2026 (.agente-core) - Executa todas as checagens locais de integridade

param (
    [switch]$Strict
)

$ErrorActionPreference = "Stop"

# Configura encoding de saída para UTF-8 no Windows PowerShell
if ($PSVersionTable.PSVersion.Major -lt 6) {
    $OutputEncoding = [System.Text.Encoding]::UTF8
}

Write-Output "==================================================="
Write-Output "   AxiomLancer - Deterministic Quality Gate        "
Write-Output "==================================================="

# 1. Executa Typecheck TypeScript
Write-Output "`n[INFO] Passo 1/3: Validando tipagem estática TypeScript (tsc --noEmit)..."
try {
    npm run typecheck
    if ($LASTEXITCODE -ne 0) {
        throw "TypeScript typecheck falhou com código $LASTEXITCODE"
    }
    Write-Output "✅ TIPO-CHECK COMPLETO: Zero erros de tipagem estática."
} catch {
    Write-Error "❌ ERRO: Verificação de tipos TypeScript falhou."
    exit 1
}

# 2. Executa a Suite de Testes Automatizados (Vitest)
Write-Output "`n[INFO] Passo 2/3: Executando suíte de testes unitários e de integração (vitest)..."
try {
    npm test
    if ($LASTEXITCODE -ne 0) {
        throw "Testes automatizados falharam com código $LASTEXITCODE"
    }
    Write-Output "✅ TESTES UNITÁRIOS COMPLETOS: Todos os testes passaram com 100% de sucesso."
} catch {
    Write-Error "❌ ERRO: Falha na execução dos testes automatizados."
    exit 1
}

# 3. Executa o Build de Produção do Next.js
Write-Output "`n[INFO] Passo 3/3: Executando compilação de produção Next.js (next build)..."
try {
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Build de produção Next.js falhou com código $LASTEXITCODE"
    }
    Write-Output "✅ BUILD DE PRODUÇÃO COMPLETO: Bundle estático/RSC compilado com sucesso."
} catch {
    Write-Error "❌ ERRO: Compilação de produção Next.js falhou."
    exit 1
}

Write-Output "`n🎉 AXIOM LANCER LANDING PAGE: 100% ÍNTEGRO, ROBUSTO E EM CONFORMIDADE!"
exit 0
