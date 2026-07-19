import { FileFilterCallback } from 'multer';
import multer from 'multer';
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
export = uploadConfig;