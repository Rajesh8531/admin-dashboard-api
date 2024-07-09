import express from 'express'
import { auth } from '../middlewares/auth'
import { getOrders } from '../controllers/orders-controller'

const router = express.Router({mergeParams:true})

router.get('/',getOrders)

// router.get('/:productId',getProduct)

// router.post('/',auth,createProduct)

// router.patch('/:productId',auth,updateProduct)

// router.delete('/:productId',auth,deleteProduct)

export default router