const jwt = require('jsonwebtoken');

const verify = (req, res, next) => {
    const token = req.body.token;
    if(!token) return res.send({status: "error", message: "No token"});
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.getUser = verified;
        next();
    } catch (error) {
        return res.send({status: "error", message: "Invalid token"});
    }
}

module.exports = {
    verify
}
