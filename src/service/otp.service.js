require('dotenv').config();
const otpGenerator = require('otp-generator');
// Import the secure mailing function from email.service.js file
const { sendEmail } = require('./email.service'); 

/**
 * Generates a numeric 6-digit OTP
 */
const generatOTP=()=>{
    otpGenerator.generate(6,{
    upperCaseAlphabets:false,
    lowerCaseAlphabets:false,
    specialChars:false});
}

/**
 * Sends the OTP using the existing OAuth2 logic from email.service.js
 */

const sendOTPEmail=async(email,otp)=>{
    try{
        const subject = "Your Secure Bank Verification Code";
    const text = `Your OTP is ${otp}. It expires in 10 minutes.`;
    
    const html = `
        <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
            <h2 style="color: #1a73e8;">Verification Required</h2>
            <p>Please use the following code to verify your identity. This code is valid for <strong>10 minutes</strong>.</p>
            <div style="font-size: 24px; font-weight: bold; background: #f4f4f4; padding: 10px; text-align: center; border-radius: 5px; color: #333;">
                ${otp}
            </div>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">If you did not request this, please ignore this email.</p>
        </div>
    `;

    // Use the shared sendEmail function (OAuth2) instead of creating a new transporter
    return await sendEmail(email,subject,text,html);
    }
    catch(error){
        console.log("Error during Sending OTP is",error.message);
    }
}
module.exports={
    generatOTP,
    sendEmail
}