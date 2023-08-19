const reviewRepository = require('../data-access/model/review');

function getAll(req, res) {
    console.log(req.url);
    const reviews = reviewRepository.getAll();
    res.status(200).json(reviews);
}

function getByUserNickname(req, res) {
    const userNickname = req.query.usernickname;
    const data = reviewRepository.getByUserNickname(userNickname);
    if (data.length >= 1) {
        res.status(200).json(data);
    } else {
        res.sendStatus(404);
    }
}

function getByReviewId(req, res) {
    const { reviewId } = req.params;
    const review = reviewRepository.getByReviewId(reviewId);
    if (review) {
        res.status(200).json(review);
    } else {
        res.sendStatus(404);
    }
}

function update(req, res) {
    const { reviewId } = req.params;
    const { grade, content } = req.body;
    const review = reviewRepository.update(reviewId, grade, content);
    if (review) {
        res.status(200).json(review);
    } else {
        res.sendStatus(404);
    }
}

function remove(req, res) {
    const { reviewId } = req.params;
    reviewRepository.remove(reviewId);
    res.sendStatus(204);
}

function getByStoreId(req, res) {
    const { storeId } = req.params;
    const storeReviews = reviewRepository.getByStoreId(storeId);
    if (storeReviews) {
        res.status(200).json(storeReviews);
    } else {
        res.sendStatus(404);
    }
}

function create(req, res) {
    const { storeId } = req.params;
    const { grade, content, usernickname, username } = req.body;
    const newReview = reviewRepository.create(storeId, grade, content, usernickname, username);
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
