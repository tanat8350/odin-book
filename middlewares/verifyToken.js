const jwt = require('jsonwebtoken');
require('dotenv').config();

// if Bearer "<token>", have to remove ""
const verifyToken = (req, res, next) => {
  const bearerHeader = req.header('authorization');
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    jwt.verify(bearerToken, process.env.JWT_SECRET, (err, authData) => {
      if (err) {
        res.sendStatus(403);
      }
      req.authData = authData;
      next();
    });
    return;
  }
  res.sendStatus(403);
};

module.exports = verifyToken;
