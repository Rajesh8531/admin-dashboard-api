import { customRequest } from "../middlewares/auth"
import { Request,Response } from "express"
import prismadb from "../utils/prismadb"
import { isValidId } from "../utils/objectId-validator"

export const getSizes = async (request:Request,res:Response) => {
    try {
        
        let req = request as customRequest

        const {storeId} = req.params

        const sizes = await prismadb.size.findMany({
            where : {
                storeId
            },
            orderBy : {
                createdAt : 'desc'
            }
        })

        return res.status(200).json(sizes)
        
    } catch (error) {
        console.log("GET_SIZES_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}

export const createSize = async (request:Request,res:Response) => {
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

        const size = await prismadb.size.create({
            data : {
                storeId,
                name,
                value
            }
        })

        return res.status(200).json(size)
        
    } catch (error) {
        console.log("CREATE_SIZE_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}

export const getSize = async (request:Request,res:Response) => {
    try {
        
        let req = request as customRequest

        const {storeId,sizeId} = req.params
        
        if(!isValidId(storeId) || !isValidId(sizeId)){
            return res.json(null)
        }

        const size = await prismadb.size.findUnique({
            where : {
                id : sizeId,
                storeId 
            }
        })

        return res.status(200).json(size)
        
    } catch (error) {
        console.log("GET_SIZE_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}

export const updateSize = async (request:Request,res:Response) => {
    try {
        
        let req = request as customRequest

        const {storeId,sizeId} = req.params

        const userId = req.userId

        const {name,value} = await req.body
        
        if(!isValidId(storeId) || !(isValidId(sizeId))){
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

        const size = await prismadb.size.update({
            where : {
                storeId,
                id : sizeId,
            } ,
            data : {
                storeId,
                name,
                value
            }
        })

        return res.status(200).json(size)
        
    } catch (error) {
        console.log("UPDATE_SIZE_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}

export const deleteSize = async (request:Request,res:Response) => {
    try {
        
        let req = request as customRequest

        const {storeId,sizeId} = req.params

        const userId = req.userId
        
        if(!isValidId(storeId)|| !isValidId(sizeId)) {
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

        const size = await prismadb.size.delete({
            where : {
                storeId,
                id : sizeId,
            }
        })

        return res.status(200).json(size)
        
    } catch (error) {
        console.log("DELETE_SIZE_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}