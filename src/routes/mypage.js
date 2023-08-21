const { Router } = require('express');
const { Users, Review, Store } = require('../data-access');
const Board = require('../data-access/model/Board');

const asyncHandler = require('../utils/async-handler');

const router = Router();

// app.use에 미들웨어 윤렬님께 여쭤보기

// 회원 정보 수정
// https://velog.io/@daonez/Express%EB%A1%9C-%EA%B2%8C%EC%8B%9C%ED%8C%90-%EB%A7%8C%EB%93%A4%EA%B8%B0-endpoint-patch
router.patch(
    '/:userid',
    asyncHandler(async (req, res) => {
        const { userid } = req.params;
        const { name, nickname, profileText, password } = req.body;
        const result = await Users.findOneAndUpdate(
            { id: userid },
            {
                name,
                nickname,
                profileText,
                password,
            },
        );
        console.log(res);
        req.json(result);
    }),
);

// 회원 탈퇴
router.delete(
    '/:userid',
    asyncHandler(async (req, res) => {
        const { userid } = req.params;
        await Users.deleteOne({ id: userid });
        // deleteOne 리턴값 : {acknowledged:성공 OR 실패, deletedCount:삭제한 갯수}
        res.redirect('/');
    }),
);

// 게시글 목록 나열 -- 완료
router.get(
    '/:userid/boards',
    asyncHandler(async (req, res) => {
        const { userid } = req.params;
        const userInfo = await Users.findOne({ _id: userid });
        const boardList = await Board.find({ userId: userInfo.id });
        res.json(boardList);
    }),
);

// 내 리뷰 목록 나열
router.get(
    '/:userid/reviews',
    asyncHandler(async (req, res) => {
        const { userid } = req.params;
        const userInfo = await Users.findOne({ _id: userid });
        console.log(userInfo);
        // userInfo 객체와 Review 데이터의 작성자 필드를 벼교 후 일치하는 것들 배열로 반환
        const reviewList = await Review.find({ userId: userInfo.id });
        console.log(reviewList);
        res.json(reviewList);
    }),
);

// 리뷰 수정

// 리뷰 삭제
router.delete(
    '/:userid/reviews/:reviewid',
    asyncHandler(async (req, res) => {
        const { userid, reviewid } = req.params;
        await Review.deleteOne({ id: reviewid, userid });
        // deleteOne 리턴값 : {acknowledged:성공 OR 실패, deletedCount:삭제한 갯수}
        console.log(res);
        res.redirect('/');
    }),
);

// 가게 찜 목록 나열
router.get(
    '/:userid/storelikes',
    asyncHandler(async (req, res) => {
        const { userid } = req.params;
        const userInfo = await Users.findOne({ userid });
        console.log(userInfo);
        // userInfo 객체와 StoreLike 데이터의 작성자 필드를 벼교 후 일치하는 것들 배열로 반환
        // 다시 체크
        const storeLikeList = Store.find({ id: userInfo.id });
        console.log(storeLikeList);
        res.json(storeLikeList.likeStore);
    }),
);

// 가게 찜 삭제
router.delete(
    '/:userid/storelikes/:storeid',
    asyncHandler(async (req, res) => {
        const { userid, storeid } = req.params;
        // userStoreLike의 id 필드 값이 뭔지 알아야함.
        await Store.deleteOne({ id: storeid, userid });
        // deleteOne 리턴값 : {acknowledged:성공 OR 실패, deletedCount:삭제한 갯수}
        console.log(res);
        res.redirect('/');
    }),
);

// ****라이크 후순위로****
// 라이크 목록 나열
router.get(
    '/:userid/storelikes',
    asyncHandler(async (req, res) => {
        const { userid } = req.params;
        const userInfo = await Users.findOne({ userid });
        console.log(userInfo);
        // userInfo 객체와 Like 데이터의 작성자 필드를 벼교 후 일치하는 것들 배열로 반환
        // const likeList = Likes.find({userId:userInfo.id})
        // console.log(likeList);
        // res.json(likeList);
        res.json(userid);
    }),
);

// 라이크 취소
router.delete(
    '/:userid/likes/:likeid',

    asyncHandler(async (req, res) => {
        // const { userid, likeid } = req.params;
        // await Likes.deleteOne({ id: likeid, userid });
        // deleteOne 리턴값 : {acknowledged:성공 OR 실패, deletedCount:삭제한 갯수}
        console.log(res);
        res.redirect('/');
    }),
);

module.exports = router;
