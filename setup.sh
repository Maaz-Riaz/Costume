#!/bin/bash

# CostumeMart MERN E-Commerce Setup Script
# This script helps set up the project quickly

echo "🎭 Welcome to CostumeMart Setup!"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"
echo ""

# Backend Setup
echo "📦 Setting up Backend..."
cd Backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo "Backend dependencies already installed"
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit Backend/.env with your MongoDB, ImageKit, and email credentials"
else
    echo "✅ .env file already exists"
fi

cd ..
echo ""

# Frontend Setup
echo "⚡ Setting up Frontend..."
cd Frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "Frontend dependencies already installed"
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file..."
    cp .env.example .env.local
    echo "✅ Frontend .env.local created"
else
    echo "✅ .env.local already exists"
fi

cd ..
echo ""

echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit Backend/.env with your credentials:"
echo "   - MongoDB URI"
echo "   - ImageKit credentials"
echo "   - Email/SMTP settings"
echo ""
echo "2. Create initial admin user:"
echo "   curl -X POST http://localhost:5000/api/admin/register \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"email\":\"admin@costumemart.com\",\"password\":\"yourpassword\",\"role\":\"admin\"}'"
echo ""
echo "3. Start services:"
echo "   Terminal 1: cd Backend && npm run dev"
echo "   Terminal 2: cd Frontend && npm run dev"
echo ""
echo "4. Open http://localhost:5173 for storefront"
echo "5. Open http://localhost:5173/admin/login for admin panel"
echo ""
