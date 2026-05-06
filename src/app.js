const express=require('express');
const router=require('../src/router/auth.routes');
const cookieParser=require('cookie-parser');

const app=express()

//json middle ware to read data using API
    app.use(express.json())

// use the cookie-parser middle ware
app.use(cookieParser())

//middle ware for authentication to use router
app.use('/api/auth',router)


module.exports=app