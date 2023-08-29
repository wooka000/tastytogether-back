require('dotenv').config();
const { Router } = require('express');
const asyncHandler = require('../utils/async-handler');
const verifySignUpForm = require('../middlewares/signupFormValidator');
const { uploadSingleImage } = require('../middlewares/imageUploader');
const authController = require('../services/authController');

const router = Router();

// verifyLogin 테스트용 코드
const verifyLogin = require('../middlewares/loginValidator');
const { Users } = require('../data-access');

const getUsers = async (req, res) => {
    const users = await Users.find();

    return res.status(200).json(users);
};

// imageUploader 테스트용 코드
const postUsers = async (req, res) => {
    try {
        return res.sendStatus(200);
    } catch (e) {
        return res.sendStatus(400);
    }
};

router.get('/user', verifyLogin, asyncHandler(getUsers));
router.post('/user', uploadSingleImage('image'), asyncHandler(postUsers));

router.post('/login', asyncHandler(authController.login));
router.post('/signup', verifySignUpForm, asyncHandler(authController.signup));
router.post('/email', asyncHandler(authController.checkEmail));
router.post('/nickname', asyncHandler(authController.checkNickname));
router.post('/refreshtoken', asyncHandler(authController.issueNewAccessTokenByRefreshToken));
router.delete('/logout', asyncHandler(authController.logout));

module.exports = router;
