const { Router } = require('express');

const router = Router();
const boardController = require('../services/board');


// 게시글 목록 조회
router.get('/posts', boardController.getAllBoard);

// // 게시글 상세 조회
// router.get('/posts/:id', boardController.getOneBoard);

// 게시글 작성
router.post('/posts', boardController.postBoard);

// 게시글 수정
router.patch('/posts/:id', boardController.editBoard);

// 게시글 삭제
router.delete('/posts/:id', boardController.deleteBoard);

// 게시글 상세 정보 조회
router.get('/posts/:id', boardController.getDetailBoard);


module.exports = router;
