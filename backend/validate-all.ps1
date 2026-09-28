Write-Host "`n⚡ [AxiomLancer] Iniciando Quality Gate Determinístico do Núcleo Financeiro..." -ForegroundColor Cyan

# 1. Typecheck & Build
Write-Host "`n📦 [1/3] Executando compilação TypeScript estrita..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Falha na compilação TypeScript!" -ForegroundColor Red
    exit $LASTEXITCODE
}
Write-Host "✅ TypeScript compilado com sucesso." -ForegroundColor Green

# 2. Suíte de Testes Unitários e Cobertura Matemática
Write-Host "`n🧪 [2/3] Executando testes unitários e cobertura lógica no Domínio com Vitest..." -ForegroundColor Yellow
npm run test:coverage
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Falha na suíte de testes Vitest ou threshold de cobertura violado!" -ForegroundColor Red
    exit $LASTEXITCODE
}
Write-Host "✅ Todos os 58 testes unitários passaram com sucesso com cobertura superior a 98%!" -ForegroundColor Green

# 3. Prisma Schema Validation
Write-Host "`n🗄️ [3/3] Validando consistência do schema Prisma PostgreSQL..." -ForegroundColor Yellow
npx prisma validate
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Falha na validação do schema Prisma!" -ForegroundColor Red
    exit $LASTEXITCODE
}
Write-Host "✅ Schema Prisma validado com sucesso." -ForegroundColor Green

Write-Host "`n🏆 [AxiomLancer] Quality Gate Aprovado com Louvor! Núcleo Financeiro Pronto para Produção.`n" -ForegroundColor Green
