const jwt = require('jsonwebtoken')
const config = require('../config.json')
const secret = config.secret

const auth = (req,res, next) => {
    const token = req.get('Authorization')
    try {
        const decoded = jwt.verify(token, secret);
        console.log(decoded)
        // req.body._id = decoded
        next()
      } catch(err) {
        res.json({msg:"Invalid token"}).status(403)
      }
}

module.exports = auth