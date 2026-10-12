import multer from 'multer';
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


