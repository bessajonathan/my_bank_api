const express = require("express");
const router = express.Router();
const accountController = require("./src/controller/accountController");

router.get("/account", accountController.getAllAccounts);
router.get(
    "/account/checkBalance/:id",
    accountController.accountExist,
    accountController.checkBalance
);
router.put(
    "/account/deposit/:id",
    accountController.accountExist,
    accountController.deposit
);
router.put(
    "/account/withdraw/:id",
    accountController.accountExist,
    accountController.withdraw
);
router.delete(
    "/account/deleteAccount/:id",
    accountController.accountExist,
    accountController.deleteAccount
);

router.post(
    "/account/transfer",
    accountController.accountExist,
    accountController.transfer
);
router.get("/account/average/:agencia", accountController.agenciAverage);
router.get(
    "/account/lowestBalances/:quantidade",
    accountController.lowestBalances
);
router.get(
    "/account/higherBalances/:quantidade",
    accountController.higherBalances
);

router.post("/account/transferPrivate", accountController.transferPrivate);

module.exports = router;