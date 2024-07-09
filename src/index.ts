import express, { Application, Request, Response } from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import authRouter from './routes/auth-route'
import storeRouter from './routes/store-route'
import billboardsRouter from './routes/billboards-route'
import categoriesRouter from './routes/categories-route'
import sizesRouter from './routes/sizes-route'
import colorsRouter from './routes/colors-route'
import productsRouter from './routes/products-route'
import ordersRouter from './routes/orders-route'
import checkoutRouter from './routes/checkout-route'
import webHookRouter from './routes/web-hook'
import { CustomIncomingMessage } from './utils/objectId-validator';


dotenv.config()

const app:Application = express();

app.use(
    bodyParser.json({
        verify: function(req :CustomIncomingMessage, res, buf) {
            req.rawBody = buf;
        }
    })
);
app.use(bodyParser.urlencoded({extended:true}))
app.use('/webhook',webHookRouter)

app.use(cors())

const port = process.env.PORT || 8000;

app.use('/auth',authRouter)
app.use('/store',storeRouter)
app.use('/store/:storeId/billboards',billboardsRouter)
app.use('/store/:storeId/categories',categoriesRouter)
app.use('/store/:storeId/sizes',sizesRouter)
app.use('/store/:storeId/colors',colorsRouter)
app.use('/store/:storeId/products',productsRouter)
app.use('/store/:storeId/orders',ordersRouter)
app.use('/store/:storeId/checkout',checkoutRouter)



app.get('/',(req:Request,res:Response)=>{
    res.json({message:"Success"})
})

app.listen(port ,()=>{
    console.log(`Server running at http://localhost:${port}`)
})