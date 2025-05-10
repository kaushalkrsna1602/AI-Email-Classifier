const express = require("express");
const cors = require("cors");
const { geminiController } = require("./controller/geminiController");
const bodyParser = require("body-parser");
require("dotenv").config();

const PORT = 5000;
const app = express();
app.use(bodyParser.json({ limit: "5mb" }));

app.use(cors());

app.post("/classify" , geminiController)

app.listen(PORT, () => console.log(`Server running on PORT : ${PORT}`));
