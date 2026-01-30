# 🔑 Pinata IPFS Setup Guide

This guide will walk you through setting up your **free** Pinata account to enable IPFS storage for files larger than 10KB.

---

## Why Pinata?

Pinata is a popular IPFS pinning service that:
- ✅ Offers a **free tier** with 1GB storage
- ✅ Provides fast and reliable IPFS gateways
- ✅ Has simple API integration
- ✅ Keeps your files permanently available on IPFS

---

## Step 1: Create a Pinata Account

1. Go to [https://app.pinata.cloud/register](https://app.pinata.cloud/register)
2. Sign up with your email address
3. Verify your email
4. Log in to your Pinata dashboard

---

## Step 2: Create an API Key

### Method 1: Using JWT (Recommended)

1. **Log in** to your Pinata dashboard: [https://app.pinata.cloud/](https://app.pinata.cloud/)

2. Click **"API Keys"** in the left sidebar

3. Click the **"+ New Key"** button (top right)

4. In the **Create API Key** dialog:
   
   **Key name:** Enter a name like `Web3-File-Storage` or `My-dApp`
   
   **Admin:** Toggle **ON** (this gives full permissions)
   
   Or customize permissions:
   - Under **V3 RESOURCES**:
     - **Files:** Set to **Write** (to upload files)
     - **Groups:** Can leave as **None**
     - **Gateways:** Can leave as **None**
     - **Analytics:** Can leave as **None**

5. Click **"Create"** button

6. **IMPORTANT:** A popup will appear with your API credentials:
   - **API Key**
   - **API Secret**  
   - **JWT** ← This is what you need!
   
7. **Copy the JWT token immediately** - you won't be able to see it again!
   - It starts with `eyJhbGci...` and is quite long
   - Store it somewhere safe temporarily

---

## Step 3: Add Your JWT to the Application

1. Open the file: `config.js` in your project

2. Find this section (around line 10):
   ```javascript
   PINATA: {
       JWT: "", // Your Pinata JWT token (recommended)
       GATEWAY: "gateway.pinata.cloud"
   },
   ```

3. Paste your JWT token between the quotes:
   ```javascript
   PINATA: {
       JWT: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3J...", // Your actual JWT
       GATEWAY: "gateway.pinata.cloud"
   },
   ```

4. **Save the file**

---

## Step 4: Test Your Setup

1. **Refresh** your web application in the browser

2. **Connect MetaMask** if not already connected

3. Try uploading a file **larger than 10KB** (like your 30KB image!)

4. You should see:
   - "Uploading file to IPFS..." notification
   - "File uploaded to IPFS! Hash: QmX1234..." notification
   - "Storing on blockchain..." notification
   - "File uploaded successfully!" notification

5. The file will now be stored on IPFS, and only the IPFS hash is stored on the blockchain (much cheaper!)

---

## Step 5: Verify on Pinata Dashboard

1. Go back to [Pinata Dashboard](https://app.pinata.cloud/)

2. Click **"Files"** in the left sidebar

3. You should see your uploaded file listed there!

4. You can click on it to see:
   - File name
   - IPFS hash (CID)
   - File size
   - Upload date
   - Preview (if it's an image)

---

## How It Works

### Small Files (< 10KB)
- Stored **directly on blockchain** as base64
- No IPFS needed
- Higher gas cost but simple

### Large Files (> 10KB)
1. File is uploaded to **Pinata IPFS**
2. Pinata returns an **IPFS hash** (e.g., `QmX1234...`)
3. Only the **hash** is stored on blockchain
4. When downloading, the app fetches from IPFS using the hash

### Benefits
- ✅ Upload files up to **100MB** (configurable)
- ✅ Much lower gas costs (only storing a small hash)
- ✅ Files are permanently available on IPFS
- ✅ Decentralized storage

---

## Pinata Free Tier Limits

- **Storage:** 1 GB
- **Bandwidth:** 100 GB/month
- **API Requests:** Unlimited
- **Gateway Requests:** 3 req/sec

For most personal projects and testing, this is more than enough!

---

## Security Notes

### ⚠️ Important: Keep Your JWT Secret!

- **DO NOT** commit your JWT to GitHub or public repositories
- **DO NOT** share your JWT with others
- Consider using environment variables for production

### For Production:
Instead of hardcoding the JWT in `config.js`, you could:
1. Use environment variables
2. Use a backend proxy server
3. Request users to add their own Pinata keys

But for learning and personal use, it's fine in the config file.

---

## Troubleshooting

### "Pinata API credentials not configured"
- Make sure you've added your JWT to `config.js`
- Make sure there are no extra spaces
- Refresh the page

### "Failed to upload to IPFS"
- Check your JWT is correct
- Check you haven't exceeded your free tier limits
- Check your internet connection
- Verify the API key hasn't been revoked

### "Cannot read from IPFS"
- Wait a few seconds for IPFS propagation
- Try refreshing the page
- Check if the file exists in your Pinata dashboard

---

## Alternative: Using API Key + Secret (Legacy)

If you prefer the old method (not recommended):

1. Create API key as described above
2. Copy both **API Key** and **API Secret**
3. You would need to modify the code to use these instead of JWT

**Recommendation:** Stick with JWT - it's simpler and more secure!

---

## Free IPFS Alternatives

If you want to try other IPFS services:

- **Web3.Storage** - 5TB free storage
- **NFT.Storage** - Unlimited free for NFTs
- **Infura IPFS** - 5GB free

But Pinata is the most popular and reliable for general use.

---

## 🎉 You're All Set!

Once you've added your JWT to `config.js`, you can:
- ✅ Upload files up to 100MB
- ✅ Store them permanently on IPFS
- ✅ Pay minimal gas fees (only for storing the hash)
- ✅ Download files from IPFS automatically

---

## Quick Reference

**Pinata Dashboard:** https://app.pinata.cloud/  
**API Keys:** https://app.pinata.cloud/keys  
**Files:** https://app.pinata.cloud/pinmanager  
**Documentation:** https://docs.pinata.cloud/

---

## What to Update in config.js

Look for this in your `config.js` file and add your JWT:

```javascript
PINATA: {
    JWT: "YOUR_JWT_TOKEN_HERE",  // ← Paste your JWT here
    GATEWAY: "gateway.pinata.cloud"  // ← Leave this as is
},
```

**That's it!** Save the file, refresh your browser, and you're ready to upload files of any size! 🚀
