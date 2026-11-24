# =============================================================================
# Script de Publicação no GitHub (PowerShell)
# Repositório remoto: https://github.com/bernardoaoliveora/caixa.git
# Usuário GitHub: bnwebstudio
# =============================================================================

$ErrorActionPreference = "Stop"

$REMOTE_URL = "https://github.com/bernardoaoliveora/caixa.git"
$BRANCH = "main"

Write-Host "==> Verificando repositório Git local..." -ForegroundColor Cyan
if (-not (Test-Path ".git")) {
    git init
}

Write-Host "==> Garantindo branch principal '$BRANCH'..." -ForegroundColor Cyan
git branch -M $BRANCH

Write-Host "==> Configurando repositório remoto 'origin' -> $REMOTE_URL" -ForegroundColor Cyan
$existingRemote = git remote
if ($existingRemote -contains "origin") {
    git remote set-url origin $REMOTE_URL
} else {
    git remote add origin $REMOTE_URL
}

Write-Host "==> Repositório remoto configurado:" -ForegroundColor Green
git remote -v

Write-Host "==> Enviando commits para o GitHub (git push -u origin $BRANCH)..." -ForegroundColor Cyan
git push -u origin $BRANCH

Write-Host "==> Publicação concluída com sucesso!" -ForegroundColor Green
