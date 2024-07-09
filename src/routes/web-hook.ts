import express from 'express'
import { stripe } from '../stripe'
import prismadb from '../utils/prismadb'
const router = express.Router()

router.post('/',express.json({type : 'application/json'}),async (request : any,response)=>{

    let event = await request.body

    if(process.env.WEBHOOK_SECRET_KEY){
        const signature = request.headers['stripe-signature'] as string
        try {
            event = stripe.webhooks.constructEvent(request.rawBody,signature,process.env.WEBHOOK_SECRET_KEY)
        } catch (error:any) {
            console.log(`Webhook signature verification failed`,error.message)
            return response.sendStatus(400)
        }
    }
    const ses = await stripe.checkout.sessions.list()   
    const session = ses.data[0]    
    const address = session?.customer_details?.address

    const addressComponents = [
        address?.line1,
        address?.line2,
        address?.city,
        address?.state,
        address?.postal_code,
        address?.country
    ]
    // 4242 4242 4242 4242
    const addressString = addressComponents.filter(c=>c!==null).join(', ')

        switch (event.type){
            case 'payment_intent.succeeded' :
                const order = await prismadb.order.update({
                    where : {
                        id : session?.metadata?.orderId
                    },data : {
                        isPaid : true,
                        address : addressString,
                        phone : session?.customer_details?.phone || ''
                    },
                    include : {
                        orderItems : true
                    }
                })

                const productIds = order.orderItems.map(orderItem=>orderItem.productId)

                await prismadb.product.updateMany({
                    where : {
                        id : {
                            in : [...productIds]
                        }
                    },
                    data : {
                        isArchived : true,
                    }
                })

                return response.status(200).json(null)

            case 'payment_method.attached' :
                const paymentMethod = event.data.object
                break
        }

        response.send()
})



// export default router

// This is your test secret API key.
// Replace this endpoint secret with your endpoint's unique secret
// If you are testing with the CLI, find the secret by running 'stripe listen'
// If you are using an endpoint defined with the API or dashboard, look in your webhook settings
// at https://dashboard.stripe.com/webhooks
export default router
