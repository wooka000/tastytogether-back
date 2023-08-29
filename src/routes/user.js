const { Router } = require('express');
const { uploadSingleImage, uploadFieldImage } = require('../middlewares/imageUploader');
const userController = require('../services/user');

const router = Router();

// 배경 이미지 변경
router.patch('/coverImage', uploadSingleImage('coverImage'), userController.editCoverImage);

// 유저 정보 가져오기
router.get('/', userController.getUser);

// 프로필 수정 api O
router.patch(
    '/:userId',
    uploadFieldImage([{ name: 'profileImage' }, { name: 'coverImage' }]),
    userController.editUser,
);

// 유저 탈퇴 api O
router.delete('/:userId', userController.deleteUser);

// (마이페이지) 리뷰 목록 조회 api O
router.get('/reviews', userController.getMyReviews);

// 특정 사용자가 작성한 리뷰들 조회 O
router.get('/:userId/reviews', userController.getUserReviews);

// (마이페이지) 게시글 목록 조회 O
router.get('/boards', userController.getBoards);

// (마이페이지) 가게 찜 목록 조회 O
router.get('/storelikes', userController.getStoreLikes);

// (마이페이지) 가게 찜 삭제 O
router.delete('/store/like/:storeId', userController.deleteStoreLike);

// 추가) 라이크 후순위 작업

module.exports = router;
