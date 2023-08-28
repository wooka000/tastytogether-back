const asyncHandler = require('../utils/async-handler');

// 배너 이미지
const getBannerImage = asyncHandler(async (req, res) => {
    const bannerImages = [
        'https://tasty-together.s3.ap-northeast-2.amazonaws.com/main/main-banner-1.jpg',
        'https://tasty-together.s3.ap-northeast-2.amazonaws.com/main/main-banner-2.jpg',
        'https://tasty-together.s3.ap-northeast-2.amazonaws.com/main/main-banner-3.jpg',
    ];
    res.json({ bannerImages });
});

module.exports = {
    getBannerImage,
};
