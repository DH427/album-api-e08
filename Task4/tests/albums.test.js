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

describe('POST /albums', () => {
  it('should add a new album and increase count by 1', async () => {

    const initialAlbums = await Album.find()

    const newAlbum = {
      artist: 'Drake',
      title: 'Scorpion',
      year: 2018,
      genre: 'Hip Hop',
      tracks: 25,
      user: new mongoose.Types.ObjectId()
    }

    const res = await request(app)
      .post('/albums')
      .send(newAlbum)

    const updatedAlbums = await Album.find()

    expect(res.statusCode).toBe(201)
    expect(updatedAlbums.length).toBe(initialAlbums.length + 1)
    expect(res.body.artist).toBe(newAlbum.artist)
    expect(res.body.title).toBe(newAlbum.title)
    expect(res.body.genre).toBe(newAlbum.genre)
  })
})

describe('DELETE /albums/:id', () => {

  it('should delete an album and decrease count by 1', async () => {

    const initialAlbums = await Album.find()
    const albumToDelete = initialAlbums[0]

    const res = await request(app)
      .delete(`/albums/${albumToDelete._id}?debug=true`)

    const updatedAlbums = await Album.find()

    console.log('Remaining albums:', updatedAlbums.length)

    expect(res.statusCode).toBe(200)

    expect(updatedAlbums.length).toBe(initialAlbums.length - 1)

    const deletedAlbum = await Album.findById(albumToDelete._id)
    expect(deletedAlbum).toBeNull()
  })

  it('should return 404 when deleting non-existent album', async () => {

    const fakeId = new mongoose.Types.ObjectId()

    const res = await request(app)
      .delete(`/albums/${fakeId}?debug=true`)


    expect(res.statusCode).toBe(404)
    expect(res.body.error).toBeDefined()
  })

})

