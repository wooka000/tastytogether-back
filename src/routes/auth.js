require('dotenv').config();
const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/async-handler');
const { User } = require('../data-access/model/user');

const router = Router();
const { SECRET_KEY } = process.env;

const login = async (req, res) => {
    const { email, password } = req.body;

    const registeredUser = await User.findOne({ email });
    if (!registeredUser) {
        throw new Error('가입되지 않은 이메일입니다.');
    }
    const checkPassword = await bcrypt.compare(password, registeredUser.password);
    console.log(checkPassword);
    if (!checkPassword) {
        throw new Error('비밀번호를 잘못 입력했습니다.');
    }

    const token = jwt.sign({ registeredUser }, SECRET_KEY, { expiresIn: '1h' });

    // const cookieOption = {
    //     httpOnly: false,
    //     maxAge: 1 * 60 * 60 * 1000,
    // };
    // res.cookie('token', token, cookieOption);

    res.json({ token });
};

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

const checkTokenHandler = (req, res) => {
    const userToken = req.cookies;
    console.log(userToken);
    res.json({ message: '성공' });
};

router.get('/login', checkTokenHandler);
router.post('/login', asyncHandler(login));
router.post('/signup', asyncHandler(signup));
router.post('/email', asyncHandler(checkEmail));
router.post('/nickname', asyncHandler(checkNickname));

module.exports = router;
