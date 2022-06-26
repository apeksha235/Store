require('dotenv').config();
const mongoose = require('mongoose');
const validator = require('validator');
const { Schema } = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const jwt = require('jsonwebtoken');


const userschema = new Schema({
    name: {
        type: String,
        required: ['true', "name can't be empty"],
        maxlength: [100, "Enter name less than 100 character"]
    },
    email: {
        type: String,
        required: ['true', "email can't be empty"],
        validate: [validator.isEmail, "Please enter a correct Email"],
        unique: true,
    },
    password: {
        type: String,
        required: ['true', "Password can't be empty"],
        minlength: [6, "Password should be min 6 characters"],
        //validate: [validator.isStrongPassword([password, minlength = 6]), "Please enter a correct Email"],
        select: false,
    },
    role: {
        type: String,
        default: 'user',
        select: false
    },
    dp: {
        id: {
            type: String,
        },
        secureUrl: {
            type: String,
        }
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    //forgot password token 
    forgotpasstoken:String,
    forgotpass_expiry: Date,

})

userschema.methods.passVal = async function (upassword) {
    return await bcrypt.compare(upassword, this.password);
}

userschema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10)
});

userschema.methods.createjwt = async function () {
    return await jwt.sign({
        userid: userschema._id
    },
        process.env.JWT_CODE,
        {
            expiresIn: process.env.JWT_E
        });
}

// forgot password token 
userschema.methods.FPtoken = async function () {
    var fpts = crypto.randomBytes(20).toString('hex'); // random string //send user

    const ftpt = crypto.createHash('sha256').update(fpts).digest('hex');//hash // store in db

    this.forgotpass_expiry = Date.now() + 20 * 60 * 60 * 1000;
    return ftpt;
}

module.exports = mongoose.model('users', userschema);