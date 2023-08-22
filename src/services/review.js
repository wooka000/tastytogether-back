const { Users, Review, Store } = require('../data-access');

// 임시 데이터 및 데이터 처리 부분 (삭제 예정)
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

// async function getAllRepository() {
//     return reviews;
// }

// async function getByUserNicknameRepository(usernickname) {
//     return reviews.filter((review) => review.usernickname === usernickname);
// }

// async function getByReviewIdRepository(reviewId) {
//     return reviews.find((reviewItem) => reviewItem.id === reviewId);
// }

// async function updateRepository(reviewId, grade, content) {
//     const review = reviews.find((reviewItem) => reviewItem.id === reviewId);
//     if (review) {
//         review.grade = grade;
//         review.content = content;
//     }
//     return review;
// }

// async function removeRepository(reviewId) {
//     reviews = reviews.filter((review) => review.id !== reviewId);
// }

// async function getByStoreIdRepository(storeId) {
//     return reviews.filter((review) => review.storeId === storeId);
// }

// async function createRepository(storeId, grade, content, usernickname, username) {
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

// 여기서부터 Controll 부분

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

// 리뷰를 작성할때 body에서 닉네임과 유저이름 가져올 수 없는 것 같다.
// 닉네임과 유저이름은 로그인 되어있으니까 로그인 정보에서 가져와야 할텐데 어떻게 가져오지?
// 유저아이디도 로그인 정보에서?
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
    getUserReviews,
    getReviewById,
    getByStoreId,
    createReview,
};
