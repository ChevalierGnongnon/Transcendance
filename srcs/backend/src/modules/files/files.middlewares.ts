import type { Request, Response, NextFunction } from 'express';
import multer, { MulterError } from 'multer';
import { UnsupportedFileTypeError } from '@/common/errors.js';

export const avatarWhiteList = [
    'image/png',
    'image/webp',
    'image/jpeg'
];

export const messageFileWhiteList = [
  'image/png',
  'image/webp',
  'image/jpeg',
  'image/gif',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',   // .docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',        // .xlsx
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
]
export const previewWhiteList = [
  'image/png',
  'image/webp',
  'image/jpeg',
  'image/gif',
  'application/pdf',
]

export const uploadImageConfig = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (avatarWhiteList.includes(file.mimetype))
        cb(null, true);
      else
        cb(new UnsupportedFileTypeError());
    },
})


export const uploadAttachmentConfig = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024},
    fileFilter: (req, file, cb) => {
      if (messageFileWhiteList.includes(file.mimetype))
        cb(null, true);
      else
        cb(new UnsupportedFileTypeError());
    },
})


export function multerErrorManager(error: unknown, req: Request, res: Response, next: NextFunction){
  if (error instanceof MulterError && error.code === 'LIMIT_FILE_SIZE'){
    return (res.status(413).json({error: 'INVALID_FILE_SIZE'}));
  }
  else if (error instanceof MulterError ){
    return (res.status(400).json ({error: 'INVALID_UPLOAD'}));
  }

  else if (error instanceof UnsupportedFileTypeError){
    return (res.status(415).json ({error: 'WRONG_FILE_TYPE'}));
  }
  else if (typeof error === 'object' && error !== null && 'status' in error
    && typeof error.status === 'number' && error.status >= 400 && error.status < 500){
    return (res.status(error.status).json({error: 'INVALID_REQUEST'}));
  }
  else {
    console.error('Unhandled error:', error);
    return res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
    });
    
  }

}