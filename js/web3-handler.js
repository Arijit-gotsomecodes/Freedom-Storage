// Web3 Handler - Manages MetaMask connection and account management

class Web3Handler {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.account = null;
        this.isConnected = false;

        this.setupEventListeners();
    }

    setupEventListeners() {
        if (!window.ethereum) return;

        // Account changed
        window.ethereum.on('accountsChanged', async (accounts) => {
            if (accounts.length === 0) {
                this.disconnectWallet();
                showNotification('Please connect to MetaMask', 'warning');
            } else if (accounts[0] !== this.account) {
                this.account = accounts[0];
                this.updateConnectionUI();
                showNotification('Account switched', 'info');
                // Reload files and stats for new account
                if (typeof updateStats === 'function') await updateStats();
                if (typeof loadMyFiles === 'function') await loadMyFiles();
            }
        });

        // Network changed
        window.ethereum.on('chainChanged', () => {
            window.location.reload();
        });
    }

    async checkMetaMask() {
        if (typeof window.ethereum === 'undefined') {
            throw new Error('MetaMask is not installed. Please install MetaMask to use this dApp.');
        }
        return true;
    }

    async connectWallet() {
        try {
            await this.checkMetaMask();

            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            // Initialize ethers provider
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
            this.signer = this.provider.getSigner();
            this.account = accounts[0];
            this.isConnected = true;

            // Check network
            await this.checkNetwork();

            // Update UI
            this.updateConnectionUI();

            return this.account;
        } catch (error) {
            console.error('Error connecting wallet:', error);
            throw error;
        }
    }

    async checkNetwork() {
        const network = await this.provider.getNetwork();
        const sepoliaChainId = parseInt(CONFIG.NETWORK.chainId, 16);

        if (network.chainId !== sepoliaChainId) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: CONFIG.NETWORK.chainId }],
                });
            } catch (switchError) {
                // Chain not added, try to add it
                if (switchError.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: CONFIG.NETWORK.chainId,
                            chainName: CONFIG.NETWORK.chainName,
                            rpcUrls: CONFIG.NETWORK.rpcUrls,
                            blockExplorerUrls: CONFIG.NETWORK.blockExplorerUrls
                        }],
                    });
                } else {
                    throw switchError;
                }
            }
        }
    }

    async disconnectWallet() {
        this.provider = null;
        this.signer = null;
        this.account = null;
        this.isConnected = false;
        this.updateConnectionUI();
    }

    handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
            // User disconnected all accounts
            this.disconnectWallet();
            showNotification('Please connect to MetaMask', 'warning');
        } else if (accounts[0] !== this.account) {
            // User switched accounts
            this.account = accounts[0];
            this.updateConnectionUI();
            showNotification('Account switched', 'info');

            // Reload user files
            if (window.loadMyFiles) {
                window.loadMyFiles();
            }
        }
    }

    updateConnectionUI() {
        const connectBtn = document.getElementById('connectBtn');
        const accountInfo = document.getElementById('accountInfo');
        const accountAddress = document.getElementById('accountAddress');
        const uploadSection = document.getElementById('uploadSection');
        const myFilesSection = document.getElementById('myFilesSection');

        if (this.isConnected) {
            connectBtn.innerHTML = '<i data-lucide="log-out" style="width: 16px; height: 16px;"></i> Disconnect';
            connectBtn.classList.add('connected');
            accountInfo.style.display = 'flex';
            accountAddress.textContent = this.formatAddress(this.account);
            uploadSection.style.display = 'block';
            myFilesSection.style.display = 'block';

            // Update balance
            this.updateBalance();
        } else {
            connectBtn.innerHTML = '<i data-lucide="plug" style="width: 16px; height: 16px;"></i> Connect Wallet';
            connectBtn.classList.remove('connected');
            accountInfo.style.display = 'none';
            uploadSection.style.display = 'none';
            myFilesSection.style.display = 'none';
        }

        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    async updateBalance() {
        try {
            const balance = await this.provider.getBalance(this.account);
            const balanceInEth = ethers.utils.formatEther(balance);
            const balanceDisplay = document.getElementById('accountBalance');
            if (balanceDisplay) {
                balanceDisplay.textContent = `${parseFloat(balanceInEth).toFixed(4)} ETH`;
            }
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    }

    formatAddress(address) {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }

    getContract() {
        if (!this.signer) {
            throw new Error('Wallet not connected');
        }
        return new ethers.Contract(CONFIG.CONTRACT_ADDRESS, CONFIG.CONTRACT_ABI, this.signer);
    }

    async getBalance() {
        if (!this.account) return '0';
        const balance = await this.provider.getBalance(this.account);
        return ethers.utils.formatEther(balance);
    }
}

// Global instance
const web3Handler = new Web3Handler();
