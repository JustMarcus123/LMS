import { config } from "dotenv";
import { NextFunction } from "express";
import { ErrorMiddleWare } from './middleware/error';
require('dotenv').config()
const express = require ('express')
const cors = require ('cors')
const cookieParser = require ('cookie-parser') 
import userRouter from "./routes/user-routes";


export const app = express(); 

//body parser
app.use(express.json({limit:'50mb'}))


//cookie parser

app.use(cookieParser());

//cors=> cross origin resource sharing

app.use(cors({
    origin:process.env.ORIGIN
}))
//routes
app.use("api/v1",userRouter)

//testing api 

app.get('/test',(req:Request,res:Response,next:NextFunction)=>{
    
    return res.status(200).json({
        success:true,
        message:'api is working'
    });
});


//unknown routes

app.all('*',(req:Request,res:Response,next:NextFunction)=>{
    const err = new Error (`route ${req.originalURl} not found`) as any;
    err.statusCode = 400;
    next(err);
})




app.use (ErrorMiddleWare)





