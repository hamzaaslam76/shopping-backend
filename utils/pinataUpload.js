import axios from "axios";
import FormData from "form-data";

/**
 * Uploads a file buffer to Pinata and returns the IPFS URL.
 * @param {Buffer} fileBuffer - The file buffer from multer.memoryStorage
 * @param {string} fileName - Original file name
 * @param {string} mimeType - MIME type of the file
 * @param {object} [metadata={}] - Optional metadata object
 * @returns {Promise<string>} - The public IPFS gateway URL
 */
export const uploadToPinata = async (fileBuffer, fileName, mimeType, metadata = {}) => {
  try {
    const formData = new FormData();

    // File
    formData.append("file", fileBuffer, {
      filename: fileName,
      contentType: mimeType,
    });

    // Metadata
    const pinataMetadata = JSON.stringify({
      name: fileName,
      keyvalues: metadata,
    });
    formData.append("pinataMetadata", pinataMetadata);

    // Options
    const pinataOptions = JSON.stringify({ cidVersion: 1 });
    formData.append("pinataOptions", pinataOptions);

    // Upload
    const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      maxBodyLength: "Infinity",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
      },
    });

    const ipfsHash = response.data.IpfsHash;
    return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
  } catch (err) {
    console.error("Pinata upload error:", err.response?.data || err.message);
    throw new Error("Failed to upload file to Pinata");
  }
};
