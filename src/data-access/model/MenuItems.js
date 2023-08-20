const mongoose = require('mongoose');
const MenuItemsSchema = require('../schema/menuItemsSchema');

exports.MenuItems = mongoose.model('menuItems', MenuItemsSchema);
