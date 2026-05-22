const express = require("express");
const cors = require("cors");

const routes = require("./routes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "Backend server running",
  });
});

app.use("/api", routes);

module.exports = app;