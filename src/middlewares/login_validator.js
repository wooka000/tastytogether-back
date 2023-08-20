require('dotenv').config();

const jwt = require('jsonwebtoken');

const { ACCESS_TOKEN_SECRET } = process.env;

const verifyLogin = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
        if (!token) {
            throw new Error('로그인되지 않았습니다.');
        }
        const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
        console.log(decodedToken);
        req.userId = { decodedToken };
        next();
    } catch (error) {
        error.message = '로그인 인증 실패하였습니다';
        next(error);
    }
};

module.exports = verifyLogin;
