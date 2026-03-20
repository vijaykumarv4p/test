const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const s3 = require('../config/s3');
// const allowedTypes = [
//  "image/jpeg",
//  "image/png",
//  "application/pdf"
// ];
// // needed if upload managed by the backend,
//  but here we are generating signed url for direct upload to s3,
//  so validation can be done on frontend before requesting signed url
exports.getUploadUrl = async (req, res) => {
  try {
    const fileType1 = req.params.fileType;
    const { fileName, fileType, folder } = req.body;

    const key = `${folder}/${Date.now()}-${fileName}`;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });
    const uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: 300,
    });
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    res.json({
      uploadUrl,
      fileUrl,
      key,
    });
  } catch (err) {
    console.error('Error generating upload URL:', err);
    res.status(500).json({
      message: err.message,
      error: err,
    });
  }
};

exports.getFileUrl = async (req, res) => {
  try {
    const key = req.query.key; // profile/1773668066460-arjun-profile.jpeg
    console.log('Received request for file URL with key:', req.params, key);
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3, command, {
      expiresIn: 3600,
    });

    res.json({
      url: signedUrl,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
      error: err,
    });
  }
};
