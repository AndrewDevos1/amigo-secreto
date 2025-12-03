# Amigo Secreto - Minimal (Flask + React)

Aplicação web minimalista para gerar sorteios de "amigo secreto" a partir de uma lista colada, parseando nomes e telefones, gerando uma fila circular única, e enviando notificações via WhatsApp (links wa.me).

## Visão Geral

- **Backend**: Flask (Python) com API simples para parsing e geração
- **Frontend**: React (Vite) com UI para colar lista, revisar participantes e enviar via WhatsApp
- **Telefones**: Links `wa.me` (sem dependências externas, sem envio server-side)
- **Estado**: Mantido no cliente (browser). Backend é stateless
- **Persistência**: Nenhuma. Dados em memória da sessão

## Estrutura do Projeto

```
amigo-secreto/
├── backend/
│   ├── app.py           # Flask app principal
│   ├── parsing.py       # Lógica de parsing e geração
│   ├── test_parsing.py  # Testes unitários
│   └── requirements.txt # Dependências
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── public/index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       └── components/
│           ├── PasteInput.jsx
│           ├── ParticipantsTable.jsx
│           └── AssignmentTable.jsx
└── README.md
```

## Instalação e Execução (Desenvolvimento)

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
pip install -r requirements.txt
python3 test_parsing.py  # Executar testes
flask run  # Servidor roda em http://localhost:5000
```

### Frontend (em outra aba/terminal)

```bash
cd frontend
npm install
npm run dev  # Servidor roda em http://localhost:5173
```

Acesse **http://localhost:5173** no navegador.

## Execução (Produção)

1. Compilar frontend:
```bash
cd frontend
npm run build
```

2. Copiar build para backend:
```bash
cp -r frontend/dist backend/dist
```

3. Rodar apenas o backend (serve frontend também):
```bash
cd backend
python3 app.py
```

Acesse **http://localhost:5000**.

## API - Contratos

### POST `/api/parse`

**Request:**
```json
{
  "text": "Amigo Secreto - Evento\nJoão Silva\t11987654321\nMaria Santos\t11998765432",
  "default_country_code": "55"
}
```

**Response (200):**
```json
{
  "group_name": "Amigo Secreto - Evento",
  "participants": [
    {
      "id": "uuid-1",
      "name": "João Silva",
      "phone_raw": "11987654321",
      "phone_digits": "5511987654321",
      "is_phone_valid": true
    },
    {
      "id": "uuid-2",
      "name": "Maria Santos",
      "phone_raw": "11998765432",
      "phone_digits": "5511998765432",
      "is_phone_valid": true
    }
  ],
  "errors": []
}
```

### POST `/api/generate`

**Request:**
```json
{
  "participants": [
    { "id": "uuid-1", "name": "João Silva", "phone_digits": "5511987654321", "is_phone_valid": true },
    { "id": "uuid-2", "name": "Maria Santos", "phone_digits": "5511998765432", "is_phone_valid": true }
  ],
  "group_name": "Amigo Secreto - Evento"
}
```

**Response (200):**
```json
{
  "pairs": [
    {
      "giver": { "id": "uuid-1", "name": "João Silva", ... },
      "receiver": { "id": "uuid-2", "name": "Maria Santos", ... }
    },
    {
      "giver": { "id": "uuid-2", "name": "Maria Santos", ... },
      "receiver": { "id": "uuid-1", "name": "João Silva", ... }
    }
  ],
  "warnings": []
}
```

## Regras de Parsing

1. **Título**: Primeira linha com palavras-chave "amigo" + "secreto" é tratada como nome do grupo
2. **Separadores**: Tab (`\t`), múltiplos espaços, ou hífem-espaço entre nome e telefone
3. **Telefone**: Última sequência contínua com dígitos, hífens, parênteses, espaços
4. **Nome**: Tudo antes do padrão de telefone
5. **Normalização**: Remove caracteres não-dígitos, adiciona código de país se necessário

## Geração de Pares

- **Algoritmo**: Fisher-Yates shuffle para criar permutação aleatória única
- **Garantia**: Cada pessoa tira a próxima (ciclo); ninguém tira a si mesmo
- **Mínimo**: 2 participantes obrigatórios

## Frontend - Fluxo

1. **Cole a lista**: textarea com textarea + botão Parsear (ou Ctrl+Enter)
2. **Revise participantes**: tabela editável inline, marque inválidos em vermelho
3. **Gere**: Botão "Gerar amigo secreto" (ativo se >=2 com telefones válidos)
4. **Veja resultados**: Tabela "quem tirou quem"
5. **Envie**: Botão WhatsApp por linha ou enviar todos (com aviso de pop-ups)

## Botão WhatsApp

- Abre link `https://wa.me/{giver_digits}?text={mensagem_template}`
- Usuário completa envio manualmente no WhatsApp
- Mensagem editável com placeholders: `{giver_name}`, `{receiver_name}`, `{group_name}`, `{receiver_phone}`
- Abre em nova aba (pop-up blocker pode interferir)

## Testes

```bash
cd backend
python3 test_parsing.py
```

Testes cobrem:
- Normalização de telefones
- Parsing com várias entradas
- Tratamento de erros
- Geração de pares (ciclo único, sem auto-atribuição)

## Notas Importantes

- **Sem persistência**: Recarregar a página limpa a sessão
- **Sem autenticação**: App é anônimo (use em contextos confiáveis)
- **Pop-up Blocker**: Enviar múltiplos via pop-up pode ser bloqueado (recomenda enviar individualmente)
- **Privacidade**: Telefones são processados apenas em memória; não armazenados

## Melhorias Futuras

- Persistência em banco de dados
- Autenticação por organização
- Envio via WhatsApp Business API (Twilio)
- Export CSV / impressão
- Temas escuros

## Licença

MIT
