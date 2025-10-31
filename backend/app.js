const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const express = require('express');
let expenseRoutes = require("./routes/expenseRoutes")
let authRoutes = require("./routes/authRoutes")
const methodOverride = require('method-override');
const dotenv = require('dotenv');
dotenv.config();

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.json())
const cors = require('cors');

// Production CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Add security headers for production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
}

const dbUri = process.env.MONGODB_URI;

mongoose.connect(dbUri).
then(() => {
    console.log("Connected to MongoDB");
}).
catch((err) => {
    console.error("Error connecting to MongoDB:", err);
})

app.get("/", async (req,res) => {
    res.send("Expense Tracker Backend is running");
})

app.use("/auth", authRoutes)
app.use("/expenses", expenseRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
})
