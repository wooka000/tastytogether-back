const mongoose = require('mongoose');
const MenuItemsSchema = require('../schema/menuItems');

exports.MenuItems = mongoose.model('menuItems', MenuItemsSchema);
