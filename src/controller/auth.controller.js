const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const emailService=require('../services/email.service');

/** 

 * - User Register controller 
 * - POST api/auth/register
 
*/

async function userRegistrationController(req, res) {
    try {

        const { email, name, password } = req.body

        //check if the email already registerd or not
        const Exist_Email = await userModel.findOne({ email: email })

        if (Exist_Email) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists."
            })
        }

        // user created if user not exist with email
        const user = await userModel.create({
            name, email, password
        })

        // after creating an user , we need to give a token to user
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })

        //now giving token, we need to save it in cookie
        res.cookie("token", token, {
            httpOnly: true, // Prevents JS access
            secure: process.env.NODE_ENV === 'production', // Only HTTPS in production
            maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days in milliseconds
        })

        //Sending Registration Mail
        await emailService.sendingRegistrationEmail(user.email,user.name)

        //giving response to the user
        res.status(201).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            message: "User Created Successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

/** 

 * - User Login controller 
 * - POST api/auth/login
 
*/

async function userLoginController(req, res) {
    try {

        const { email, password } = req.body

        //checking is user with email not exists
        const user = await userModel.findOne({ email }).select("+password")

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not Registerd with This Email"
            })
        }

        //if the password valid and same 

        const valid_Pass = await user.comparePassword(password)
        
        

        if (!valid_Pass) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credential"
            })
        }

        //giving token to user
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })

        // save the token in cookie
        res.cookie("token", token, {
            httpOnly: true, // Prevents JS access
            sameSite: 'strict', // Protects against CSRF
            secure: process.env.NODE_ENV === 'production', // Only HTTPS in production
            maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days in milliseconds
        })


        //giving response
        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            },
            message: "User found successfully"
        })
        //Sending Login Email
        await emailService.sendingLoginEmail(user.email,user.name);

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    userRegistrationController,
    userLoginController
}
