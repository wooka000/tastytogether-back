const { body } = require('express-validator');

const verifySignUpForm = [
    body('email').normalizeEmail().isEmail().withMessage('유효한 이메일을 입력해주세요'),

    body('name')
        .notEmpty()
        .withMessage('이름을 입력해주세요')
        .isLength({ max: 5 })
        .withMessage('이름은 최대 5글자 이하이어야 합니다'),

    body('nickname')
        .notEmpty()
        .withMessage('닉네임을 입력해주세요')
        .isLength({ max: 5 })
        .withMessage('닉네임은 최대 5글자 이하이어야 합니다'),

    body('password')
        .isLength({ min: 8 })
        .withMessage('비밀번호는 최소 8글자 이상이어야 합니다')
        .matches(/[a-zA-Z]/)
        .withMessage('비밀번호는 영문 대소문자를 포함해야 합니다')
        .matches(/[0-9]/)
        .withMessage('비밀번호는 숫자를 포함해야 합니다'),

    body('profileText')
        .isLength({ max: 30 })
        .withMessage('프로필 소개는 최대 30글자까지 가능합니다'),
];

module.exports = verifySignUpForm;
