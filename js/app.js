// Main Application Logic

let selectedFile = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

function initializeApp() {
    // Set up event listeners
    document.getElementById('connectBtn').addEventListener('click', handleConnectWallet);
    document.getElementById('fileInput').addEventListener('change', handleFileSelect);
    document.getElementById('uploadBtn').addEventListener('click', handleUpload);
    document.getElementById('loadFilesBtn').addEventListener('click', loadMyFiles);
    document.getElementById('retrieveBtn').addEventListener('click', handleRetrieve);
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);

    // Show retrieve gas estimate when file ID is entered
    document.getElementById('fileIdInput').addEventListener('input', (e) => {
        const estimateDiv = document.getElementById('retrieveGasEstimate');
        if (e.target.value) {
            estimateDiv.style.display = 'flex';
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        } else {
            estimateDiv.style.display = 'none';
        }
    });

    // Close preview modal on background click
    document.getElementById('previewModal').addEventListener('click', (e) => {
        if (e.target.id === 'previewModal') {
            closePreview();
        }
    });

    // Check if already connected
    checkWalletConnection();

    // Load dark mode preference
    loadDarkModePreference();

    // Check for shared file in URL
    checkSharedFile();
}

async function checkSharedFile() {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedIdBase64 = urlParams.get('share');

    if (sharedIdBase64) {
        try {
            const fileId = atob(sharedIdBase64);
            console.log('Shared file ID detected:', fileId);

            showNotification('Loading shared file...', 'info');

            // Try to preview directly (will use read-only provider if no wallet)
            await previewFile(fileId);

            // Clean URL
            const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.pushState({ path: newUrl }, '', newUrl);

        } catch (error) {
            console.error('Error handling shared file:', error);
            showNotification('Invalid share link or wallet required', 'error');
        }
    }
}

async function checkWalletConnection() {
    if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            await web3Handler.connectWallet();
            // Automatically load stats and files when wallet is already connected
            await updateStats();
            await loadMyFiles();
        }
    }
}

async function handleConnectWallet() {
    try {
        if (web3Handler.isConnected) {
            await web3Handler.disconnectWallet();
        } else {
            await web3Handler.connectWallet();
            await loadMyFiles();
            await updateStats();
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Check against IPFS max size
    if (file.size > CONFIG.STORAGE.IPFS_STORAGE_LIMIT) {
        showNotification(`File too large! Maximum size is ${formatFileSize(CONFIG.STORAGE.IPFS_STORAGE_LIMIT)}`, 'warning');
        event.target.value = '';
        return;
    }

    selectedFile = file;

    // Show file info
    const fileInfo = document.getElementById('fileInfo');
    const uploadBtn = document.getElementById('uploadBtn');

    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = formatFileSize(file.size);
    document.getElementById('fileType').textContent = file.type || 'Unknown';

    // Determine storage method
    const storageMethodElement = document.getElementById('storageMethod');
    let storageMethod;

    if (file.size <= CONFIG.STORAGE.DIRECT_STORAGE_LIMIT) {
        storageMethod = 'Direct On-Chain';
        storageMethodElement.style.color = '#3498db';
    } else if (file.size <= CONFIG.STORAGE.IPFS_STORAGE_LIMIT) {
        storageMethod = 'IPFS (Pinata)';
        storageMethodElement.style.color = '#9b59b6';
    } else {
        storageMethod = 'File too large';
        storageMethodElement.style.color = '#e74c3c';
        uploadBtn.disabled = true;
    }

    storageMethodElement.textContent = storageMethod;
    fileInfo.style.display = 'block';
    uploadBtn.disabled = false;

    // Estimate gas cost
    await estimateUploadGas(file);
}

async function estimateUploadGas(file) {
    const gasEstimateDiv = document.getElementById('gasEstimate');
    const gasEstimateText = document.getElementById('gasEstimateText');

    try {
        gasEstimateDiv.style.display = 'flex';
        gasEstimateText.textContent = 'Estimating gas cost...';

        let estimatedGas;

        if (file.size <= CONFIG.STORAGE.DIRECT_STORAGE_LIMIT) {
            // Direct storage - estimate based on file size
            // Rough estimate: ~680 gas per byte for SSTORE operations
            const dataSize = Math.ceil(file.size * 4 / 3); // base64 overhead
            estimatedGas = 100000 + (dataSize * 680);
        } else {
            // IPFS storage - only storing hash (~46 bytes)
            estimatedGas = 150000; // Much lower, just storing hash
        }

        // Get current gas price and estimate cost
        const gasPrice = await web3Handler.provider.getGasPrice();
        const gasCostWei = gasPrice.mul(estimatedGas);
        const gasCostEth = ethers.utils.formatEther(gasCostWei);

        // Estimate USD (assuming ~$2000 per ETH for Sepolia equivalent)
        const ethPrice = 2000;
        const gasCostUsd = (parseFloat(gasCostEth) * ethPrice).toFixed(2);

        gasEstimateText.innerHTML = `
            <strong>Estimated:</strong> ${estimatedGas.toLocaleString()} gas 
            (~${parseFloat(gasCostEth).toFixed(6)} ETH ≈ $${gasCostUsd} on mainnet)
        `;

        // Reinitialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } catch (error) {
        console.error('Gas estimation error:', error);
        gasEstimateText.textContent = 'Gas estimation unavailable';
    }
}

async function handleUpload() {
    if (!selectedFile) {
        showNotification('Please select a file first', 'warning');
        return;
    }

    if (!web3Handler.isConnected) {
        showNotification('Please connect your wallet first', 'warning');
        return;
    }

    try {
        const uploadBtn = document.getElementById('uploadBtn');
        uploadBtn.disabled = true;
        uploadBtn.textContent = 'Uploading...';

        let fileContent;
        const useIPFS = selectedFile.size > CONFIG.STORAGE.DIRECT_STORAGE_LIMIT;

        if (useIPFS) {
            // Upload to IPFS via Pinata
            const ipfsHash = await ipfsHandler.uploadFile(selectedFile);
            fileContent = `ipfs://${ipfsHash}`;
            uploadBtn.textContent = 'Storing on blockchain...';
        } else {
            // Store directly on-chain as base64
            fileContent = await readFileAsBase64(selectedFile);
        }

        // Upload metadata to blockchain
        const result = await contractInteraction.uploadFile(
            selectedFile.name,
            fileContent,
            selectedFile.type,
            selectedFile.size
        );

        // Reset form
        document.getElementById('fileInput').value = '';
        document.getElementById('fileInfo').style.display = 'none';
        selectedFile = null;

        // Reload files and stats
        await loadMyFiles();
        await updateStats();

    } catch (error) {
        console.error('Upload error:', error);
    } finally {
        const uploadBtn = document.getElementById('uploadBtn');
        uploadBtn.disabled = false;
        uploadBtn.textContent = 'Upload to Blockchain';
    }
}

async function loadMyFiles() {
    if (!web3Handler.isConnected) {
        return;
    }

    try {
        const fileIds = await contractInteraction.getMyFiles();
        const filesList = document.getElementById('filesList');

        if (fileIds.length === 0) {
            filesList.innerHTML = '<p class="no-files">No files uploaded yet. Upload your first file!</p>';
            return;
        }

        filesList.innerHTML = '<div class="loading">Loading files...</div>';

        // Load full file data to get content for thumbnails
        const filesData = await Promise.all(
            fileIds.map(id => contractInteraction.getFile(id))
        );

        // Sort by timestamp (newest first)
        filesData.sort((a, b) => b.timestamp - a.timestamp);

        // Render files
        filesList.innerHTML = filesData.map(file => {
            const isImage = file.fileType.startsWith('image/');
            let thumbnailHtml = '';

            if (isImage) {
                let imageUrl;
                if (ipfsHandler.isIPFSHash(file.fileContent)) {
                    imageUrl = ipfsHandler.getIPFSUrl(file.fileContent);
                } else {
                    imageUrl = `data:${file.fileType};base64,${file.fileContent}`;
                }

                thumbnailHtml = `
                    <div class="file-thumbnail">
                        <img src="${imageUrl}" alt="${escapeHtml(file.fileName)}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                        <div class="file-icon-fallback" style="display: none;">
                            <i data-lucide="${getLucideIcon(file.fileType)}"></i>
                        </div>
                    </div>
                `;
            } else {
                thumbnailHtml = `
                    <div class="file-icon">
                        <i data-lucide="${getLucideIcon(file.fileType)}"></i>
                    </div>
                `;
            }

            return `
            <div class="file-card" data-file-id="${file.id}">
                ${thumbnailHtml}
                <div class="file-details">
                    <h3>${escapeHtml(file.fileName)}</h3>
                    <p class="file-meta">
                        <span><i data-lucide="package" style="width: 14px; height: 14px; vertical-align: middle;"></i> ${formatFileSize(file.fileSize)}</span>
                        <span><i data-lucide="clock" style="width: 14px; height: 14px; vertical-align: middle;"></i> ${formatDate(file.timestamp)}</span>
                    </p>
                    <p class="file-id">ID: ${file.id}</p>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    ${isImage ? `
                    <button class="preview-btn" onclick="previewFile(${file.id})">
                        <i data-lucide="eye" style="width: 16px; height: 16px;"></i>
                        Preview
                    </button>
                    ` : ''}
                    <button class="download-btn" onclick="downloadFile(${file.id})">
                        <i data-lucide="download" style="width: 16px; height: 16px;"></i>
                        Download
                    </button>
                    <button class="share-btn" onclick="shareFile(${file.id})">
                        <i data-lucide="share-2" style="width: 16px; height: 16px;"></i>
                        Share
                    </button>
                </div>
            </div>
        `;
        }).join('');

        // Reinitialize Lucide icons for dynamically added content
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

    } catch (error) {
        console.error('Error loading files:', error);
    }
}

async function handleRetrieve() {
    const fileIdInput = document.getElementById('fileIdInput');
    const fileId = parseInt(fileIdInput.value);

    if (!fileId || fileId < 1) {
        showNotification('Please enter a valid file ID', 'warning');
        return;
    }

    try {
        const retrieveBtn = document.getElementById('retrieveBtn');
        retrieveBtn.disabled = true;
        retrieveBtn.textContent = 'Retrieving...';

        const file = await contractInteraction.getFile(fileId);
        await downloadFile(fileId);

    } catch (error) {
        console.error('Retrieve error:', error);
    } finally {
        const retrieveBtn = document.getElementById('retrieveBtn');
        retrieveBtn.disabled = false;
        retrieveBtn.textContent = 'Retrieve File';
    }
}

async function downloadFile(fileId) {
    // Find the download button for this file
    const downloadBtn = event?.target?.closest('.download-btn');

    try {
        // Show loading on button
        if (downloadBtn) {
            downloadBtn.disabled = true;
            downloadBtn.innerHTML = '<i data-lucide="loader-2" class="spinner"></i> Preparing...';
            lucide.createIcons();
        }

        showNotification('Preparing download...', 'info');

        const file = await contractInteraction.getFile(fileId);
        console.log('Download file data:', file);

        // Check if it's an IPFS hash
        if (ipfsHandler.isIPFSHash(file.fileContent)) {
            console.log('Downloading from IPFS. Hash:', file.fileContent);
            showNotification('Fetching from IPFS, please wait...', 'info');

            // Download from IPFS
            await ipfsHandler.downloadFile(file.fileContent, file.fileName, file.fileType);

            // Give user feedback and wait a bit before re-enabling button
            showNotification('Download started! Check your downloads folder.', 'success');
            setTimeout(() => {
                if (downloadBtn) {
                    downloadBtn.disabled = false;
                    downloadBtn.innerHTML = '<i data-lucide="download"></i> Download';
                    lucide.createIcons();
                }
            }, 2000);
        } else {
            console.log('Downloading from base64');
            // Download from base64
            const blob = base64ToBlob(file.fileContent, file.fileType);

            // Create download link
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showNotification('File downloaded successfully!', 'success');

            // Re-enable button immediately for base64
            if (downloadBtn) {
                downloadBtn.disabled = false;
                downloadBtn.innerHTML = '<i data-lucide="download"></i> Download';
                lucide.createIcons();
            }
        }
    } catch (error) {
        console.error('Download error:', error);
        showNotification('Download failed: ' + error.message, 'error');

        // Re-enable button on error
        if (downloadBtn) {
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = '<i data-lucide="download"></i> Download';
            lucide.createIcons();
        }
    }
}

async function updateStats() {
    try {
        const totalFiles = await contractInteraction.getFileCount();
        document.getElementById('totalFiles').textContent = totalFiles;

        if (web3Handler.isConnected) {
            const myFiles = await contractInteraction.getMyFiles();
            document.getElementById('myFiles').textContent = myFiles.length;
        }
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// Utility Functions

function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: mimeType });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

function getLucideIcon(mimeType) {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'music';
    if (mimeType.includes('pdf')) return 'file-text';
    if (mimeType.includes('text')) return 'file-text';
    if (mimeType.includes('zip') || mimeType.includes('compressed')) return 'archive';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'file-text';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'table';
    return 'file';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// Dark Mode Functions
function toggleDarkMode() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Update icon
    const icon = document.querySelector('#darkModeToggle i');
    icon.setAttribute('data-lucide', newTheme === 'dark' ? 'sun' : 'moon');

    // Reinitialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function loadDarkModePreference() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Update icon
    const icon = document.querySelector('#darkModeToggle i');
    if (icon) {
        icon.setAttribute('data-lucide', savedTheme === 'dark' ? 'sun' : 'moon');
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

// Image Preview Functions
async function previewFile(fileId) {
    try {
        showNotification('Loading preview...', 'info');

        // Store file ID globally for download button
        window.currentPreviewFileId = fileId;

        const file = await contractInteraction.getFile(fileId);

        console.log('Preview file data:', file);

        if (!file.fileType.startsWith('image/')) {
            showNotification('Preview only available for images', 'warning');
            return;
        }

        const modal = document.getElementById('previewModal');
        const imgContainer = document.querySelector('.preview-image-container');
        const img = document.getElementById('previewImage');
        const fileName = document.getElementById('previewFileName');
        const info = document.getElementById('previewInfo');

        fileName.textContent = file.fileName;

        // Reset image state and show loading spinner
        img.classList.remove('loaded');
        imgContainer.classList.add('loading');

        // Check if it's IPFS or base64
        if (ipfsHandler.isIPFSHash(file.fileContent)) {
            // Load from IPFS
            const url = ipfsHandler.getIPFSUrl(file.fileContent);
            console.log('IPFS Preview URL:', url);
            console.log('IPFS Hash:', file.fileContent);

            // Add error handler for image loading
            img.onerror = () => {
                console.error('Failed to load image from:', url);
                imgContainer.classList.remove('loading');
                showNotification('Failed to load image from IPFS', 'error');
            };

            img.onload = () => {
                console.log('Image loaded successfully from IPFS');
                imgContainer.classList.remove('loading');
                img.classList.add('loaded');
                showNotification('Preview loaded!', 'success');
            };

            img.src = url;
        } else {
            // Load from base64
            console.log('Loading base64 image');

            img.onload = () => {
                imgContainer.classList.remove('loading');
                img.classList.add('loaded');
            };

            img.onerror = () => {
                imgContainer.classList.remove('loading');
                showNotification('Failed to load image', 'error');
            };

            img.src = `data:${file.fileType};base64,${file.fileContent}`;
        }

        info.innerHTML = `
            <strong>File ID:</strong> ${file.id} |
            <strong>Size:</strong> ${formatFileSize(file.fileSize)} |
            <strong>Uploaded:</strong> ${formatDate(file.timestamp)}
        `;

        modal.classList.add('show');

        // Reinitialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

    } catch (error) {
        console.error('Preview error:', error);
        showNotification('Failed to load preview', 'error');
    }
}

function closePreview() {
    const modal = document.getElementById('previewModal');
    const img = document.getElementById('previewImage');
    const imgContainer = document.querySelector('.preview-image-container');

    // Remove event handlers BEFORE clearing src to prevent error notifications
    img.onerror = null;
    img.onload = null;

    // Clear loading state
    imgContainer.classList.remove('loading');
    img.classList.remove('loaded');

    modal.classList.remove('show');
    img.src = '';
}

// Make functions globally available
window.loadMyFiles = loadMyFiles;
window.downloadFile = downloadFile;
window.previewFile = previewFile;
window.closePreview = closePreview;
window.shareFile = shareFile;

async function shareFile(fileId) {
    try {
        // Simple base64 encoding of ID to make it look like a "link"
        const encodedId = btoa(fileId.toString());
        const shareUrl = `${window.location.origin}${window.location.pathname}?share=${encodedId}`;

        await navigator.clipboard.writeText(shareUrl);
        showNotification('Share link copied to clipboard!', 'success');
    } catch (error) {
        console.error('Error sharing file:', error);
        showNotification('Failed to copy link', 'error');
    }
}
