const { Board, Comment } = require('../data-access');

const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
        date.getDate(),
    ).padStart(2, '0')}`;
};

const getDetailBoard = async (req, res) => {
    try {
        const board = await Board.findById(req.params.id).populate('userId', [
            'nickname',
            'profileImage',
        ]);

        if (!board) {
            return res.status(404).end();
        }

        const formattedDateBoard = formatDate(board.createdAt);

        const comments = await Comment.find({ boardId: req.params.id }).populate('userId', [
            'nickname',
            'profileImage',
        ]);

        const responseObject = {
            board: {
                // eslint-disable-next-line no-underscore-dangle
                id: board._id,
                userId: board.userId,
                storeId: board.storeId,
                title: board.title,
                content: board.content,
                meetDate: board.meetDate,
                region: board.region,
                image: board.image,
                createdAt: formattedDateBoard,
            },
            comments: comments.map((comment) => ({
                // eslint-disable-next-line no-underscore-dangle
                id: comment._id,
                userId: comment.userId,
                boardId: comment.boardId,
                content: comment.content,
                createdAt: formatDate(comment.createdAt),
                updatedAt: comment.updatedAt,
            })),
        };

        res.status(200).json(responseObject);
    } catch (err) {
        console.error(err.message);
        res.status(500).end();
    }
};

const getSearchBoard = async (req, res) => {
    try {
        const searchValue = req.query.value;

        const result = await Board.find({ region: searchValue }).sort({ _id: -1 });

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
};

const getAllBoard = async (req, res, countPerPage, pageNo) => {
    try {
        const totalCount = await Board.countDocuments({});
        const totalPages = Math.ceil(totalCount / countPerPage);

        let startItemNo = (pageNo - 1) * countPerPage;
        if (startItemNo >= totalCount) {
            startItemNo = Math.max(0, totalCount - countPerPage);
        }

        const boardList = await Board.find({})
            .sort({ createdAt: -1 })
            .skip(startItemNo)
            .limit(countPerPage)
            .populate({
                path: 'userId',
                select: 'nickname',
            });

        res.status(200).json({
            success: true,
            data: boardList,
            currentPage: pageNo,
            totalPages,
            totalCount,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).end();
    }
};

const postBoard = async (req, res) => {
    const { region, title, content, meetDate } = req.body;
    const { userId } = req.userData;

    // 입력값 검증
    if (!userId || !region || !title || !content || !meetDate || !req.file) {
        return res.status(400).end();
    }

    try {
        const board = new Board({
            userId,
            region,
            title,
            content,
            meetDate,
            image: req.file.location,
        });
        const savedBoard = await board.save();
        res.status(201).json(savedBoard);
    } catch (err) {
        console.error(err.message);
        res.status(500).end();
    }
};

const editBoard = async (req, res) => {
    const { title, content, meetDate, region } = req.body;

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
    if (region) {
        updatedFields.region = region;
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
};

const deleteBoard = async (req, res) => {
    try {
        const { userId } = req.userData;
        const boardId = req.params.id;

        const board = await Board.findById(boardId);

        if (!board || String(board.userId) !== String(userId)) {
            return res.status(403).json({ message: "You can't delete this board" });
        }

        await Board.findByIdAndDelete(boardId);

        res.status(200).end();
    } catch (err) {
        console.error(err.message);
        res.status(500).end();
    }
};

module.exports = { getAllBoard, postBoard, editBoard, deleteBoard, getDetailBoard, getSearchBoard };
