require('dotenv').config();
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

const { S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY } = process.env;

const FILE_TYPE = /^image\/.*/;

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

    fileFilter: (req, file, cb) => {
        if (file.mimetype.match(FILE_TYPE)) {
            cb(null, true);
        } else {
            const error = new Error('이미지 파일만 업로드 가능합니다.');
            cb(error, false);
        }
    },
};

const uploadSingleImage = (fieldname) => multer(multerConfig).single(fieldname);
const uploadMultiImage = (fieldname) => multer(multerConfig).array(fieldname);

module.exports = { uploadSingleImage, uploadMultiImage };
