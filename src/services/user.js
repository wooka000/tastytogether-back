const { Users, Review, Store, Board } = require('../data-access');
const asyncHandler = require('../utils/async-handler');

// 회원 정보 수정 -- 기본적인 patch 기능 우선 완료
const test = {
    name: '짱구',
    nickname: '짱구는못말려',
    profileText: '짱구짱구',
    password: '짱구123',
};

const editUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    console.log(userId);
    // test=>req.body로 변경
    const { name, nickname, profileText, password } = test;
    const updated = await Users.findOneAndUpdate(
        { _id: userId },
        {
            name,
            nickname,
            profileText,
            password,
        },
    );
    res.json(updated);
});

// 회원 탈퇴 O
const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    await Users.deleteOne({ _id: userId });
    // deleteOne 리턴값 : {acknowledged:성공 OR 실패, deletedCount:삭제한 갯수}
    res.sendStatus(200);
});

// 게시글 목록 나열
const getBoards = asyncHandler(async (req, res) => {
    const { userid } = req.params;
    const userInfo = await Users.findOne({ _id: userid });
    const boardList = await Board.find({ userId: userInfo.id });
    res.json(boardList);
});

// 리뷰 목록 나열
const getReviews = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const userInfo = await Users.findOne({ _id: userId });
    const reviewList = await Review.find({ userId: userInfo.id });
    res.json(reviewList);
});

// 리뷰 수정
const testReview = {
    grade: '별로다',
    content: '직원이 불친절하다',
};

const editReview = asyncHandler(async (req, res) => {
    const { reviewid } = req.params;
    // testReview=>req.body로 변경
    // {new:true}는 res.json에 값을 넘겨줄때 변경값을 넘겨줄지 말지 정해줌.
    const { grade, content } = testReview;
    const updated = await Review.findOneAndUpdate(
        { _id: reviewid },
        {
            grade,
            content,
        },
        { new: true },
    );
    // updated 된 review 객체를 넘겨주고 있는데, 이게 필요한지? 성공 실패 상태를 넘겨줘도 되는지
    res.json(updated);
});

// 리뷰 삭제
const deleteReview = asyncHandler(async (req, res) => {
    const { reviewid } = req.params;
    await Review.deleteOne({ _id: reviewid });
    res.sendStatus(200);
});

// 가게 찜 목록 나열
const getStoreLikes = asyncHandler(async (req, res) => {
    const { userid } = req.params;
    const userInfo = await Users.findOne({ _id: userid });
    const storeLikeList = await Store.find({ storeLikes: userInfo.id });
    res.json(storeLikeList);
});

// 가게 찜 삭제
const deleteStoreLike = asyncHandler(async (req, res) => {
    const { userid, storeid } = req.params;
    const finded = await Store.findOne({ _id: storeid });
    const { storeLikes } = finded;
    const filter = { _id: storeid, storeLikes: userid };
    const update = { storeLikes: storeLikes.filter((user) => String(user) !== userid) };
    await Store.findOneAndUpdate(filter, update);
    res.sendStatus(200);
});

module.exports = {
    editUser,
    deleteUser,
    getBoards,
    getReviews,
    editReview,
    deleteReview,
    getStoreLikes,
    deleteStoreLike,
};
