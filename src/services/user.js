const bcrypt = require('bcryptjs');
const { Users, Review, Store, Board } = require('../data-access');
const asyncHandler = require('../utils/async-handler');

// 배경 이미지 변경
const editCoverImage = asyncHandler(async (req, res) => {
    const { userId } = req.userData;
    await Users.findOneAndUpdate({ _id: userId }, { coverImage: req.file.location }, { new: true });
    res.sendStatus(201);
});

// 유저 정보 가져오기
const getUser = asyncHandler(async (req, res) => {
    const { userId } = req.userData;
    const user = await Users.findOne({ _id: userId });
    const { name, nickname, profileImage, profileText, coverImage } = user;
    res.json({ name, nickname, profileImage, profileText, coverImage });
});

// 회원 정보 수정
const editUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const tokenUserId = req.userData.userId;

    if (userId !== tokenUserId) {
        const error = new Error('다른 유저 정보 수정은 불가합니다.');
        error.statusCode = 401;
        throw error;
    }
    const user = await Users.findOne({ _id: userId });
    const { name, nickname, profileText, profileImage, coverImage } = req.body;

    const newUser = await Users.findOneAndUpdate(
        { _id: userId },
        {
            name,
            nickname,
            profileText,
            profileImage:
                typeof profileImage === 'string'
                    ? user.profileImage
                    : req.files.profileImage[0].location,
            coverImage:
                typeof coverImage === 'string' ? user.coverImage : req.files.coverImage[0].location,
        },
        { new: true },
    );
    res.status(200).json(newUser);
});

// 회원 탈퇴
const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.userData;
    await Users.deleteOne({ _id: userId });
    res.sendStatus(204);
});

// 리뷰 목록 나열
const getMyReviews = asyncHandler(async (req, res) => {
    const { userId } = req.userData;
    const userInfo = await Users.findOne({ _id: userId });
    const reviewList = await Review.find({ userId: userInfo.id });
    res.json({ reviewList });
});

// 특정 사용자 리뷰 조회
const getUserReviews = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await Users.findOne({ _id: userId });
    const reviewList = await Review.find({ userId: user.id });
    if (reviewList.length === 0) {
        const error = new Error('리뷰가 없습니다.');
        error.statusCode = 204;
        throw error;
    }
    res.json({ reviewList });
});

// 게시글 목록 나열
const getBoards = asyncHandler(async (req, res) => {
    const { userId } = req.userData;
    const userInfo = await Users.findOne({ _id: userId });
    const boardList = await Board.find({ userId: userInfo.id });
    res.json({ boardList });
});

// 가게 찜 목록 나열
const getStoreLikes = asyncHandler(async (req, res) => {
    const { userId } = req.userData;
    const userInfo = await Users.findOne({ _id: userId });
    const storeLikeList = await Store.find({ storeLikes: { $in: [userInfo.id] } });
    res.json({ storeLikeList });
});

// 가게 찜 삭제
const deleteStoreLike = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    const { userId } = req.userData;
    const foundStore = await Store.findOne({ _id: storeId });
    const { storeLikes } = foundStore;
    const filter = { _id: storeId };
    const update = { storeLikes: storeLikes.filter((user) => String(user) !== userId) };
    await Store.findOneAndUpdate(filter, update);
    res.sendStatus(200);
});

// 비밀번호 변경
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword, checkPassword } = req.body;
    const { userId } = req.userData;
    const user = await Users.findOne({ _id: userId });
    const filter = {
        password: newPassword,
    };
    const checkCurrentPassword = await bcrypt.compare(currentPassword, user.password);
    if (!checkCurrentPassword) {
        throw new Error('비밀번호를 잘못 입력했습니다.');
    }
    const checkNewPassword = await bcrypt.compare(newPassword, checkPassword);
    if (!checkNewPassword) {
        throw new Error('비밀번호가 일치하지 않습니다.');
    }
    await Users.findOneAndUpdate({ _id: userId }, filter);

    res.sendStatus(201);
});

module.exports = {
    editCoverImage,
    getUser,
    editUser,
    deleteUser,
    getBoards,
    getMyReviews,
    getStoreLikes,
    deleteStoreLike,
    getUserReviews,
    changePassword,
};
