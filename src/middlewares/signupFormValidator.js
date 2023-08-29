const { body } = require('express-validator');

const ERROR_MESSAGE = {
    invalidEmail: '유효한 이메일을 입력해주세요',
    name: {
        required: '이름을 입력해주세요',
        typeAndLengthLimit: '이름은 한글로만 구성되고 최대 5글자여야 합니다',
    },
    nickname: {
        required: '닉네임을 입력해주세요',
        lengthLimit: '닉네임은 최대 8글자 이하이어야 합니다',
    },
    password: {
        lengthLimit: '비밀번호는 최소 8글자 이상이어야 합니다',
        includeAlphabet: '비밀번호는 영문 대소문자를 포함해야 합니다',
        includeNumber: '비밀번호는 숫자를 포함해야 합니다',
    },
};

const REGEX = {
    name: /^[가-힣]{1,5}$/,
    password: {
        eng: /[a-zA-Z]/,
        num: /[0-9]/,
    },
};

const verifySignUpForm = [
    body('email').normalizeEmail().isEmail().withMessage(ERROR_MESSAGE.invalidEmail),

    body('name')
        .notEmpty()
        .withMessage(ERROR_MESSAGE.name.required)
        .matches(REGEX.name)
        .withMessage(ERROR_MESSAGE.name.typeAndLengthLimit),

    body('nickname')
        .notEmpty()
        .withMessage(ERROR_MESSAGE.nickname.required)
        .isLength({ max: 8 })
        .withMessage(ERROR_MESSAGE.nickname.lengthLimit),

    body('password')
        .isLength({ min: 8 })
        .withMessage(ERROR_MESSAGE.password.lengthLimit)
        .matches(REGEX.password.eng)
        .withMessage(ERROR_MESSAGE.password.includeAlphabet)
        .matches(REGEX.password.num)
        .withMessage(ERROR_MESSAGE.password.includeNumber),
];

module.exports = verifySignUpForm;
