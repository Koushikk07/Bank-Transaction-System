const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

/* 
check whether tokens are in cookies or in header,, if not return 
if token,
check in database and set as req.user

*/
async function authMiddleware(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized access, token is missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // if verified ,it contained id (bcz we give id as token)
    const user = await userModel.findById(decoded.userId);

    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized access, token is invalid",
    });
  }
}

module.exports = { authMiddleware };
