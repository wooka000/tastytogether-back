require('dotenv').config();
const { Router } = require('express');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../utils/async-handler');
const { User } = require('../data-access/model/user');

// const jwt = require('jsonwebtoken');

const router = Router();
// const key = env.process[SECRET_KEY];

const signup = async (req, res) => {
    const { email, password, nickname, name } = req.body;
    console.log(req.body);
    // 이메일, 닉네임 중복여부

    const checkEmail = await User.findOne({ $or: [{ email }, { nickname }] });
    if (checkEmail) {
        throw new Error('이메일 또는 닉네임이 중복되었습니다.');
    }

    const hashedPassword = (await bcrypt.hash(password, 12)).toString();

    const newUser = {
        nickname,
        email,
        password: hashedPassword,
        name,
    };

    await User.create(newUser);

    res.status(200).json({ newUser });
};

const checkEmail = async (req, res) => {
    const { email } = req.body;
    const checkResult = await User.findOne({ email });

    if (checkResult) {
        throw new Error('이미 사용 중인 이메일입니다.');
    }

    res.status(200).json({
        message: '사용 가능한 이메일입니다.',
    });
};

const checkNickname = async (req, res) => {
    const { nickname } = req.body;
    const checkResult = await User.findOne({ nickname });

    if (checkResult) {
        throw new Error('이미 사용 중인 닉네임입니다.');
    }

    res.status(200).json({
        message: '사용 가능한 닉네임입니다.',
    });
};

router.post('/login');
router.post('/signup', asyncHandler(signup));
router.post('/email', asyncHandler(checkEmail));
router.post('/nickname', asyncHandler(checkNickname));

module.exports = router;
