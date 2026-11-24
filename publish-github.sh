#!/usr/bin/env bash
# =============================================================================
# Script de Publicação no GitHub (Bash / Git Bash)
# Repositório remoto: https://github.com/bernardoaoliveora/caixa.git
# Usuário GitHub: bnwebstudio
# =============================================================================

set -e

REMOTE_URL="https://github.com/bernardoaoliveora/caixa.git"
BRANCH="main"

echo "==> Verificando repositório Git local..."
if [ ! -d ".git" ]; then
  git init
fi

echo "==> Garantindo branch principal '$BRANCH'..."
git branch -M "$BRANCH"

echo "==> Configurando repositório remoto 'origin' -> $REMOTE_URL"
if git remote | grep -q "^origin$"; then
  git remote set-url origin "$REMOTE_URL"
else
  git remote add origin "$REMOTE_URL"
fi

git remote -v

echo "==> Enviando commits para o GitHub..."
git push -u origin "$BRANCH"

echo "==> Publicação concluída com sucesso!"
