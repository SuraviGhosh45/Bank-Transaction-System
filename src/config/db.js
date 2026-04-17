const mongoose=require('mongoose');



async function connectDB() {

    await mongoose.connect(process.env.Mongo_URL);
    console.log("now Connected with MongoDB");
    
}