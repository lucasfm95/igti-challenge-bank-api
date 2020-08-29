import { db } from "../models/database.js"

const Account = db.account;

const getAll = async (_, response) => {
    try {
        const data = await Account.find();
        response.status(200).send(data);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

const getByAgenciaAndConta = async (request, response) => {
    try {
        const { agencia, conta } = request.params;

        if (!conta || !agencia || !value > 0) {
            response.status(400).send("params invalids");
            return;
        }

        let account = await Account.findOne({ conta: conta, agencia: agencia });

        if (!account) {
            response.status(404).send("account not found");
            return;
        }

        response.status(200).send(account);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

const credit = async (request, response) => {
    try {
        const { conta, agencia, value } = request.body;

        if (!conta || !agencia || !value > 0) {
            response.status(400).send("params invalids");
            return;
        }

        let account = await Account.findOne({ conta: conta, agencia: agencia });

        if (!account) {
            response.status(400).send("account invalid");
            return;
        }

        account.balance += value;

        const data = await Account.findByIdAndUpdate({ _id: account._id }, account, {
            new: true,
        });

        if (!data) {
            response.status(400).send("Fail to add credit");
            return;
        }

        response.status(200).send(data);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

const debit = async (request, response) => {
    try {
        const { conta, agencia, value } = request.body;

        if (!conta || !agencia || !value > 0) {
            response.status(400).send("params invalids");
            return;
        }

        let account = await Account.findOne({ conta: conta, agencia: agencia });

        if (!account) {
            response.status(400).send("account invalid");
            return;
        }

        if (!(account.balance >= (value + 1))) {
            response.status(400).send("not enough balance ");
            return;
        }

        account.balance -= (value + 1);

        const data = await Account.findByIdAndUpdate({ _id: account._id }, account, {
            new: true,
        });

        if (!data) {
            response.status(400).send("Fail to add credit");
            return;
        }

        response.status(200).send(data);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

export { getAll, credit, debit, getByAgenciaAndConta };