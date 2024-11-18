const express = require('express');
const { upload, uploadFile } = require('../controllers/uploadController');
const { getStatus } = require('../controllers/statusController');
const { handleWebhook } = require('../controllers/webhookController');

const router = express.Router();

router.post('/upload', upload.single('file'), uploadFile);
router.get('/status/:requestId', getStatus);
router.post('/webhook', handleWebhook);

module.exports = router;
