const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        trim: true,
        maxLength: [50, "Name cannot exceed 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Email Required"],
        unique: true, // Note: This creates a unique index in MongoDB
        lowercase: true,
        trim: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid Email Format"]
    },
    // role:{
    //     type:String,
    //     enum:['user','admin'],
    //     default:'user'
    // },
    password: {
        type: String,
        required: [true, "Password is mandatory"],
        trim: true,
        // Regex: Min 8 chars, 1 Upper, 1 Lower, 1 Number, 1 Special Char
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
        "Password must include uppercase, lowercase, number, and special character"],
        select: false // Prevents password from being returned in queries by default
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre("save", async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified("password")) {
        return ;
    };

    try {
        
        const hash = await bcrypt.hash(this.password, 10);
        this.password=hash
        return ;

    } catch (error) {
        console.log(error.message); // Pass error to Mongoose middleware
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
    // Note: 'this.password' will be undefined if not explicitly selected in the controller
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
