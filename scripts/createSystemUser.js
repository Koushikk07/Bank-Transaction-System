require("dotenv").config();
const mongoose = require("mongoose");
const userModel = require("../src/models/user.model");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const email = "system@ledger.com";

  if (await userModel.findOne({ email })) {
    console.log("System user already exists");
  } else {
    await userModel.create({
      name: "System",
      email,
      password: process.env.SYSTEM_USER_PASSWORD,
      systemUser: true,
    });
    console.log("System user created");
  }
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});