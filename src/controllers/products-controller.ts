import { customRequest } from "../middlewares/auth"
import { Request,Response } from "express"
import prismadb from "../utils/prismadb"
import { isValidId } from "../utils/objectId-validator"

interface searchParams {
    categoryId : string;
    colorId : string;
    sizeId : string;
    isFeatured : boolean
}

export const getProducts = async (request:Request,res:Response) => {
    try {
        
        let req = request as customRequest
        const {storeId} = req.params
        const searchParams = req.query 

        const categoryId = searchParams?.category as string || undefined
        const colorId = searchParams?.color as string || undefined
        const sizeId = searchParams?.size as string || undefined
        const isFeatured = searchParams?.featured as string || undefined

        const products = await prismadb.product.findMany({
            where : {
                storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured : isFeatured ? true : undefined,
                isArchived : false
            },
            orderBy : {
                createdAt : 'desc'
            },
            include : {
                category : true,
                color : true,
                image : true,
                size : true
            }
        })
        
        const images = await prismadb.image.findMany()

        return res.status(200).json(products)
        
    } catch (error) {
        console.log("GET_PRODUCTS_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}

export const createProduct = async (request:Request,res:Response) => {
    try {
        
        let req = request as customRequest

        const {storeId} = req.params

        const userId = req.userId

        let data = await req.body

        const {name,categoryId,sizeId,colorId,isFeatured,isArchived,imageUrl} = data
        let {price} = data

        if(typeof price == 'string'){
            price = parseInt(price)
        }
        
        if(!isValidId(storeId) || !isValidId(categoryId) || !isValidId(sizeId) || !isValidId(colorId)){
            return res.status(403).json("Invalid StoreId")
        }

        if(!name){
            return res.status(404).json("Name Field Required")
        }
        
        if(!categoryId){
            return res.status(404).json("categoryId Field Required")
        }

        if(!price){
            return res.status(404).json("price Field Required")
        }

        if(!colorId){
            return res.status(404).json("colorId Field Required")
        }

        if(!sizeId){
            return res.status(404).json("sizeId Field Required")
        }

        const store = await prismadb.store.findUnique({
            where : {
                id : storeId
            }
        })

        if(store?.userId !== userId) {
            return res.status(404).json("UNAUTHORIZED")
        }

        const images = imageUrl.map((im:string)=>({url:im}))

        const product = await prismadb.product.create({
            data : {
                storeId,
                name,
                categoryId,
                colorId,
                price,
                sizeId,
                isArchived,
                isFeatured,
                image : {
                    createMany : {
                        data : [...images]
                    }
                }
            }
        })

        return res.status(200).json(product)
        
    } catch (error) {
        console.log("CREATE_PRODUCT_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}

export const getProduct = async (request:Request,res:Response) => {
    try {
        
        let req = request as customRequest

        const {storeId,productId} = req.params
        
        if(!isValidId(storeId) || !isValidId(productId)){
            return res.json(null)
        }

        const product = await prismadb.product.findUnique({
            where : {
                id : productId,
                storeId 
            },
            include : {
                category : true,
                color : true,
                size : true,
                image : true
            }
        })

        return res.status(200).json(product)
        
    } catch (error) {
        console.log("GET_PRODUCT_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}

export const updateProduct = async (request:Request,res:Response) => {
    try {
        
        let req = request as customRequest

        const {storeId,productId} = req.params

        const userId = req.userId

        let data = await req.body

        const {name,categoryId,sizeId,colorId,isFeatured,isArchived,imageUrl} = data

        let {price} = data

        if(typeof price == 'string'){
            price = parseInt(price)
        }
        
        if(!isValidId(storeId) || !isValidId(categoryId) || !isValidId(sizeId) || !isValidId(colorId)){
            return res.status(403).json("Invalid StoreId")
        }

        if(!name){
            return res.status(404).json("Name Field Required")
        }
        
        if(!categoryId){
            return res.status(404).json("categoryId Field Required")
        }

        if(!price){
            return res.status(404).json("price Field Required")
        }

        if(!colorId){
            return res.status(404).json("colorId Field Required")
        }

        if(!sizeId){
            return res.status(404).json("sizeId Field Required")
        }

        const store = await prismadb.store.findUnique({
            where : {
                id : storeId
            }
        })

        if(store?.userId !== userId) {
            return res.status(404).json("UNAUTHORIZED")
        }

        const images = imageUrl.map((im:string)=>({url:im}))

        await prismadb.product.update({
            where : {
                id : productId
            },data : {
                name,
                price,
                categoryId,
                isArchived,
                isFeatured,
                colorId,
                image : {
                    deleteMany : {}
                },
                sizeId,
                storeId
            }
        })

        const products = await prismadb.product.update({
            where : {
                id : productId
            },data : {
                name,
                price,
                categoryId,
                isArchived,
                isFeatured,
                colorId,
                image : {
                    createMany : {
                        data : images
                    }
                },
                sizeId,
                storeId
            }
        })

        return res.status(200).json(products)
        
    } catch (error) {
        console.log("UPDATE_PRODUCT_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}

export const deleteProduct = async (request:Request,res:Response) => {
    try {
        
        let req = request as customRequest

        const {storeId,productId} = req.params

        const userId = req.userId
        
        if(!isValidId(storeId)|| !isValidId(productId)) {
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

        const product = await prismadb.product.delete({
            where : {
                storeId,
                id : productId,
            }
        })

        return res.status(200).json(product)
        
    } catch (error) {
        console.log("DELETE_PRODUCT_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}