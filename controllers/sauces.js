const { response } = require('express')
const mongoose = require('mongoose')
const { unlink } = require('fs/promises')


const productSchema = new mongoose.Schema({
    userId: String,
    name: String,
    manufacturer: String,
    description: String,
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


function getSauceId(req, res) {
    const { id } = req.params
    return Product.findById(id)
}

function getSauceById(req, res) {
    getSauceId(req, res)
        .then(product => sendClientResponse(product, res))
        .catch((err) => res.status(500).send(err))
}


function deleteSauce(req, res) {
    const { id } = req.params
    Product.findByIdAndDelete(id)
        .then((product) => sendClientResponse(product, res))
        .then((item) => deleteImage(item))
        .then((res) => console.log(res))
        .catch((err) => console.error("problem, cant modify", err))
}


function modifySauce(req, res) {
    const {
        params: { id }
    } = req

    const hasNewImage = req.file != null
    const payload = makePayload(hasNewImage, req)

    Product.findByIdAndUpdate(id, payload)
        .then((dbResponse) => sendClientResponse(dbResponse, res))
        .then((product) => deleteImage(product))
        .then((res) => console.log(res))
        .catch((err) => console.error("problem, cant modify", err))
}

function deleteImage(product) {
    if (product == null) return
    const imageToDelete = product.imageUrl.split('/').at(-1)
    return unlink("images/" + imageToDelete)
}

function makePayload(hasNewImage, req) {
    if (!hasNewImage) return req.body
    const payload = JSON.parse(req.body.sauce)
    payload.imageUrl = makeImageUrl(req, req.file.fileName)
    return payload
}

function sendClientResponse(product, res) {
    if (product == null) {
        console.log("Nothing to update")
        return res.status(404).send({ message: 'Unknow object !' })
    }
    return Promise.resolve(res.status(200).send(product)).then(() => product)
}

function makeImageUrl(req, fileName) {
    return req.protocol + "://" + req.get('host') + "/images/" + fileName
}

function createSauce(req, res) {
    const { body, file } = req
    const { fileName } = file
    const sauce = JSON.parse(body.sauce)

    const { name, manufacturer, description, mainPepper, heat, userId } = sauce


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
            return console.log('produit enregistré');
        })
        .catch(console.error)
}


function likeSauce(req, res) {
    const { like, userId } = req.body
    if (![1, -1, 0].includes(like)) return res.status(403).send({ message: "invalid like value" })

    getSauceId(req, res)
        .then((product) => updateVote(product, like, userId, res))
        .then((pr) => pr.save())
        .then((prod) => sendClientResponse(prod, res))
        .catch((err) => res.status(500).send(err))
}


function updateVote(product, like, userId, res) {
    if (like === 1 || like === -1) return incrementVote(product, userId, like)
    return resetVote(product, userId, res)

}


function resetVote(product, userId, res) {
    const { usersLiked, usersDisliked } = product
    if ([usersLiked, usersDisliked].every(arr => arr.includes(userId))) return Promise.reject("Problem, users like & dislike in same time...")

    if (![usersLiked, usersDisliked].some(arr => arr.includes(userId))) return Promise.reject("problem, we have no vote yet...")


    if (usersLiked.includes(userId)) {
        --product.likes
        product.usersLiked = product.usersLiked.filter(id => id != userId)
    } else {
        --product.dislikes
        product.usersDisliked = product.usersDisliked.filter(id => id != userId)
    }
    return product
}


function incrementVote(product, userId, like) {
    const { usersLiked, usersDisliked } = product

    const votersArray = like === 1 ? usersLiked : usersDisliked

    if (votersArray.includes(userId)) return product
    votersArray.push(userId)

    like === 1 ? ++product.likes : ++product.dislikes
    return product

}




module.exports = { sendClientResponse, getSauceId, getSauces, createSauce, getSauceById, deleteSauce, modifySauce, likeSauce }