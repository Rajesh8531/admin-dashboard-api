import express from 'express'
import { createStore, deleteStore, getStore, getStores, updateStore } from '../controllers/store-controller'
import { auth } from '../middlewares/auth'

const router = express.Router()

router.post('/',auth,createStore)

router.get('/',getStores)

router.get('/:storeId',getStore)

router.patch('/:storeId',auth,updateStore)

router.delete('/:storeId',auth,deleteStore)

export default router