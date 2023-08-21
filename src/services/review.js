// 임시 데이터 및 데이터 처리 부분 (삭제 예정)
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

async function getAllRepository() {
    return reviews;
}

async function getByUserNicknameRepository(usernickname) {
    return reviews.filter((review) => review.usernickname === usernickname);
}

async function getByReviewIdRepository(reviewId) {
    return reviews.find((reviewItem) => reviewItem.id === reviewId);
}

async function updateRepository(reviewId, grade, content) {
    const review = reviews.find((reviewItem) => reviewItem.id === reviewId);
    if (review) {
        review.grade = grade;
        review.content = content;
    }
    return review;
}

async function removeRepository(reviewId) {
    reviews = reviews.filter((review) => review.id !== reviewId);
}

async function getByStoreIdRepository(storeId) {
    return reviews.filter((review) => review.storeId === storeId);
}

async function createRepository(storeId, grade, content, usernickname, username) {
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

// 여기서부터 Controll 부분
async function getAll(req, res) {
    console.log(req.url);
    const getReviews = await getAllRepository();
    res.status(200).json(getReviews);
}

async function getByUserNickname(req, res) {
    const userNickname = req.query.usernickname;
    const data = await getByUserNicknameRepository(userNickname);
    if (data.length >= 1) {
        res.status(200).json(data);
    } else {
        res.sendStatus(404);
    }
}

async function getByReviewId(req, res) {
    const { reviewId } = req.params;
    const review = await getByReviewIdRepository(reviewId);
    if (review) {
        res.status(200).json(review);
    } else {
        res.sendStatus(404);
    }
}

async function update(req, res) {
    const { reviewId } = req.params;
    const { grade, content } = req.body;
    const review = await updateRepository(reviewId, grade, content);
    if (review) {
        res.status(200).json(review);
    } else {
        res.sendStatus(404);
    }
}

async function remove(req, res) {
    const { reviewId } = req.params;
    await removeRepository(reviewId);
    res.sendStatus(204);
}

async function getByStoreId(req, res) {
    const { storeId } = req.params;
    const storeReviews = await getByStoreIdRepository(storeId);
    if (storeReviews) {
        res.status(200).json(storeReviews);
    } else {
        res.sendStatus(404);
    }
}

async function create(req, res) {
    const { storeId } = req.params;
    const { grade, content, usernickname, username } = req.body;
    const newReview = await createRepository(storeId, grade, content, usernickname, username);
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
