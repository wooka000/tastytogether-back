const { Router } = require('express');
const { uploadSingleImage } = require('../middlewares/imageUploader');
const userController = require('../services/user');
const storeController = require('../services/store');

const router = Router();

// 배경 이미지 변경
router.patch('/coverImage', uploadSingleImage('coverImage'), userController.editCoverImage);

// 프로필 수정 api
router.patch('/:userId', uploadSingleImage('profileImage'), userController.editUser);

// 유저 탈퇴 api
router.delete('/:userId', userController.deleteUser);

// (마이페이지) 리뷰 목록 조회
router.get('/reviews', userController.getMyReviews);

// 특정 사용자가 작성한 리뷰들 조회
router.get('/:userId/reviews', userController.getUserReviews);

// (마이페이지) 게시글 목록 조회
router.get('/boards', userController.getBoards);

// (마이페이지) 가게 찜 목록 조회
router.get('/storelikes', userController.getStoreLikes);

// (마이페이지) 가게 찜 삭제
router.delete('/storelike/:storeId', storeController.updateStoreLikes);

// 추가) 라이크 후순위 작업

module.exports = router;
