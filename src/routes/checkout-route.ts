import express from 'express'
import { checkoutOptions, checkoutPost } from '../controllers/checkout-controller'

const router = express.Router({mergeParams:true})

router.options('/',checkoutOptions)

router.post('/',checkoutPost)

export default router