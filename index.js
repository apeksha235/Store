const app = require('./app');
require('dotenv').config();
const connectdb = require('./configs/db');
const cloudinary = require('cloudinary');

connectdb();//database connection

cloudinary.config({
    cloud_name: process.env.CN_NAME,
    api_key: process.env.CN_API_KEY,
    api_secret: process.env.CN_API_SECRET,
})

app.listen(process.env.PORT, () => {
    console.log(`Server running at ${process.env.PORT}`);
});
