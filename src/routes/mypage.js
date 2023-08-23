const { Router } = require('express');
const mypageController = require('../services/mypage');

const router = Router();

// 프로필 수정 api
router.patch('/:userid', mypageController.editUser);

// 유저 탈퇴 api
router.delete('/:userid', mypageController.deleteUser);

// 게시글 목록 조회 api
router.get('/:userid/boards', mypageController.getBoards);

// 리뷰 목록 조회 api
router.get('/:userid/reviews', mypageController.getReviews);

// 리뷰 수정 api
router.patch('/reviews/:reviewid', mypageController.editReview);

// 리뷰 삭제 api
router.delete('/reviews/:reviewid', mypageController.deleteReview);

// 가게 찜 목록 조회 api
router.get('/:userid/storelikes', mypageController.getStoreLikes);

// 가게 찜 삭제 api
router.delete('/:userid/storelikes/:storeid', mypageController.deleteStoreLike);

// 추가) 라이크 후순위 작업

module.exports = router;
