require('dotenv').config();

const jwt = require('jsonwebtoken');

const { ACCESS_TOKEN_SECRET } = process.env;

const verifyLogin = async (req, res, next) => {
    const accessToken = await req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'

    if (!accessToken) {
        next(new Error('토큰이 존재하지 않습니다.'));
    }
    try {
        const decodedToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
        req.userData = { userId: decodedToken._id, email: decodedToken.email };
        next();
    } catch (error) {
        next(new Error('로그인 인증 실패하였습니다.'));
    }
};

module.exports = verifyLogin;
