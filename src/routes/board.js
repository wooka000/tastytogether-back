const express = require('express');

const boardRouter = express.Router();
const Board = require('../data-access/schema/boardSchema');
const Comment = require('../data-access/schema/commentSchema');

// 게시글 목록 조회
// GET /posts
boardRouter.get('/posts', async (req, res) => {
    try {
        // 모든 게시글 조회
        const boardList = await Board.find({});
        res.status(200).send(boardList);
    } catch (err) {
        console.error(err.message);
        res.status(500).end();
    }
});
// eslint-disable-next-line consistent-return
// boardRouter.get('/posts/:id', async (req, res) => {
//     try {
//       const board = await Board.findById(req.params.id);
//       if (!board) {
//         return res.status(404).end();
//       }
//       res.status(200).json(board);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).end();
//     }
//   });

// 게시글 작성
// POST /posts
// eslint-disable-next-line consistent-return
boardRouter.post('/posts', async (req, res) => {
    const { userId, storeId, title, content, meetDate } = req.body;

    // 입력값 검증
    if (!userId || !storeId || !title || !content || !meetDate) {
        return res.status(400).end();
    }

    try {
        const board = new Board({ userId, storeId, title, content, meetDate });
        const savedBoard = await board.save();
        res.status(201).json(savedBoard);
    } catch (err) {
        console.error(err.message);
        res.status(500).end();
    }
});

// 게시글 수정
// eslint-disable-next-line consistent-return
boardRouter.patch('/posts/:id', async (req, res) => {
    const { title, content, meetDate, storeId } = req.body;

    const updatedFields = {};
    if (title) {
        updatedFields.title = title;
    }
    if (content) {
        updatedFields.content = content;
    }
    if (meetDate) {
        updatedFields.meetDate = meetDate;
    }
    if (storeId) {
        updatedFields.storeId = storeId;
    }

    try {
        let board = await Board.findById(req.params.id);

        if (!board) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }

        board = Object.assign(board, updatedFields);

        board = await board.save();

        res.status(200).json(board);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('서버 내부 오류로 인해 요청을 처리할 수 없습니다.');
    }
});

// 게시글 삭제
// DELETE /posts/:id
// eslint-disable-next-line consistent-return
boardRouter.delete('/posts/:id', async (req, res) => {
    try {
        const board = await Board.findOneAndDelete({ _id: req.params.id });
        if (!board) {
            return res.status(404).end();
        }
        res.status(200).end();
    } catch (err) {
        console.error(err.message);
        res.status(500).end();
    }
});

// eslint-disable-next-line consistent-return
boardRouter.get('/posts/:id', async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if (!board) {
            return res.status(404).end();
        }

        // 게시물 ID를 사용하여 댓글을 조회합니다.
        const comments = await Comment.find({ boardId: req.params.id });

        // 게시물과 댓글 정보를 포함하는 응답 객체를 생성합니다.
        const responseObject = {
            board: {
                // eslint-disable-next-line no-underscore-dangle
                id: board._id,
                userId: board.userId,
                storeId: board.storeId,
                title: board.title,
                content: board.content,
                meetDate: board.meetDate,
                createdAt: board.createdAt,
            },
            comments: comments.map((comment) => ({
                // eslint-disable-next-line no-underscore-dangle
                id: comment._id,
                userId: comment.userId,
                boardId: comment.boardId,
                content: comment.content,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
                // eslint-disable-next-line no-underscore-dangle
                __v: comment.__v,
            })),
        };

        res.status(200).json(responseObject);
    } catch (err) {
        console.error(err.message);
        res.status(500).end();
    }
});

module.exports = boardRouter;
