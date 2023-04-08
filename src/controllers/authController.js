import authModel from "../models/authModel.js";
import { sendMail, sendOtp } from "../helper/mailSender.js";
import bcrypt from "bcrypt";

//!Register Controller/////////////////////////////////////////////

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name) {
      return res.send({ error: `Name is require` });
    }
    if (!email) {
      return res.send({ error: `email is require` });
    }
    if (!phone) {
      return res.send({ error: `phone is require` });
    }
    if (!password) {
      return res.send({ error: `password is require` });
    }

    const existingAuth = await authModel.findOne({ email: email });
    if (existingAuth) {
      return res.status(200).send({
        success: false,
        message: `Already register Please login`,
      });
    }
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp=await sendOtp(name,email)
    const auth = await new authModel({
      name,
      email,
      phone,
      password: hashedPassword,
      otp
    }).save();
    res.status(201).send({
      success: true,
      message: `auth registration success`,
      auth:auth.name,
      note:`If you did't receive otp visit- http://localhost:8080/register/resend-otp`
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `error in Register`,
      error,
    });
    console.log(error);
  }
};

//!  OTP Controller/////////////////////////////////////////////

export const registerOtpController=async(req,res)=>{
  const {email,otp}=req.body;
  if (!email) {
    return res.send({ error: `email is require` });
  }
  if (!otp) {
    return res.send({ error: `otp is require` });
  }
  let auth = await authModel.findOne({ email });
  if(auth.isActive){
    return res.send({error:`Your Account is already active`})
  }
  if(otp!==auth.otp){
    return res.send({error:`otp is not valid`})
  }
  const updatedAuth=await authModel.findByIdAndUpdate(auth._id,{
    name:auth.name,
    email:auth.email,
    password:auth.password,
    phone:auth.phone,
    otp:auth.otp,
    isActive:true,

 },{new:true})
 sendMail(auth.name,auth.email);
  res.status(200).send({
    success: true,
    message: `Account activated successfully`,
    auth: {
      name: auth.name,
      email: auth.email,
      isActive: true,
    },
  });
  

}
// !resend otp Controller/////////////////////////////////////////////
export const resendOtp=async(req,res)=>{
    const {email}=req.body;
    let auth = await authModel.findOne({ email });
    if (!auth) {
      return res.status(404).send({
        success: false,
        message: `auth not found `,
      });
    }
    const otp=await sendOtp(auth.name,auth.email)

    const updatedAuth=await authModel.findByIdAndUpdate(auth._id,{
      name:auth.name,
      email:auth.email,
      password:auth.password,
      phone:auth.phone,
      otp:otp,
  
   },{new:true})
   res.status(200).send({
    success: true,
    message: `otp send successfully to ${auth.email}`,
  });


}

//!  Login Controller/////////////////////////////////////////////


export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: `Invalid email or password`,
      });
    }
    let auth = await authModel.findOne({ email });
    if (!auth) {
      const phone = email;
      auth = await authModel.findOne({ phone });
    }
    if (!auth) {
      return res.status(404).send({
        success: false,
        message: `auth not found `,
      });
    }
    if(!auth.isActive){
      return res.send({error:`Your Account is Not active`,visit:`http://localhost:8080/register/otp`})
    }
    const match = await bcrypt.compare(password, auth.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: `the password is incorrect`,
      });
    }
    // sendMail(auth.name,auth.email);
    res.status(200).send({
      success: true,
      message: `login successfully`,
      auth: {
        name: auth.name,
        email: auth.email,
        phone: auth.phone,
      },
    });
  } catch (error) {
    res.status(500).send({
      success: true,
      message: "error while login",
      error,
    });
  }
};
