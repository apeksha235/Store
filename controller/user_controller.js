const User = require('../models/user');
const BigPromise = require('../middleware/bigPromise');
const customError = require('../utils/customError');
const cookietoken = require('../utils/cookietoken');
const emailh = require('../utils/emailh');
const cloudinary = require('cloudinary');


exports.signup = BigPromise(async (req, res, next) => {
   let result;
   if (req.files) {
      let file = req.files.dp;
      cloudinary.v2.uploader.upload(file.tempFilePath, {
         folder: "users",
         width: 150,
         crope: "scale"
      })
   }

   const { name, email, password } = req.body;
   if (!email || !name || !password) {
      return next(new customError("Some fields are missing", 400));
   }

   const newuser = await User.create({
      name,
      email,
      password,
      dp: {
         id: result.public_id,
         secure_url: result.secure_url
      },
   });
   //add flash of user created, registered
   cookietoken(newuser, res)
});

exports.login = BigPromise(
   async (req, res, next) => {
      const { email, password } = req.body;
      if (!email || !password) {
         return next(new customError("Some fields are missing", 400));
      }

      const user = await User.findOne({ email }).select("+password");
      if (!user) {
         return next(new customError("Please register , user not found ", 400));
      }

      const Pcorrect = await user.passVal(password);
      if (!Pcorrect) {
         return next(new customError("Invalid email or password", 400));
      }
      cookietoken(newuser, res)

   });

exports.logout = BigPromise(
   async (req, res, next) => {
      res.cookie("token", null, {
         expires: new Date(Date.now()),
         httpOnly: true,
      });
      res.status(200).json({
         success: true,
         message: "Logout success"
      });
   });

exports.userInfo = BigPromise(async (req, res, next) => {
   let user = await User.findById(req.user.id);
   res.status(200).json({
      success: true,
      user
   });
});

exports.updateuserInfo = BigPromise(async (req, res, next) => {
   const updatedata = {};
   if (req.files.dp) {
      const user = await User.findById(req.user.id);
      const imageid = user.dp.id;
      const resp = await cloudinary.v2.uploader.destroy(imageid);
      const result = await cloudinary.v2.uploader.upload(req.file.dp.tempFilePath, {
         folder: "users",
         width: 150,
         crope: "scale"
      });

      updatedata.dp = {
         id: result.public_id,
         secure_url: result.secure_url
      }
   }
   updatedata = {
      name: req.body.name,
      email: req.body.email,
   }

   
   let user = await User.findByIdAndUpdate(req.user.id, updatedata, {
      new: true,
      runValidators: true,
   });

   res.status(200).json({
      success: true,
      user
   });
});

exports.updatepassword = BigPromise(async (req, res, next) => {
   // const { token } = req.params.token;

   // const Etoken = crypto.createHash('sha256').update(fpts).digest('hex');
   // const user = await User.findOne({
   //    Etoken,
   //    forgotpass_expiry: { $gt: Date.now() }
   // })
   // if (!user) {
   //    return next(new customError("Token is invalid or expired ", 400));
   // }
   // if (req.body.password !== req.body.confirmPassword) {
   //    return next(
   //       new CustomError("password and confirm password do not match", 400)
   //    ); I
   // }
   // user.password = req.body.password;
   // user.forgotPasswordToken = undefined;
   // user.forgotPasswordExpiry = undefined;

   const user = await User.findById(req.user.id).select("+password");
   if (!user) {
      return next(new customError("Token is invalid or expired ", 400));
   }

   correctP = await user.passVal(req.body.password)
   if (!correctP) {
      return next(new customError("Incorrect password", 400));
   }

   if (req.body.newpassword !== req.body.confirmPassword) {
      return next(
         new CustomError("password and confirm password do not match", 400)
      ); I
   }
   user.password = req.body.newpassword;

   await user.save();
   cookietoken(user, res);

});

exports.forgotpassword = BigPromise(
   async (req, res, next) => {

      const { email } = req.body;
      if (!email) {
         return next(new customError("Some fields are missing", 400));
      }

      const user = await User.findOne({ email }).select("+password");
      if (!user) {
         return next(new customError("Please register , user not found ", 400));
      }
      const forgotToken = user.FPtoken();
      await user.save({ validateBeforeSave: false });

      const myUrl =`${req.protocol}://${req.get("host")}/api/v1/password/reset/${forgotToken}`
      const message =`<p>Verify your email address to complete the password reset.</p><p>This link
        <b>expires in 20 min </b>.</p > <p> Press <a href="${myUrl}"> here </a> to proceed.</p>`

      try {
         await emailh({
            email:user.email,
            message:message
         })
      } catch (error) {
         user.forgotpasstoken = undefined;
         user.forgotpass_expiry = undefined;
         await user.save({ validateBeforeSave: false });
         return next(new customError(error.message,500))
      }
      res.status(200).json({
         success: true,
         message: "Resent Email sent"
      });
   });

exports.passwordR = BigPromise(async (req, res, next) => {
   const { token } = req.params.token;

   const Etoken = crypto.createHash('sha256').update(fpts).digest('hex');
   const user = await User.findOne({
      Etoken,
      forgotpass_expiry:{$gt: Date.now()}
   })
   if (!user) {
      return next(new customError("Token is invalid or expired ", 400));
   }
   if (req.body.password !== req.body.confirmPassword) {
      return next(
         new CustomError("password and confirm password do not match", 400)
      ); I
   }
   user.password = req.body.password;
   user.forgotPasswordToken = undefined;
   user.forgotPasswordExpiry = undefined;

   await user.save();
   cookietoken(user,res)
});

