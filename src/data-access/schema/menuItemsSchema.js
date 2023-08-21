const mongoose = require('mongoose');

const { Schema } = mongoose;

const MenuItemsSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        price: {
            type: String,
            required: true,
        },
    },
    {
        collection: 'MenuItems',
    },
);

module.exports = MenuItemsSchema;
