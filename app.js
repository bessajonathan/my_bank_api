const express = require("express");
const app = express();
const router = require("./router");
const database = require("./src/database/config");

database();
app.use(express.json());
app.use(router);

app.listen(3001, () => {
    console.log("Api rodando na porta 3001");
});