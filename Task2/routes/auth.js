import express from 'express'
import { register, login, logout } from '../controllers/auth.js'

const router = express.Router()

// Register route
router.post('/register', register)

// Login route
router.post('/login', login)

// Login route
router.post('/logout', logout)

export default router
