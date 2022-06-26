require('dotenv').config;
const { urlencoded } = require('express');
const express = require('express');
const app = express();
const morgan = require('morgan');
const fileupload = require('express-fileupload');


//routes import
const home = require('./routes/home');
const user = require('./routes/user');
const admin = require('./routes/admin');
const product = require('./routes/product');

//middleware 
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileupload({
    useTempFiles:true,
    tempFileDir: "/temp/"
}))


//routes 
app.use('/api/v1', home);
app.use('/api/v1', user);
app.use('/api/v1', product);
app.use('/api/v1/admin', admin);


module.exports = app;