@echo off
echo 🎮 GamerSite - Iniciando servidor...
echo.

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado!
    echo Por favor, instale o Node.js de https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar se as dependências estão instaladas
if not exist "node_modules" (
    echo 📦 Instalando dependências...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Erro ao instalar dependências!
        pause
        exit /b 1
    )
)

REM Criar pasta de uploads se não existir
if not exist "public\uploads" (
    echo 📁 Criando pasta de uploads...
    mkdir public\uploads
)

REM Iniciar o servidor
echo ✅ Iniciando servidor...
echo 🌐 Acesse: http://localhost:3000
echo 🛑 Pressione Ctrl+C para parar o servidor
echo.

npm start

pause