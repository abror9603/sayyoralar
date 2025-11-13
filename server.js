const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan = require('morgan')
const errorHandler = require('./middlewares/error')
const colors = require('colors')
const path = require('path')

dotenv.config()

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

if(process.env.NODE_ENV == 'development'){
    app.use(morgan('dev'))
}

// Static public
app.use(express.static(path.join(__dirname, 'public')))

// api route lists
app.use('/api/v1/auth', require('./routes/auth.route'))
app.use('/api/v1/stars', require('./routes/star.route'))
app.use('/api/v1/planets', require('./routes/planet.route'))

// error middlware
app.use(errorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running ${process.env.NODE_ENV} on port: ${PORT}`.bgBlue.white.bold)
})