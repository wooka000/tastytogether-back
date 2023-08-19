const { Store, MenuItems } = require('../data-access');

const editStoreDetail = async (
    storeId,
    newPhone,
    menuNames,
    menuPrice,
    newPriceRange,
    newParkingInfo,
    newBusinessHours,
    newClosedDays,
) => {
    const result = await Store.findOneAndUpdate(
        { storeId },
        {
            phone: newPhone,
            priceRange: newPriceRange,
            parkingInfo: newParkingInfo,
            businessHours: newBusinessHours,
            closedDays: newClosedDays,
        },
    );
    if (!result) {
        const error = new Error('서버 오류 발생');
        error.statusCode = 500;
        throw error;
    }
    const menuList = result.menuItems;
    await Promise.all(
        menuList.map((id, idx) =>
            MenuItems.findOneAndUpdate(
                { id },
                {
                    itemName: menuNames[idx],
                    itemPrice: menuPrice[idx],
                },
            ),
        ),
    ).catch(() => {
        const error = new Error('서버 오류 발생');
        error.statusCode = 500;
        throw error;
    });
};

module.exports = { editStoreDetail };
