import express from 'express'
import session from 'express-session'
import { connectDB } from './db.js'
import albumRoutes from './routes/albums.js'
import authRoutes from './routes/auth.js'
import { errorHandler } from './middleware/errorHandler.js'
import passport from 'passport'
import './middleware/passport.js'
import 'dotenv/config'

const app = express()
const PORT = 3000

app.use(express.json())
app.use(express.static('public'))

// Logger
const requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
  next()
}

app.use(requestLogger)

await connectDB()

app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: false
}))

// Routes
app.use(passport.initialize())
app.use(passport.session())
app.use('/auth', authRoutes)
app.use('/albums', albumRoutes)
app.use(errorHandler)

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
  })
}

export default app

