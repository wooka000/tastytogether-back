require('dotenv').config();
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

const { S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY } = process.env;

const FILE_TYPE = /^image\/.*/;
const FILE_SIZE = 10 * 1024 * 1024;
const ERR_MSG = {
    fileType: '이미지 파일만 업로드 가능합니다.',
    fileSize: '파일 크기는 10MB까지 허용됩니다.',
};

AWS.config.update({
    correctClockSkew: true,
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
    region: 'ap-northeast-2',
});

const multerConfig = {
    storage: multerS3({
        s3: new AWS.S3(),
        bucket: 'tasty-together',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key(req, file, cb) {
            cb(null, `image/${Date.now()}-${file.fieldname}-${file.originalname}`);
        },
    }),

    limits: {
        fileSize: FILE_SIZE,
    },

    fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(FILE_TYPE)) {
            return cb(new Error(ERR_MSG.fileType), false);
        }

        if (file.size > FILE_SIZE) {
            return cb(new Error(ERR_MSG.fileSize), false);
        }

        cb(null, true);
    },
};

const uploadSingleImage = (fieldname) => multer(multerConfig).single(fieldname);
const uploadMultiImage = (fieldname) => multer(multerConfig).array(fieldname);
const uploadFieldImage = (fieldname) => multer(multerConfig).fields(fieldname);

module.exports = { uploadSingleImage, uploadMultiImage, uploadFieldImage };
