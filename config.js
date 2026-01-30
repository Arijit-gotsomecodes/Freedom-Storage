// Template configuration file
// Copy this to config.js and fill in your values

const CONFIG = {
    // Your deployed smart contract address on Sepolia testnet
    CONTRACT_ADDRESS: "0x7af5fdFd5BC1C9996072e1e0Fed37aeF5C60BBe7",

    // Pinata configuration - NOT NEEDED for Netlify deployment
    // The JWT is kept secure in Netlify environment variables
    PINATA: {
        JWT: "", // Leave empty - handled by Netlify Functions
        GATEWAY: "gateway.pinata.cloud"
    },

    // Storage limits
    STORAGE: {
        DIRECT_STORAGE_LIMIT: 10 * 1024,        // 10KB
        IPFS_STORAGE_LIMIT: 100 * 1024 * 1024   // 100MB
    },

    // Network configuration
    NETWORK: {
        CHAIN_ID: 11155111, // Sepolia
        NAME: "Sepolia",
        RPC_URL: "https://sepolia.infura.io/v3/"
    },

    // Smart contract ABI
    CONTRACT_ABI: [
        {
            "anonymous": false,
            "inputs": [
                { "indexed": true, "internalType": "uint256", "name": "fileId", "type": "uint256" },
                { "indexed": true, "internalType": "address", "name": "uploader", "type": "address" },
                { "indexed": false, "internalType": "string", "name": "fileName", "type": "string" },
                { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
            ],
            "name": "FileUploaded",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                { "indexed": true, "internalType": "uint256", "name": "fileId", "type": "uint256" },
                { "indexed": true, "internalType": "address", "name": "retriever", "type": "address" },
                { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
            ],
            "name": "FileRetrieved",
            "type": "event"
        },
        {
            "inputs": [
                { "internalType": "string", "name": "_fileName", "type": "string" },
                { "internalType": "string", "name": "_fileContent", "type": "string" },
                { "internalType": "string", "name": "_fileType", "type": "string" },
                { "internalType": "uint256", "name": "_fileSize", "type": "uint256" }
            ],
            "name": "uploadFile",
            "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{ "internalType": "uint256", "name": "_fileId", "type": "uint256" }],
            "name": "getFile",
            "outputs": [
                { "internalType": "string", "name": "fileName", "type": "string" },
                { "internalType": "string", "name": "fileContent", "type": "string" },
                { "internalType": "string", "name": "fileType", "type": "string" },
                { "internalType": "uint256", "name": "fileSize", "type": "uint256" },
                { "internalType": "address", "name": "uploader", "type": "address" },
                { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{ "internalType": "uint256", "name": "_fileId", "type": "uint256" }],
            "name": "getFileMetadata",
            "outputs": [
                { "internalType": "string", "name": "fileName", "type": "string" },
                { "internalType": "string", "name": "fileType", "type": "string" },
                { "internalType": "uint256", "name": "fileSize", "type": "uint256" },
                { "internalType": "address", "name": "uploader", "type": "address" },
                { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getMyFiles",
            "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getFileCount",
            "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
            "stateMutability": "view",
            "type": "function"
        }
    ]
};

// Make CONFIG globally available
window.CONFIG = CONFIG;
