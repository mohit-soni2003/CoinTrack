const express = require("express");
const connectDB = require("./src/config/db");
require("dotenv").config();
const cors = require("cors");
const routes = require("./src/routes/index");

const app = express();

if (!process.env.JWT_SECRET) {
  console.error("FATAL: Missing JWT_SECRET");
  process.exit(1);
}

const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN_URL,
  credentials: true,
};

app.use(cors(corsOptions)); // ✅ enough
app.use(express.json());

connectDB();

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("I am fine");
});

const port = 8080;
app.listen(port, () => {
  console.log("Server running on port 8080");
});
