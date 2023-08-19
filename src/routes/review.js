const { Router } = require('express');

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

const router = Router();

// 모든 리뷰 조회 (임시 api)
router.get('/all', (req, res) => {
    console.log(req.url);
    res.status(200).json(reviews);
});

// 특정 사용자가 작성한 리뷰들 조회
router.get('/', (req, res) => {
    const userNickname = req.query.usernickname;
    const data = reviews.filter((review) => review.usernickname === userNickname);
    if (data.length >= 1) {
        res.status(200).json(data);
    } else {
        res.sendStatus(404);
    }
});

// 특정 리뷰 조회
router.get('/:reviewId', (req, res) => {
    const { reviewId } = req.params;
    const review = reviews.find((reviewItem) => reviewItem.id === reviewId);
    if (review) {
        res.status(200).json(review);
    } else {
        res.sendStatus(404);
    }
});

// 특정 리뷰 수정
router.patch('/:reviewId', (req, res) => {
    const { reviewId } = req.params;
    const { grade, content } = req.body;
    const review = reviews.find((reviewItem) => reviewItem.id === reviewId);
    if (review) {
        review.grade = grade;
        review.content = content;
        res.status(200).json(review);
    } else {
        res.sendStatus(404);
    }
});

// 특정 리뷰 삭제
router.delete('/:reviewId', (req, res) => {
    const { reviewId } = req.params;
    reviews = reviews.filter((review) => review.id !== reviewId);
    res.sendStatus(204);
});

// 가게 리뷰들 조회
router.get('/store/:storeId', (req, res) => {
    const { storeId } = req.params;
    const storeReviews = reviews.filter((review) => review.storeId === storeId);
    if (storeReviews) {
        res.status(200).json(storeReviews);
    } else {
        res.sendStatus(404);
    }
});

// 가게 리뷰 생성
router.post('/store/:storeId', (req, res) => {
    const { storeId } = req.params;
    const { grade, content, usernickname, username } = req.body;
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
    res.status(201).json(newReview);
});

module.exports = router;
