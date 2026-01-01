const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./src/config/db");
const routes = require("./src/routes/index");

const app = express();

// Middleware
// Allow requests from any origin (CORS open)
const corsOptions = {
  origin: true, // reflect request origin, allows any origin
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','Accept','Origin','X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Enable CORS for all routes and handle preflight
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json());

// DB connection (cached)
let isConnected = false;
async function ensureDB() {
  if (isConnected) return;
  await connectDB();
  isConnected = true;
}

// Health check
app.get("/", async (req, res) => {
  await ensureDB();
  res.send("I am fine (Vercel)");
});

// API routes
app.use("/api", async (req, res, next) => {
  await ensureDB();
  next();
}, routes);

// ❌ REMOVE app.listen()
// Vercel handles it automatically

module.exports = app;



// const express = require("express");
// const connectDB = require("./src/config/db")
// require("dotenv").config();

// // Ensure JWT secret is set early so signing doesn't fail at runtime
// if (!process.env.JWT_SECRET) {
//     console.error("FATAL: Missing JWT_SECRET in environment (.env)");
//     process.exit(1);
// }
// const cors  = require("cors");

// const routes = require("./src/routes/index");

// const app = express();
// const port = 8080;
// connectDB();

// app.use(cors());

// app.use(express.json());

// app.use("/api", routes);


// app.get("/", (req, res) => {
//     res.send("I am fine");
// });

// app.listen(port, () => {
//     console.log("Server is running fine on port 8080");
// });
