import multer from 'multer';

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

export const uploadImageConfig = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
    cb(null, avatarWhiteList.includes(file.mimetype));
  },
})


export const uploadAttachmentConfig = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024},
    fileFilter: (req, file, cb) => {
    cb(null, messageFileWhiteList.includes(file.mimetype));
  },
})