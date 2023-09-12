const express = require('express')
const mongoose = require('mongoose')
const app = express();
const Product = require('./models/productModel')


//PAKAI INI UNTUK TEST API DENGAN JSON
app.use(express.json());

//PAKAI INI AGAR KITA BISA PAKAI FORM UNTUK TEST API
app.use(express.urlencoded({ extended: false }));

const url = "mongodb+srv://dedesudiahna:Sudiahna21@cluster0.eldpxem.mongodb.net/?retryWrites=true&w=majority";


async function connect() {
    try{
        await mongoose.connect(url);
        console.log("BERHASIL CONNECT KE MONGODB CUK")
    } catch (error) {
        console.error(error);
    }
}
//routes

app.get("/",(req, res)=>{
    res.send("<H1>HELOO MOTHERFUCKER NODE</H1>")
}),
app.get("/about",(req, res)=>{
    res.send("HELOO MOTHERFUCKER  NODE ITS ABOUT PAGE")
}),

//KITA AKAN BUAT ROUTER UNTUK MEMPOSTING SEBUAH DATA KE DATABASE MONGO
// app.post('/product',(req,res)=>{
//     console.log(req.body),
//     res.send(req.body)
// }),

//CARA POSTING DATA DI DATABASE MONGO
app.post('/product',async(req,res)=>{
    try{
        const product = await Product.create(req.body)
        res.status(200).json(product),
        console.log("Successfully created product CUK")

    } catch(error){
        console.log(req.body),
        res.status(500).json({message:error.message})

    }
    
}),

//CARA MENDAPATKAN DATA = GET DI DATABASE

app.get('/products',async(req,res)=>{
    try{
        const products = await Product.find({});
        res.status(200).json({products});
        console.log("berhasil di fetch")

    } catch(error){
        res.status(500).json({message:error.message})
    }
})

//CARA MENDAPATKAN DATA DENGAN ID TERTENTU

app.get('/products/:id',async(req,res)=>{
    try{
        const {id} = req.params;
        const products = await Product.findById(id);
        res.status(200).json({products});
        console.log(`berhasil di fetch sesuai id : ${id}`);

    } catch(error){
        res.status(500).json({message:error.message})
    }
})

//UPDATE PRODUCT

app.put('/products/:id',async(req,res)=>{
    try{
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id,req.body);

        //we can not find any product in database

        if(!product){
            return res.status(404).json({message:`cannot find any product ID ${id}`})
        }
        const updatedProduct = await Product.findById(id);
        res.status(200).json(updatedProduct);
        console.log(`berhasil di fetch sesuai id : ${id}`);

    } catch(error){
        res.status(500).json({message:error.message})
    }
})



connect();
app.listen(8000,()=>{
    console.log("SERVER STARTED DI PORT 8000 MASBRO");
});



