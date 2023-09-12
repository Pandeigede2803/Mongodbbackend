const Products = require('../models/product');
const {validationResult} = require ('express-validator')


//menambahkan product KE DATABASE
exports.postAddProduct = (req,res,next)=>{
const title = req.body.title;
const price = req.body.price;
const description = req.body.description;
const imageUrl = req.body.imageUrl;
const category = req.body.category;
const color = req.body.color;


//VALIDASI INPUT DATA BERDASARKAN ROUTER DI ADMIN
const errors = validationResult(req)
if(!errors.isEmpty()){
    const error = new Error ("VALIDASI TIDAK BERHASIL BRO INPUT SALAH")
    error.statusCode = 442
    res.send({gagal: error})
}
console.log(errors)
// console.log(req.user)


const product = new Products({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    category: category,
    color: color,
    userId: req.user,
});
product
.save()
.then((result)=>{
    //console.log(result);
    console.log("PRODUCT BERHASIL DIBUAT CUK");
res.json(result);
})
.catch((err)=> {
    console.log(err)
});
};

//narik data berdasarkan title

exports.getProducts = (req, res, next) => {
    const search = req.query.search;
    if (search) {
        // Products.find({title: {$regex: search}},"title")
        Products.find()
        .select("title price -_id")
        .where("title")
        .equals(search)
        .then((result)=>{
            res.json(result);
            console.log(`sukses : ${result}`);
        })
        .catch((err)=>{})
    } else {
        Products.find()
        .then((result)=>{
            res.json(result);
            console.log("sukses2")
        })
        .catch((err)=>console.log(err));
    }
};

//getproducts berdasarkan query

exports.getProducts = (req,res,next) => {
    const search = req.query.search;
    const price = req.query.price;
    

    let myquery = Products.find().select("title price -_id");

    if (search) {
        //dimana data title = $regex search
        myquery.where("title").equals({$regex:search});
    }
    if(price) {
        myquery.where("price").gt(price);
    }

    myquery
    .populate('userId', 'name email -_id')
    .then((result)=>{
        res.json(result);
    })
    .catch((err)=>console.log(err));
};

// productController.js


exports.getProductsByPrice = (req, res) => {
    const { minPrice,maxPrice} = req.body; // Dapatkan nilai minPrice dan maxPrice dari body permintaan
  
    // Buat objek kriteria pencarian berdasarkan rentang harga
    const priceQuery = {
      $gte: minPrice, // Lebih besar dari atau sama dengan minPrice
      $lte: maxPrice, // Lebih kecil dari atau sama dengan maxPrice
    };
  
    // Mencari produk berdasarkan rentang harga
    Products.find({ price: priceQuery })
      .then((products) => {
        if (products.length === 0) {
          return res.status(404).json({ message: 'Tidak ada produk yang memenuhi filter harga' });
        } else {
          return res.status(200).json({ message: 'Produk yang memenuhi filter harga ditemukan', products });
        }
      })
      .catch((err)=>console.log(err));
  };


  //GET PRODUCT BASE ON CATEGORY

  // productController.js



exports.getProductsByCategory = (req, res) => {
  const { category } = req.body; // Dapatkan nilai category dari body permintaan

  // Mencari produk berdasarkan kategori
  Products.find({ category })
    .then((products) => {
      if (products.length === 0) {
        return res.status(404).json({ message: 'Tidak ada produk dengan kategori yang dimaksud' });
      } else {
        return res.status(200).json({ message: 'Produk dengan kategori yang dimaksud ditemukan', products });
      }
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ message: 'Terjadi kesalahan server' }); // Menangani kesalahan server
    });
};

exports.getProductsByColor = (req, res) => {
    const { color } = req.body; // Dapatkan nilai color dari body permintaan
  
    // Mencari produk berdasarkan warna
    Products.find({ color })
      .then((products) => {
        if (products.length === 0) {
          return res.status(404).json({ message: 'Tidak ada produk dengan warna yang dimaksud' });
        } else {
          return res.status(200).json({ message: 'Produk dengan warna yang dimaksud ditemukan', products });
        }
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan server' }); // Menangani kesalahan server
      });
  };