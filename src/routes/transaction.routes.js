const { Router } = require("express");

const authMiddleware = require("../middleware/auth.middleware");
const transactionController = require("../controllers/transaction.controller");

const transactionRouter = Router();
/**
 * -POST /api/transactions/
 * - Create a new transaction
 */

transactionRouter.post(
  "/",
  authMiddleware.authMiddleware,
  transactionController.createTransaction,
);

module.exports = transactionRouter;
