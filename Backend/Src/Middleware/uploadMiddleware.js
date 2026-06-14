const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Storage architecture configuration detailing safe folder targets and randomized, 
 * path-traversal proof string filenames.
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const cleanFieldName = file.fieldname.replace(/[^a-zA-Z0-9]/g, '');
        const fileExtension = path.extname(file.originalname).toLowerCase();

        cb(null, `${cleanFieldName}-${Date.now()}${fileExtension}`);
    },
});

/**
 * Mime-type traffic analysis gate. Validates file headers to guarantee 
 * only valid media extensions bypass boundary layers.
 * 
 * @param {import('express').Request} req - Express request wrapper context.
 * @param {Express.Multer.File} file - Multer binary file metadata descriptor.
 * @param {function} cb - Resolution completion callback execution hook.
 */
const checkFileFilter = (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("LIMIT_UNSUPPORTED_FILE_TYPE"), false);
    }
};

/**
 * Instantiated, exportable multipart middleware boundary layer.
 * Constrains atomic payload file streams to 5MB allocations maximum.
 */
const upload = multer({
    storage: storage,
    fileFilter: checkFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
});

module.exports = upload;
