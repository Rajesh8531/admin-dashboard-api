import express from 'express'
import { auth } from '../middlewares/auth'
import { createColor, deleteColor, getColor, getColors, updateColor } from '../controllers/colors-controller'

const router = express.Router({mergeParams:true})

router.get('/',getColors)

router.get('/:colorId',getColor)

router.post('/',auth,createColor)

router.patch('/:colorId',auth,updateColor)

router.delete('/:colorId',auth,deleteColor)

export default router