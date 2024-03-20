// routes/videoRoutes.js
const express = require('express');
const multer = require('multer');
const videoController = require('../controllers/videoController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.put('/videos', upload.single('video'), videoController.uploadVideo);

module.exports = router;


