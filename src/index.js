import express from 'express';
import mongoose from "mongoose";
import dotenv from 'dotenv'
import authRoute from '../src/routes/authRoute.js'
dotenv.config();


const app=express()

app.use(express.json())
//! Database 
const db= async()=>{
    try {
        await mongoose.connect(process.env.CLUSTER)
        console.log(`db is connected`);
    } catch (error) {
        console.log(`Error in mongodb${error}`);
    }
}
db();
//! Routes 
app.use('/',authRoute);

app.listen(8080,()=>{
    console.log(`Server is running at ${8080}`);
})
