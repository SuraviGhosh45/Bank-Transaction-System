const app=require('./src/app');


let port=3000;
app.listen(port,()=>{
    console.log("Server is running on Port",port);
})