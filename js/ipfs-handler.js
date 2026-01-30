// IPFS Handler - Manages file uploads to Pinata IPFS

class IPFSHandler {
    constructor() {
        this.pinataJWT = CONFIG.PINATA.JWT;
        this.pinataGateway = CONFIG.PINATA.GATEWAY;
    }

    isConfigured() {
        // In production (Netlify), JWT is handled by Functions, so it's okay if it's empty
        // In local development, we need the JWT
        const isProduction = window.location.hostname !== 'localhost' &&
            window.location.hostname !== '127.0.0.1';

        // If production, always return true (Netlify Functions handle it)
        // If local, check if JWT exists
        return isProduction || (this.pinataJWT && this.pinataJWT.length > 0);
    }

    /**
     * Upload a file to IPFS via Pinata
     * @param {File} file - The file to upload
     * @returns {Promise<string>} - The IPFS hash (CID)
     */
    async uploadFile(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            // Optional: Add metadata
            const metadata = JSON.stringify({
                name: file.name,
                keyvalues: {
                    uploadedAt: new Date().toISOString(),
                    fileType: file.type,
                    fileSize: file.size
                }
            });
            formData.append('pinataMetadata', metadata);

            // Optional: Pinning options
            const options = JSON.stringify({
                cidVersion: 1
            });
            formData.append('pinataOptions', options);

            showNotification('Uploading file to IPFS...', 'info');

            // Determine if we're in production (Netlify) or local dev
            const isProduction = window.location.hostname !== 'localhost' &&
                window.location.hostname !== '127.0.0.1';

            let response;

            if (isProduction) {
                // Use Netlify Function in production
                response = await fetch('/.netlify/functions/pinata-upload', {
                    method: 'POST',
                    body: formData
                });
            } else {
                // Use direct Pinata API in local development
                if (!this.pinataJWT || this.pinataJWT.length === 0) {
                    throw new Error('IPFS storage requires Pinata API credentials. Please configure in config.js');
                }

                response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.pinataJWT}`
                    },
                    body: formData
                });
            }

            console.log('IPFS upload response status:', response.status);

            if (!response.ok) {
                let errorMessage = 'Failed to upload to IPFS';
                try {
                    const errorData = await response.text();
                    console.error('IPFS upload error response:', errorData);

                    // Try to parse as JSON
                    try {
                        const errorJson = JSON.parse(errorData);
                        errorMessage = errorJson.error || errorJson.message || errorData;
                    } catch {
                        errorMessage = errorData || `HTTP ${response.status}: ${response.statusText}`;
                    }
                } catch (e) {
                    console.error('Error parsing response:', e);
                    errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log('IPFS upload success:', result);
            const ipfsHash = result.IpfsHash;

            showNotification(`File uploaded to IPFS! Hash: ${ipfsHash.substring(0, 12)}...`, 'success');

            return ipfsHash;

        } catch (error) {
            console.error('IPFS upload error:', error);
            showNotification(`IPFS upload failed: ${error.message}`, 'error');
            throw error;
        }
    }

    /**
     * Get the full IPFS URL for a hash
     * @param {string} ipfsHash - The IPFS hash (CID)
     * @returns {string} - Full IPFS URL
     */
    getIPFSUrl(ipfsHash) {
        // Remove ipfs:// prefix if present
        const cleanHash = ipfsHash.replace('ipfs://', '');
        return `https://${this.pinataGateway}/ipfs/${cleanHash}`;
    }

    /**
     * Check if a string is an IPFS hash
     * @param {string} content - The content to check
     * @returns {boolean}
     */
    isIPFSHash(content) {
        // Check for IPFS hash patterns (CIDv0 or CIDv1)
        return content.startsWith('Qm') ||
            content.startsWith('bafy') ||
            content.startsWith('ipfs://');
    }

    /**
     * Download a file from IPFS
     * @param {string} ipfsHash - The IPFS hash
     * @param {string} fileName - The file name to save as
     * @param {string} fileType - The MIME type
     */
    async downloadFile(ipfsHash, fileName, fileType) {
        try {
            showNotification('Downloading from IPFS...', 'info');

            const cleanHash = ipfsHash.replace('ipfs://', '');

            // Determine if we're in production or local
            const isProduction = window.location.hostname !== 'localhost' &&
                window.location.hostname !== '127.0.0.1';

            let downloadUrl;

            if (isProduction) {
                // Use Netlify Function to proxy download with proper Content-Disposition headers
                downloadUrl = `/.netlify/functions/ipfs-download?hash=${encodeURIComponent(cleanHash)}&fileName=${encodeURIComponent(fileName)}`;
            } else {
                // In development, use direct IPFS URL
                downloadUrl = this.getIPFSUrl(cleanHash);
            }

            // Use a simple link approach to avoid CORS issues
            // The browser will handle the download natively
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = fileName || 'download';
            a.target = '_blank';  // Open in new tab if download fails
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            showNotification('Download started!', 'success');

        } catch (error) {
            console.error('IPFS download error:', error);
            showNotification(`Failed to download from IPFS: ${error.message}`, 'error');
            throw error;
        }
    }

    /**
     * Test Pinata connection
     * @returns {Promise<boolean>}
     */
    async testConnection() {
        if (!this.isConfigured()) {
            return false;
        }

        try {
            const response = await fetch('https://api.pinata.cloud/data/testAuthentication', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.pinataJWT}`
                }
            });

            return response.ok;
        } catch (error) {
            console.error('Pinata connection test failed:', error);
            return false;
        }
    }
}

// Global instance
const ipfsHandler = new IPFSHandler();
