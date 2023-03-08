const express = require("express")
// Controllers

const { getSauces, createSauce, getSauceById, deleteSauce, modifySauce } = require('../controllers/sauces')

// Midleware

const { upload } = require('../middleware/multer')
const { authUser } = require('../middleware/auth')
const saucesRouter = express.Router()


saucesRouter.get('/', authUser, getSauces)
saucesRouter.post('/', authUser, upload.single('image'), createSauce)
saucesRouter.get('/:id', authUser, getSauceById)
saucesRouter.delete('/:id', authUser, deleteSauce)
saucesRouter.put('/:id', authUser, upload.single('image'), modifySauce)

module.exports = { saucesRouter }