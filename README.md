# 🥗 GestNutri — API Backend

API REST do sistema de gestão nutricional escolar, desenvolvida com Node.js e PostgreSQL.

## 🛠️ Tecnologias
- Node.js
- Express
- PostgreSQL (Neon)
- JWT (autenticação)
- bcryptjs (criptografia de senhas)

## 📁 Estrutura
- `config/` → configuração do banco de dados
- `controllers/` → lógica das requisições
- `routes/` → definição das rotas
- `services/` → regras de negócio

## ⚙️ Como rodar localmente

### Pré-requisitos
- Node.js instalado
- Banco PostgreSQL configurado

### Instalação
```bash
git clone https://github.com/SEU_USUARIO/gestnutri-backend.git
cd gestnutri-backend
npm install
```

### Variáveis de ambiente
Crie um arquivo `.env` na raiz:
```env
DATABASE_URL=postgresql://usuario:senha@host:5432/GestNutri
JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=8h
NODE_ENV=development
PORT=3000
```

### Rodar o projeto
```bash
npm start
```
API disponível em `http://localhost:3000`

## 🌐 Deploy
- API hospedada no [Render](https://render.com)
- Banco de dados no [Neon](https://neon.tech)