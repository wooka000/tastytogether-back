const path = require('path');
const multer = require('multer');

const FILE_EXTENSION = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};

const multerConfig = {
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '..', 'public', 'image'));
        },
        filename: (req, file, cb) => {
            cb(null, `${file.fieldname}-${Date.now()}.${FILE_EXTENSION[file.mimetype]}`);
        },
    }),
    // fileFilter: (req, file, cb) => {
    //     const isValid = !!FILE_EXTENSION[file.mimetype];
    //     const error = isValid ? null : new Error('png, jpeg, jpg 파일만 업로드 가능합니다.');
    //     cb(error, isValid);
    // },
};

const uploadImageFile = multer(multerConfig);

module.exports = uploadImageFile;
