import express from 'express'
import { getOrders } from '../controllers/orders-controller'

const router = express.Router({mergeParams:true})

router.get('/',getOrders)

export default router