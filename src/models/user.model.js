const mongoose=require('mongoose');


//schema created 
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is required"],
        trim:true,
        lowercase:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Invalid Email Format"],
        unique:[true,"Email already exists"]
    },
    name:{
        type:String,
        required:[true,"Username required"]
    },
    password:{
        type:String,
        required:[true,"Password required"],
        match:[/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,"Invalid Password Format"],
        minlength:[8,"At least 8 char needed"],
        select:false
    }
},
{
    timestamps:true 
})

// this function runs before saving a new user to check if the password changed and hashed
userSchema.pre("save",async function(next) {
    if(!this.isModified("password")){
        return next()
    }
    const hashed=bcrypt.hash(this.password,10)
    this.password=hashed
    return next()
})

// this funtion is to compare the hashed password are same or not
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(this.password,password)
}

//Creating Model 

const userModel=mongoose.model("user",userSchema)

module.exports=userModel