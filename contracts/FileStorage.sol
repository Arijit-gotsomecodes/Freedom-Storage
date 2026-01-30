// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title FileStorage
 * @dev Store and retrieve file metadata on the Sepolia blockchain
 */
contract FileStorage {
    
    struct File {
        uint256 id;
        string fileName;
        string fileContent; // Can be IPFS hash or base64 encoded data
        address uploader;
        uint256 timestamp;
        string fileType; // MIME type
        uint256 fileSize; // Size in bytes
    }
    
    // Mapping from file ID to File
    mapping(uint256 => File) public files;
    
    // Mapping from user address to their file IDs
    mapping(address => uint256[]) public userFiles;
    
    // Counter for file IDs
    uint256 public fileCount;
    
    // Events
    event FileUploaded(
        uint256 indexed fileId,
        string fileName,
        address indexed uploader,
        uint256 timestamp,
        string fileType
    );
    
    event FileRetrieved(
        uint256 indexed fileId,
        address indexed retriever
    );
    
    /**
     * @dev Upload a new file
     * @param _fileName Name of the file
     * @param _fileContent IPFS hash or base64 encoded content
     * @param _fileType MIME type of the file
     * @param _fileSize Size of the file in bytes
     */
    function uploadFile(
        string memory _fileName,
        string memory _fileContent,
        string memory _fileType,
        uint256 _fileSize
    ) public returns (uint256) {
        require(bytes(_fileName).length > 0, "File name cannot be empty");
        require(bytes(_fileContent).length > 0, "File content cannot be empty");
        
        fileCount++;
        
        files[fileCount] = File({
            id: fileCount,
            fileName: _fileName,
            fileContent: _fileContent,
            uploader: msg.sender,
            timestamp: block.timestamp,
            fileType: _fileType,
            fileSize: _fileSize
        });
        
        userFiles[msg.sender].push(fileCount);
        
        emit FileUploaded(
            fileCount,
            _fileName,
            msg.sender,
            block.timestamp,
            _fileType
        );
        
        return fileCount;
    }
    
    /**
     * @dev Get file by ID
     * @param _fileId ID of the file to retrieve
     */
    function getFile(uint256 _fileId) public returns (
        uint256 id,
        string memory fileName,
        string memory fileContent,
        address uploader,
        uint256 timestamp,
        string memory fileType,
        uint256 fileSize
    ) {
        require(_fileId > 0 && _fileId <= fileCount, "Invalid file ID");
        
        File memory file = files[_fileId];
        
        emit FileRetrieved(_fileId, msg.sender);
        
        return (
            file.id,
            file.fileName,
            file.fileContent,
            file.uploader,
            file.timestamp,
            file.fileType,
            file.fileSize
        );
    }
    
    /**
     * @dev Get all file IDs uploaded by a specific user
     * @param _user Address of the user
     */
    function getUserFiles(address _user) public view returns (uint256[] memory) {
        return userFiles[_user];
    }
    
    /**
     * @dev Get all file IDs uploaded by the caller
     */
    function getMyFiles() public view returns (uint256[] memory) {
        return userFiles[msg.sender];
    }
    
    /**
     * @dev Get total number of files stored
     */
    function getFileCount() public view returns (uint256) {
        return fileCount;
    }
    
    /**
     * @dev Get file metadata without content (gas efficient)
     * @param _fileId ID of the file
     */
    function getFileMetadata(uint256 _fileId) public view returns (
        uint256 id,
        string memory fileName,
        address uploader,
        uint256 timestamp,
        string memory fileType,
        uint256 fileSize
    ) {
        require(_fileId > 0 && _fileId <= fileCount, "Invalid file ID");
        
        File memory file = files[_fileId];
        
        return (
            file.id,
            file.fileName,
            file.uploader,
            file.timestamp,
            file.fileType,
            file.fileSize
        );
    }
}
