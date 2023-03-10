const express = require("express")
// Controllers

const { getSauces, createSauce, getSauceById, deleteSauce, modifySauce, likeSauce } = require('../controllers/sauces')

// Midleware

const { upload } = require('../middleware/multer')
const { authUser } = require('../middleware/auth')
const bodyParser = require("body-parser")
const saucesRouter = express.Router()



saucesRouter.use(bodyParser.json())


saucesRouter.get('/', authUser, getSauces)
saucesRouter.post('/', authUser, upload.single('image'), createSauce)
saucesRouter.get('/:id', authUser, getSauceById)
saucesRouter.delete('/:id', authUser, deleteSauce)
saucesRouter.put('/:id', authUser, upload.single('image'), modifySauce)
saucesRouter.post('/:id/like', authUser, likeSauce)

module.exports = { saucesRouter }