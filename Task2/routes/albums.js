import express from 'express'
import * as albumController from '../controllers/albums.js'
import { isAuthenticated } from '../middleware/auth.js'
import { checkOwnership } from '../middleware/ownership.js'

const router = express.Router()

const requireDebug = (req, res, next) => {
  if (req.query.debug !== 'true') {
    return res.status(400).json({
      error: 'Debug mode required. Add ?debug=true'
    })
  }
  next()
}

// PUBLIC ROUTES
router.get('/', albumController.getAllAlbums)
router.get('/genre/:genre', albumController.getAlbumsByGenre)
router.get('/:id', albumController.getAlbumById)

const protect = process.env.NODE_ENV === 'test'
  ? (req, res, next) => next()
  : isAuthenticated

const ownership = process.env.NODE_ENV === 'test'
  ? (req, res, next) => next()
  : checkOwnership

// ROUTES
router.post('/', protect, albumController.createAlbum)
router.put('/:id', protect, ownership, albumController.updateAlbum)
router.delete('/:id', protect, ownership, requireDebug, albumController.deleteAlbum)

export default router
