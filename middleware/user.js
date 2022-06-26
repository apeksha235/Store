const User = require("../models/user");
const BigPromise = require('../middleware/bigPromise');
const customError = require('../utils/customError');

exports.isLoggedIn = BigPromise(async (req,res,next) =>
{
    const token = req.cookie.token || req.header("Authorization").replace('Bearer','');
    //req.body.token
    if(!token)
    {
        return next(new customError("No token is found",400));
    }
    const decoded = jwt.verify(token,process.env.JWT_CODE);
    req.user = await User.findById(decode.id);
    next();
});

exports.userRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new customError("Not authorised", 403))
        }
        next();
    };
};