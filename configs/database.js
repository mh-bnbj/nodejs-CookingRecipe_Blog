const mongoose = require('mongoose')

const mongoDB_Url = process.env.MONGODB_URL

console.log('mongodb url : ', mongoDB_Url)

mongoose.connect(mongoDB_Url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error : ' + mongoDB_Url))

db.on('open', function () {
    console.log('Connected to mongodb : ' + mongoDB_Url)
})
