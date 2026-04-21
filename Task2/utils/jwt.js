import jwt from 'jsonwebtoken'

const SECRET = 'your-secret-key'

export function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    SECRET,
    { expiresIn: '1h' }
  )
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET)
}
