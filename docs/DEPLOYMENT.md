# 🚀 HackOps Deployment Guide

This guide covers multiple deployment options for the HackOps cybersecurity learning platform.

## 📋 Table of Contents

- [🌐 GitHub Pages (Recommended)](#github-pages)
- [⚡ GitHub Actions (Automated)](#github-actions)
- [🔧 Manual Deployment](#manual-deployment)
- [🐛 Troubleshooting](#troubleshooting)

---

## 🌐 GitHub Pages (Recommended)

GitHub Pages provides free hosting for static sites and is perfect for the HackOps frontend.

### Prerequisites
- GitHub repository with your HackOps code
- Node.js 18+ and Yarn installed locally

### 📖 Step-by-Step Setup

#### 1. Configure Repository
```bash
# Clone your repository
git clone https://github.com/YOUR_USERNAME/HackOps.git
cd HackOps
```

#### 2. Update Package.json
Ensure your `frontend/package.json` has the correct homepage field:

```json
{
  "name": "hackops-cybersecurity-platform",
  "homepage": "https://YOUR_USERNAME.github.io/HackOps",
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}
```

#### 3. Install Dependencies
```bash
cd frontend
yarn install
```

#### 4. Build & Deploy
```bash
# Build the project
yarn build

# Deploy to GitHub Pages
yarn deploy
```

#### 5. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Set source to **Deploy from a branch**
4. Select branch: `gh-pages`
5. Click **Save**

Your site will be live at: `https://YOUR_USERNAME.github.io/HackOps`

---

## ⚡ GitHub Actions (Automated)

For automated deployment on every push to main/master branch.

### ✅ Setup Instructions

#### 1. Workflow File
The workflow file is already included: `.github/workflows/deploy.yml`

#### 2. Enable GitHub Pages
1. Repository Settings → **Pages**
2. Source: **GitHub Actions**
3. Save settings

#### 3. Configure Repository Permissions
1. Repository Settings → **Actions** → **General**
2. Workflow permissions: **Read and write permissions**
3. Save changes

#### 4. Push to Trigger Deployment
```bash
git add .
git commit -m "feat: setup automated deployment"
git push origin main
```

### 🔄 Workflow Features
- ✅ Automatic builds on push to main/master
- ✅ Frontend linting and testing
- ✅ Production optimization
- ✅ SPA routing support (404.html)
- ✅ Deployment status updates

---

## 🔧 Manual Deployment

### Option A: Local Build + Upload

```bash
# 1. Build the project
cd frontend
yarn build

# 2. The dist/ folder contains your built site
# Upload contents to your hosting provider
```

### Option B: Using gh-pages CLI

```bash
# Install gh-pages globally
npm install -g gh-pages

# Deploy from frontend directory
cd frontend
yarn build
gh-pages -d dist
```

### Option C: Other Hosting Providers

#### Vercel
```bash
npm i -g vercel
cd frontend
yarn build
vercel --prod
```

#### Netlify
```bash
npm install -g netlify-cli
cd frontend
yarn build
netlify deploy --prod --dir=dist
```

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### ❌ **404 Errors on Page Refresh**
**Problem**: React Router routes return 404 when accessed directly

**Solution**: Ensure 404.html exists and mirrors index.html
```bash
# In your build process
cp dist/index.html dist/404.html
```

#### ❌ **Assets Not Loading**
**Problem**: CSS/JS files return 404

**Solution 1**: Check homepage field in package.json
```json
{
  "homepage": "https://username.github.io/repo-name"
}
```

**Solution 2**: Verify Vite config base path
```typescript
// vite.config.ts
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/HackOps/' : '/',
  // ... other config
})
```

#### ❌ **Build Fails**
**Problem**: Build process exits with errors

**Solution**: Check Node.js version and dependencies
```bash
node --version  # Should be 18+
yarn --version  # Should be 1.22+
yarn install    # Reinstall dependencies
yarn build      # Try building again
```

#### ❌ **GitHub Actions Fails**
**Problem**: Workflow fails with permission errors

**Solution**: Check repository permissions
1. Settings → Actions → General
2. Workflow permissions: **Read and write permissions**
3. Allow GitHub Actions to create and approve pull requests: ✅

#### ❌ **Environment Variables**
**Problem**: Environment variables not working in production

**Solution**: Use VITE_ prefix for frontend variables
```bash
# ❌ Wrong
REACT_APP_API_URL=https://api.example.com

# ✅ Correct  
VITE_API_URL=https://api.example.com
```

Access in code:
```typescript
// ❌ Wrong
const apiUrl = process.env.REACT_APP_API_URL

// ✅ Correct
const apiUrl = import.meta.env.VITE_API_URL
```

### 📞 **Still Having Issues?**

1. **Check the Actions tab** in your GitHub repository for detailed error logs
2. **Review the console** in browser developer tools for client-side errors  
3. **Verify all prerequisites** are installed and updated
4. **Create an issue** in the repository with detailed error information

---

## 🎯 **Production Checklist**

Before deploying to production, ensure:

- [ ] ✅ All dependencies installed and updated
- [ ] ✅ Environment variables configured
- [ ] ✅ Build process completes without errors
- [ ] ✅ Homepage field in package.json is correct
- [ ] ✅ 404.html file created for SPA routing
- [ ] ✅ GitHub Pages source configured properly
- [ ] ✅ Repository permissions set for GitHub Actions
- [ ] ✅ All routes tested in production environment
- [ ] ✅ Assets loading correctly
- [ ] ✅ Performance optimized (check Lighthouse score)

---

## 🔗 **Useful Resources**

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router Documentation](https://reactrouter.com/en/main)

---

*Happy deploying! 🚀*