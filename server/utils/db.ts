import { config } from 'dotenv';
const mongoose =require ('mongoose')
require('dotenv').config()

const dbUrL: string=process.env.DB_URL || "";

const connectDB = async()=>{
    try {
        await mongoose.connect(dbUrL).then((data:any)=>{
            console.log(`database connected with ${data.connection.host}`)
        })
        
    } catch (error:any) {
        console.log(error.message);
        setTimeout(connectDB,5000);
    }

}

export default connectDB;