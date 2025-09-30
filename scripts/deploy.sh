#!/bin/bash

# 🚀 HackOps Deployment Script
# Automated deployment to GitHub Pages using SSH
# 
# Usage: ./scripts/deploy.sh
# Location: /scripts/deploy.sh

set -e  # Exit on any error

echo "🛡️  Starting HackOps Deployment Process..."
echo "========================================"

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the HackOps root directory"
    exit 1
fi

# Check SSH key
if [ ! -f ~/.ssh/hackops_deploy_key ]; then
    echo "❌ Error: SSH key not found at ~/.ssh/hackops_deploy_key"
    echo "   Please run the SSH setup first (see SSH_DEPLOYMENT.md)"
    exit 1
fi

# Verify SSH connection to GitHub
echo "🔐 Testing SSH connection to GitHub..."
if ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
    echo "✅ SSH connection to GitHub verified"
else
    echo "❌ SSH connection failed. Please check your SSH key setup"
    echo "   See SSH_DEPLOYMENT.md for troubleshooting"
    exit 1
fi

# Navigate to frontend directory
cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    yarn install
fi

# Run linting (non-blocking)
echo "🔍 Running frontend linting..."
if ! yarn lint; then
    echo "⚠️  Linting warnings found, but continuing..."
fi

# Build the project
echo "🏗️  Building project for production..."
if ! yarn build; then
    echo "❌ Build failed! Please check the errors above"
    exit 1
fi

# Verify build output
if [ ! -f "dist/index.html" ]; then
    echo "❌ Build output not found in dist/index.html"
    exit 1
fi

echo "✅ Build completed successfully"

# Deploy to GitHub Pages
echo "🌐 Deploying to GitHub Pages..."
if yarn deploy; then
    echo ""
    echo "🎉 SUCCESS! HackOps has been deployed!"
    echo "========================================"
    echo "🔗 Live URL: https://flamechargerr.github.io/HackOps"
    echo ""
    echo "📋 Deployment Summary:"
    echo "   • Frontend built successfully"
    echo "   • 404.html created for SPA routing"  
    echo "   • Deployed to gh-pages branch"
    echo "   • Site should be live in 1-2 minutes"
    echo ""
    echo "🎯 Next Steps:"
    echo "   1. Visit your live site in a few minutes"
    echo "   2. Test all cybersecurity challenges"
    echo "   3. Share your project with the community!"
    echo ""
else
    echo "❌ Deployment failed! Check the errors above"
    echo ""
    echo "🔧 Common fixes:"
    echo "   • Ensure GitHub Pages is enabled in repo settings"
    echo "   • Check if gh-pages package is installed"
    echo "   • Verify repository permissions"
    echo "   • See SSH_DEPLOYMENT.md for detailed troubleshooting"
    exit 1
fi