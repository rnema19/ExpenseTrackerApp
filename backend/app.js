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
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',                                           // Local development
      'http://localhost:3000',                                           // Alternative local port
      'https://expense-tracker-app-git-main-rnema19s-projects.vercel.app', // Production Vercel
      process.env.FRONTEND_URL                                           // Environment variable
    ].filter(Boolean); // Remove undefined values
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
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
