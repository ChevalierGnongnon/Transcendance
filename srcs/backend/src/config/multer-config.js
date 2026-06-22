const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

function uploadConfig(options){
    const diskStorage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, '/app/uploads'),
        filename : (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, crypto.randomUUID() + ext)
        }
    });
    return (multer({
        storage: diskStorage,
        limits: {fileSize: options.maxSize}, 
        fileFilter: options.fileFilter
    }));
}
module.exports = uploadConfig;