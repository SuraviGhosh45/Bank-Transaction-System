const mongoose=require('mongoose');

async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.Mongo_URI);
        console.log("DB Connected");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); 
    }
}

module.exports=connectDB;