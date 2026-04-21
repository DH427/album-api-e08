import Album from '../models/Album.js'

export async function checkOwnership(req, res, next) {
  try {
    const album = await Album.findById(req.params.id)

    if (!album) {
      return res.status(404).json({ error: 'Album not found' })
    }

    if (req.user.role === 'admin') {
      return next()
    }

    if (album.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Not authorized to access this resource'
      })
    }

    next()

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Authorization failed' })
  }
}
