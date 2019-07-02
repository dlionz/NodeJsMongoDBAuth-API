const express = require('express');
require('./db/mongoose');
const userRouter = require('./routes/user');
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const publicDir = path.join(__dirname, "./public");

app.use(express.json());
app.use(userRouter);
app.use(express.static(publicDir));

app.get("", (req, res) => {
    res.render("index");
});

app.listen(PORT, () => {
    console.log(`app listening on ${PORT}`);
});