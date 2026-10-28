require("dotenv").config();

const app = require("./src/app"); // instead of import , require-all companies old are used require
const connectToDB = require("./src/config/db");

connectToDB();
app.listen(3000, () => {
  console.log("Server is running on port: 3000");
});
