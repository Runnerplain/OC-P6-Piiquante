const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    userId: String,
    name: String,
    manufacturer: String,
    mainPepper: String,
    imageUrl: String,
    heat: Number,
    likes: Number,
    dislikes: Number,
    usersLiked: [String],
    usersDisliked: [String]
})
const Product = mongoose.model('Product', productSchema)




function getSauces(req, res) {
    Product.find({}).then(products => res.send(products))
        .catch(error => res.status(500).send(error))
}

function getSauceById(req, res) {
    const { id } = req.params
    Product.findById(id)
        .then(product => res.send(product))
        .catch(console.error)
}

function createSauce(req, res) {
    const { body, file } = req
    const { fileName } = file
    const sauce = JSON.parse(body.sauce)

    const { name, manufacturer, description, mainPepper, heat, userId } = sauce

    function makeImageUrl(req, fileName) {
        return req.protocol + "://" + req.get('host') + "/images/" + fileName
    }

    const product = new Product({
        userId: userId,
        name: name,
        manufacturer: manufacturer,
        description: description,
        mainPepper: mainPepper,
        imageUrl: makeImageUrl(req, fileName),
        heat: heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    })
    product
        .save()
        .then((message) => {
            res.status(201).send({ message: message })
            return console.log('produit enregistré', message);
        })
        .catch(console.error)
}

module.exports = { getSauces, createSauce, getSauceById }