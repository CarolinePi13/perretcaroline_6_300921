const jwt = require('jsonwebtoken');
require('dotenv').config()
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    req.token = jwt.verify(token, process.env.TOKEN_KEY);

    const userId = req.token.userId;
    if (req.body.userId && req.body.userId !== userId) {
      res.status(403).json({message : 'Invalid UserId'})
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};