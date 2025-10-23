#!/bin/bash

echo "🚀 Setting up backend environment..."
echo ""

# Check if .env already exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled."
        exit 0
    fi
fi

# Copy .env.local to .env
cp .env.local .env

echo "✅ Created .env file from .env.local"
echo ""
echo "📝 Next steps:"
echo "1. Edit back-end/.env and add your PHOENIXD_TOKEN"
echo "2. You can find your token in: phoenixd/phoenix.conf (look for http-password)"
echo "3. Run: npm install"
echo "4. Run: npm run dev"
echo ""
echo "💡 To get your phoenixd token:"
echo "   cat ../phoenixd/phoenix.conf | grep http-password"
echo ""
