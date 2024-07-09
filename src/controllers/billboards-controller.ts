import { customRequest } from "../middlewares/auth"
import { Request,Response } from "express"
import prismadb from "../utils/prismadb"
import { isValidId } from "../utils/objectId-validator"

export const getBillboards = async (request:Request,res:Response) => {
    try {
        
        let req = request as customRequest

        const {storeId} = req.params

        const billboards = await prismadb.billBoard.findMany({
            where : {
                storeId
            },
            orderBy : {
                createdAt : 'desc'
            }
        })

        return res.status(200).json(billboards)
        
    } catch (error) {
        console.log("GET_BILLBOARDS_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}

export const createBillboard = async (request:Request,res:Response) => {
    try {
        
        let req = request as customRequest

        const {storeId} = req.params

        const userId = req.userId

        const {imageUrl,label} = await req.body
        
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

        const billboard = await prismadb.billBoard.create({
            data : {
                storeId,
                imageUrl,
                label
            }
        })

        return res.status(200).json(billboard)
        
    } catch (error) {
        console.log("CREATE_BILLBOARD_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}

export const getBillboard = async (request:Request,res:Response) => {
    try {
        
        let req = request as customRequest

        const params = req.params
        const {storeId,billboardId} = params
        
        if(!isValidId(storeId) || !isValidId(billboardId)){
            return res.json(null)
        }

        const billboard = await prismadb.billBoard.findUnique({
            where : {
                id : billboardId,
                storeId 
            }
        })

        return res.status(200).json(billboard)
        
    } catch (error) {
        console.log("GET_BILLBOARD_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}

export const updateBillboard = async (request:Request,res:Response) => {
    try {
        
        let req = request as customRequest

        const {storeId,billboardId} = req.params

        const userId = req.userId

        const {imageUrl,label} = await req.body
        
        if(!isValidId(storeId) || !(isValidId(billboardId))){
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

        const billboard = await prismadb.billBoard.update({
            where : {
                storeId,
                id : billboardId,
            } ,
            data : {
                storeId,
                imageUrl,
                label
            }
        })

        return res.status(200).json(billboard)
        
    } catch (error) {
        console.log("UPDATE_BILLBOARD_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}

export const deleteBillboard = async (request:Request,res:Response) => {
    try {
        
        let req = request as customRequest

        const {storeId,billboardId} = req.params

        const userId = req.userId
        
        if(!isValidId(storeId)){
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

        const billboard = await prismadb.billBoard.delete({
            where : {
                storeId,
                id : billboardId,
            }
        })

        return res.status(200).json(billboard)
        
    } catch (error) {
        console.log("DELETE_BILLBOARD_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}