# 🚀 Deployment Guide - FileStorage Smart Contract

This guide will walk you through deploying the FileStorage smart contract to the Sepolia testnet using Remix IDE.

## Prerequisites

Before you begin, make sure you have:

- ✅ **MetaMask** browser extension installed
- ✅ **Sepolia testnet** added to MetaMask
- ✅ **Sepolia ETH** in your wallet (for gas fees)

---

## Step 1: Get Sepolia Testnet ETH

If you don't have Sepolia ETH yet:

1. Visit a Sepolia faucet:
   - [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
   - [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)
   - [Chainlink Sepolia Faucet](https://faucets.chain.link/sepolia)

2. Connect your MetaMask wallet
3. Request testnet ETH (usually 0.5 - 1 ETH per request)
4. Wait for the transaction to confirm

> **Note:** You'll need at least 0.1 ETH for deployment and testing.

---

## Step 2: Add Sepolia Network to MetaMask

If Sepolia isn't already in your MetaMask:

1. Open MetaMask
2. Click the network dropdown (top of the extension)
3. Click "Add Network" or "Show test networks"
4. Toggle "Show test networks" to ON
5. Select "Sepolia Test Network"

**Manual Network Configuration:**
- Network Name: `Sepolia Testnet`
- RPC URL: `https://sepolia.infura.io/v3/`
- Chain ID: `11155111`
- Currency Symbol: `SepoliaETH`
- Block Explorer: `https://sepolia.etherscan.io`

---

## Step 3: Open Remix IDE

1. Go to [Remix IDE](https://remix.ethereum.org/)
2. You'll see the default workspace

---

## Step 4: Create the Smart Contract in Remix

1. In the **File Explorer** (left sidebar), click the **"+"** icon to create a new file
2. Name it: `FileStorage.sol`
3. Copy the entire contract code from `contracts/FileStorage.sol`
4. Paste it into the Remix editor

---

## Step 5: Compile the Contract

1. Click the **"Solidity Compiler"** icon in the left sidebar (looks like an "S")
2. Select compiler version: `0.8.0` or higher (e.g., `0.8.20`)
3. Click **"Compile FileStorage.sol"**
4. You should see a green checkmark ✅

**Troubleshooting:**
- If you see warnings about SPDX license, you can ignore them
- If you see errors, make sure the compiler version matches `^0.8.0`

---

## Step 6: Deploy the Contract

1. Click the **"Deploy & Run Transactions"** icon (Ethereum logo with an arrow)
2. In **ENVIRONMENT**, select **"Injected Provider - MetaMask"**
3. MetaMask will pop up asking to connect - click **"Connect"**
4. Make sure your selected account has Sepolia ETH
5. Verify the network shows **"Custom (11155111) network"** (Sepolia)
6. Under **CONTRACT**, select **"FileStorage"**
7. Click the **orange "Deploy"** button
8. MetaMask will pop up with a transaction confirmation:
   - Review the gas fee
   - Click **"Confirm"**
9. Wait for the deployment transaction to be confirmed (10-30 seconds)

---

## Step 7: Verify Deployment

Once deployed, you'll see the contract under **"Deployed Contracts"** in Remix.

1. Click the dropdown arrow next to your contract
2. You should see all the contract functions
3. **Copy the contract address** (it's shown at the top of the deployed contract section)
   - It will look like: `0x1234...5678`

---

## Step 8: Configure the Web Application

Now you need to tell your web app where the contract is deployed:

1. Open `config.js` in your project
2. Find this line:
   ```javascript
   CONTRACT_ADDRESS: "0x0000000000000000000000000000000000000000",
   ```
3. Replace it with your actual contract address:
   ```javascript
   CONTRACT_ADDRESS: "0xYourContractAddressHere",
   ```
4. Save the file

---

## Step 9: Test the Contract (Optional)

Before using the web interface, you can test in Remix:

1. In the deployed contract section, try calling **getFileCount**
   - Should return `0` initially
2. Expand **uploadFile** and enter:
   - `_fileName`: `"test.txt"`
   - `_fileContent`: `"SGVsbG8gV29ybGQ="` (base64 for "Hello World")
   - `_fileType`: `"text/plain"`
   - `_fileSize`: `11`
3. Click **transact** and confirm in MetaMask
4. Call **getFileCount** again - should return `1`

---

## Step 10: Verify on Etherscan

1. Go to [Sepolia Etherscan](https://sepolia.etherscan.io/)
2. Paste your contract address in the search bar
3. You should see:
   - Contract creation transaction
   - Any transactions you made
   - Contract code (if verified)

---

## Step 11: Run Your Web Application

Now your dApp is ready to use!

1. Open `index.html` in a web browser
2. Click **"Connect MetaMask"**
3. Test uploading and retrieving files

---

## 🎉 You're Done!

Your smart contract is now live on the Sepolia testnet! Share your contract address with others so they can interact with it.

---

## Important Information to Save

📝 **Save this information:**
- **Contract Address:** `0xYour_Contract_Address_Here`
- **Network:** Sepolia Testnet (Chain ID: 11155111)
- **Deployment Transaction:** (copy from Remix or Etherscan)

---

## Troubleshooting

### "Insufficient funds" error
- You need more Sepolia ETH. Visit a faucet.

### "Wrong network" error
- Switch MetaMask to Sepolia testnet

### Contract not deploying
- Check compiler version matches `^0.8.0`
- Ensure you have enough ETH for gas

### Web app not connecting to contract
- Verify `config.js` has the correct contract address
- Check MetaMask is on Sepolia network
- Clear browser cache and reload

---

## Need Help?

- [Remix Documentation](https://remix-ide.readthedocs.io/)
- [MetaMask Support](https://support.metamask.io/)
- [Sepolia Etherscan](https://sepolia.etherscan.io/)
