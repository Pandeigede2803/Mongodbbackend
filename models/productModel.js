//INI CARA UNTUK MEMBUAT SEBUAH MODEL DATABASE DI MONGODB

const mongoose = require('mongoose');

//BUAT SEBUAH MODEL DATABASE
const productSchema = mongoose.Schema(

    {
        name:{
            type: String,
            //ditambahkan required ketika true berarti data harus wajib
            required: [true, "please enter PRODUCT FUCKN NAME"]
        },
        quantity:{
            type: Number,
            required: [true]
        },
        price: {
            type: Number,
            required:true,
        },
        description: {
            type: Number,
            required:true,
        },
        image:{
            type: String,
            //ketika false berarti data tidak wajib
            required: [false]
        },
    },
    {
        timestamps: true,
    }
)

const Product = mongoose.model('Product',productSchema);

module.exports = Product;