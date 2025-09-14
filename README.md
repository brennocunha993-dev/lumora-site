# 🎮 GamerSite - Plataforma de Publicação de Jogos

Uma plataforma completa para desenvolvedores publicarem seus jogos e gamers descobrirem novos títulos.

## ✨ Funcionalidades

### 🔐 Sistema de Autenticação
- Registro e login de usuários
- Autenticação 2FA com QR Code
- Sistema de roles (usuário, moderador, admin)
- Sessões seguras

### 🎯 Publicação de Jogos
- Upload de jogos com múltiplas imagens
- Categorização por gênero e plataforma
- Sistema de tags
- Links para trailers e downloads

### 👥 Sistema de Moderação
- Painel administrativo completo
- Aprovação/rejeição de jogos
- Gerenciamento de usuários
- Estatísticas detalhadas

### 🌟 Funcionalidades Sociais
- Sistema de avaliações e reviews
- Contador de downloads e visualizações
- Busca avançada de jogos
- Jogos em destaque

## 🚀 Tecnologias Utilizadas

- **Backend**: Node.js, Express.js
- **Banco de Dados**: MongoDB com Mongoose
- **Autenticação**: bcryptjs, jsonwebtoken, speakeasy
- **Upload**: Multer
- **2FA**: QR Code generation
- **Frontend**: EJS, Bootstrap 5, Font Awesome
- **Segurança**: Helmet, CORS, Rate Limiting

## 📦 Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd gamer-site
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o MongoDB**
- Instale o MongoDB localmente ou use MongoDB Atlas
- O banco será criado automaticamente como 'gamersite'

4. **Inicie o servidor**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

5. **Acesse a aplicação**
- Abra http://localhost:3000 no navegador

## 🔧 Configuração

### Variáveis de Ambiente (Opcional)
Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/gamersite
SESSION_SECRET=gamer-secret-key-2023
```

### Estrutura de Pastas
```
gamer-site/
├── models/          # Modelos do MongoDB
├── routes/          # Rotas da aplicação
├── views/           # Templates EJS
├── public/          # Arquivos estáticos
├── middleware/      # Middlewares customizados
├── uploads/         # Uploads de imagens
└── app.js          # Arquivo principal
```

## 👤 Roles de Usuário

### Usuário Comum
- Visualizar jogos
- Fazer reviews
- Submeter jogos para aprovação

### Moderador
- Aprovar/rejeitar jogos
- Destacar jogos
- Ver estatísticas

### Administrador
- Todas as funções do moderador
- Gerenciar usuários
- Alterar roles
- Banir/desbanir usuários

## 🔒 Segurança

- Senhas criptografadas com bcrypt
- Autenticação 2FA opcional
- Rate limiting para prevenir spam
- Validação de uploads
- Sanitização de dados
- Sessões seguras

## 📱 Responsividade

O site é totalmente responsivo e funciona em:
- Desktop
- Tablets
- Smartphones

## 🎨 Tema

Interface com tema gamer dark:
- Cores: Preto, azul neon (#00d4ff), laranja (#ff6b35)
- Animações suaves
- Efeitos hover
- Design moderno

## 🚀 Deploy

### Heroku
1. Crie uma conta no Heroku
2. Instale o Heroku CLI
3. Configure MongoDB Atlas
4. Deploy:

```bash
heroku create gamer-site
heroku config:set MONGODB_URI=<sua-string-mongodb-atlas>
git push heroku main
```

### Vercel/Netlify
Para deploy em plataformas serverless, considere usar Next.js ou adaptar para funções serverless.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🆘 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato através do email.

---

**Feito com ❤️ para a comunidade gamer**