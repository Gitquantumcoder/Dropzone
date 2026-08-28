const express = require('express');
const upload = require('../middleware/multer');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { uploadFile, getMyFiles, getAllFiles } = require('../controllers/fileController');

const router = express.Router();

router.post('/upload', requireAuth, upload.single('myFile'), uploadFile);
router.get('/files', requireAuth, getMyFiles);
router.get('/admin/files', requireAuth, requireAdmin, getAllFiles);

module.exports = router;
