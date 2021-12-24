const jwt = require('jsonwebtoken');
const varifyUser = async function(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            res.status(403).send({ status: false, message: "Missing Authentication Token in req" })
            return
        }
        let bearerHeader = authHeader && authHeader.split(' ')[1]
        const decoded = jwt.verify(bearerHeader, 'radium')
        if (!decoded) {
            res.status(403).send({ status: false, message: 'invalid Authentication authHeader in request' })
            return
        }
        req.userId = decoded.userId;
        next()
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}
module.exports = { varifyUser }