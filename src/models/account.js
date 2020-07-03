const mongoose = require("mongoose");

const accountSchema = mongoose.Schema({
    agencia: {
        type: Number,
        required: true,
    },
    conta: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) {
                throw new Error("Valor não permitido");
            }
        },
    },
});

const accountModel = mongoose.model("account", accountSchema, "account");

module.exports = accountModel;