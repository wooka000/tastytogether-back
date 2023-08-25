require('dotenv').config();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { Users, RefreshTokens } = require('../data-access');

const ACCESS_TOKEN_DURATION = '1h';
const COOKIE_DURATION = 1 * 30 * 60 * 1000; // hour * min * sec * ms
const { ACCESS_TOKEN_SECRET } = process.env;

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

    if (!checkPassword) {
        throw new Error('비밀번호를 잘못 입력했습니다.');
    }

    const tokenPayload = { _id: registeredUser._id, email: registeredUser.email };
    const accessToken = jwt.sign(tokenPayload, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_DURATION,
    });

    const refreshToken = await crypto.randomBytes(8).toString('hex');
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
        maxAge: COOKIE_DURATION,
    };

    // refresh token cookie에 보내기
    res.cookie('refreshToken', refreshToken, cookieOption);
    // access token body에 보내기
    res.status(200).json({
        userId: registeredUser._id,
        nickname: registeredUser.nickname,
        profileImage: registeredUser.profileImage,
        accessToken,
    });
};

// 회원가입
const signup = async (req, res) => {
    // validationResult 객체 내 validator errors 확인
    const { errors } = validationResult(req);
    if (errors.length !== 0) {
        return res.status(400).json({
            message: '회원가입 양식이 올바르지 않습니다.',
            errors,
        });
    }

    const { email, password, nickname, name, profileText = null } = req.body;

    // 이메일, 닉네임 중복여부
    const checkEmail = await Users.findOne({ $or: [{ email }, { nickname }] });
    if (checkEmail) {
        throw new Error('이메일 또는 닉네임이 중복되었습니다.');
    }

    const hashingSalt = bcrypt.genSaltSync();

    const hashedPassword = bcrypt.hashSync(password, hashingSalt).toString();

    const newUser = {
        nickname,
        email,
        password: hashedPassword,
        name,
        profileImage: req.file.location,
        profileText,
    };

    await Users.create(newUser);

    res.status(201).json({ message: '회원가입되었습니다.' });
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

// refreshToken 확인 후 accessToken 재발행
const issueNewAccessTokenByRefreshToken = async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!req.cookies?.refreshToken) return res.sendStatus(401);
    const foundUser = await RefreshTokens.findOne({ refreshToken });
    if (!foundUser) {
        throw new Error('로그인 정보가 없습니다.');
    }

    const tokenPayload = { _id: foundUser.userId, email: foundUser.email };
    const accessToken = jwt.sign(tokenPayload, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_DURATION,
    });

    res.status(200).json({ ...tokenPayload, accessToken });
};

// on Client, also delete the accessToken. on Back, delete the refreshToken
const logout = async (req, res) => {
    //  req.cookies에 refreshToken 없는 경우
    const { refreshToken } = req.cookies;
    if (!req.cookies?.refreshToken) return res.sendStatus(204);

    // req.cookies에 refreshToken 있는 경우 - refreshToken delete
    await RefreshTokens.findOneAndDelete({ refreshToken });
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(204);
};

module.exports = {
    login,
    logout,
    signup,
    checkEmail,
    checkNickname,
    issueNewAccessTokenByRefreshToken,
};
