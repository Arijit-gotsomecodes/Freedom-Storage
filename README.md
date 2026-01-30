# 🔗 Web3 File Storage dApp

A decentralized application for storing files on the Ethereum Sepolia testnet using smart contracts and MetaMask.

![Web3](https://img.shields.io/badge/Web3-Enabled-blue)
![Solidity](https://img.shields.io/badge/Solidity-^0.8.0-green)
![Sepolia](https://img.shields.io/badge/Network-Sepolia-purple)

---

## 🌟 Features

- **🔐 Wallet Integration:** Full MetaMask integration with account management
- **📤 File Upload:** Upload files directly to the blockchain (up to 100KB)
- **📥 File Retrieval:** Download files using their unique blockchain ID
- **👤 User Management:** Track all files uploaded by your account
- **⛓️ Blockchain Storage:** Immutable storage on Ethereum Sepolia testnet
- **🎨 Modern UI:** Beautiful Web3-themed interface with dark mode
- **📊 Real-time Stats:** View total files and your personal file count

---

## 🏗️ Architecture

### Smart Contract (`FileStorage.sol`)

- **Storage:** Stores file metadata and content on-chain
- **Mappings:** Efficient file lookup by ID and user address
- **Events:** FileUploaded and FileRetrieved for tracking
- **Functions:**
  - `uploadFile()` - Upload a new file
  - `getFile()` - Retrieve file by ID
  - `getMyFiles()` - Get all your uploaded files
  - `getFileMetadata()` - Get file info without content (gas efficient)

### Web Application

- **HTML/CSS/JavaScript:** Vanilla frontend for maximum compatibility
- **Ethers.js:** Blockchain interaction library
- **MetaMask:** Web3 wallet provider
- **Responsive Design:** Works on desktop and mobile

---

## 🚀 Quick Start

### Prerequisites

1. **MetaMask** browser extension ([Install here](https://metamask.io/))
2. **Sepolia testnet ETH** ([Get from faucet](https://sepoliafaucet.com/))
3. **Modern web browser** (Chrome, Firefox, Brave, or Edge)

### Installation

1. **Clone or download this repository**

2. **Deploy the smart contract:**
   - Follow the detailed instructions in [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md)
   - Deploy to Sepolia testnet using Remix IDE
   - Copy your deployed contract address

3. **Configure the application:**
   - Open `config.js`
   - Replace the `CONTRACT_ADDRESS` with your deployed contract address:
     ```javascript
     CONTRACT_ADDRESS: "0xYourContractAddressHere"
     ```

4. **Run the application:**
   - Open `index.html` in your web browser
   - Or use a local server:
     ```bash
     # Using Python
     python3 -m http.server 8000
     
     # Using Node.js
     npx serve
     ```

5. **Connect your wallet:**
   - Click "Connect MetaMask"
   - Approve the connection
   - Make sure you're on Sepolia network

---

## 📖 Usage Guide

### Uploading Files

1. Click **"Connect MetaMask"** and approve the connection
2. Make sure you're on **Sepolia testnet**
3. Click **"Choose File"** and select a file (max 100KB)
4. Review the file information
5. Click **"Upload to Blockchain"**
6. Confirm the transaction in MetaMask
7. Wait for confirmation (usually 10-30 seconds)

### Viewing Your Files

1. Your uploaded files appear automatically in the **"My Files"** section
2. Click **"Refresh Files"** to reload the list
3. Each file shows:
   - File name and type
   - File size
   - Upload timestamp
   - Unique blockchain ID

### Downloading Files

1. Click the **"Download"** button on any file in your list
2. Or enter a **File ID** in the "Retrieve File by ID" section
3. The file will be downloaded to your computer

---

## 🔧 Technical Details

### File Storage Method

Files are stored as **base64-encoded strings** directly on the blockchain. This approach:

- ✅ Simple and doesn't require external services
- ✅ Files are permanently stored on-chain
- ⚠️ Limited to small files (recommended max 100KB)
- ⚠️ Higher gas costs for larger files

**For production:** Consider using IPFS for larger files and storing only the IPFS hash on-chain.

### Gas Costs

Approximate gas costs on Sepolia:

- **Deploy Contract:** ~1,500,000 gas
- **Upload 1KB file:** ~100,000 gas
- **Upload 50KB file:** ~2,000,000 gas
- **Retrieve file:** ~50,000 gas

### Smart Contract Security

- ✅ No reentrancy vulnerabilities
- ✅ Input validation on all functions
- ✅ Events for all state changes
- ✅ Read-only functions don't modify state

---

## 📁 Project Structure

```
sol test/
├── contracts/
│   └── FileStorage.sol          # Smart contract
├── css/
│   └── styles.css               # Application styles
├── js/
│   ├── web3-handler.js          # MetaMask integration
│   ├── contract-interaction.js  # Blockchain operations
│   └── app.js                   # Main application logic
├── config.js                    # Contract address & ABI
├── index.html                   # Main HTML page
├── DEPLOYMENT_GUIDE.md          # Deployment instructions
└── README.md                    # This file
```

---

## 🎨 Features in Detail

### Account Management

- **Automatic account detection:** Detects connected MetaMask accounts
- **Account switching:** Automatically updates when you switch accounts
- **Network validation:** Ensures you're on Sepolia testnet
- **Auto-reconnect:** Remembers your connection across page reloads

### File Management

- **Personal file list:** See only your uploaded files
- **File metadata:** View size, type, and upload date
- **Quick download:** One-click file retrieval
- **File validation:** Prevents uploading files that are too large

### User Experience

- **Real-time notifications:** Toast messages for all actions
- **Loading states:** Visual feedback during transactions
- **Error handling:** User-friendly error messages
- **Responsive design:** Works on all screen sizes

---

## ⚠️ Important Notes

1. **This is a testnet application:** Only use Sepolia testnet, never mainnet
2. **File size limits:** Keep files under 100KB for reasonable gas costs
3. **Gas fees required:** You need Sepolia ETH for all transactions
4. **Public storage:** All files are publicly visible on the blockchain
5. **Immutable:** Files cannot be deleted once uploaded

---

## 🔮 Future Enhancements

Potential improvements for production use:

- [ ] IPFS integration for larger files
- [ ] File encryption for privacy
- [ ] File sharing and permissions
- [ ] Folder organization
- [ ] File preview functionality
- [ ] Search and filter capabilities
- [ ] Multiple network support

---

## 🛠️ Development

### Testing the Contract

Use Remix IDE to test individual functions:

```solidity
// Upload a test file
uploadFile("test.txt", "SGVsbG8gV29ybGQ=", "text/plain", 11)

// Get file count
getFileCount() // Returns: 1

// Get your files
getMyFiles() // Returns: [1]
```

### Local Development

For local testing with a local blockchain:

1. Install Hardhat or Ganache
2. Update `config.js` with local network settings
3. Deploy to localhost
4. Update contract address

---

## 📄 License

MIT License - Feel free to use this code for learning and development.

---

## 🤝 Contributing

This is a learning project. Feel free to:

- Fork the repository
- Submit issues
- Propose improvements
- Share your deployments

---

## 📚 Resources

- [Solidity Documentation](https://docs.soliditylang.org/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [MetaMask Documentation](https://docs.metamask.io/)
- [Remix IDE](https://remix.ethereum.org/)
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Sepolia Etherscan](https://sepolia.etherscan.io/)

---

## 🆘 Support

Having issues? Check:

1. **MetaMask is installed and unlocked**
2. **You're on Sepolia testnet**
3. **You have enough Sepolia ETH**
4. **Contract address in config.js is correct**
5. **Browser console for error messages**

---

**Built with ❤️ for the Web3 community**

*Happy decentralized file storing! 🚀*
