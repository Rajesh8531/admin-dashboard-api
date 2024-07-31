import { Response,Request } from "express";
import { customRequest } from "../middlewares/auth";
import prismadb from "../utils/prismadb";

export const createStore = async (request:Request,res:Response) => {
    try {
        
        let req = request as customRequest

        if(!req.userId){
            return res.status(400).json("Unauthorized")
        }

        const {name} = await req.body;

        const userId = req.userId

        const store = await prismadb.store.create({
            data : {
                userId,
                name
            }
        })

        return res.status(200).json(store)
        
    } catch (error) {
        console.log("CREATE_STORE_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}

export const getStores = async (request:Request,res:Response) => {
    try {
        
        let req = request as customRequest

        const {userId} = req.query

        const store = await prismadb.store.findMany({
            where : {
                userId : userId as string
            },orderBy : {
                createdAt : 'desc'
            },
            include : {
                colors : true,
                sizes : true,
                categories : true
            }
        })

        return res.status(200).json(store)
        
    } catch (error) {
        console.log("GET_STORE_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}

export const getStore = async (request:Request,res:Response) => {
    try {
        
        let req = request as customRequest

        const {storeId} = req.params

        const store = await prismadb.store.findUnique({
            where : {
                id : storeId
            },include : {
                categories : true,
                billboards : true,
                colors : true,
                sizes : true
            }
        })

        return res.status(200).json(store)
        
    } catch (error) {
        console.log("CREATE_STORE_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}


export const updateStore = async (request:Request,res:Response) => {
    try {
        
        let req = request as customRequest

        if(!req.userId){
            return res.status(400).json("Unauthorized")
        }

        const {storeId} = req.params
        const {name} = await req.body;

        if(!name){
            return res.status(401).json("Name Required")
        }

        const userId = req.userId

        const store = await prismadb.store.update({
            where : {
                userId,
                id : storeId
            },
            data : {
                name : name
            }
        })

        return res.status(200).json(store)
        
    } catch (error) {
        console.log("UPDATE_STORE_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}

export const deleteStore = async (request:Request,res:Response) => {
    try {
        
        let req = request as customRequest

        if(!req.userId){
            return res.status(400).json("Unauthorized")
        }

        const {storeId} = req.params

        const userId = req.userId

        const store = await prismadb.store.delete({
            where : {
                userId,
                id : storeId
            },
        })

        return res.status(200).json(store)
        
    } catch (error) {
        console.log("UPDATE_STORE_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}
