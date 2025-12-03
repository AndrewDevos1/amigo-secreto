#!/bin/bash

cd "$(dirname "$0")/backend"

# Criar venv se não existir
if [ ! -d "venv" ]; then
    echo "Criando ambiente virtual..."
    python3 -m venv venv
fi

# Ativar venv
source venv/bin/activate

# Instalar dependências se necessário
pip install -q -r requirements.txt

# Rodar Flask
echo "Iniciando backend em http://localhost:5000"
python3 app.py
