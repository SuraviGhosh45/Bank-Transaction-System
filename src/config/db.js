const mongoose = require('mongoose')


async function connectDB() {

    try {

        await mongoose.connect(process.env.MONGO_URL)
        console.log("DB connected.");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Stop the app if it can't connect
    }

}

module.exports = connectDB
