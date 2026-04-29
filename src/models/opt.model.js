const  mongoose=require('mongoose');


const otpSchema=new mongoose.Schema({
    email:{
        type:String,
        required: [true, "Please Enter Your Name"],
        trim: true
    },
    otp:{
        type:String,
        required:[true,"Please Enter OTP"]
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:600 // Automatically deletes after 10 minutes
    }
});

module.exports = mongoose.model('OTP', otpSchema);