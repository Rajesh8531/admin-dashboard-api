import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient()

export const singUp = async (req:Request,res:Response)=>{
    try {

        const {name,email,password} = await req.body
  
        const user = await prisma.user.findUnique({
            where : {
                email
            }
        })

        if(user){
            return res.status(401).send({error : "User already Existing"})
        }

        const hashedPassword = await bcrypt.hash(password,12)

        const newUser = await prisma.user.create({
            data : {
                email,
                hashedPassword,
                name
            }
        })

        let token = jwt.sign({name,id:newUser.id},process.env.JWT_SECRET as string,{})
        
        return res.json({
                            token,
                            id:newUser.id,
                            email:newUser.email,
                            name : newUser.name
                        })

    } catch (error) {
        console.log("SIGNUP MIDDLEWARE")
        throw new Error("Something went wrong")
    }
}

export const signIn = async (req:Request,res:Response)=>{
    try {

        const {email,password} = await req.body;

        let existingUser = await prisma.user.findUnique({
            where : {
                email
            }
        })

        if(!existingUser){
            throw new Error("User doesn't existing")
        }

        const correctPassword = await bcrypt.compare(password,existingUser.hashedPassword as string)

        if(!correctPassword) {
            throw new Error("Invalid Credentials")
        }
        
        const token = jwt.sign({name : existingUser.name,id:existingUser.id},process.env.JWT_SECRET as string,{})

        return res.status(200).json({
                                        token,
                                        id:existingUser.id,
                                        name : existingUser.name,
                                        email : existingUser.email
                                    })
        
    } catch (error) {
        console.log("SIGNIN_CONTROLLER",error)
        return res.status(500).json({message:"Something went wrong!"})
    }
}
