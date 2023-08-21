const { Router } = require('express');
const asyncHandler = require('../utils/async-handler');

const router = Router();

router.get(
    '/',
    asyncHandler(async (req, res) => {
        res.send('홈페이지');
    }),
);

module.exports = router;
