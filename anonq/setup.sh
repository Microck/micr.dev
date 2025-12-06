#!/bin/bash

# Setup script for AnonQ

echo "🚀 Setting up AnonQ..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Setup environment file
if [ ! -f .env ]; then
    echo "⚙️  Setting up environment file..."
    cp .env.example .env
    echo "✅ Environment file created (.env)"
    echo "📝 Please update the following variables in .env:"
    echo "   - ADMIN_PASSWORD_HASH (generate with: node -e \"const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your_password', 10));\")"
    echo "   - NTFY_URL (optional, for notifications)"
    echo "   - OPENAI_API_KEY (optional, for grammar correction)"
else
    echo "✅ Environment file already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Update your admin password in .env"
echo "   2. Run 'npm start' to start the server"
echo "   3. Open http://localhost:3001 in your browser"
echo ""
echo "🔗 URLs:"
echo "   - Main page: http://localhost:3001"
echo "   - Admin login: http://localhost:3001/admin"