const cors = require("cors");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.json());
app.use(cors());
// app.use('/task', tasks);

app.listen(PORT, () => {
    console.log("Server ouvindo na porta ", PORT);
});