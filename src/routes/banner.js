const { Router } = require('express');
const mainController = require('../services/main');

const router = Router();

router.get('/', mainController.getBannerImage);

module.exports = router;
