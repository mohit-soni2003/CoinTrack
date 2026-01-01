const express = require("express");
const connectDB = require("./src/config/db")
require("dotenv").config();

// Ensure JWT secret is set early so signing doesn't fail at runtime
if (!process.env.JWT_SECRET) {
    console.error("FATAL: Missing JWT_SECRET in environment (.env)");
    process.exit(1);
}
const cors  = require("cors");

const routes = require("./src/routes/index");

const app = express();
const port = 8080;
connectDB();

app.use(cors());

app.use(express.json());

app.use("/api", routes);


app.get("/", (req, res) => {
    res.send("I am fine");
});

app.listen(port, () => {
    console.log("Server is running fine on port 8080");
});
