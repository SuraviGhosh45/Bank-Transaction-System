const app=require('./src/app');
const connectDB=require('./src/config/db');
require('dotenv').config()
const dns = require('node:dns'); 
dns.setServers(["8.8.8.8","1.1.1.1"]);

const port=3000

connectDB();
app.listen(port,()=>{
    console.log("server running in port ",port);
})