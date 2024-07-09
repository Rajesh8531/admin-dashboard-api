import express from 'express'
import { auth } from '../middlewares/auth'
import { createSize, deleteSize, getSize, getSizes, updateSize } from '../controllers/sizes-controller'

const router = express.Router({mergeParams:true})

router.get('/',getSizes)

router.get('/:sizeId',getSize)

router.post('/',auth,createSize)

router.patch('/:sizeId',auth,updateSize)

router.delete('/:sizeId',auth,deleteSize)

export default router