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

        let length = token.length < 500

        let decoded;

        if(token && length) {
            decoded = jwt.verify(token,process.env.JWT_SECRET as string) as DecodedToken
            req.userId = decoded.id
            
        } else {
            decoded = jwt.decode(token) as DecodedToken
            req.userId = decoded?.sub as string
        }
        
        req.name = decoded.name

        next()
    } catch (error) {
        console.log("AUTH_MIDDLEWARE",error)
        throw new Error("Unauthenticated")
    }
}