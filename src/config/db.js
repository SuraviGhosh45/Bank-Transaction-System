require('dotenv').config();
const mongoose = require('mongoose');


async function connectDB() {

    try {
        
        await mongoose.connect(process.env.Mongo_URL);
        console.log("now Connected with MongoDB");

    } catch (error) {

        console.log(error.message);
        process.exit(1);

    }

}

module.exports = connectDB