const { Router } = require('express');

const router = Router();
const boardController = require('../services/board');
const verifyLogin = require('../middlewares/loginValidator');
const { uploadSingleImage } = require('../middlewares/imageUploader');

router.post('/posts', uploadSingleImage('image'), verifyLogin, boardController.postBoard);

// 게시글 목록 조회
router.get('/posts', (req, res) => {
    const countPerPage = parseInt(req.query.countperpage, 10) || 10;
    const pageNo = parseInt(req.query.pageno, 10) || 1;

    boardController.getAllBoard(req, res, countPerPage, pageNo);
});

// 게시글 상세 조회
// router.get('/posts/:id', boardController.getOneBoard);

// 게시글 작성

router.get('/posts/:id', verifyLogin,boardController.getDetailBoard);

router.patch('/posts/:id', verifyLogin, boardController.editBoard);

router.delete('/posts/:id',verifyLogin,boardController.deleteBoard);

router.get('/regionSearch', boardController.getSearchBoard);

module.exports = router;
