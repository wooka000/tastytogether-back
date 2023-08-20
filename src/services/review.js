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

// 임시 데이터
// let reviews = [
//     {
//         id: '1',
//         grade: '맛있다',
//         content: '치즈피자가 제일 맛있어요!',
//         usernickname: 'elice',
//         username: 'Elice',
//         createdAt: Date.now().toString(),
//         storeId: '2',
//     },
//     {
//         id: '2',
//         grade: '괜찮다',
//         content: '불고기피자 괜찮아요~',
//         usernickname: 'bob',
//         username: 'Bob',
//         createdAt: Date.now().toString(),
//         storeId: '3',
//     },
//     {
//         id: '3',
//         grade: '별로다',
//         content: '야채피자 별로에요..',
//         usernickname: 'james',
//         username: 'James',
//         createdAt: Date.now().toString(),
//         storeId: '3',
//     },
// ];

// async function getAll() {
//     return reviews;
// }

// async function getByUserNickname(usernickname) {
//     return reviews.filter((review) => review.usernickname === usernickname);
// }

// async function getByReviewId(reviewId) {
//     return reviews.find((reviewItem) => reviewItem.id === reviewId);
// }

// async function update(reviewId, grade, content) {
//     const review = reviews.find((reviewItem) => reviewItem.id === reviewId);
//     if (review) {
//         review.grade = grade;
//         review.content = content;
//     }
//     return review;
// }

// async function remove(reviewId) {
//     reviews = reviews.filter((review) => review.id !== reviewId);
// }

// async function getByStoreId(storeId) {
//     return reviews.filter((review) => review.storeId === storeId);
// }

// async function create(storeId, grade, content, usernickname, username) {
//     const newReview = {
//         id: Date.now().toString(),
//         grade,
//         content,
//         usernickname,
//         username,
//         createdAt: Date.now().toString(),
//         storeId,
//     };
//     reviews = [newReview, ...reviews];
//     return newReview;
// }

// module.exports = {
//     getAll,
//     getByUserNickname,
//     getByReviewId,
//     update,
//     remove,
//     getByStoreId,
//     create,
// };
