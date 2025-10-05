const PinataSDK = require('@pinata/sdk');
const AppError = require('./appError');
const fs = require('fs');
const path = require('path');

class PinataService {
  constructor() {
    // Initialize Pinata SDK with API keys from environment variables
    this.pinata = new PinataSDK({ 
      pinataApiKey: process.env.PINATA_API_KEY, 
      pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY 
    });
  }

  /**
   * Upload a single file to Pinata IPFS
   * @param {Object} file - Multer file object
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} - Pinata response with IPFS hash
   */
  async uploadFile(file, options = {}) {
    try {
      // Create readable stream from file buffer
      const readableStream = require('stream').Readable.from(file.buffer);
      
      // Set default options
      const uploadOptions = {
        pinataMetadata: {
          name: options.name || file.originalname,
          keyvalues: {
            type: options.type || 'image',
            uploadedAt: new Date().toISOString(),
            ...options.metadata
          }
        },
        pinataOptions: {
          cidVersion: 0,
          wrapWithDirectory: false
        }
      };

      const result = await this.pinata.pinFileToIPFS(readableStream, uploadOptions);
      
      return {
        success: true,
        ipfsHash: result.IpfsHash,
        pinSize: result.PinSize,
        timestamp: result.Timestamp,
        url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
      };
    } catch (error) {
      console.error('Pinata upload error:', error);
      throw new AppError('Failed to upload file to IPFS', 500);
    }
  }

  /**
   * Upload multiple files to Pinata IPFS
   * @param {Array} files - Array of Multer file objects
   * @param {Object} options - Upload options
   * @returns {Promise<Array>} - Array of upload results
   */
  async uploadMultipleFiles(files, options = {}) {
    try {
      const uploadPromises = files.map((file, index) => {
        const fileOptions = {
          ...options,
          name: `${options.name || 'file'}_${index + 1}_${file.originalname}`,
          metadata: {
            ...options.metadata,
            fileIndex: index + 1,
            originalName: file.originalname
          }
        };
        return this.uploadFile(file, fileOptions);
      });

      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error('Pinata multiple upload error:', error);
      throw new AppError('Failed to upload files to IPFS', 500);
    }
  }

  /**
   * Upload file from local path to Pinata IPFS
   * @param {string} filePath - Path to the file
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} - Pinata response with IPFS hash
   */
  async uploadFileFromPath(filePath, options = {}) {
    try {
      if (!fs.existsSync(filePath)) {
        throw new AppError('File not found', 404);
      }

      const readableStream = fs.createReadStream(filePath);
      const fileName = path.basename(filePath);
      
      const uploadOptions = {
        pinataMetadata: {
          name: options.name || fileName,
          keyvalues: {
            type: options.type || 'image',
            uploadedAt: new Date().toISOString(),
            ...options.metadata
          }
        },
        pinataOptions: {
          cidVersion: 0,
          wrapWithDirectory: false
        }
      };

      const result = await this.pinata.pinFileToIPFS(readableStream, uploadOptions);
      
      return {
        success: true,
        ipfsHash: result.IpfsHash,
        pinSize: result.PinSize,
        timestamp: result.Timestamp,
        url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
      };
    } catch (error) {
      console.error('Pinata upload from path error:', error);
      throw new AppError('Failed to upload file to IPFS', 500);
    }
  }

  /**
   * Get file information from Pinata
   * @param {string} ipfsHash - IPFS hash of the file
   * @returns {Promise<Object>} - File information
   */
  async getFileInfo(ipfsHash) {
    try {
      const result = await this.pinata.pinList({
        hashContains: ipfsHash
      });
      
      if (result.rows.length === 0) {
        throw new AppError('File not found in Pinata', 404);
      }

      return result.rows[0];
    } catch (error) {
      console.error('Pinata get file info error:', error);
      throw new AppError('Failed to get file information', 500);
    }
  }

  /**
   * Unpin file from Pinata
   * @param {string} ipfsHash - IPFS hash of the file to unpin
   * @returns {Promise<Object>} - Unpin result
   */
  async unpinFile(ipfsHash) {
    try {
      const result = await this.pinata.unpin(ipfsHash);
      return result;
    } catch (error) {
      console.error('Pinata unpin error:', error);
      throw new AppError('Failed to unpin file', 500);
    }
  }

  /**
   * Test Pinata connection
   * @returns {Promise<boolean>} - Connection status
   */
  async testConnection() {
    try {
      const result = await this.pinata.testAuthentication();
      return result.authenticated;
    } catch (error) {
      console.error('Pinata connection test error:', error);
      return false;
    }
  }

  /**
   * Get account information
   * @returns {Promise<Object>} - Account info
   */
  async getAccountInfo() {
    try {
      const result = await this.pinata.userPinnedDataTotal();
      return result;
    } catch (error) {
      console.error('Pinata account info error:', error);
      throw new AppError('Failed to get account information', 500);
    }
  }
}

// Create singleton instance
const pinataService = new PinataService();

module.exports = pinataService;
