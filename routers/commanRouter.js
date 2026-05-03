const express = require('express');
const router = express.Router();
const { getVideo } = require('../controller/videoController');

router.get('/', getVideo);
router.get('/stream', getVideo);

module.exports = router;
