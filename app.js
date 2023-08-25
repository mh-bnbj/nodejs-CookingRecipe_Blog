const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const fileUpload = require('express-fileupload')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

require('dotenv').config()

const app = express()
const port = process.env.PORT || 30000

// start db
require('./configs/database')

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(expressLayouts)

app.use(cookieParser('CookingBlogSecure'))
app.use(
    session({
        secret: 'CookingBlogSecretSession',
        saveUninitialized: true,
        resave: true,
    })
)
app.use(flash())
app.use(fileUpload())

app.set('view engine', 'ejs')
app.set('layout', './layouts/main')

const routes = require('./server/routes/recipe.Routes')

app.use('/', routes)

app.listen(port, () => {
    console.log(`Server Listening to port ${port}`)
})
