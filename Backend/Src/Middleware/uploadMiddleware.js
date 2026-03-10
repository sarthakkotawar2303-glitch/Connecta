const multer = require('multer')
const path = require('path')
const fs = require('fs')

//ensure uploads folder exists
const uploadDir = 'upload/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
}

//multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    },
})


const checkFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")){
        cb(null, true);
    }
    else {
        cb(new Error("NOt an Image! please upload an image only."))
    }
}

//multer upload middleware
const upload = multer({
    storage,
    fileFilter: checkFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
})
module.exports = upload