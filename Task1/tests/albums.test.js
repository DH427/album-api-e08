import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import mongoose from 'mongoose'
import app from '../app.js'
import Album from '../models/Album.js'
import data from './data.json' assert { type: 'json' }

beforeEach(async () => {
  await Album.deleteMany()

  const formattedData = data.map(album => ({
    ...album,
    user: new mongoose.Types.ObjectId(album.user)
  }))

  await Album.insertMany(formattedData)
})

describe('GET /albums', () => {
  it('should return correct number of albums', async () => {
    const res = await request(app).get('/albums')

    console.log('Album count:', res.body.data.length)

    expect(res.statusCode).toBe(200)
    expect(res.body.data.length).toBe(data.length)
  })
})
