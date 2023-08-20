require('dotenv').config();
const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/async-handler');
const { Users, RefreshTokens } = require('../data-access');
const verifyLogin = require('../middlewares/loginValidator');
const verifySignUpForm = require('../middlewares/signupFormValidator');

const router = Router();
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

// 로그인
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new Error('이메일과 비밀번호를 입력하세요.');
    }

    const registeredUser = await Users.findOne({ email });
    if (!registeredUser) {
        throw new Error('가입되지 않은 이메일입니다.');
    }
    const checkPassword = await bcrypt.compare(password, registeredUser.password);
    console.log('checkPassword', checkPassword);
    if (!checkPassword) {
        throw new Error('비밀번호를 잘못 입력했습니다.');
    }

    const tokenPayload = { _id: registeredUser._id, email: registeredUser.email };
    console.log('JWT Payload', tokenPayload);
    const accessToken = jwt.sign(tokenPayload, ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
    const refreshToken = jwt.sign(tokenPayload, REFRESH_TOKEN_SECRET, { expiresIn: '30m' });

    await RefreshTokens.create({
        userId: registeredUser._id,
        email: registeredUser.email,
        refreshToken,
    });

    const cookieOption = {
        path: '/',
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        maxAge: 1 * 30 * 60 * 1000, // hour * min * sec * ms
    };

    // refresh token cookie에 보내기
    res.cookie('refreshToken', refreshToken, cookieOption);
    // access token body에 보내기
    res.json({ userId: registeredUser._id, email: registeredUser.email, accessToken });
};

// 회원가입
const signup = async (req, res) => {
    const errors = validationResult(req);

    // validationResult 객체
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, nickname, name } = req.body;
    console.log('request body', req.body);
    // 이메일, 닉네임 중복여부

    const checkEmail = await Users.findOne({ $or: [{ email }, { nickname }] });
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

    await Users.create(newUser);

    res.status(200).json({ newUser });
};

// 이메일 중복검사
const checkEmail = async (req, res) => {
    const { email } = req.body;
    const checkResult = await Users.findOne({ email });

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
    const checkResult = await Users.findOne({ nickname });

    if (checkResult) {
        throw new Error('이미 사용 중인 닉네임입니다.');
    }

    res.status(200).json({
        message: '사용 가능한 닉네임입니다.',
    });
};

const getUsers = async (req, res) => {
    const users = await Users.find();
    if (!users) {
        throw new Error('가입된 이용자가 없습니다.');
    }
    res.json(users);
};

// refreshToken 확인 후 accessToken 재발행

const issueNewAccessTokenByRefreshToken = async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!req.cookies?.refreshToken) return res.sendStatus(401);
    const foundUser = await RefreshTokens.findOne({ refreshToken });
    if (!foundUser) {
        throw new Error('로그인 정보가 업습니다.');
    }
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            throw new Error('인증이 잘 안된다.');
        }
        console.log('user in DB', foundUser);
        console.log('decoded Payload', decoded);
        if (foundUser.email !== decoded.email) {
            throw new Error('인증 실패하였습니다');
        }

        const tokenPayload = { _id: foundUser.userId, email: foundUser.email };

        const accessToken = jwt.sign(tokenPayload, ACCESS_TOKEN_SECRET, {
            expiresIn: '1m',
        });

        res.json({ accessToken });
    });
};

// 로그아웃 - refreshToken 삭제

const logout = async (req, res) => {
    // on Client, also delete the accessToken
    // on Back, delete the refreshToken

    //  req.cookies에 refreshToken 없는 경우
    const { refreshToken } = req.cookies;
    if (!req.cookies?.refreshToken) return res.sendStatus(204); // no content

    // req.cookies에 refreshToken 있는 경우

    const deletedUser = await RefreshTokens.findOneAndDelete({ refreshToken });
    console.log('deleted User', deletedUser);
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(204); // no content
};

router.get('/user', verifyLogin, asyncHandler(getUsers));
router.post('/login', asyncHandler(login));
router.post('/signup', verifySignUpForm, asyncHandler(signup));
router.post('/email', asyncHandler(checkEmail));
router.post('/nickname', asyncHandler(checkNickname));
router.get('/refreshtoken', asyncHandler(issueNewAccessTokenByRefreshToken));
router.get('/logout', asyncHandler(logout));
module.exports = router;
