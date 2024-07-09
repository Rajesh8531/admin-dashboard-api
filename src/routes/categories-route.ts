import express from 'express'
import { createCategory,deleteCategory, getCategory, getCategories, updateCategory } from '../controllers/cateories-controller'
import { auth } from '../middlewares/auth'

const router = express.Router({mergeParams:true})

router.get('/',getCategories)

router.get('/:categoryId',getCategory)

router.post('/',auth,createCategory)

router.patch('/:categoryId',auth,updateCategory)

router.delete('/:categoryId',auth,deleteCategory)

export default router