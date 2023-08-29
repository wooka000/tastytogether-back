require('dotenv').config();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { Users, RefreshTokens } = require('../data-access');

const ACCESS_TOKEN_DURATION = '1m';
const COOKIE_DURATION = 1 * 30 * 60 * 1000;
const { ACCESS_TOKEN_SECRET } = process.env;
const DEFAULT_PROFILE_IMAGE =
    'https://tasty-together.s3.ap-northeast-2.amazonaws.com/main/default-profile-image.png';

const RES_MSG = {
    email: '사용 가능한 이메일입니다.',
    nickname: '사용 가능한 닉네임입니다.',
};

const ERR_MSG = {
    login: {
        emptyField: '이메일과 비밀번호를 입력하세요.',
        notFound: '가입되지 않은 이메일입니다.',
        wrongPassword: '비밀번호를 잘못 입력했습니다.',
    },
    signUp: {
        invalidForm: '회원가입 양식이 올바르지 않습니다.',
        duplicate: '이메일 또는 닉네임이 중복되었습니다.',
    },
    duplicateCheck: {
        email: '이미 사용 중인 이메일입니다.',
        nickname: '이미 사용 중인 닉네임입니다.',
    },
    refreshToken: '로그인 정보가 없습니다.',
};

// 로그인
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: ERR_MSG.login.emptyField }).end();
    }

    const registeredUser = await Users.findOne({ email });
    if (!registeredUser) {
        return res.status(404).json({ message: ERR_MSG.login.notFound }).end();
    }
    const checkPassword = await bcrypt.compare(password, registeredUser.password);

    if (!checkPassword) {
        return res.status(400).json({ message: ERR_MSG.login.wrongPassword }).end();
    }

    const tokenPayload = { _id: registeredUser._id, email: registeredUser.email };
    const accessToken = jwt.sign(tokenPayload, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_DURATION,
    });

    const refreshToken = await crypto.randomBytes(8).toString('hex');
    await RefreshTokens.create({
        userId: registeredUser._id,

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
        return res
            .status(400)
            .json({
                message: ERR_MSG.signUp.invalidForm,
                errors,
            })
            .end();
    }

    const { email, password, nickname, name } = req.body;

    // 이메일, 닉네임 중복여부
    const checkEmail = await Users.findOne({ $or: [{ email }, { nickname }] });
    if (checkEmail) {
        return res.status(400).json({ message: ERR_MSG.signUp.duplicate }).end();
    }

    const hashingSalt = bcrypt.genSaltSync();

    const hashedPassword = bcrypt.hashSync(password, hashingSalt).toString();

    const newUser = {
        nickname,
        email,
        password: hashedPassword,
        name,
        profileImage: DEFAULT_PROFILE_IMAGE,
        profileText: null,
    };

    await Users.create(newUser);

    res.sendStatus(201);
};

// 이메일 중복검사
const checkEmail = async (req, res) => {
    const { email } = req.body;
    const checkResult = await Users.findOne({ email });

    if (checkResult) {
        return res.status(400).json({ message: ERR_MSG.duplicateCheck.email }).end();
    }

    res.status(200).json({ message: RES_MSG.email });
};

// 닉네임 중복검사
const checkNickname = async (req, res) => {
    const { nickname } = req.body;
    const checkResult = await Users.findOne({ nickname });

    if (checkResult) {
        return res.status(400).json({ message: ERR_MSG.duplicateCheck.nickname }).end();
    }

    res.status(200).json({ message: RES_MSG.nickname });
};

// refreshToken 확인 후 accessToken 재발행
const issueNewAccessTokenByRefreshToken = async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!req.cookies?.refreshToken) {
        return res.status(401).json({ message: ERR_MSG.refreshToken }).end();
    }
    const foundUser = await RefreshTokens.findOne({ refreshToken });
    if (!foundUser) {
        return res.status(401).json({ message: ERR_MSG.refreshToken }).end();
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
