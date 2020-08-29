import { db } from "../models/database.js"

const Account = db.account;

const getAll = async (request, response) => {
    try {
        const data = await Account.find();
        response.status(200).send(data);
    } catch (error) {
        response.status(500).send(error);
    }
}

export { getAll };