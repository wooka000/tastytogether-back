const asyncHandler = require('../utils/async-handler');

// 배너 이미지
const getBannerImage = asyncHandler(async (req, res) => {
    const bannerImages = ['bannerImage.jpg', 'bannerImage2.jpg'];
    res.json({ bannerImages });
});

module.exports = {
    getBannerImage,
};
