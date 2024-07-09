import express from 'express'
import { createBillboard, deleteBillboard, getBillboard, getBillboards, updateBillboard } from '../controllers/billboards-controller'
import { auth } from '../middlewares/auth'

const router = express.Router({mergeParams:true})

router.get('/',getBillboards)

router.get('/:billboardId',getBillboard)

router.post('/',auth,createBillboard)

router.patch('/:billboardId',auth,updateBillboard)

router.delete('/:billboardId',auth,deleteBillboard)

export default router