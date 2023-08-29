const { Review, Store, Users } = require('../data-access');
const asyncHandler = require('../utils/async-handler');
const multiImageAddressHandler = require('../utils/multiImageAddressHandler');
const photoLimit = require('../utils/photoLimit');
const starRatingForm = require('../utils/starRatingForm');

// 특정 리뷰 조회
const getReviewById = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const review = await Review.findOne({ _id: reviewId });
    res.json(review);
});

// 리뷰 생성

const createReview = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    const { userId } = req.userData;
    const userInfo = await Users.findOne({ _id: userId });
    const { grade, content } = req.body;
    const { nickname, name } = userInfo;

    const photos = multiImageAddressHandler(req.files);

    if (!photoLimit(photos)) {
        const error = new Error('사진은 최대 8장 까지만 업로드 가능합니다.');
        error.statusCode = 400;
        throw error;
    }

    if (!grade || !content) {
        const error = new Error('입력하지 않은 값이 존재합니다.');
        error.statusCode = 400;
        throw error;
    }

    const newReview = await Review.create({
        grade,
        content,
        usernickname: nickname,
        username: name,
        storeId,
        userId,
        photos,
    });

    // store의 review 필드에 리뷰 아이디 추가
    const updatedStore = await Store.findOne({ _id: storeId });
    const { starRating, reviews } = updatedStore;

    // store의 별점 평균 추가 로직
    const updatedRating = starRatingForm(
        (starRating * reviews.length + Number(grade)) / (reviews.length + 1),
    );
    const updated = { reviews: [...reviews, newReview._id], starRating: updatedRating };
    await Store.findOneAndUpdate({ _id: storeId }, updated);
    res.sendStatus(201);
});

// 리뷰 수정
const editReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { grade, content } = req.body;
    if (!grade || !content) {
        const error = new Error('입력하지 않은 값이 존재합니다.');
        error.statusCode = 400;
        throw error;
    }
    const previousReview = await Review.findOne({ _id: reviewId });
    const previousGrade = previousReview.grade;

    const updated = {
        grade,
        content,
        photos: multiImageAddressHandler(req.files),
    };

    if (!photoLimit(updated.photos)) {
        const error = new Error('사진은 최대 8장 까지만 업로드 가능합니다.');
        error.statusCode = 400;
        throw error;
    }

    const updatedReview = await Review.findOneAndUpdate({ _id: reviewId }, updated);
    const updatedStore = await Store.findOne({ _id: updatedReview.storeId });
    // 평균별점 업데이트 로직
    const { reviews, starRating } = updatedStore;
    const newRating = starRatingForm(
        (starRating * reviews.length - previousGrade + Number(grade)) / reviews.length,
    );
    const updatedRating = { starRating: newRating };

    await Store.findOneAndUpdate({ _id: updatedReview.storeId }, updatedRating);
    res.sendStatus(201);
});

// 리뷰 삭제
const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const deletedReview = await Review.findOne({ _id: reviewId });
    const { storeId, grade } = deletedReview;

    const store = await Store.findOne({ _id: storeId });
    const { starRating, reviews } = store;

    // 평균별점 업데이트 로직
    const newRating =
        store.reviews.length !== 1
            ? starRatingForm((starRating * reviews.length - Number(grade)) / (reviews.length - 1))
            : 0;
    console.log(newRating);
    const newReview = reviews.filter((review) => String(review) !== reviewId);
    const updated = { starRating: newRating, reviews: newReview };
    await Store.findOneAndUpdate({ _id: storeId }, updated);
    await Review.deleteOne({ _id: reviewId });
    res.sendStatus(200);
});

module.exports = {
    getReviewById,
    createReview,
    editReview,
    deleteReview,
};
