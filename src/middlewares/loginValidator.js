require('dotenv').config();

const jwt = require('jsonwebtoken');

const { ACCESS_TOKEN_SECRET } = process.env;

const verifyLogin = async (req, res, next) => {
    const accessToken = await req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'

    if (!accessToken) {
        throw new Error('토큰이 존재하지 않습니다.');
    }
    try {
        jwt.verify(accessToken, ACCESS_TOKEN_SECRET);

        next();
    } catch (error) {
        throw new Error('로그인 인증 실패하였습니다.');
    }
};

module.exports = verifyLogin;
