const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const app = express();
const routes = require("../configRoutes/configRoutes");

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api", routes);




app.get("/", async (req, res) => {
  res.status(200).json("app works.");
});

module.exports = app;