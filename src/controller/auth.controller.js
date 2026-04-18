const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registration
async function userRegistration(req, res) {
    try {
        const { email, password, name } = req.body;

        // 1. Validation: Ensure all fields are provided
        if (!email || !password || !name) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 2. Check if the Email already exists
        const isEmail_exist = await userModel.findOne({ email });
        if (isEmail_exist) {
            // IMPORTANT: Use return here to stop execution
            return res.status(422).json({
                message: "Email already Exists.",
                status: "Failed"
            });
        }

        // 3. Hashing the password (already hash the password before saving in user.model.js line no. 37) so again do not required

        // 4. Create the user (This both creates AND saves)
        const user = await userModel.create({
            name,
            email,
            password// Save the hashed version
        });

        // 5. Create a token
        const token = jwt.sign(
            { userId: user._id,role: user.role  },
            process.env.JWT_Secret,
            { expiresIn: '3d' }
        );

        // 6. Set cookie 
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
            maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days in milliseconds
        });

        // 7. Success response
        return res.status(201).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role:user.role
            },
            token,
            message: "Account created successfully"
        });

    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

//Login 

async function userLogin(req, res) {
    try {
        const { email, password } = req.body;

        // 1. Validation
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // 2. Check if user exists
        const user = await userModel
            .findOne({ email: email.toLowerCase() })
            .select('+password');

         if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }


        // 3. Verify Password

        //  Already hashed the password using bcrypt during registration(line no.37 of user.model.js)

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        
        // 4. Create Token

         const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        // 5. Set Cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3 * 24 * 60 * 60 * 1000
        });

        // 6. Send Response
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                id: user._id,
                role: user.role,
                name: user.name,
                email: user.email
            },
            token
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = {
    userRegistration,
    userLogin
};
