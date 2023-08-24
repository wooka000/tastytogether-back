const { Router } = require('express');

const router = Router();

const boardController = require('../services/board');

// 게시글 목록 조회
router.get('/posts', (req, res) => {
    const countPerPage = parseInt(req.query.countperpage, 10) || 10;
    const pageNo = parseInt(req.query.pageno, 10) || 1;

    boardController.getAllBoard(req, res, countPerPage, pageNo);
});

// 게시글 상세 조회
// router.get('/posts/:id', boardController.getOneBoard);

// 게시글 작성
router.post('/posts', boardController.postBoard);

// 게시글 상세 정보 조회
router.get('/posts/:id', boardController.getDetailBoard);

// 게시글 수정
router.patch('/posts/:id', boardController.editBoard);

// 게시글 삭제
router.delete('/posts/:id', boardController.deleteBoard);

router.get('/regionSearch', boardController.getSearchBoard);

module.exports = router;
