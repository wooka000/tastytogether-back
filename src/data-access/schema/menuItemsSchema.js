const mongoose = require('mongoose');

const { Schema } = mongoose;

const MenuItemsSchema = new Schema({
  itemName: {
    type: String,
    required: true,
  },
  itemPrice: {
    type: String,
    required: true,
  },
}, {
    collection: 'MenuItems',
});

module.exports = MenuItemsSchema;


