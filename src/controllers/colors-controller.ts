import { customRequest } from "../middlewares/auth"
import { Request,Response } from "express"
import prismadb from "../utils/prismadb"
import { isValidId } from "../utils/objectId-validator"

export const getColors = async (request:Request,res:Response) => {
    try {
        
        let req = request as customRequest

        const {storeId} = req.params

        const colors = await prismadb.color.findMany({
            where : {
                storeId
            },
            orderBy : {
                createdAt : 'desc'
            }
        })

        return res.status(200).json(colors)
        
    } catch (error) {
        console.log("GET_COLORS_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}

export const createColor = async (request:Request,res:Response) => {
    try {
        
        let req = request as customRequest

        const {storeId} = req.params

        const userId = req.userId

        const {name,value} = await req.body
        
        if(!isValidId(storeId)){
            return res.status(403).json("Invalid StoreId")
        }

        const store = await prismadb.store.findUnique({
            where : {
                id : storeId
            }
        })

        if(store?.userId !== userId) {
            return res.status(404).json("UNAUTHORIZED")
        }

        const color = await prismadb.color.create({
            data : {
                storeId,
                name,
                value
            }
        })

        return res.status(200).json(color)
        
    } catch (error) {
        console.log("CREATE_COLOR_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}

export const getColor = async (request:Request,res:Response) => {
    try {
        
        let req = request as customRequest

        const {storeId,colorId} = req.params
        
        if(!isValidId(storeId) || !isValidId(colorId)){
            return res.json(null)
        }

        const color = await prismadb.color.findUnique({
            where : {
                id : colorId,
                storeId 
            }
        })

        return res.status(200).json(color)
        
    } catch (error) {
        console.log("GET_COLOR_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}

export const updateColor = async (request:Request,res:Response) => {
    try {
        
        let req = request as customRequest

        const {storeId,colorId} = req.params

        const userId = req.userId

        const {name,value} = await req.body
        
        if(!isValidId(storeId) || !(isValidId(colorId))){
            return res.status(403).json("Invalid StoreId")
        }

        if(!name){
            return res.status(403).json("Name field Required")
        }

        const store = await prismadb.store.findUnique({
            where : {
                id : storeId
            }
        })

        if(!store){
            return res.status(404).json({message:"Store Not Found. Invalid StoreId"})
        }

        if(store.userId !== userId) {
            return res.status(404).json("UNAUTHORIZED")
        }

        const color = await prismadb.color.update({
            where : {
                storeId,
                id : colorId,
            } ,
            data : {
                storeId,
                name,
                value
            }
        })

        return res.status(200).json(color)
        
    } catch (error) {
        console.log("UPDATE_COLOR_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}

export const deleteColor = async (request:Request,res:Response) => {
    try {
        
        let req = request as customRequest

        const {storeId,colorId} = req.params

        const userId = req.userId
        
        if(!isValidId(storeId)|| !isValidId(colorId)) {
            return res.status(403).json("Invalid StoreId")
        }

        const store = await prismadb.store.findUnique({
            where : {
                id : storeId
            }
        })

        if(!store){
            return res.status(404).json({message:"Store Not Found. Invalid StoreId"})
        }

        if(store.userId !== userId) {
            return res.status(404).json("UNAUTHORIZED")
        }

        const color = await prismadb.color.delete({
            where : {
                storeId,
                id : colorId,
            }
        })

        return res.status(200).json(color)
        
    } catch (error) {
        console.log("DELETE_COLOR_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}