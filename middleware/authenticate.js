const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const secretKey = 'yourSecretKey'; // Replace with your actual secret key
        const decode = jwt.verify(token, secretKey);

        req.user = decode;
        next();
    } catch (error) {
        console.error('Authentication Error:', error); // Log the error for debugging
        res.status(401).json({
            message: 'Authentication Failed!'
        });
    }
};

module.exports = authenticate;
