import { Request,Response, NextFunction } from "express";
import UserModel from "../models/user-model";
import ErrorHandler from "../utils/ErrorHandler";
import { catchAsyncError } from "../middleware/catchAsyncError";
import jwt,{Secret} from 'jsonwebtoken'
import ejs from 'ejs'
import path from "path";
require('dotenv').config()




//registering new user

interface IRegistrationBody{
    name:String;
    email:String;
    password:String;
    avatar?:String;
}

export const registrationUser =catchAsyncError(async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const {name,email,password} = req.body;

        const isEmailExist = await UserModel.findOne({email})
        if(isEmailExist){
            return next (new ErrorHandler("email already exist",400))
        }
        const user : IRegistrationBody={
            name,
            email,
            password
        };

        const activationToken = createActivationToken(user)
        const activationCode = activationToken.activationCode

        const data={user:{name:user.name},activationCode};
        const html =await ejs.renderFile(path.join(__dirname,""))

        
    } catch (error:any) {
        return next (new ErrorHandler (error.message,400))
    }
})


interface IActivationToken{
    token:String;
    activationCode:String;
}

export const createActivationToken=(user:any): IActivationToken=>{
    const activationCode = Math.floor(100+Math.random()*9000).toString();

    const token = jwt.sign({
        user,activationCode
    },
    process.env.ACTIVATION_SECRET as Secret,
    {
        expiresIn:"5m",
    });
    return {token, activationCode}
}