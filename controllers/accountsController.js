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
        const { agencia, conta } = request.query;

        if (!conta || !agencia) {
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

const getAvarageByAgencia = async (request, response) => {
    try {
        const { agencia } = request.query;

        if (!agencia) {
            response.status(400).send("params invalids");
            return;
        }

        const accounts = await Account.find({ agencia: agencia });

        if (!accounts) {
            response.status(400).send("agencia not found");
            return;
        }

        const totalValues = accounts.reduce((sum, account) => {
            return sum + account.balance;
        }, 0);

        const avarage = totalValues / accounts.length;

        response.status(200).send({ agencia: agencia, average: avarage });

    } catch (error) {
        response.status(500).send(error.message);
    }
}

const getListMinValues = async (request, response) => {
    try {
        const { limit } = request.query;

        if (Number(limit) <= 0) {
            response.status(400).send("params invalids");
            return;
        }

        const data = await Account.find({}, [], { limit: Number(limit), sort: { balance: 1 } });

        response.status(200).send(data);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

const getListMaxValues = async (request, response) => {
    try {
        const { limit } = request.query;

        if (Number(limit) <= 0) {
            response.status(400).send("params invalids");
            return;
        }

        const data = await Account.find({}, [], { limit: Number(limit), sort: { balance: -1, name: 1 } });

        response.status(200).send(data);
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

const transferValue = async (request, response) => {
    try {
        const { contaOrigin, contaDestiny, value } = request.body;

        if (!contaOrigin || !contaDestiny || !value > 0) {
            response.status(400).send("params invalids");
            return;
        }
        var accountOrigin = await Account.findOne({ conta: contaOrigin });

        if (!accountOrigin) {
            response.status(400).send("account debtor invalid");
            return;
        }

        var accountDestiny = await Account.findOne({ conta: contaDestiny });

        if (!accountDestiny) {
            response.status(400).send("account creditor invalid");
            return;
        }

        if (accountOrigin.agencia === accountDestiny.agencia) {
            if (!(accountOrigin.balance >= value)) {
                response.status(400).send("not enough balance ");
                return;
            }

            accountOrigin.balance -= value;
            accountDestiny.balance += value;

            const origin = await Account.findByIdAndUpdate({ _id: accountOrigin._id }, accountOrigin, {
                new: true,
            });

            if (!origin) {
                response.status(400).send("Fail to remove credit");
                return;
            }

            const destiny = await Account.findByIdAndUpdate({ _id: accountDestiny._id }, accountDestiny, {
                new: true,
            });

            if (!destiny) {
                response.status(400).send("Fail to transfer credit");
                return;
            }

            response.status(200).send(origin);
        } else {
            if (!(accountOrigin.balance >= (value + 8))) {
                response.status(400).send("not enough balance ");
                return;
            }

            accountOrigin.balance -= (value + 8);
            accountDestiny.balance += value;

            const origin = await Account.findByIdAndUpdate({ _id: accountOrigin._id }, accountOrigin, {
                new: true,
            });

            if (!origin) {
                response.status(400).send("Fail to remove credit");
                return;
            }

            const destiny = await Account.findByIdAndUpdate({ _id: accountDestiny._id }, accountDestiny, {
                new: true,
            });

            if (!destiny) {
                response.status(400).send("Fail to transfer credit");
                return;
            }

            response.status(200).send(origin);
        }
    } catch (error) {
        response.status(500).send(error.message);
    }
}

const setListVip = async (request, response) => {
    try {

        const agencias = await Account.distinct("agencia");

        for (let index = 0; index < agencias.length; index++) {
            await Account.findOneAndUpdate({ agencia: agencias[index] }, { agencia: 99 }, { sort: { balance: -1 } });
        }

        const vipAccounts = await Account.find({ agencia: 99 });

        response.status(200).send(vipAccounts);

    } catch (error) {
        response.status(500).send(error.message);
    }
}

const removeAccount = async (request, response) => {
    try {
        const { agencia, conta } = request.query;

        if (!conta || !agencia) {
            response.status(400).send("params invalids");
            return;
        }

        const res = await Account.deleteOne({ conta: conta, agencia: agencia });

        if (res.deletedCount > 0) {
            const accounts = await Account.countDocuments({ agencia: agencia });

            response.status(200).send({ totalAccounts: accounts });

        } else {
            response.status(400).send("fail to delete account");
        }

    } catch (error) {
        response.status(500).send(error.message);
    }
}

export { getAll, credit, debit, getByAgenciaAndConta, removeAccount, transferValue, getAvarageByAgencia, getListMinValues, getListMaxValues, setListVip };