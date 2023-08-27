const { Router } = require('express');

const router = Router();

const CommentController = require('../services/comment');


router.post('/:id/comments', CommentController.postComments);

router.delete('/comments/:id', CommentController.deleteComments);

router.get('/comments/:id', CommentController.getComments);

module.exports = router;
