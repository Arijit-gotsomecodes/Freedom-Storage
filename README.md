# 📦 EtherVault

**Secure, decentralized file storage on the Ethereum Sepolia testnet.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://evault.arijitdeb.com/)
![Web3](https://img.shields.io/badge/Web3-Enabled-blue)
![Solidity](https://img.shields.io/badge/Solidity-^0.8.0-green)
![Sepolia](https://img.shields.io/badge/Network-Sepolia-purple)

EtherVault allows you to store files permanently on the blockchain. It uses a **Hybrid Storage Strategy**: small files are stored directly on-chain for maximum permanence, while larger files are automatically decentralized via [IPFS](https://ipfs.tech/).

---

## 🌟 Key Features

- **🔐 Hybrid Storage:** 
  - Files < 10KB: Stored directly on Ethereum (On-chain)
  - Files > 10KB: Stored on IPFS (Off-chain) with hash on-chain
- **🌍 Read-Only Access:** Anyone can view and download files **without connecting a wallet**.
- **🔗 Universal Sharing:** Generate shareable links (`?share=ID`) that work for everyone.
- **👛 Wallet Integration:** Seamless MetaMask integration for uploading.
- **🛡️ Secure:** Immutable storage on the Sepolia testnet.
- **🎨 Modern UI:** Beautiful Dark Mode interface with file previews.

---

## 🚀 Quick Start

### 🌐 Live Demo
Access the live application here: **[evault.arijitdeb.com](https://evault.arijitdeb.com/)**

### 💻 Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Arijit-gotsomecodes/Freedom-Storage.git
   cd Freedom-Storage
   ```

2. **Serve the application**
   ```bash
   # Using Python
   python3 -m http.server 8000
   
   # Using Node.js
   npx serve
   ```

3. **Open in Browser**
   Visit `http://localhost:8000`

---

## 📖 Usage Guide

### Uploading Files (Requires Wallet)
1. Click **"Connect Wallet"**.
2. Select a file to upload.
3. System automatically chooses storage method (Chain vs IPFS).
4. Confirm transaction in MetaMask.
5. Wait for confirmation!

### Sharing & Viewing (No Wallet Needed)
1. Click the **Share** button on any file.
2. Send the link to anyone.
3. They can view/download the file immediately, even on mobile!

---

## 🔧 Architecture

### Smart Contract (`FileStorage.sol`)
- **Storage:** Stores file metadata and content/hash.
- **Optimization:** Hybrid approach reduces gas costs significantly for large files.

### Tech Stack
- **Frontend:** Vanilla JS / HTML5 / CSS3 (No framework overhead)
- **Blockchain:** Ethers.js
- **Storage:** Ethereum Sepolia + Pinata IPFS
- **Hosting:** Netlify

---

## 📁 Project Structure

```
.
├── contracts/               # Solidity Smart Contracts
├── css/                     # Application Styles
├── js/
│   ├── app.js               # Main Logic
│   ├── web3-handler.js      # Wallet & Provider Logic
│   ├── ipfs-handler.js      # IPFS & Pinata Integration
│   └── contract-interaction.js # Smart Contract Calls
├── config.js                # Network Configuration
├── index.html               # Main Entry Point
└── README.md                # Project Documentation
```

---

## 📄 License

MIT License - Open for learning and development.

---

**Built with ❤️ for the Web3 community.**
