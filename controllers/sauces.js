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
    console.log("le token a été validé nous sommes ici");
    // console.log("token ok: ", decoded);
    Product.find({}).then(products => res.send(products))
    // res.send({ message: [{ sauce: "sauce1" }, { sauce: "sauce2" }] })
}

function createSauce(req, res) {
    console.log(__dirname);
    const { body, file } = req
    console.log({ file });
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
    product.save().then((res) => console.log('produit enregistré', res)).catch(console.error)
}

module.exports = { getSauces, createSauce }