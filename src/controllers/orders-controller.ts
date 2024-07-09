import { customRequest } from "../middlewares/auth"
import { Request,Response } from "express"
import prismadb from "../utils/prismadb"
import { isValidId } from "../utils/objectId-validator"

export const getOrders = async (request:Request,res:Response) => {
    try {
        
        let req = request as customRequest

        const {storeId} = req.params

        const orders = await prismadb.order.findMany({
            where : {
                storeId
            },
            include : {
                orderItems : {
                    include : {
                        product : true,
                    }
                },
            },
            orderBy : {
                createdAt : 'desc'
            }
        })

        return res.status(200).json(orders)
        
    } catch (error) {
        console.log("GET_ORDERS_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}

export const createOrder = async (request:Request,res:Response) => {
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
        console.log("CREATE_ORDER_CONTROLLER",error)
        return res.status(500).json("Something went wrong")
    }
}

