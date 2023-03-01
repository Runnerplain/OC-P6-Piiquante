require("dotenv").config()
const express = require('express')
const app = express()
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const port = 3000

// function Storage from multer 
const storage = multer.diskStorage({
    destination: "images/",
    filename: function (req, file, cb) {
        cb(null, makeFilename(req, file))
    }
})

// Make name for file 
function makeFilename(req, file) {
    const fileName = `${Date.now()}-${file.originalname}`.replace(/\s/g, "-")
    file.fileName = fileName
    return fileName
}
const upload = multer({ storage: storage })


// Connection to database
require('./mongo')

// Controllers
const { createUser, logUser } = require('./controllers/users')
const { getSauces, createSauce } = require('./controllers/sauces')



//Middleware
app.use(cors())
app.use(express.json())


const { authUser } = require('./middleware/auth')

// Routes
app.post('/api/auth/signup', createUser)
app.post('/api/auth/login', logUser)
app.get('/api/sauces', authUser, getSauces)
app.post('/api/sauces', authUser, upload.single('image'), createSauce)



app.use("/images", express.static(path.join(__dirname, 'images')))
app.listen(port, () => console.log("Listen on port: " + port));



