const jwt = require ('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({
            status: "Unauthorized",
            message: 'Access denied',
            statusCode: 401,
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findOne({where: {userId: decoded.userId}});
        next();
    }catch(error){
        return res.status(403).json({
            status: 'Forbidden',
            message: 'Invalid token',
            statusCode: 403,
        });
    }
};

module.exports = authMiddleware;