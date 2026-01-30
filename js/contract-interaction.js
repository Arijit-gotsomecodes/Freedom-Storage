// Contract Interaction - Handles blockchain operations

class ContractInteraction {
    constructor(web3Handler) {
        this.web3Handler = web3Handler;
    }

    async uploadFile(fileName, fileContent, fileType, fileSize) {
        try {
            if (!this.web3Handler.isConnected) {
                throw new Error('Please connect your wallet first');
            }

            const contract = this.web3Handler.getContract();

            showNotification('Uploading file to blockchain...', 'info');

            // Estimate gas
            const gasEstimate = await contract.estimateGas.uploadFile(
                fileName,
                fileContent,
                fileType,
                fileSize
            );

            // Add 20% buffer to gas estimate
            const gasLimit = gasEstimate.mul(120).div(100);

            // Send transaction
            const tx = await contract.uploadFile(
                fileName,
                fileContent,
                fileType,
                fileSize,
                { gasLimit }
            );

            showNotification('Transaction submitted. Waiting for confirmation...', 'info');

            // Wait for confirmation
            const receipt = await tx.wait();

            // Get file ID from event
            const event = receipt.events.find(e => e.event === 'FileUploaded');
            const fileId = event.args.fileId.toNumber();

            showNotification(`File uploaded successfully! File ID: ${fileId}`, 'success');

            return {
                fileId,
                transactionHash: receipt.transactionHash
            };
        } catch (error) {
            console.error('Error uploading file:', error);

            if (error.code === 4001) {
                showNotification('Transaction rejected by user', 'error');
            } else if (error.message.includes('insufficient funds')) {
                showNotification('Insufficient funds for gas', 'error');
            } else {
                showNotification(`Upload failed: ${error.message}`, 'error');
            }

            throw error;
        }
    }

    async getFile(fileId) {
        try {
            const contract = this.web3Handler.getContract();

            const tx = await contract.getFile(fileId);
            const receipt = await tx.wait();

            // The function returns the file data
            const file = await contract.files(fileId);

            return {
                id: file.id.toNumber(),
                fileName: file.fileName,
                fileContent: file.fileContent,
                uploader: file.uploader,
                timestamp: file.timestamp.toNumber(),
                fileType: file.fileType,
                fileSize: file.fileSize.toNumber()
            };
        } catch (error) {
            console.error('Error retrieving file:', error);
            showNotification(`Failed to retrieve file: ${error.message}`, 'error');
            throw error;
        }
    }

    async getFileMetadata(fileId) {
        try {
            const contract = this.web3Handler.getContract();
            const file = await contract.files(fileId);

            return {
                id: file.id.toNumber(),
                fileName: file.fileName,
                uploader: file.uploader,
                timestamp: file.timestamp.toNumber(),
                fileType: file.fileType,
                fileSize: file.fileSize.toNumber()
            };
        } catch (error) {
            console.error('Error retrieving file metadata:', error);
            throw error;
        }
    }

    async getMyFiles() {
        try {
            if (!this.web3Handler.isConnected) {
                return [];
            }

            const contract = this.web3Handler.getContract();
            const fileIds = await contract.getMyFiles();

            return fileIds.map(id => id.toNumber());
        } catch (error) {
            console.error('Error getting user files:', error);
            showNotification(`Failed to load your files: ${error.message}`, 'error');
            return [];
        }
    }

    async getUserFiles(address) {
        try {
            const contract = this.web3Handler.getContract();
            const fileIds = await contract.getUserFiles(address);

            return fileIds.map(id => id.toNumber());
        } catch (error) {
            console.error('Error getting user files:', error);
            throw error;
        }
    }

    async getFileCount() {
        try {
            const contract = this.web3Handler.getContract();
            const count = await contract.getFileCount();

            return count.toNumber();
        } catch (error) {
            console.error('Error getting file count:', error);
            return 0;
        }
    }
}

// Global instance
const contractInteraction = new ContractInteraction(web3Handler);
