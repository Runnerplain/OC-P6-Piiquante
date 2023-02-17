const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const passwordServ = process.env.DB_PASSWORD
const username = process.env.DB_USER
const uri = `mongodb+srv://${username}:${passwordServ}@cluster0.ipmpyge.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', true);
mongoose.connect(uri)
    .then((() => console.log("connected to mongoose !")))
    .catch(err => console.error("Error connecting to Mongo: ", err))

const userSchema = new mongoose.Schema({
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true }
})
userSchema.plugin(uniqueValidator)

const User = mongoose.model('user', userSchema)

module.exports = { mongoose, User }