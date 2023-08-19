const express = require('express');

const likeRouter = express.Router();
const Like = require('../data-access/schema/like');

// eslint-disable-next-line consistent-return
likeRouter.post('/posts/:id/like', async (req, res) => {
    const { userId,boardId } = req.body;

    // 입력값 검증
    if (!userId || !boardId ) {
        return res.status(400).end();
    }

    try {
        const like = new Like({ userId, boardId });
        const savedlike = await like.save();
        res.status(201).send(savedlike);
    } catch (err) {
        console.error(err.message);
        res.status(500).end();
    }
});

// eslint-disable-next-line consistent-return
likeRouter.delete('/posts/:id/like/:id', async (req, res) => {
    try {
        const like = await Like.findOneAndDelete({ _id: req.params.id });
        if (!like) {
            return res.status(404).end();
        }
        res.status(200).end();
    } catch (err) {
        console.error(err.message);
        res.status(500).end();
    }
});


module.exports = likeRouter;