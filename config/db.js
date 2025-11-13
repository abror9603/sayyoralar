const mongoose = require('mongoose')

const connectDB = async () => {
    mongoose.set('strictQuery', false)
    const connecting = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB connected on port: ${connecting.connection.host}`.white.bgBlue.bold)
}

module.exports = connectDB