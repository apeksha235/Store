const mongoose = require('mongoose');
const { MONGODB_URL } = process.env;

connectdb = () => {
    mongoose.connect(MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() =>{
        console.log("DB connected");
    }).catch((err) => {
        console.log("Db connection failed" + err.message);
        process.exit(1);
    });
};

module.exports = connectdb;