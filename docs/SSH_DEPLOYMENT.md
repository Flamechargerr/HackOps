# 🔐 HackOps SSH Deployment Guide

This guide covers secure deployment using SSH keys for GitHub authentication.

## 🚀 Quick SSH Setup

### **📋 Step 1: Add SSH Key to GitHub**

1. **Copy the public key below:**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAID+5USscNV7qwm+jCGbnzN+9WdlICjz0O1sGpPmOToEi hackops-deployment-key
```

2. **Add to GitHub:**
   - Go to GitHub.com → Settings → SSH and GPG keys
   - Click "New SSH key"
   - Title: `HackOps Deployment Key`
   - Paste the public key above
   - Click "Add SSH key"

### **📋 Step 2: Configure Local Git**

```bash
# Configure SSH for this repository
git remote set-url origin git@github.com:Flamechargerr/HackOps.git

# Test SSH connection
ssh -T git@github.com
```

### **📋 Step 3: Deploy**

```bash
# Build and deploy to GitHub Pages
cd frontend
yarn build
yarn deploy
```

---

## 🔧 Detailed SSH Configuration

### **🔑 SSH Key Management**

Your SSH keys are stored in:
- **Private Key**: `~/.ssh/hackops_deploy_key` (Keep secure, never share!)
- **Public Key**: `~/.ssh/hackops_deploy_key.pub` (Safe to share)

### **⚙️ SSH Config Setup**

Create/update your SSH config for easier management:

```bash
# Create SSH config
cat >> ~/.ssh/config << 'EOF'

# HackOps GitHub Repository
Host github-hackops
    HostName github.com
    User git
    IdentityFile ~/.ssh/hackops_deploy_key
    IdentitiesOnly yes

EOF
```

Then use the custom host for git operations:
```bash
git remote set-url origin git@github-hackops:Flamechargerr/HackOps.git
```

### **🧪 Test SSH Connection**

```bash
# Test GitHub SSH connection
ssh -T git@github.com

# Expected successful output:
# Hi Flamechargerr! You've successfully authenticated, but GitHub does not provide shell access.
```

---

## 🤖 GitHub Actions SSH Deployment

### **🔐 Repository Secrets Setup**

1. **Go to Repository Settings** → Secrets and variables → Actions
2. **Add New Secret**: `SSH_PRIVATE_KEY`
3. **Value**: Your private key content:

```bash
# Display private key for copying (run locally)
cat ~/.ssh/hackops_deploy_key
```

### **⚡ Updated GitHub Actions Workflow**

The workflow file `.github/workflows/deploy.yml` is already configured for SSH deployment!

**Key Features:**
- ✅ Automatic deployment on push to main/master
- ✅ SSH authentication for secure git operations  
- ✅ Build optimization and SPA routing support
- ✅ Error handling and deployment status updates

---

## 🚀 Deployment Methods

### **Method 1: Manual SSH Deployment (Recommended)**

```bash
# 1. Clone with SSH
git clone git@github.com:Flamechargerr/HackOps.git
cd HackOps

# 2. Make changes and commit
git add .
git commit -m "feat: update cybersecurity challenges"
git push origin main

# 3. Deploy to GitHub Pages
cd frontend
yarn deploy
```

### **Method 2: Automated GitHub Actions**

Simply push to main branch - GitHub Actions will handle the rest:

```bash
git add .
git commit -m "feat: add new security challenge"
git push origin main
# ✅ Automatic deployment triggered!
```

### **Method 3: Direct Deployment Script**

Create a one-command deployment:

```bash
# Create deployment script
# Create deployment script (if not exists)
cat > scripts/deploy.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting HackOps Deployment..."

# Build the project
echo "📦 Building frontend..."
cd frontend
yarn build

# Deploy to GitHub Pages
echo "🌐 Deploying to GitHub Pages..."
yarn deploy

echo "✅ HackOps deployed successfully!"
echo "🔗 Live at: https://flamechargerr.github.io/HackOps"
EOF

chmod +x deploy.sh

# Use it
./deploy.sh
```

---

## 🐛 SSH Troubleshooting

### **❌ Permission Denied (publickey)**

**Solution:**
```bash
# Check SSH agent
ssh-add -l

# Add your key to SSH agent
ssh-add ~/.ssh/hackops_deploy_key

# Test connection again
ssh -T git@github.com
```

### **❌ Host key verification failed**

**Solution:**
```bash
# Add GitHub to known hosts
ssh-keyscan github.com >> ~/.ssh/known_hosts

# Or manually accept when prompted
ssh -T git@github.com
```

### **❌ Repository not found**

**Solution:**
```bash
# Verify remote URL is SSH format
git remote -v

# Should show: git@github.com:Flamechargerr/HackOps.git
# If not, update it:
git remote set-url origin git@github.com:Flamechargerr/HackOps.git
```

### **❌ GitHub Actions deployment fails**

**Solution:**
1. Check if `SSH_PRIVATE_KEY` secret is set correctly
2. Verify repository has GitHub Pages enabled
3. Check Actions tab for detailed error logs
4. Ensure repository permissions allow Actions to deploy

---

## 🔒 Security Best Practices

### **🔐 Key Security**
- ✅ Never commit private keys to repository
- ✅ Use different keys for different projects
- ✅ Regularly rotate SSH keys (every 6-12 months)
- ✅ Use strong passphrases for production keys

### **🛡️ Repository Security**
- ✅ Enable branch protection rules
- ✅ Require status checks before merging
- ✅ Enable security advisories
- ✅ Use Dependabot for dependency updates

### **⚙️ Deployment Security**
- ✅ Use SSH keys instead of HTTPS tokens
- ✅ Limit key permissions to specific repositories
- ✅ Monitor deployment logs for anomalies
- ✅ Use environment-specific deployment keys

---

## 🎯 Quick Commands Reference

```bash
# Generate new SSH key
ssh-keygen -t ed25519 -C "hackops-deploy" -f ~/.ssh/hackops_key

# Test SSH connection
ssh -T git@github.com

# Clone with SSH
git clone git@github.com:Flamechargerr/HackOps.git

# Set remote to SSH
git remote set-url origin git@github.com:Flamechargerr/HackOps.git

# Deploy to GitHub Pages
cd frontend && yarn deploy

# Check deployment status
git log --oneline -5
```

---

## ✅ Deployment Checklist

Before deploying, ensure:

- [ ] 🔑 SSH key added to GitHub account
- [ ] 🔗 Repository remote set to SSH URL
- [ ] 🧪 SSH connection tested and working
- [ ] 📦 Frontend builds successfully (`yarn build`)
- [ ] 🌐 GitHub Pages enabled in repository settings
- [ ] ⚡ GitHub Actions workflow file present
- [ ] 🔐 SSH_PRIVATE_KEY secret configured (for Actions)
- [ ] 🎯 Homepage field in package.json is correct
- [ ] 📱 404.html created for SPA routing

---

<div align="center">

## 🚀 **Ready to Deploy!**

**Your HackOps platform is now configured for secure SSH deployment to GitHub Pages!**

[![Deploy Now](https://img.shields.io/badge/Deploy-Now-success?style=for-the-badge&logo=github)](https://flamechargerr.github.io/HackOps)

*Push to main branch and watch your cybersecurity platform go live! 🎉*

</div>