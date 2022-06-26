const nodemailer = require("nodemailer");
const user = require("../models/user");

const mailhelper = async (options) => {

    var transporter = nodemailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.PORT,
        auth: {
            user: process.env.SMPT_USER,
            pass: process.env.SMPT_PASS
        }
    });

    // send mail with defined transport object
    await transporter.sendMail({
        from: 'hrisik_project@git.dev', // sender address
        to: options.email, // list of receivers
        subject: "Password Email",
        html: options.message
    });
}

module.exports = mailhelper;