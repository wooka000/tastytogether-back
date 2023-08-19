const { Store } = require('../data-access');

const getStoreInfo = async (storeId) => {
    const storeInfo = await Store.findOneAndUpdate(
        { storeId },
        { $inc: { viewCount: 1 } },
    ).populate('reviews');
    const storeReviewCount = storeInfo.reviews.length;
    const storeLikeCount = storeInfo.storeLikes.length;
    return { storeInfo, storeReviewCount, storeLikeCount };
};
module.exports = { getStoreInfo };
