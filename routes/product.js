const express = require('express');
const { addprod, allprod, oneprod, updateprod, deleteprod, addreview, deletereview } = require('../controller/product_controller');
const router = express.Router();
const { isLoggedIn,userRole } = require('../middleware/user');

router.route('/products').get(isLoggedIn,allprod);
router.route('/product/add').get(isLoggedIn, userRole('admin'), addprod)
   // .put(isLoggedIn, userRole('admin'), updateuser).delete(isLoggedIn, userRole('admin'), deleteUser)
router.route('/product/:id').get(oneprod).put(isLoggedIn, userRole('admin'), updateprod).delete(isLoggedIn, userRole('admin'), deleteprod);
router.route('/product/:id/review').get(isLoggedIn, addreview).delete(isLoggedIn,deletereview);


module.exports = router;