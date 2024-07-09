import express from 'express'
import { auth } from '../middlewares/auth'
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../controllers/products-controller'

const router = express.Router({mergeParams:true})

router.get('/',getProducts)

router.get('/:productId',getProduct)

router.post('/',auth,createProduct)

router.patch('/:productId',auth,updateProduct)

router.delete('/:productId',auth,deleteProduct)

export default router