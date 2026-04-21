import mongoose from 'mongoose'

export async function connectDB() {
  try {
    const uri =
      process.env.NODE_ENV === 'test'
        ? process.env.MONGO_TEST_URI
        : process.env.MONGO_URI

    if (!uri) {
      throw new Error('Database URI not defined')
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    console.log(
      `MongoDB connected to (${
        process.env.NODE_ENV === 'test' ? 'TEST DB' : 'DEV/PROD DB'
      })`
    )
  } catch (err) {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  }
}
