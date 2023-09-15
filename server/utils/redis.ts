import { config } from 'dotenv';
const Redis = require ('ioredis')
require('dotenv').config();



const redisClient =()=>{
    if(process.env.REDIS_URL){
        console.log('redis connected')
        return process.env.REDIS_URL
    }else{
        throw new Error ('redis connection fail')
    }
};

export const redis = new Redis(redisClient())