const User = require('../models/user');
const BigPromise = require('../middleware/bigPromise');
const customError = require('../utils/customError');
const cloudinary = require('cloudinary');

exports.alluser = BigPromise(async (req, res, next) => {
    users = await User.find();
    res.status(200).json({
        success: true,
        users
    });
});

exports.oneUser = BigPromise(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        next(new CustomError("No user found", 400));
    }
    res.status(200).json({
        success: true,
        user,
    });
});

exports.updateuser = BigPromise(async (req, res, next) => {
    const updatedata = {};
    // if (req.files.dp) {
    //     const user = await User.findById(req.user.id);
    //     const imageid = user.dp.id;
    //     const resp = await cloudinary.v2.uploader.destroy(imageid);
    //     const result = await cloudinary.v2.uploader.upload(req.file.dp.tempFilePath, {
    //         folder: "users",
    //         width: 150,
    //         crope: "scale"
    //     });
    //     updatedata.dp = {
    //         id: result.public_id,
    //         secure_url: result.secure_url
    //     }
    // }
    updatedata = {
        name: req.body.name,
        email: req.body.email,
        role:req.body.role
    }


    user = await User.findByIdAndUpdate(req.params.id, updatedata, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true
    });
});

exports.deleteUser = BigPromise(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        next(new customError("No user found", 400));
    }
    const imageid = user.dp.id;
    await cloudinary.v2.uploader.destroy(imageid);
    user.remove();
    res.status(200).json({
        success: true
    });
});