export default (mongoose) => {
    const schema = mongoose.Schema({
        agencia: {
            type: String,
            required: true
        },
        conta: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        balance: {
            type: Number,
            required: true,
            min: 0.1
        }
    });

    const Account = mongoose.model('accounts', schema);

    return Account;
}