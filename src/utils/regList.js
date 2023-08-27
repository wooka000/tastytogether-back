// 전화번호 정규식 함수
const regPhone = /^\d{2,4}-\d{3,4}-\d{4}$/;
const isValidPhoneNumber = (phoneNumber) => regPhone.test(phoneNumber);

const regHour = /^(0\d|1[0-2])$/;
const isValidHour = (hour1, hour2) => regHour.test(hour1) && regHour.test(hour2);

const regMinute = /^[0-5]\d$/;
const isvalidMinute = (minute1, minute2) => regMinute.test(minute1) && regMinute.test(minute2);

module.exports = { isValidPhoneNumber, isValidHour, isvalidMinute };
