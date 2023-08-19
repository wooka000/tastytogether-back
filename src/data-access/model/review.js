// 임시 데이터
let reviews = [
    {
        id: '1',
        grade: '맛있다',
        content: '치즈피자가 제일 맛있어요!',
        usernickname: 'elice',
        username: 'Elice',
        createdAt: Date.now().toString(),
        storeId: '2',
    },
    {
        id: '2',
        grade: '괜찮다',
        content: '불고기피자 괜찮아요~',
        usernickname: 'bob',
        username: 'Bob',
        createdAt: Date.now().toString(),
        storeId: '3',
    },
    {
        id: '3',
        grade: '별로다',
        content: '야채피자 별로에요..',
        usernickname: 'james',
        username: 'James',
        createdAt: Date.now().toString(),
        storeId: '3',
    },
];

function getAll() {
    return reviews;
}

function getByUserNickname(usernickname) {
    return reviews.filter((review) => review.usernickname === usernickname);
}

function getByReviewId(reviewId) {
    return reviews.find((reviewItem) => reviewItem.id === reviewId);
}

function update(reviewId, grade, content) {
    const review = reviews.find((reviewItem) => reviewItem.id === reviewId);
    if (review) {
        review.grade = grade;
        review.content = content;
    }
    return review;
}

function remove(reviewId) {
    reviews = reviews.filter((review) => review.id !== reviewId);
}

function getByStoreId(storeId) {
    return reviews.filter((review) => review.storeId === storeId);
}

function create(storeId, grade, content, usernickname, username) {
    const newReview = {
        id: Date.now().toString(),
        grade,
        content,
        usernickname,
        username,
        createdAt: Date.now().toString(),
        storeId,
    };
    reviews = [newReview, ...reviews];
    return newReview;
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
