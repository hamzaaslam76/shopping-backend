# Pinata IPFS Integration Setup

This backend now uses Pinata for decentralized image storage via IPFS. Follow these steps to set up Pinata integration.

## 1. Create a Pinata Account

1. Go to [Pinata Cloud](https://pinata.cloud/)
2. Sign up for a free account
3. Verify your email address

## 2. Get API Keys

1. Log in to your Pinata dashboard
2. Go to "API Keys" section
3. Click "New Key"
4. Give it a name (e.g., "Shopping Backend")
5. Select appropriate permissions (at minimum: PinFileToIPFS, PinList, Unpin)
6. Copy your **API Key** and **Secret API Key**

## 3. Configure Environment Variables

Update your `config.env` file with your Pinata credentials:

```env
# Pinata IPFS Configuration
PINATA_API_KEY=your_actual_api_key_here
PINATA_SECRET_API_KEY=your_actual_secret_key_here
```

**⚠️ Important:** Replace the placeholder values with your actual API keys.

## 4. Test the Integration

### Option 1: Using the Test Script

Run the test script to verify your Pinata connection:

```bash
node scripts/testPinata.js
```

### Option 2: Using API Endpoints

1. Start your server: `npm run dev`
2. Test connection: `GET http://localhost:8000/api/v1/test/pinata/connection`
3. Get account info: `GET http://localhost:8000/api/v1/test/pinata/account`
4. Test image upload: `POST http://localhost:8000/api/v1/test/pinata/upload` (with image file)

## 5. How It Works

### Image Upload Flow

1. **Client uploads image** → Backend receives via Multer (memory storage)
2. **Backend processes image** → Uploads to Pinata IPFS
3. **Pinata returns IPFS hash** → Backend stores hash and gateway URL in database
4. **Client accesses image** → Via Pinata gateway URL or any IPFS gateway

### Database Schema Changes

Images are now stored with additional IPFS metadata:

```javascript
{
  url: "https://gateway.pinata.cloud/ipfs/QmYourHash...",
  ipfsHash: "QmYourHash...",
  alt: "image-description.jpg",
  uploadedAt: "2024-01-15T10:30:00.000Z"
}
```

### Supported Image Types

- JPEG/JPG
- PNG
- GIF
- WebP
- SVG

### File Size Limits

- **Category images**: 10MB (increased from 2MB)
- **Product images**: 10MB (increased from 5MB)

## 6. Benefits of Using Pinata

### Decentralized Storage
- Images are stored on IPFS (InterPlanetary File System)
- Distributed across multiple nodes globally
- No single point of failure

### Performance
- Global CDN-like access
- Multiple gateway options
- Fast retrieval from nearest node

### Cost-Effective
- Pay only for what you use
- No bandwidth charges for retrieval
- Competitive pricing for storage

### Reliability
- 99.9% uptime SLA
- Automatic redundancy
- Data integrity verification

## 7. API Endpoints

### Category Images
- `POST /api/v1/categories` - Create category with image
- `PATCH /api/v1/categories/:id` - Update category image

### Product Images
- `POST /api/v1/products` - Create product with main/variant images
- `PATCH /api/v1/products/:id` - Update product images

### Test Endpoints
- `GET /api/v1/test/pinata/connection` - Test Pinata connection
- `GET /api/v1/test/pinata/account` - Get account information
- `POST /api/v1/test/pinata/upload` - Test image upload

## 8. Troubleshooting

### Common Issues

**Authentication Failed**
- Check API keys in config.env
- Verify keys are correct in Pinata dashboard
- Ensure account has sufficient credits

**Upload Failed**
- Check file size limits
- Verify file type is supported
- Check network connectivity

**Image Not Loading**
- Verify IPFS hash is correct
- Try different gateway URLs
- Check if file is pinned in Pinata dashboard

### Gateway URLs

If Pinata gateway is slow, you can use alternative IPFS gateways:

- `https://gateway.pinata.cloud/ipfs/{hash}`
- `https://ipfs.io/ipfs/{hash}`
- `https://cloudflare-ipfs.com/ipfs/{hash}`
- `https://gateway.ipfs.io/ipfs/{hash}`

## 9. Migration from Local Storage

If you have existing images in local storage, you can migrate them:

1. Use the `pinataService.uploadFileFromPath()` method
2. Update database records with new IPFS URLs
3. Remove old local files after verification

## 10. Production Considerations

### Security
- Keep API keys secure
- Use environment variables
- Consider IP whitelisting in Pinata

### Monitoring
- Monitor Pinata usage dashboard
- Set up alerts for quota limits
- Track upload success rates

### Backup Strategy
- IPFS provides built-in redundancy
- Consider additional backup for critical images
- Document your pinning strategy

## Support

- [Pinata Documentation](https://docs.pinata.cloud/)
- [IPFS Documentation](https://docs.ipfs.io/)
- [Pinata Support](https://pinata.cloud/support)
