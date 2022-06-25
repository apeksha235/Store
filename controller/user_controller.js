const User = require('../models/user');
const BigPromise = require('../middleware/bigPromise');
const customError = require('../utils/customError');

exports.signup = BigPromise(async (req, res,next) => {
   const {name,email,password}=req.body;
   if(!email || !name || !password)
   {
      return next(new customError("Some fields are missing",400));
   }

   const newuser = await User.create({
      name,
      email,
      password,
   });
   //add flash of user created, registered
   newuser.save()
   const token = newuser.createjwt();
   
   const options = {
      expires: new Date(
      Date.now() + 3 * 24 * 60 * 60 * 1000
   ),
   httpOnly: true
   }
   
   res.status(200).cookie('token',token,options).json({
      success: true,
      token,
      user
   })



});