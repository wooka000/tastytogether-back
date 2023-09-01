require('dotenv').config();

const jwt = require('jsonwebtoken');

const { ACCESS_TOKEN_SECRET } = process.env;

const ERROR_MESSAGE = '로그인 인증 실패하였습니다.';

const verifyLogin = async (req, res, next) => {
    try {
        const accessToken = await req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'

        if (!accessToken) {
            return res.status(401);
        }

        const verfifiedToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
        req.userData = { userId: verfifiedToken._id };
        next();
    } catch (error) {
        return res.status(401).json({ message: ERROR_MESSAGE });
    }
};

module.exports = verifyLogin;
