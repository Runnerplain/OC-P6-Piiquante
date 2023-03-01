const jwt = require('jsonwebtoken')

function authUser(req, res, next) {
    console.log("authUser");
    const header = req.header('Authorization')
    if (header == null) return res.status(403).send({ message: "Invalid" })
    const token = header.split(' ')[1]
    if (token == null) return res.status(403).send({ message: "Token cannot be null" })

    jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) => {
        if (err) return res.status(403).send({ message: 'invalid token' + err })
        console.log("le token est bien valide");
        next()
    })

}

module.exports = { authUser }