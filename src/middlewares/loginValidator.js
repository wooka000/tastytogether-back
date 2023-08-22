require('dotenv').config();

const jwt = require('jsonwebtoken');

const { ACCESS_TOKEN_SECRET } = process.env;

const verifyLogin = (req, res, next) => {
    // preflight 요청에 대해선 verify 하지 않음.
    // if (req.method === 'OPTIONS') {
    //     next();
    // }

    const accessToken = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'

    if (!accessToken) {
        throw new Error('토큰이 존재하지 않습니다.');
    }
    try {
        const decodedToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
        req.user = { userId: decodedToken._id, email: decodedToken.email };
        next();
    } catch (error) {
        throw new Error('로그인 인증 실패하였습니다.');
    }
};

module.exports = verifyLogin;
