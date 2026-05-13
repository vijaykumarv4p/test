const { S3Client } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});
console.log('S3 Client initialized successfully', process.env.AWS_REGION);

// AWS_REGION=us-east-1
// AWS_ACCESS_KEY=xxxx
// AWS_SECRET_KEY=xxx
// AWS_BUCKET_NAME=vijay-file-upload-bucket

module.exports = s3;
