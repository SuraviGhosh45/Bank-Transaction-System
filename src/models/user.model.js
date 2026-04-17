const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Your Name"],
        trim:true
    },
    email:{
        type:String,
        required:[true,"Email Required"],
        unique:[true,"This Email is Already Exits "],
        lowercase:true,
        trim:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Invalid Email Format"]
    },
    password:{
        type:String,
        required:[true,"Password  is manadatory"],
        trim:true,
        match:[/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,"Invalid Password Format"],
        minlength:[8,"At least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."],
        select:false
    }

},{
    timestamps:true
});

userSchema.pre("save",async function (next) {
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10)
    }
    next();
})

userSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(this.password,password)
}

const userModel=mongoose.model("user",userSchema);

module.exports=userModel;