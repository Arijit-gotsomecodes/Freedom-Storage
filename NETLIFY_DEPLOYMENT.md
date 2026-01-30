# 🚀 Deploying to Netlify - Secure Setup Guide

This guide shows you how to deploy your Web3 File Storage app to Netlify **securely** without exposing your API credentials.

---

## 🔒 Security Architecture

Instead of storing your Pinata JWT in the client-side code, we use **Netlify Functions** (serverless functions) to keep your credentials secure on the server.

**How it works:**
1. Your browser sends files to a Netlify Function (not directly to Pinata)
2. The Netlify Function forwards the request to Pinata using your secret JWT
3. Your JWT never appears in the browser or public code

---

## 📋 Prerequisites

1. **GitHub account** (to connect with Netlify)
2. **Netlify account** (free) - [Sign up here](https://app.netlify.com/signup)
3. **Your deployed smart contract address** on Sepolia
4. **Your Pinata JWT token**

---

## 🛠️ Step 1: Prepare Your Code

### 1.1 Update Contract Address

Open `config.template.js` and update:

```javascript
CONTRACT_ADDRESS: "0xYourActualContractAddress",
```

### 1.2 Create config.js (for local testing)

```bash
cp config.template.js config.js
```

Then add your Pinata JWT to `config.js` (only for local development).

### 1.3 Install Dependencies

```bash
npm install
```

---

## 🚀 Step 2: Deploy to Netlify

### Option A: Deploy via Drag & Drop (Easiest)

1. **Build your site:**
   - Make sure `config.template.js` has your contract address
   - Your code is ready to deploy

2. **Go to Netlify:**
   - Visit [https://app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag your entire project folder to the upload area
   - Wait for deployment to complete

3. **Set up environment variable:**
   - Go to your site settings
   - Navigate to: **Site settings** → **Environment variables**
   - Click **Add a variable**
   - Set:
     - **Key:** `PINATA_JWT`
     - **Value:** Your Pinata JWT token (starts with `eyJhbGci...`)
   - Click **Save**

4. **Redeploy:**
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Clear cache and deploy site**

### Option B: Deploy via GitHub (Recommended for updates)

1. **Create a GitHub repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/web3-file-storage.git
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - Go to [https://app.netlify.com/](https://app.netlify.com/)
   - Click **Add new site** → **Import an existing project**
   - Choose **GitHub**
   - Select your repository
   - Deploy settings:
     - **Build command:** Leave empty
     - **Publish directory:** `.`
   - Click **Deploy site**

3. **Add environment variable:**
   - Go to **Site settings** → **Environment variables**
   - Add variable:
     - **Key:** `PINATA_JWT`
     - **Value:** Your Pinata JWT
   - **Save**

4. **Redeploy:**
   - Netlify will automatically redeploy
   - Or manually trigger: **Deploys** → **Trigger deploy**

---

## ✅ Step 3: Verify Deployment

1. **Open your Netlify site URL** (e.g., `https://your-site-name.netlify.app`)

2. **Connect MetaMask**

3. **Try uploading a file:**
   - Select a file larger than 10KB
   - It should upload to IPFS via the Netlify Function
   - Check browser console for logs

4. **Check if it works:**
   - File uploads successfully ✅
   - You can download files ✅
   - No JWT token visible in browser code ✅

---

## 🔧 Step 4: Configure Custom Domain (Optional)

1. **In Netlify dashboard:**
   - Go to **Domain settings**
   - Click **Add custom domain**
   - Follow instructions to add your domain

2. **Enable HTTPS:**
   - Netlify provides free SSL certificates
   - HTTPS is auto-enabled for custom domains

---

## 🐛 Troubleshooting

### Issue: "Pinata JWT not configured"

**Solution:**
- Make sure you added `PINATA_JWT` environment variable
- Check the value is correct (starts with `eyJhbGci...`)
- Redeploy after adding environment variables

### Issue: "CORS error"

**Solution:**
- The `netlify.toml` file includes CORS headers
- Make sure it's in your project root
- Redeploy

### Issue: "Function not found"

**Solution:**
- Verify `netlify/functions/pinata-upload.js` exists
- Check `netlify.toml` has correct `functions` path
- Redeploy

### Issue: Files upload locally but not on Netlify

**Solution:**
- Check browser console for error messages
- Verify environment variable is set correctly
- Check Netlify Function logs:
  - Go to **Functions** tab in Netlify
  - Click on `pinata-upload`
  - View logs

---

## 📁 Project Structure for Deployment

```
sol test/
├── netlify/
│   └── functions/
│       └── pinata-upload.js      # Serverless function (keeps JWT secret)
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── web3-handler.js
│   ├── contract-interaction.js
│   └── ipfs-handler.js           # Updated to use Netlify Function
├── contracts/
│   └── FileStorage.sol
├── index.html
├── config.template.js            # Public template (commit this)
├── config.js                     # Your actual config (DON'T commit)
├── .gitignore                    # Excludes config.js
├── netlify.toml                  # Netlify configuration
├── package.json                  # Dependencies for functions
└── NETLIFY_DEPLOYMENT.md         # This guide
```

---

## 🔐 Security Best Practices

### ✅ DO:
- Use `config.template.js` for your repository
- Set sensitive values in Netlify environment variables
- Add `config.js` to `.gitignore`
- Use Netlify Functions for API calls
- Keep your private keys **offline** and **secure**

### ❌ DON'T:
- Commit `config.js` with real credentials
- Share your Pinata JWT publicly
- Hardcode API keys in client-side JavaScript
- Push `.env` files to GitHub

---

## 🎯 Environment Variables You Need

| Variable | Where to Set | Value |
|----------|-------------|-------|
| `PINATA_JWT` | Netlify Dashboard | Your Pinata API JWT token |

**Note:** The contract address goes in `config.template.js` (it's public on the blockchain anyway).

---

## 🔄 Updating Your Deployment

Whenever you make changes:

### If using GitHub:
```bash
git add .
git commit -m "Your update message"
git push
```
Netlify auto-deploys from GitHub!

### If using drag & drop:
1. Make your changes locally
2. Go to Netlify **Deploys** tab
3. Drag your updated folder to the deploy area

---

## 💰 Cost

**Everything is FREE:**
- ✅ Netlify hosting (100GB bandwidth/month)
- ✅ Netlify Functions (125K requests/month)
- ✅ Netlify SSL certificates
- ✅ Sepolia testnet transactions (free test ETH)
- ✅ Pinata free tier (1GB storage)

---

## 📞 Support Resources

- **Netlify Docs:** https://docs.netlify.com/
- **Netlify Functions:** https://docs.netlify.com/functions/overview/
- **Environment Variables:** https://docs.netlify.com/environment-variables/overview/

---

## 🎉 You're Done!

Your Web3 File Storage app is now:
- ✅ Deployed securely on Netlify
- ✅ API credentials protected
- ✅ HTTPS enabled
- ✅ Auto-deploying from GitHub (if using Git)
- ✅ Production-ready!

**Share your live URL:** `https://your-site-name.netlify.app`

---

## 🔍 Quick Checklist

Before going live, verify:

- [ ] Smart contract deployed to Sepolia
- [ ] Contract address updated in `config.template.js`
- [ ] `PINATA_JWT` environment variable set in Netlify
- [ ] Site deployed successfully
- [ ] Can connect MetaMask
- [ ] Can upload files (both small and large)
- [ ] Can download files
- [ ] Can preview images
- [ ] Dark mode works
- [ ] No console errors

🎊 **Congratulations on your deployment!**
