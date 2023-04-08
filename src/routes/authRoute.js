import express from "express";
import { loginController, registerController, registerOtpController, resendOtp } from "../controllers/authController.js";

const router=express.Router()

router.post('/register',registerController)

router.post('/register/otp',registerOtpController)

router.post('/register/resend-otp',resendOtp)

router.post('/login',loginController)

export default router;