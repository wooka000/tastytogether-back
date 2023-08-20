require('dotenv').config();
const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/async-handler');
const { User, Token } = require('../data-access');
const verifyLogin = require('../middlewares/login_validator');

const router = Router();
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

// 로그인
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new Error('이메일과 비밀번호를 입력하세요.');
    }

    const registeredUser = await User.findOne({ email });
    if (!registeredUser) {
        throw new Error('가입되지 않은 이메일입니다.');
    }
    const checkPassword = await bcrypt.compare(password, registeredUser.password);
    console.log(checkPassword);
    if (!checkPassword) {
        throw new Error('비밀번호를 잘못 입력했습니다.');
    }

    const tokenPayload = { _id: registeredUser._id };
    const accessToken = jwt.sign({ tokenPayload }, ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
    const refreshToken = jwt.sign({ tokenPayload }, REFRESH_TOKEN_SECRET, { expiresIn: '1m' });

    await Token.create({
        userId: registeredUser._id,
        email: registeredUser.email,
        token: accessToken,
    });

    const cookieOption = {
        path: '/',
        httpOnly: true,
        secure: true,
        maxAge: 1 * 10 * 60 * 1000, // hour * min * sec * ms
    };

    // token 보내기
    res.cookie('refreshToken', refreshToken, cookieOption);
    res.json({ accessToken });
};

// 회원가입
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

// 이메일 중복검사
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

// 닉네임 중복검사
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

const getUsers = async (req, res) => {
    const users = await User.find();
    if (!users) {
        throw new Error('가입된 이용자가 없습니다.');
    }
    res.json(users);
};

router.get('/user', verifyLogin, asyncHandler(getUsers));
router.post('/login', asyncHandler(login));
router.post('/signup', asyncHandler(signup));
router.post('/email', asyncHandler(checkEmail));
router.post('/nickname', asyncHandler(checkNickname));

module.exports = router;
