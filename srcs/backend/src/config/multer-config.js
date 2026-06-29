const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

function uploadConfig(options){
    return (multer({
        storage: multer.memoryStorage,
        limits: {fileSize: options.maxSize}, 
        fileFilter: options.fileFilter
    }));
}
module.exports = uploadConfig;