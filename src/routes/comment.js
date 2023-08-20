const { Router } = require('express');

const router = Router();
const CommentController = require('../services/comment');

// eslint-disable-next-line consistent-return
router.post('/:id/comments', CommentController.postComments);
// eslint-disable-next-line consistent-return
router.delete('/comments/:id', CommentController.deleteComments);

router.get('/comments/:id', CommentController.getComments);

module.exports = router;
