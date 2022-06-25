const express = require('express');
const router = express.Router();
const { signup } = require('../controller/user_controller')

router.route('/signup').post(signup);

module.exports = router;