
const { app, express } = require('./server')
const port = 3000
const path = require('path')



// Connection to database
require('./mongo')

// Controllers
const { createUser, logUser } = require('./controllers/users')
const { getSauces, createSauce, getSauceById } = require('./controllers/sauces')

// Midleware

const { upload } = require('./middleware/multer')
const { authUser } = require('./middleware/auth')


// Routes
app.post('/api/auth/signup', createUser)
app.post('/api/auth/login', logUser)
app.get('/api/sauces', authUser, getSauces)
app.post('/api/sauces', authUser, upload.single('image'), createSauce)
app.get('/api/sauces/:id', authUser, getSauceById)

// Listen

app.use("/images", express.static(path.join(__dirname, 'images')))
app.listen(port, () => console.log("Listen on port: " + port));



