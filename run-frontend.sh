#!/bin/bash

cd "$(dirname "$0")/frontend"

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "Instalando dependências..."
    npm install
fi

# Rodar Vite dev
echo "Iniciando frontend em http://localhost:5173"
npm run dev
