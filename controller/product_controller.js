const Product = require('../models/product');
const BigPromise = require('../middleware/bigPromise');
const customError = require('../utils/customError');
const cloudinary = require('cloudinary');
const { Search } = require('../utils/search');


exports.addprod = BigPromise(async (req, res, next) => {
    let images = [];
    if (!req.files) {
        return next(new customError("upload images", 401));
    }
    for (let i = 0; i < req.files.photos.length; i++) {
        let result = await cloudinary.v2.uploader.upload(req.files.photos[i].tempFilePath, {
            folder: "products",
            width: 150,
            crope: "scale"
        });
        images.push({
            id: result.public_id,
            secure_url: result.secure_url
        });
    }

    req.body.photos = images;
    req.body.user = req.user.id;

    const prod = Product.create(req.body);

    res.status(200).json({
        success: true,
        prod
    });
})

exports.allprod = BigPromise(async (req, res, next) => {

    const prods =new Search(Product.find(),req.query).searchword().filter;
    prods.pager(6);
    prods = await prods.base
    if (!prods) {
        next(new CustomError("No products found", 401));
    }
    res.status(200).json({
        success: true,
        prods,
    });
});

exports.oneprod = BigPromise(async (req, res, next) => {
   const prod = await Product.findById(req.params.id)
    if (!prods) {
        next(new CustomError("No product found", 401));
    }
    res.status(200).json({
        success: true,
        prod,
    });
});

exports.updateprod = BigPromise(async (req, res, next) => {
    let prod = await Product.findById(req.params.id)
    if (!prods) {
        next(new CustomError("No product found", 401));
    }
    if (req.files) {
        for (let i = 0; i < req.files.photos.length; i++) {
            let result = await cloudinary.v2.uploader.destroy(prod.photos[i].id)
        }
    }
    const images=[];
    for (let i = 0; i < req.files.photos.length; i++) {
        let result = await cloudinary.v2.uploader.upload(req.files.photos[i].tempFilePath, {
            folder: "products",
            width: 150,
            crope: "scale"
        });
        images.push({
            id: result.public_id,
            secure_url: result.secure_url
        });
    }

    req.body.photos = images;
    prod = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })
    res.status(200).json({
        success: true,
        prod,
    });
});

exports.deleteprod = BigPromise(async (req, res, next) => {
    const prod = await Product.findById(req.params.id)
    if (!prods) {
        next(new CustomError("No product found", 401));
    }

        for (let i = 0; i < req.files.photos.length; i++) {
            let result = await cloudinary.v2.uploader.destroy(prod.photos[i].id)
        }
    
     await prod.remove();

    res.status(200).json({
        success: true,
    });
});

exports.addreview= BigPromise(async (req, res, next) => {
    const {rating , comment } =  req.body;
    const productId = req.params.id
    const prod = await Product.findById(productId)
    
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const AlreadyReview = prod.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    )

    if(AlreadyReview){
     prod.reviews.forEach((review)=>{
         if (review.user.toString() === req.review._id.toString()){
            review.comment = comment;
            review.rating = rating;
         }
     })
    }else{
        prod.reviews.push(review);
        prod.numberOfReviews=prod.reviews.length;
    }

    prod.rating = prod.reviews.reduce((acc, item) => item.rating + acc, 0) / prod.reviews.length
    await prod.save({validateBeforeSave: true})
    res.status(200).json({
        success: true,
        prod,
    });
});

exports.deletereview = BigPromise(async (req, res, next) => {
    const {  productId } = req.query;
    const prod = await Product.findById(productId)

    const reviews = prod.reviews.filter((review) => review.user.toString() === req.user._id.toString())
    
    const no_reviews = reviews.length

    prod.rating = prod.reviews.reduce((acc, item) => item.rating + acc, 0) / prod.reviews.length

    await Product.findByIdAndUpdate(
        productId,
        {
            reviews,
            rating,
            no_reviews,
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    res.status(200).json({
        success: true,
        prod,
    });
});