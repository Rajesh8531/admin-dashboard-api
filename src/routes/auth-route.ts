import express from 'express'
import { signIn, singUp } from '../controllers/auth-controller'

const router = express.Router()

router.post('/signup',singUp)

router.post('/signin',signIn)

export default router