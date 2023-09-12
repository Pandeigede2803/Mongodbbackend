// const data = "TESCROT"
// console.log(data)

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const Product = require('./models/productModel')
const cors = require('cors')
const bodyParser = require('body-parser')
const adminRouters = require('./routes/admin')
const User = require("./models/user")
const shopRouters= require('./routes/shop')
const path = require('path');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const authRoute = require("./routes/auth");

const env = require("dotenv")

const cookieParser = require ("cookie-parser");
app.use(cookieParser());

env.config();
app.use(cors());

app.use(bodyParser.json());
app.use(express.json());

// app.use(cors());
// app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());
// app.use(bodyParser.urlencoded({ extended: false }));
// const url = "mongodb+srv://dedesudiahna:Sudiahna21@cluster0.eldpxem.mongodb.net/ecommerce?retryWrites=true&w=majority";


app.use((req, res, next) => {
    User.findById('64d2453b1b2167fdac473e79').then( resUser => {
        req.user = resUser
        console.log("Product user berhasil dibuat")
        console.log(req.user)
        next()
    }).catch (err => console.log(err))
})

app.use("/auth", authRoute)
app.use("/admin", adminRouters);
app.use("/shop", shopRouters);
app.use("/images", express.static(path.join(__dirname,'images')))

mongoose.set("strictQuery",true);

mongoose.connect("mongodb+srv://dedesudiahna:Sudiahna21@cluster0.eldpxem.mongodb.net/ecommerce?retryWrites=true&w=majority").then((res)=> {
    app.listen(7000);
    console.log("sukses connect ke mongo db lewat server 7000");
})
.catch((err)=> console.error(err));


//token


//CODE JWT LOGIN
app.post('/login', (req, res) => {
    // Proses otentikasi pengguna
    // Jika otentikasi berhasil, buat JWT
    const user = {
      id: 1,
      username: 'john.doe'
    };
    const token = jwt.sign(user, 'secretKey'); // Ganti 'secretKey' dengan kunci rahasia yang lebih kuat
    
    // Kirim token sebagai respons
    res.json({ token });
  });


//CODE JWT AUTHORIZATION
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: 'Token tidak ditemukan' });
    }
  
    try {
      const decoded = jwt.verify(token, 'secretKey');
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token tidak valid' });
    }
  };
  
  app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'Halaman terproteksi' });
  });



//upload image
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    //cb singkatan dari callback
    cb(null, "images"); //'images' adalah nama folder
  },

  filename: function (req, file, cb) {
    cb(null, uuidv4() + file.originalname);
  },
});

//tentukan format file yg ingin diupload
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//middleware upload image dg multer
//image yg diupload belum multiple
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("file")
);

app.use((req, res, next) => {
  User
    .findById("64d2375cdaaf0cbb0150ec6d") //dapat dari database test tabel users
    .then((resUser) => {
      req.user = resUser;
      next();
    })
    .catch((err) => console.log(err));
});



