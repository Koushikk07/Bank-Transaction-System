const mongoose = require("mongoose");

function connectToDB() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Server is connected to Database");
    })
    .catch((err) => {
      console.log("Error while connecting to Database", err);
      process.exit(1);
    });
}

module.exports = connectToDB;
