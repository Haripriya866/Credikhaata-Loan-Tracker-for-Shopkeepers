// const jwt = require("jsonwebtoken");
// module.exports = function (request, response, next) {
//   const token = request.header("Authorization")?.split(" ")[1];
//   if (!token) return response.status(401).json({ message: "Access denied." });
//   try {
//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     request.user = verified;
//     next();
//   } catch (err) {
//     response.status(400).json({ message: "Invalid token." });
//   }
// };

const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. Token missing or malformed." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // { _id, email, ... }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

