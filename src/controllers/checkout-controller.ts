import Stripe from "stripe";

import { stripe } from "../stripe";
import prismadb from "../utils/prismadb";
import { Request, Response } from "express";

const corsHeaders = {
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Methods" : "Get, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers" : "Content-Type, Authorization"
}

export async function checkoutOptions (){
    return Response.json({},{headers : corsHeaders})
}

export async function checkoutPost(req:Request,res:Response){
    try {
        const { storeId } = req.params

        const {productIds} = await req.body

        if(!productIds || productIds.length == 0){
            return res.status(400).json("Product ids are required")
        }

        const products = await prismadb.product.findMany({
            where : {
                id : {
                    in : productIds
                }
            }
        })

        const line_items : Stripe.Checkout.SessionCreateParams.LineItem[] = []

        products.forEach((product)=>{
            line_items.push({
                quantity : 1,
                price_data : {
                    currency : 'USD',
                    product_data : {
                        name : product.name
                    },
                    unit_amount : product.price * 100
                }
            })
        })

        const order = await prismadb.order.create({
            data : {
                storeId,
                isPaid : false,
                orderItems : {
                    create : productIds.map((productId:string)=>({
                        product : {
                            connect : {
                                id : productId
                            }
                        }
                    }))
                }
            }
        })

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode : 'payment',
            billing_address_collection : 'required',
            phone_number_collection : {
                enabled : true
            },
            success_url : `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
            cancel_url : `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
            metadata : {
                orderId : order.id
            },
        })

        return res.json({url : session.url,headers : corsHeaders})

    } catch (error) {
        
    }
}