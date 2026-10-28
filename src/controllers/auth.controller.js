const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

/**
 * - user register controller
 * - POST /api/auth/register
 */
async function userRegisterController(req, res) {
  const { email, password, name } = req.body;

  const isExists = await userModel.findOne({ email: email });

  if (isExists) {
    return res.status(422).json({
      message: "User already exists with this email",
      status: "failed",
    });
  }

  const user = await userModel.create({
    email,
    password,
    name,
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  }); //secret higher the key more secure but high cumputational

  res.cookies("token", token);

  res.status(201).json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
    token,
  }); // api sending new resource by user , so 201
}
module.exports = {
  userRegisterController,
};
