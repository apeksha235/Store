const express = require('express');
const { alluser, oneUser, updateuser, deleteUser } = require('../controller/admin_controller');
const router = express.Router();
const { isLoggedIn, userRole } = require('../middleware/user');

router.route('/users').get(isLoggedIn,userRole('admin'),alluser);
router.route('/users/:id').get(isLoggedIn, userRole('admin'), oneUser)
    .put(isLoggedIn, userRole('admin'), updateuser).delete(isLoggedIn, userRole('admin'), deleteUser)


module.exports = router;