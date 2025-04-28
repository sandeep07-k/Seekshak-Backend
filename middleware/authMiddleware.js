const jwt = require("jsonwebtoken");

// const verifyToken = (req, res, next) => {
//   let token = req.headers.authorization;

//   if (!token) {
//     return res.status(401).json({ error: 'No token provided' });
//   }

//   // If token starts with "Bearer ", remove it
//   if (token.startsWith('Bearer ')) {
//     token = token.slice(7, token.length).trim();
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // save decoded info in request for next middleware/controller
//     next();
//   } catch (err) {
//     return res.status(403).json({ error: 'Invalid or expired token' });
//   }
// };

// module.exports = verifyToken;





module.exports = (req, res, next) => {
    const token = req.header("Authorization");
    

    if (!token) return res.status(401).json({ msg: "Access denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Invalid token" });
    }
};

module.exports = (req, res, next) => {
  const token = req.header.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};
