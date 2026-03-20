const express = require('express');
const router = express.Router();
const { getUploadUrl, getFileUrl } = require('../controller/uploadController');

router.post('/', getUploadUrl);
router.get('/url', getFileUrl);

module.exports = router;
