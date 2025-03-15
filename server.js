require('dotenv').config();
const express = require('express');
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS for frontend access

// AWS S3 Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

app.get('/generate-presigned-url', async (req, res) => {
  try {
    const { fileName } = req.query; // Get file name from request
    if (!fileName) return res.status(400).json({ error: 'File name required' });

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${fileName}`, // File path in S3
      Expires: 60, // URL expires in 60 seconds
      ContentType: 'image/jpeg',
    };

    // Generate a pre-signed URL
    const signedUrl = await s3.getSignedUrlPromise('putObject', params);
    
    res.json({ url: signedUrl });
  } catch (err) {
    console.error('Error generating pre-signed URL:', err);
    res.status(500).json({ error: 'Error generating URL' });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
