// 전화번호 정규식 함수
const regPhone = /^\d{2,4}-\d{3,4}-\d{4}$/;
const isValidPhoneNumber = (phoneNumber) => regPhone.test(phoneNumber);

module.exports = isValidPhoneNumber