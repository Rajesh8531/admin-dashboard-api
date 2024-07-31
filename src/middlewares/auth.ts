import axios from 'axios';
import { NextFunction,Request,Response } from 'express'
import jwt from 'jsonwebtoken'



export interface customRequest extends Request {
    userId? : string;
    token? : string;
    name : string;
}

interface DecodedToken {
    id : string;
    name : string;
    sub? : string
}

export const auth = async (expressRequest:Request,res:Response,next:NextFunction)=>{
    try {
        
        let req = expressRequest as customRequest
        let token = req.headers.authorization?.split(' ')[1]

        if(!token){
            throw new Error("Authentication failed. Token missing")
        }

        const isJwtGenerated = jwt.decode(token,{complete:true}) !== null

        let decoded;

        if(isJwtGenerated) {
            decoded = jwt.verify(token,process.env.JWT_SECRET as string) as DecodedToken
            req.userId = decoded.id
            
        } else {
            const {data} = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`,{headers : {Authorization : `Bearer ${token}`}})
            decoded = data
            req.userId = data?.sub as string
        }
        
        req.name = decoded.name

        next()
    } catch (error) {
        console.log("AUTH_MIDDLEWARE",error)
        throw new Error("Unauthenticated")
    }
}