const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json()); //middleware
app.use(cookieParser());

/**
 * - Routes required
 */
const authRouter = require("./routes/auth.routes");
const accountRouter = require("./routes/account.routes");
const transactionRouter = require("./routes/transaction.routes");

/**
 * - Use Routes
 */
app.get("/", (req, res) => {
  res.json({
    message: "Backend Ledger API is running",
    docs: "See GitHub README",
  });
});
app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/transactions", transactionRouter);
module.exports = app;
