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
// AWS_ACCESS_KEY=AKIAWEAII5CTJ25DH5CO
// AWS_SECRET_KEY=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
// AWS_BUCKET_NAME=vijay-file-upload-bucket

module.exports = s3;
