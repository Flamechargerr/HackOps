# 🚀 HackOps Scripts

This directory contains utility and deployment scripts for the HackOps project.

## 📁 Available Scripts

### `deploy.sh` 
🌐 **Automated Deployment Script**

Comprehensive deployment script that:
- ✅ Builds the frontend for production
- ✅ Runs linting and validation
- ✅ Deploys to GitHub Pages using SSH
- ✅ Provides deployment status and troubleshooting

**Usage:**
```bash
# Make executable (first time only)
chmod +x scripts/deploy.sh

# Deploy to GitHub Pages
./scripts/deploy.sh
```

**Prerequisites:**
- SSH key configured for GitHub (see [docs/SSH_DEPLOYMENT.md](../docs/SSH_DEPLOYMENT.md))
- Node.js and Yarn installed
- Repository permissions for GitHub Pages

## 🔧 Script Development

When adding new scripts:
1. Make them executable with `chmod +x`
2. Add proper error handling and validation
3. Include usage documentation
4. Test thoroughly before committing
5. Update this README with script descriptions

## 📖 Related Documentation

- [SSH Deployment Guide](../docs/SSH_DEPLOYMENT.md)
- [General Deployment Instructions](../docs/DEPLOYMENT.md)
- [Contributing Guidelines](../docs/CONTRIBUTING.md)