import { Schema, model } from 'mongoose'

const allowedGenres = [
  'Pop',
  'Rock',
  'Jazz',
  'Hip Hop',
  'Classical',
  'Electronic'
]

const albumSchema = new Schema({
  artist: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    validate: {
      validator: function (value) {
        return value <= new Date().getFullYear()
      },
      message: 'Year cannot be in the future'
    }
  },
  genre: {
    type: String,
    required: true,
    enum: allowedGenres
  },
  tracks: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

albumSchema.virtual('ageInYears').get(function () {
  return new Date().getFullYear() - this.year
})

albumSchema.methods.isClassic = function () {
  return this.ageInYears > 25
}

albumSchema.statics.findByGenre = function (genre) {
  return this.find({ genre })
}

albumSchema.pre('save', async function () {
  const existing = await this.constructor.findOne({
    artist: this.artist,
    title: this.title,
    _id: { $ne: this._id }
  })

  if (existing) {
    throw new Error('An album with this artist and title already exists')
  }
})

albumSchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate()

  if (update.artist && update.title) {
    const existing = await this.model.findOne({
      artist: update.artist,
      title: update.title,
      _id: { $ne: this.getQuery()._id }
    })

    if (existing) {
      throw new Error('An album with this artist and title already exists')
    }
  }
})

albumSchema.set('toJSON', { virtuals: true })
albumSchema.set('toObject', { virtuals: true })

export default model('Album', albumSchema)
