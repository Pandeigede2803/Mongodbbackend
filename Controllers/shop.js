const Product = require ('../models/product');
const axios = require('axios');
const User = require('../models/user'); 

exports.postItemCart = (req,res,next) => {

    //ngambil data dari post pakai productId di key
    const prodId = req.body.productId
    Product.findById(prodId).then(resProduct =>{
        return req.user.addToCart(resProduct)
    }).then(resultAdd => {
        res.json(resultAdd)
    }).catch(err=>console.log(err));
};

exports.getCategories = (req, res,next) => {
    axios.get('https://63cdf885d2e8c29a9bced636.mockapi.io/api/v1/categories')
    .then(response=>{
        let result= response.data
        // res.json(response.data);
        res.json(result)
    })
    .catch(error => console.log(error))
    // getCategories().then(response=>{
    //     res.json(response.data)
    // }).catch(error => console.log(error))
};

// async function getCategories(){
//     try{
//         const resp = await axios.get('https://63cdf885d2e8c29a9bced636.mockapi.io/api/v1/categories')
//         return resp
//     }catch(error){
//         console.log(error)
//     }
// }


//FIND CART BASE ON USERID

// cartController.js

// Impor model User atau sesuaikan dengan model yang Anda gunakan

exports.getCartByUserId = (req, res) => {
  const userId = req.body.userId; // Mengambil userId dari parameter URL

  // Mencari user berdasarkan userId
  User.findOne({ _id: userId })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User tidak ditemukan' });
      }

      const cart = user.cart; // Mengambil keranjang dari properti 'cart' dalam dokumen user

      if (!cart) {
        return res.status(404).json({ message: 'Keranjang tidak ditemukan' });
      }

      return res.status(200).json(cart);
    })
    .catch(error => console.log(error))
};

