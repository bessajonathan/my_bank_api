const accountModel = require("../models/account");

const fares = {
    transfer: 8,
};

const accountExist = async(req, res, next) => {
    const { agencia, conta } = req.body;
    const accounts = await accountModel.find({});
    const account = accounts.find(
        (account) => account.conta == conta && account.agencia == agencia
    );

    if (!account) {
        res.status(404).send("Essa conta não existe");
    }

    next();
};

const getAllAccounts = async(req, res) => {
    try {
        const accounts = await accountModel.find({});
        res.send(accounts);
    } catch (error) {
        res.status(500).send(error);
    }
};

const deposit = async(req, res) => {
    try {
        const { id } = req.params;
        const { balance } = req.body;

        let account = await accountModel.findById(id);
        account.balance = account.balance + balance;

        await account.updateOne(account);

        res.send({
            balance: account.balance,
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

const withdraw = async(req, res) => {
    try {
        const { id } = req.params;
        const { balance } = req.body;

        let account = await accountModel.findById(id);

        const value = account.balance - balance;
        if (value < 0) {
            return res.send({
                message: "Saldo insuficiente",
            });
        }

        account.balance = account.balance - balance;

        await account.updateOne(account);

        res.send({
            balance: account.balance,
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

const checkBalance = async(req, res) => {
    try {
        const { id } = req.params;

        const account = await accountModel.findById(id);

        res.send({
            balance: account.balance,
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

const deleteAccount = async(req, res) => {
    try {
        const { id } = req.params;
        const { agencia } = req.body;

        await accountModel.findOneAndDelete(id);

        const allAccounts = await accountModel.find({});
        const accounts = allAccounts.filter(
            (account) => account.agencia == agencia
        );

        console.log(accounts);

        res.send({
            accounts: accounts.length,
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

const transfer = async(req, res) => {
    try {
        const { conta, agencia, conta_destino, agencia_destino, valor } = req.body;

        const allAccounts = await accountModel.find({});
        let currentAccount = allAccounts.find(
            (account) => account.agencia === agencia && account.conta === conta
        );
        currentAccount.balance = currentAccount.balance - valor;

        if (currentAccount.balance < 0) {
            return res.send({ message: "Saldo Insuficiente" });
        }

        let accountDestination = allAccounts.find(
            (account) =>
            account.agencia === agencia_destino && account.conta === conta_destino
        );

        if (!accountDestination) {
            return res.send({ message: "A conta de destino não existe" });
        }

        let previousValue = accountDestination.balance;

        accountDestination.balance = accountDestination.balance + valor;

        if (currentAccount.agencia !== accountDestination.agencia) {
            currentAccount.balance = currentAccount.balance - fares.transfer;
        }

        await currentAccount.updateOne(currentAccount);
        await accountDestination.updateOne(accountDestination);

        res.send({
            message: `Valor transferido para ${accountDestination.name}`,
            conta: conta_destino,
            agencia: agencia_destino,
            SaldoAnterior: previousValue,
            SaldoAtual: accountDestination.balance,
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

const agenciAverage = async(req, res) => {
    try {
        const { agencia } = req.params;

        const allAccounts = await accountModel.find({});

        const accounts = allAccounts.filter(
            (account) => account.agencia === +agencia
        );

        const sum = accounts.reduce(
            (total, item) => (total = total + item.balance),
            0
        );

        const average = sum / accounts.length;
        const averageFormated = formatNumber(Number(average));

        res.send({ avarage: averageFormated });
    } catch (error) {
        res.status(500).send(error);
    }
};

const formatNumber = (value) => {
    return Intl.NumberFormat().format(value);
};

const lowestBalances = async(req, res) => {
    try {
        const { quantidade } = req.params;

        const allAccounts = await accountModel.find({});
        const filteringAccounts = allAccounts.sort((a, b) => {
            return a.balance - b.balance;
        });

        const accounts = filteringAccounts.slice(0, quantidade);

        res.send(accounts);
    } catch (error) {
        res.status(500).send(error);
    }
};

const higherBalances = async(req, res) => {
    try {
        const { quantidade } = req.params;

        const allAccounts = await accountModel.find({});
        const filteringAccounts = allAccounts.sort((a, b) => {
            return b.balance - a.balance;
        });

        const accounts = filteringAccounts.slice(0, quantidade);

        res.send(accounts);
    } catch (error) {
        res.status(500).send(error);
    }
};

const transferPrivate = async(req, res) => {
    const lstAgency = await accountModel
        .find({})
        .sort({ balance: -1 })
        .distinct("agencia");

    for (let i = 0; i < lstAgency.length; i++) {
        const [account] = await accountModel
            .find({ agencia: lstAgency[i] })
            .sort({ balance: -1 })
            .limit(1);

        account.agencia = 99;
        await account.updateOne(account);
    }

    const privateAccounts = await accountModel.find({ agencia: 99 });

    res.send(privateAccounts);
};

module.exports = {
    accountExist,
    getAllAccounts,
    deposit,
    withdraw,
    checkBalance,
    deleteAccount,
    transfer,
    agenciAverage,
    lowestBalances,
    higherBalances,
    transferPrivate,
};