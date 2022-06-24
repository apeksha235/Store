const express = require('express');
const router = express.Router();
const {home} = require('../controller/home_controller')

router.route('/').get(home);

module.exports = router;