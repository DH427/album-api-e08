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

// PROTECTED ROUTES
router.post('/', isAuthenticated, albumController.createAlbum)
router.put('/:id', isAuthenticated, checkOwnership, albumController.updateAlbum)
router.delete('/:id', isAuthenticated, checkOwnership, requireDebug, albumController.deleteAlbum)

export default router
