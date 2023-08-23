const { Users, Review, Store } = require('../data-access');
const verifyLogin = require('../middlewares/loginValidator');

async function getUserReviews(req, res) {
    try {
        const { userId } = req.params;
        const user = await Users.findOne({ _id: userId });
        const reviewList = await Review.find({ userId: user.id });
        res.status(200).json(reviewList);
    } catch (e) {
        res.sendStatus(404);
    }
}

async function getReviewById(req, res) {
    try {
        const { reviewId } = req.params;
        const review = await Review.findOne({ _id: reviewId });
        if (!review) throw new Error();
        res.status(200).json(review);
    } catch (e) {
        res.sendStatus(404);
    }
}

async function getByStoreId(req, res) {
    try {
        const { storeId } = req.params;
        const store = await Store.findOne({ _id: storeId });
        if (store.reviews.length === 0) throw new Error();
        res.json(store.reviews);
    } catch (e) {
        res.sendStatus(404);
    }
}

const test = {
    grade: 5,
    content: '맛있어요',
    usernickname: '엘리스',
    username: '김토끼',
};

async function createReview(req, res) {
    // 리뷰 객체 추가
    const { storeId } = req.params;
    const { grade, content, usernickname, username } = test;
    // const { grade, content, usernickname, username } = req.body;
    const newReview = await Review.create({ grade, content, usernickname, username, storeId });

    // store의 review 필드에 리뷰 아이디 추가
    const updateStore = await Store.findOne({ _id: storeId });
    const { reviews } = updateStore;
    const updateReviews = { reviews: [...reviews, storeId] };
    await Store.findOneAndUpdate({ _id: storeId }, updateReviews);
    console.log(verifyLogin.accessToken);
    res.status(201).json(newReview);
}

module.exports = {
    getUserReviews,
    getReviewById,
    getByStoreId,
    createReview,
};
