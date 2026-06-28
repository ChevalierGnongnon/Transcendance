const jwt = require('jsonwebtoken');

const checkAuthToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token)
        return (res.status(401).json({error: 'INVALID_TOKEN'}));
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.account = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'INVALID_TOKEN' });
    }
}
module.exports = checkAuthToken;