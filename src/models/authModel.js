import mongoose from "mongoose";

const authSchema=new mongoose.Schema({
    name:{type:String,require:true,trim:true},
    email:{type:String,require:true,trim:true},
    phone:{type:String,require:true,trim:true},
    password:{type:String,require:true,trim:true},
    otp:{type:String,require:true,trim:true},
    isActive:{type:Boolean,default:false},
},{timestamps:true})

export default mongoose.model('auth',authSchema)
