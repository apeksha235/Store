const mongoose = require('mongoose')
const users = require('./user')


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please provide product name'],
        trim: true,
        maxlength: [100, 'Product name should not be more than 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'please provide the price'],
        maxlength: [5, 'Product name should not be more than 5 digits']
    },
    description: {
        type: String,
        required: [true, 'please provide description'],
        trim: true,
    },
    photos: [{
        id: {
            type: String,
        },
        secureUrl: {
            type: String,
        }
    }],
    categeory: {
        type: String,
        required: [true, 'please provide categeory'],
        enum: {
            values: [
                'a',
                'b',
                'c'
            ]
        }
    },
    //brand ?
    rating: {
        type: Number,
        default: 0
    },
    numberOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'users',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            coment: {
                type: String,
                required: true
            },
        }
    ],
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})


module.exports = mongoose.model("products",productSchema);