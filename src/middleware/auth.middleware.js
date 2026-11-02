const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../models/blacklist.model");

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
  const isBlacklisted = await tokenBlackListModel.findOne({
    token,
  });

  if (isBlacklisted) {
    return res.status(401).json({
      message: "Token is Blacklisted!",
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
async function authSystemMiddleware(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized access, token is missing",
    });
  }
  const isBlacklisted = await tokenBlackListModel.findOne({
    token,
  });

  if (isBlacklisted) {
    return res.status(401).json({
      message: "Token is Blacklisted!",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // if verified ,it contained id (bcz we give id as token)
    const user = await userModel.findById(decoded.userId).select("+systemUser");

    if (!user.systemUser) {
      return res.status(403).json({
        message: "Forbidden access, not a system user",
      });
    }
    req.user = user;

    return next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized access, token is invalid",
    });
  }
}
module.exports = { authMiddleware, authSystemMiddleware };
