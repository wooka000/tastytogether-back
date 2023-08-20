require('dotenv').config();

const jwt = require('jsonwebtoken');

const { ACCESS_TOKEN_SECRET } = process.env;

const verifyLogin = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
        if (!token) {
            throw new Error('Authentication failed!');
        }
        const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
        console.log(decodedToken);
        req.userId = { decodedToken };
        next();
    } catch (error) {
        return next(new Error('Authentication failed!'));
    }
};

module.exports = verifyLogin;
