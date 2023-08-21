const { Router } = require('express');
const { Users } = require('../data-access');

const asyncHandler = require('../utils/async-handler');

const router = Router();

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

// 게시글 목록 나열
router.get(
    '/:userid/boards',
    asyncHandler(async (req, res) => {
        // board는 storeID로 이루어진 배열
        // board 배열에서 storeID로 각각의 store 정보 가져온 후 필요한 정보 리턴
        const { userid } = req.params;
        const userInfo = await Users.findOne({ id: userid });
        console.log(userInfo);
        // userInfo 객체와 Board 데이터의 작성자 필드를 비교 후 일치하는 것들 배열로 반환
        // const boardList = Boards.find({userId:userInfo.id})
        // console.log(boardList);
        // res.json(boardList);
        res.json(userInfo);
    }),
);

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

// 내 리뷰 목록 나열
router.get(
    '/:userid/reviews',
    asyncHandler(async (req, res) => {
        const { userid } = req.params;
        const userInfo = await Users.findOne({ userid });
        console.log(userInfo);
        // userInfo 객체와 Review 데이터의 작성자 필드를 벼교 후 일치하는 것들 배열로 반환
        // const reviewList = Reviews.find({userId:userInfo.id})
        // console.log(reviewList);
        // res.json(reviewList);
        res.json(userid);
    }),
);

// 리뷰 수정

// 리뷰 삭제
router.delete(
    '/:userid/reviews/:reviewid',
    asyncHandler(async (req, res) => {
        // const { userid, reviewid } = req.params;
        // await Reviews.deleteOne({ id: reviewid, userid });
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
        // const storeLikeList = userStoreLike.find({id:userInfo.id})
        // console.log(storeLikeList);
        // res.json(storeLikeList.likeStore);
        res.json(userid);
    }),
);

// 가게 찜 삭제
router.delete(
    '/:userid/storelikes/:storeid',
    asyncHandler(async (req, res) => {
        // const { userid, storeid } = req.params;
        // userStoreLike의 id 필드 값이 뭔지 알아야함.
        // await userStoreLike.deleteOne({ id: storeid, userid  });
        // deleteOne 리턴값 : {acknowledged:성공 OR 실패, deletedCount:삭제한 갯수}
        console.log(res);
        res.redirect('/');
    }),
);

router.get(
    '/test',
    asyncHandler(async (req, res) => {
        const data = [1, 2, 3];
        res.json(data);
    }),
);

module.exports = router;
