import Album from '../models/Album.js'

// GET all albums
export async function getAllAlbums(req, res) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10))
    const skip = (page - 1) * limit

    let filter = {}

    if (req.query.search) {
      const search = req.query.search
      filter.$or = [
        { artist: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } }
      ]
    }

    if (req.query.year) {
      filter.year = Number(req.query.year)
    }

    if (req.query.startYear || req.query.endYear) {
      filter.year = {}

      if (req.query.startYear) {
        filter.year.$gte = Number(req.query.startYear)
      }

      if (req.query.endYear) {
        filter.year.$lte = Number(req.query.endYear)
      }
    }

    let query = Album.find(filter)

    if (req.query.sort) {
      query = query.sort(req.query.sort)
    }

    let selectedFields = null
    if (req.query.fields) {
      selectedFields = req.query.fields.split(',')
      query = query.select(selectedFields.join(' ') + ' -_id')
    }

    const albums = await query.skip(skip).limit(limit).exec()

    const totalItems = await Album.countDocuments(filter)
    const totalPages = Math.ceil(totalItems / limit)

    const data = selectedFields
      ? albums.map(album => {
          const obj = {}
          selectedFields.forEach(field => {
            obj[field] = album[field]
          })
          return obj
        })
      : albums

    res.json({
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to load albums' })
  }
}

// GET album by ID
export async function getAlbumById(req, res) {
  try {
    const album = await Album.findById(req.params.id)

    if (!album) {
      return res.status(404).json({ error: 'Album not found' })
    }

    res.json(album)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to load album' })
  }
}

// CREATE
export async function createAlbum(req, res) {
  try {
    const { artist, title, year, genre, tracks, user } = req.body

    const newAlbum = await Album.create({
      artist,
      title,
      year,
      genre,
      tracks,

      user: req.user?._id || user
    })
    res.status(201).json(newAlbum)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create album' })
  }
}

// UPDATE
export async function updateAlbum(req, res) {
  try {
    const album = await Album.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )

    if (!album) {
      return res.status(404).json({ error: 'Album not found' })
    }

    res.json(album)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to update album' })
  }
}

// DELETE
export async function deleteAlbum(req, res) {
  try {
    const album = await Album.findByIdAndDelete(req.params.id)

    if (!album) {
      return res.status(404).json({ error: 'Album not found' })
    }

    res.json(album)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to delete album' })
  }
}

// GENRE
export async function getAlbumsByGenre(req, res) {
  try {
    const albums = await Album.findByGenre(req.params.genre)
    res.json(albums)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to filter albums' })
  }
}
