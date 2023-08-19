const reviewRepository = require('../data-access/model/review');

async function getAll(req, res) {
    console.log(req.url);
    const reviews = await reviewRepository.getAll();
    res.status(200).json(reviews);
}

async function getByUserNickname(req, res) {
    const userNickname = req.query.usernickname;
    const data = await reviewRepository.getByUserNickname(userNickname);
    if (data.length >= 1) {
        res.status(200).json(data);
    } else {
        res.sendStatus(404);
    }
}

async function getByReviewId(req, res) {
    const { reviewId } = req.params;
    const review = await reviewRepository.getByReviewId(reviewId);
    if (review) {
        res.status(200).json(review);
    } else {
        res.sendStatus(404);
    }
}

async function update(req, res) {
    const { reviewId } = req.params;
    const { grade, content } = req.body;
    const review = await reviewRepository.update(reviewId, grade, content);
    if (review) {
        res.status(200).json(review);
    } else {
        res.sendStatus(404);
    }
}

async function remove(req, res) {
    const { reviewId } = req.params;
    await reviewRepository.remove(reviewId);
    res.sendStatus(204);
}

async function getByStoreId(req, res) {
    const { storeId } = req.params;
    const storeReviews = await reviewRepository.getByStoreId(storeId);
    if (storeReviews) {
        res.status(200).json(storeReviews);
    } else {
        res.sendStatus(404);
    }
}

async function create(req, res) {
    const { storeId } = req.params;
    const { grade, content, usernickname, username } = req.body;
    const newReview = await reviewRepository.create(
        storeId,
        grade,
        content,
        usernickname,
        username,
    );
    res.status(201).json(newReview);
}

module.exports = {
    getAll,
    getByUserNickname,
    getByReviewId,
    update,
    remove,
    getByStoreId,
    create,
};
