const express = require('express');
const router = express.Router();
const { signup,login,logout,forgotpassword, passwordR, userInfo, updatepassword, updateuserInfo} = require('../controller/user_controller');
const { isLoggedIn } = require('../middleware/user');

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/user').get(isLoggedIn,userInfo);
router.route('/user/update').post(isLoggedIn,updateuserInfo);
router.route('/updatepassword').post(updatepassword);
router.route('/forgotpassword').post(forgotpassword);
router.route('/password/reset/:token').post(passwordR);

module.exports = router;