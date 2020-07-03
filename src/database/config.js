const mongoose = require("mongoose");

const db = async() => {
    try {
        await mongoose.connect(
            "mongodb+srv://mongo:mongoapi@cluster.cekm8.gcp.mongodb.net/trabalho?retryWrites=true&w=majority", {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log("Conectado ao banco");
    } catch (error) {
        console.log(error);
    }
};

module.exports = db;