
const { Store } = require('../data-access');
// 허스키 eslint로 인해 잠시 주석 처리
// const { Store, Review, menuItems } = require('../data-access');


const checkStore = async (req, res) => {
    const { name, address } = req.body;
    
    const checkName = await Store.findOne({ name });
    const checkAddress = await Store.findOne({ address });
    
    if (checkName && checkAddress) {
        const error = new Error('이미 같은 가게가 존재합니다.');
        error.statusCode = 409;
        res.status(409).send(error.message);
    } else {
        res.status(200).send('가게 확인 완료');
    }
};

const createStore = async (req, res) => {
    const {
        name, 
        address, 
        storeType, 
        phone, 
        menuItems,
        priceRange, 
        parkingInfo, 
        businessHours, 
        closedDays, 
        bannerImage,
    } = req.body;

    const regPhone = /^\d{2,4}-\d{3,4}-\d{4}$/;
    if(!regPhone.test(phone)
        || !address
        || !storeType
        || !priceRange
        || !parkingInfo
        || !closedDays
        || !menuItems
        || !bannerImage
    ){return res.status(400).json({ error: '입력하지 않은 값이 존재합니다.' });}
   
    await Store.create({
        name,
        address,
        storeType,
        phone,
        menuItems: [],
        priceRange,
        parkingInfo,
        businessHours,
        closedDays,
        bannerImage,
        starRating: 0,
        viewCount: 0,
        reviews: [],
        storeLikes: [],
    }); 
    return res.status(201).json({ message: '가게 정보가 등록되었습니다.' });
};

// 가게 검색하는 경우(기본 정렬 적용)
async function searchStores (req, res) {
    const keyword = req.query

    if (keyword) {
        const searchStoreList = await Store.find({
            $or: [
                { 'name': { $regex: keyword, $options: 'i' } },
                { 'address.city': { $regex: keyword, $options: 'i' } },
                { 'address.street': { $regex: keyword, $options: 'i' } },
                { 'address.state': { $regex: keyword, $options: 'i' } },
                { 'storeType': { $regex: keyword, $options: 'i' } }
            ]
        });
        // searchStoreList.sort(async (a, b) => {
        //     if (starRating) {
        //         return b.starRating - a.starRating;
        //     } else if(Review.reviews){
        //         return b.Review.reviews.length - a.Review.reviews.length;
        //     } else if(storeLikes){
        //         return b.User.storeLikes.length - b.User.storeLikes.length;
        //     }
        // });
        res.json({ searchStoreList });
    } else {
        res.json({ searchStoreList: [] });};
}

// 맛집찾기 필터(업종, 지역)
async function filterStores(req, res) {
    const typeFilter = req.query.type;
    const regionFilter = req.query.region;

    const filter = {};

    if (typeFilter) {
        filter.storeType = typeFilter;
    };
    if(regionFilter) {
        const subRegions = regionFilter.split('/');

        // filter['Address.city'] = subRegions[0];

        if(subRegions.length > 1){
            // filter['Address.state'] = subRegions[1];
        }
    }
    // 필터 조건에 따른 가게 리스트 가져오기
    // let filterStoreList = await Store.find(filter);

    // 가게 리스트 기본 정렬: 1. 별점순, 2. 리뷰순, 3. 좋아요순
    // filterStoreList.sort(async (a, b) => {
    //     if (starRating) {
    //         return b.starRating - a.starRating;
    //     } else if(Review.reviews){
    //         return b.Review.reviews.length - a.Review.reviews.length;
    //     } else if(storeLikes){
    //         return b.User.storeLikes.length - b.User.storeLikes.length;
    //     }
    // });
    // res.render('storesearch', { filterStoreList: filterStoreList });
    // res.json({ filterStoreList })
    // 임시로 res 사용
    res.send()
};

module.exports = { checkStore, createStore, searchStores, filterStores }

// 임시데이터
// let stores = [
// {
//     "name": "스타벅스 본사",
//     "address": [{
//         "street": "퇴계로 100 9층",
//         "city": "서울",
//         "state": "중구",
//         "zipCode": "04631",
//         "latitude": 496227,
//         "longitude": 1128062
//     }],
//     "storeType": "커피.디저트",
//     "phone": "1522-3232",
//     "menuItems": [
//         {"itemName": "아메리카노", "itemPrice": "4500원"},
//         {"itemName": "콜드브루", "itemPrice": "5000원"},
//         {"itemName": "돌체라떼", "itemPrice": "5500원"}
//     ],
//     "priceRange": "5천원대",
//     "parkingInfo": "무료주차",
//     "businessHours": ["09", "30", "10", "00"],
//     "closedDays": ["연중무휴"],
//     "bannerImage": "public/image/ex1.png"
// },
// {
//     "name": "민락돼지국밥",
//     "address": [{
//         "street": "광안해변호277번길 28-13",
//         "city": "부산",
//         "state": "수영구",
//         "zipCode": "48287",
//         "latitude": 983940,
//         "longitude": 466520
//     }],
//     "storeType": "한식",
//     "phone": "051-754-2988",
//     "menuItems": [
//         {"itemName": "돼지국밥", "itemPrice": "8000원"},
//         {"itemName": "살고기국밥", "itemPrice": "8000원"},
//         {"itemName": "수육", "itemPrice": "22000원"}
//     ],
//     "priceRange": "5천원대",
//     "parkingInfo": "무료주차",
//     "businessHours": ["09", "30", "10", "00"],
//     "closedDays": ["연중무휴"],
//     "bannerImage": "public/image/ex1.png"
// },

// ]