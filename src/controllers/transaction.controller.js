const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const accountModel = require("../models/account.model");
const emailService = require("../services/email.service");

/**
 * Create a new Transaction
 * The 10 step transfer flow:
 * 1. Validate request
 * 2. Validate idempotency key
 * 3. check account status
 * 4. Derive sender balance from ledger
 * 5. create transaction (PENDING)
 * 6. Create DEBIT ledger entry
 * 7. Create CREDIT ledger entry
 * 8. Mark transaction COMPLETED
 * 9. commit MONGODB session
 * 10. Send email notification
 */

async function createTransaction(req, res) {
  //1. Validate request
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message:
        "From Account, ToAccount, amount and IdempotencyKey are Required!",
    });
  }

  const fromUserAccount = await accountModel.find({ _id: fromAccount });
  const toUserAccount = await accountModel.find({ _id: toAccount });

  if (!fromUserAccount || !toUserAccount) {
    return res.status(400).json({
      message: "Invalid FromAccount or ToAccount",
    });
  }

  //2. Idempotency

  const isTransactionAlreadyExists = await transactionModel.findOne({
    idempotencyKey: idempotencyKey,
  });
  if (isTransactionAlreadyExists) {
    if (isTransactionAlreadyExists.status === "COMPLETED") {
      return res.status(200).json({
        message: "Transaction already processed",
        transaction: isTransactionAlreadyExists,
      });
    }
    if (isTransactionAlreadyExists.status === "PENDING") {
      return res.status(200).json({
        message: "Transaction is still processing",
      });
    }
    if (isTransactionAlreadyExists.status === "FAILED") {
      return res.status(500).json({
        message: "Transaction is Failed, Try again.",
      });
    }
    if (isTransactionAlreadyExists.status === "REVERSED") {
      return res.status(500).json({
        message: "Transaction was Reversed, Try again.",
      });
    }
  }

  //3.check account status

  if (
    !fromUserAccount.status !== "ACTIVE" ||
    !toUserAccount.status !== "ACTIVE"
  ) {
    return res.status(400).json({
      message:
        "Both fromAccount and ToAccount must be ACTIVE to process transaction",
    });
  }

  //4. Derive sender balance from ledger      (*** aggregation pipeline)
}

const balance = await fromUserAccount.getBalance();

if (balance < amount) {
  return res.status(400).json({
    message: `Insufficient Balance! Current balance is ${balance}. Requested balance is ${amount}, Remaining: ${amount - balance}`,
  });
}

module.exports = {
  createTransaction,
};
