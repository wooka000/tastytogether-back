const { Comment } = require('../data-access');

const postComments = async (req, res) => {
    const { content } = req.body;
    const { userId } = req.userData;
    const boardId = req.params.id;

    if (!userId || !content || !boardId) {
        return res.status(400).end();
    }
    try {
        const comment = new Comment({ userId, content, boardId });
        const savedComment = await comment.save();

        const populatedComment = await Comment.findById(savedComment._id).populate('userId', [
            'nickname',
            'profileImage',
        ]);

        // Convert createdAt to the desired format using array destructuring
        let formattedDate;
        if (populatedComment.createdAt) {
            const date = new Date(populatedComment.createdAt);
            [formattedDate] = date.toISOString().split('T');
        }

        // Construct the response object
        const responseObject = {
            ...populatedComment._doc,
            createdAt: formattedDate,
        };

        res.status(201).json(responseObject);
    } catch (err) {
        console.error(err.message);
        res.status(500).end();
    }
};

// eslint-disable-next-line consistent-return
const deleteComments = async (req, res) => {
    try {
        const comment = await Comment.findOneAndDelete({ _id: req.params.id });
        if (!comment) {
            return res.status(404).end();
        }
        res.status(200).end();
    } catch (err) {
        console.error(err.message);
        res.status(500).end();
    }
};

// eslint-disable-next-line consistent-return
const getComments = async (req, res) => {
    const commentId = req.params.id;
    try {
        const comment = await Comment.findOne({ _id: commentId }).populate('userId', 'nickname');
        if (!comment) {
            return res.status(404).end();
        }
        return res.status(200).json(comment);
    } catch (err) {
        console.error(err.message);
        res.status(500).end();
    }
};

module.exports = { postComments, deleteComments, getComments };
