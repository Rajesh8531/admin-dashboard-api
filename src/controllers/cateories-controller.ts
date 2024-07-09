import { customRequest } from "../middlewares/auth"
import { Request,Response } from "express"
import prismadb from "../utils/prismadb"
import { isValidId } from "../utils/objectId-validator"

export const getCategories = async (request:Request,res:Response) => {
    try {
        
        let req = request as customRequest

        const {storeId} = req.params

        const categories = await prismadb.category.findMany({
            where : {
                storeId
            },
            include : {
                billboard : true
            },
            orderBy : {
                createdAt : 'desc'
            }
        })

        return res.status(200).json(categories)
        
    } catch (error) {
        console.log("GET_CATEGORIES_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}

export const createCategory = async (request:Request,res:Response) => {
    try {
        
        let req = request as customRequest

        const {storeId} = req.params

        const userId = req.userId

        const {name,billboardId} = await req.body
        
        if(!isValidId(storeId) || !isValidId(billboardId)){
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

        const category = await prismadb.category.create({
            data : {
                storeId,
                name,
                billboardId
            }
        })

        return res.status(200).json(category)
        
    } catch (error) {
        console.log("CREATE_CATEGORY_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}

export const getCategory = async (request:Request,res:Response) => {
    try {
        
        let req = request as customRequest

        const {storeId,categoryId} = req.params
        
        if(!isValidId(storeId) || !isValidId(categoryId)){
            return res.json(null)
        }

        const category = await prismadb.category.findUnique({
            where : {
                id : categoryId,
                storeId 
            },
            include : {
             billboard : true,
             products : true
            }
        })

        return res.status(200).json(category)
        
    } catch (error) {
        console.log("GET_CATEGORY_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}

export const updateCategory = async (request:Request,res:Response) => {
    try {
        
        let req = request as customRequest

        const {storeId,categoryId} = req.params

        const userId = req.userId

        const {name,billboardId} = await req.body
        
        if(!isValidId(storeId) || !(isValidId(categoryId) ||!isValidId(billboardId))){
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

        const category = await prismadb.category.update({
            where : {
                storeId,
                id : categoryId,
            } ,
            data : {
                storeId,
                name,
                billboardId
            }
        })

        return res.status(200).json(category)
        
    } catch (error) {
        console.log("UPDATE_CATEGORY_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}

export const deleteCategory = async (request:Request,res:Response) => {
    try {
        
        let req = request as customRequest

        const {storeId,categoryId} = req.params

        const userId = req.userId
        
        if(!isValidId(storeId)|| !isValidId(categoryId)) {
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

        const category = await prismadb.category.delete({
            where : {
                storeId,
                id : categoryId,
            }
        })

        return res.status(200).json(category)
        
    } catch (error) {
        console.log("DELETE_CATEGORY_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}