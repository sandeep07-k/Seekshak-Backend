

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization"); // e.g., "Bearer <token>"

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // get <token>

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // you can access req.user.userId etc.
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

