const { Router } = require('express');
const mypageController = require('../services/user');

const router = Router();

// 프로필 수정 api
router.patch('/:userId', mypageController.editUser);

// 유저 탈퇴 api
router.delete('/:userId', mypageController.deleteUser);

// 게시글 목록 조회 api => /board/:userId
router.get('/:userid/boards', mypageController.getBoards);

// 리뷰 목록 조회 api => /user/reviews
router.get('/reviews', mypageController.getReviews);

// 리뷰 수정 api => /review/:reviewId
router.patch('/reviews/:reviewid', mypageController.editReview);

// 리뷰 삭제 api => /review/:reviewId
router.delete('/reviews/:reviewid', mypageController.deleteReview);

// 가게 찜 목록 조회 api => /store/likes/:userId
router.get('/:userid/storelikes', mypageController.getStoreLikes);

// 가게 찜 삭제 api => /store/like/:userId
router.delete('/:userid/storelikes/:storeid', mypageController.deleteStoreLike);

// 추가) 라이크 후순위 작업

module.exports = router;
