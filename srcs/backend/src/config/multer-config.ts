import { FileFilterCallback } from 'multer';
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
import { Request} from 'express';

interface UploadOptions {
    maxSize: number;
    fileFilter: (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => void;
}
function uploadConfig(options: UploadOptions){
    return (multer({
        storage: multer.memoryStorage(),
        limits: {fileSize: options.maxSize}, 
        fileFilter: options.fileFilter
    }));
}
module.exports = uploadConfig;