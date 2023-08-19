const express = require('express');

const commentRouter = express.Router();
const Comment = require('../data-access/schema/comment');

// eslint-disable-next-line consistent-return
commentRouter.post('/:id/comments', async (req, res) => {
    const { userId, content } = req.body;
    const boardId = req.params.id;

    if (!userId || !content || !boardId) {
        return res.status(400).end();
    }

    try {
        const comment = new Comment({ userId, content, boardId });
        const saveCommnet = await comment.save();
        res.status(201).json(saveCommnet);
    } catch (err) {
        console.error(err.message);
        res.status(500).end();
    }
});
// eslint-disable-next-line consistent-return
commentRouter.delete('/comments/:id', async (req, res) => {
    try {
        const comment = await Comment.findOneAndDelete({_id: req.params.id});
        if (!comment) {
            return res.status(404).end();
        }
        res.status(200).end();
    } catch (err) {
        console.error(err.message);
        res.status(500).end();
    }
});

commentRouter.get('/:id/comments', async (req, res) => {
    const boardId = req.params.id;
    try {
      const comments = await Comment.find({ boardId });
      res.status(200).json(comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).end();
    }
  });


module.exports = commentRouter;
