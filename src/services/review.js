const { Review, Store } = require('../data-access');
const asyncHandler = require('../utils/async-handler');

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

// 리뷰 수정
const testReview = {
    grade: '별로다',
    content: '직원이 불친절하다',
};

const editReview = asyncHandler(async (req, res) => {
    const { reviewid } = req.params;
    // testReview=>req.body로 변경
    // {new:true}는 res.json에 값을 넘겨줄때 변경값을 넘겨줄지 말지 정해줌.
    const { grade, content } = testReview;
    const updated = await Review.findOneAndUpdate(
        { _id: reviewid },
        {
            grade,
            content,
        },
        { new: true },
    );
    // updated 된 review 객체를 넘겨주고 있는데, 이게 필요한지? 성공 실패 상태를 넘겨줘도 되는지
    res.json(updated);
});

// 리뷰 삭제
const deleteReview = asyncHandler(async (req, res) => {
    const { reviewid } = req.params;
    await Review.deleteOne({ _id: reviewid });
    res.sendStatus(200);
});

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
    res.status(201).json(newReview);
}

module.exports = {
    getReviewById,
    getByStoreId,
    createReview,
    editReview,
    deleteReview,
};
