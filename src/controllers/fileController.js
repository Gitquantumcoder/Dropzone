const { cloudinary } = require('../config/cloudinary');
const File = require('../models/File');

async function uploadFile(req, res, next) {
    if (!req.file) {
        return res.status(400).json({ msg: 'No File Attached' });
    }

    try {
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: 'auto', folder: 'fileUpload' },
                (error, response) => error ? reject(error) : resolve(response)
            );
            stream.end(req.file.buffer);
        });

        const file = await File.create({
            owner: req.user.id,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            url: result.secure_url,
            publicId: result.public_id,
            resourceType: result.resource_type
        });

        res.status(201).json({ message: 'File uploaded successfully', file });
    } catch (error) {
        next(error);
    }
}

async function getMyFiles(req, res, next) {
    try {
        const filter = req.user.role === 'admin' && req.query.all === 'true'
            ? {}
            : { owner: req.user.id };
        const files = await File.find(filter).populate('owner', 'name email').sort({ createdAt: -1 });
        res.json({ files });
    } catch (error) {
        next(error);
    }
}

async function getAllFiles(req, res, next) {
    try {
        const files = await File.find().populate('owner', 'name email').sort({ createdAt: -1 });
        res.json({ files });
    } catch (error) {
        next(error);
    }
}

module.exports = { uploadFile, getMyFiles, getAllFiles };
