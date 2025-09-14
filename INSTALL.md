# 🚀 Guia de Instalação - GamerSite

## Pré-requisitos

Antes de instalar o GamerSite, certifique-se de ter:

1. **Node.js** (versão 16 ou superior)
   - Download: https://nodejs.org/
   - Verifique: `node --version`

2. **MongoDB** 
   - Opção 1: MongoDB Community Server (local)
     - Download: https://www.mongodb.com/try/download/community
   - Opção 2: MongoDB Atlas (cloud - recomendado)
     - Crie conta em: https://www.mongodb.com/atlas

3. **Git** (opcional, para clonar)
   - Download: https://git-scm.com/

## 📋 Passo a Passo

### 1. Preparar o Ambiente

```bash
# Verificar se Node.js está instalado
node --version
npm --version

# Se não estiver instalado, baixe em nodejs.org
```

### 2. Obter o Código

```bash
# Se você tem o código em um repositório Git:
git clone <url-do-repositorio>
cd gamer-site

# Ou se você já tem os arquivos, navegue até a pasta:
cd caminho/para/gamer-site
```

### 3. Instalar Dependências

```bash
# Instalar todas as dependências do projeto
npm install

# Isso pode levar alguns minutos na primeira vez
```

### 4. Configurar MongoDB

#### Opção A: MongoDB Local
1. Instale o MongoDB Community Server
2. Inicie o serviço MongoDB
3. O banco será criado automaticamente

#### Opção B: MongoDB Atlas (Recomendado)
1. Crie conta em mongodb.com/atlas
2. Crie um cluster gratuito
3. Obtenha a string de conexão
4. Crie arquivo `.env` na raiz do projeto:

```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/gamersite
PORT=3000
SESSION_SECRET=sua-chave-secreta-aqui
```

### 5. Criar Estrutura de Pastas

```bash
# Criar pasta para uploads (se não existir)
mkdir public\uploads
```

### 6. Iniciar o Servidor

```bash
# Para desenvolvimento (com auto-reload)
npm run dev

# Para produção
npm start
```

### 7. Acessar a Aplicação

Abra seu navegador e acesse:
- **URL**: http://localhost:3000
- **Primeira conta**: Registre-se normalmente
- **Tornar admin**: Acesse o MongoDB e altere o campo `role` para `admin`

## 🔧 Configurações Adicionais

### Criar Primeiro Administrador

1. Registre uma conta normalmente
2. No MongoDB, encontre seu usuário
3. Altere o campo `role` de `user` para `admin`

### Configurar Upload de Imagens

As imagens são salvas em `public/uploads/`. Certifique-se de que:
- A pasta existe
- Tem permissões de escrita
- Não excede 5MB por imagem

### Configurar 2FA

O 2FA funciona automaticamente com:
- Google Authenticator
- Authy
- Microsoft Authenticator
- Qualquer app compatível com TOTP

## 🐛 Solução de Problemas

### Erro: "npm não é reconhecido"
- Instale o Node.js de nodejs.org
- Reinicie o terminal/prompt

### Erro de Conexão MongoDB
- Verifique se o MongoDB está rodando
- Confirme a string de conexão
- Verifique firewall/antivírus

### Erro de Porta em Uso
```bash
# Mude a porta no arquivo .env ou app.js
PORT=3001
```

### Problemas com Uploads
- Verifique permissões da pasta `public/uploads`
- Confirme que não excede 5MB por arquivo
- Apenas imagens são aceitas (jpg, png, gif)

## 📱 Testando a Instalação

1. **Página Inicial**: Deve carregar sem erros
2. **Registro**: Crie uma conta de teste
3. **Login**: Faça login com a conta criada
4. **Upload**: Tente submeter um jogo de teste
5. **Admin**: Altere role para admin e acesse `/admin/dashboard`

## 🚀 Próximos Passos

Após a instalação:

1. **Customize**: Edite cores e logos em `public/css/style.css`
2. **Configure**: Ajuste regras de moderação
3. **Backup**: Configure backup do MongoDB
4. **SSL**: Configure HTTPS para produção
5. **Deploy**: Considere Heroku, Vercel ou VPS

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs no terminal
2. Confirme todas as dependências
3. Teste com MongoDB Atlas
4. Abra uma issue no GitHub

---

**Boa sorte com seu site gamer! 🎮**