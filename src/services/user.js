const { Users, Review, Store, Board } = require('../data-access');
const asyncHandler = require('../utils/async-handler');

// 회원 정보 수정 -- 이미지 내용 추가 필요. 비밀번호 중복확인 로직 사용.
const test = {
    name: '짱구',
    nickname: '짱구는못말려',
    profileText: '짱구짱구',
};

const editUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const tokenId = req.userData.userId;
    if (userId !== tokenId) {
        const error = new Error('다른 유저 정보 수정은 불가합니다.');
        error.statusCode = 401;
        throw error;
    }
    // test=>req.body로 변경
    const { name, nickname, profileText } = test;
    const updated = await Users.findOneAndUpdate(
        { _id: userId },
        {
            name,
            nickname,
            profileText,
        },
    );
    res.json(updated);
});

// 회원 탈퇴 O
const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const tokenId = req.userData.userId;
    if (userId !== tokenId) {
        const error = new Error('다른 유저의 탈퇴 요청은 불가합니다.');
        error.statusCode = 401;
        throw error;
    }
    await Users.deleteOne({ _id: userId });
    // deleteOne 리턴값 : {acknowledged:성공 OR 실패, deletedCount:삭제한 갯수}
    res.sendStatus(200);
});

// 리뷰 목록 나열 O
const getMyReviews = asyncHandler(async (req, res) => {
    // req.userData로 유저 아이디 접근
    const { userId } = req.userData;
    const userInfo = await Users.findOne({ _id: userId });
    const reviewList = await Review.find({ userId: userInfo.id });
    res.status(200).json(reviewList);
});

// 특정 사용자 리뷰 조회 O
const getUserReviews = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await Users.findOne({ _id: userId });
    const reviewList = await Review.find({ userId: user.id });
    if (reviewList.length === 0) {
        const error = new Error('리뷰가 없습니다.');
        error.statusCode = 204;
        throw error;
    }
    res.status(200).json(reviewList);
});

// 게시글 목록 나열 O
const getBoards = asyncHandler(async (req, res) => {
    const { userId } = req.userData;
    const userInfo = await Users.findOne({ _id: userId });
    const boardList = await Board.find({ userId: userInfo.id });
    res.json(boardList);
});

// 가게 찜 목록 나열 O
const getStoreLikes = asyncHandler(async (req, res) => {
    const { userId } = req.userData;
    const userInfo = await Users.findOne({ _id: userId });
    const storeLikeList = await Store.find({ storeLikes: { $in: [userInfo.id] } });
    res.json(storeLikeList);
});

// 가게 찜 삭제 O
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

module.exports = {
    editUser,
    deleteUser,
    getBoards,
    getMyReviews,
    getStoreLikes,
    deleteStoreLike,
    getUserReviews,
};
