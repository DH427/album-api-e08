import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import AppError from '../utils/AppError.js'
import passport from 'passport'

// REGISTER 
export async function register(req, res) {
  try {
    const { name, email, password, passwordConfirm } = req.body

    // Check required fields
    if (!name || !email || !password || !passwordConfirm) {
      return res.status(400).json({
        error: 'All fields are required'
      })
    }

    // Check password confirmation
    if (password !== passwordConfirm) {
      return res.status(400).json({
        error: 'Passwords do not match'
      })
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        error: 'Email already exists'
      })
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    })

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email
      }
    })

  } catch (error) {
    console.error(error)
    // Handle MongoDB duplicate error
    if (error.code === 11000) {
      return res.status(400).json({
        error: 'Email already exists'
      })
    }

    res.status(500).json({
      error: error.message || 'Registration failed'
    })
  }
}

// LOGIN
export function login(req, res) {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({
        error: 'Login failed'
      })
    }

    if (!user) {
      return res.status(401).json({
        error: info?.message || 'Invalid credentials'
      })
    }

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({
          error: 'Login session failed'
        })
      }

      res.json({
        message: 'Login successful',
        user: {
          id: user._id,
          email: user.email
        }
      })
    })
  })(req, res)
}

// LOGOUT
export function logout(req, res) {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        error: 'Logout failed'
      })
    }

    req.session.destroy(() => {
      res.json({
        message: 'Logged out successfully'
      })
    })
  })
}

