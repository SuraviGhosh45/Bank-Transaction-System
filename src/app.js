const express=require('express');
const cookieParse=require('cookie-parser');

const app=express();

const authRoute=require('./routes/auth.routes');

app.use(express.json());
app.use(cookieParse());
app.use('/api/auth',authRoute);


module.exports=app;