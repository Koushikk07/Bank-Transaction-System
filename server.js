require("dotenv").config();

const app = require("./src/app"); // instead of import , require-all companies old are used require
const connectToDB = require("./src/config/db");

connectToDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
