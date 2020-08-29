import mongoose from "mongoose";
import account from "./accountModel.js";

const db = {
    url: "mongodb+srv://bank-api:FPPMPBEjSxmHRKqW@clustermongo.tspwa.gcp.mongodb.net/igti?retryWrites=true&w=majority",
    mongoose: mongoose,
    account: account(mongoose)
};

export { db };