import multer from 'multer';

export const uploadImageConfig = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
    const allowed = [
        'image/png',
        'image/webp',
        'image/jpeg'
    ];
    cb(null, allowed.includes(file.mimetype));
  },
})


export const uploadAttachmentConfig = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024},
    fileFilter: (req, file, cb) => {
    const allowed = [
        'image/png',
        'image/webp',
        'image/jpeg',
        'image/gif',
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',   // .docx
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',        // .xlsx
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    ];
    cb(null, allowed.includes(file.mimetype));
  },
})