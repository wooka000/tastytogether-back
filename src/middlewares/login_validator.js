require('dotenv').config();

const jwt = require('jsonwebtoken');

const { ACCESS_TOKEN_SECRET } = process.env;

const verifyLogin = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next();
    }

    const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'

    if (!token) {
        throw new Error('토큰이 존재하지 않습니다.');
    }
    try {
        const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
        req.user = { userId: decodedToken._id, email: decodedToken.email };
        next();
    } catch (error) {
        error.message = '로그인 인증 실패하였습니다.';
        next(error);
    }
};

module.exports = verifyLogin;
