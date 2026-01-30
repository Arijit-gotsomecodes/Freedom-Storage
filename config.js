// Template configuration file
// Copy this to config.js and fill in your values

const CONFIG = {
    // Your deployed smart contract address on Sepolia testnet
    CONTRACT_ADDRESS: "0xADbBaaa80B958ec351e4F46f1A8cCE11449B7Cd9",

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
        chainId: "0xaa36a7", // 11155111 in hex (Sepolia)
        chainName: "Sepolia Testnet",
        rpcUrls: ["https://sepolia.infura.io/v3/"],
        publicRpcUrl: 'https://rpc2.sepolia.org', // Public RPC for read-only access
        blockExplorerUrls: ["https://sepolia.etherscan.io/"]
    },

    // Smart contract ABI (from Remix)
    CONTRACT_ABI: [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "fileId",
                    "type": "uint256"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "retriever",
                    "type": "address"
                }
            ],
            "name": "FileRetrieved",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "fileId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "fileName",
                    "type": "string"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "uploader",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "timestamp",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "fileType",
                    "type": "string"
                }
            ],
            "name": "FileUploaded",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_fileId",
                    "type": "uint256"
                }
            ],
            "name": "getFile",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "fileName",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "fileContent",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "uploader",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "timestamp",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "fileType",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "fileSize",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_fileName",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_fileContent",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_fileType",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_fileSize",
                    "type": "uint256"
                }
            ],
            "name": "uploadFile",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "fileCount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "files",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "fileName",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "fileContent",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "uploader",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "timestamp",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "fileType",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "fileSize",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getFileCount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_fileId",
                    "type": "uint256"
                }
            ],
            "name": "getFileMetadata",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "fileName",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "uploader",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "timestamp",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "fileType",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "fileSize",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getMyFiles",
            "outputs": [
                {
                    "internalType": "uint256[]",
                    "name": "",
                    "type": "uint256[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_user",
                    "type": "address"
                }
            ],
            "name": "getUserFiles",
            "outputs": [
                {
                    "internalType": "uint256[]",
                    "name": "",
                    "type": "uint256[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "userFiles",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
};

// Make CONFIG globally available
window.CONFIG = CONFIG;
