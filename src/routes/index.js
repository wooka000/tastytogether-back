const { Router } = require('express');
// const asyncHandler = require('../utils/async-handler');
const mainController = require('../services/main');

const router = Router();

// router.get(
//     '/',
//     asyncHandler(async (req, res) => {
//         res.send('홈페이지');
//     }),
// );

router.get('/', mainController.getBannerImage);

module.exports = router;
