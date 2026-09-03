@echo off
REM CostumeMart MERN E-Commerce Setup Script for Windows

echo.
echo 🎭 Welcome to CostumeMart Setup!
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js is installed: %NODE_VERSION%
echo.

REM Backend Setup
echo 📦 Setting up Backend...
cd Backend

if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
) else (
    echo Backend dependencies already installed
)

if not exist ".env" (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo ⚠️  Please edit Backend\.env with your MongoDB, ImageKit, and email credentials
) else (
    echo ✅ .env file already exists
)

cd ..
echo.

REM Frontend Setup
echo ⚡ Setting up Frontend...
cd Frontend

if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo Frontend dependencies already installed
)

if not exist ".env.local" (
    echo Creating .env.local file...
    copy .env.example .env.local
    echo ✅ Frontend .env.local created
) else (
    echo ✅ .env.local already exists
)

cd ..
echo.

echo 🎉 Setup complete!
echo.
echo 📋 Next steps:
echo 1. Edit Backend\.env with your credentials:
echo    - MongoDB URI
echo    - ImageKit credentials
echo    - Email/SMTP settings
echo.
echo 2. Create initial admin user:
echo    Open PowerShell/CMD in Backend folder and run:
echo    curl -X POST http://localhost:5000/api/admin/register ^
echo      -H "Content-Type: application/json" ^
echo      -d "{\"email\":\"admin@costumemart.com\",\"password\":\"yourpassword\",\"role\":\"admin\"}"
echo.
echo 3. Start services in separate terminals:
echo    Terminal 1: cd Backend ^&^& npm run dev
echo    Terminal 2: cd Frontend ^&^& npm run dev
echo.
echo 4. Open http://localhost:5173 for storefront
echo 5. Open http://localhost:5173/admin/login for admin panel
echo.
echo For more details, see README.md
echo.
pause
