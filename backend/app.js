const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const express = require('express');
let expenseRoutes = require("./routes/expenseRoutes")
let authRoutes = require("./routes/authRoutes")
const cors = require('cors');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
dotenv.config();

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.json())
app.use(cors())


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
