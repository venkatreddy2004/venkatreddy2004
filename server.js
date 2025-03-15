import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

require('dotenv').config();
const express = require('express');
const AWS = require('aws-sdk');
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
// Use the PORT provided by Render, or default to 4000
const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
