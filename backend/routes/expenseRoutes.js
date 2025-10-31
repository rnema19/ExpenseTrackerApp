const express = require('express');
const router = express.Router();
const Expense = require("../model/expenseSchema");
const { authenticateToken } = require("../middleware/auth");


router.get('/view-expense', authenticateToken, async (req,res) => {
    try {
        let expenses = await Expense.find({})
        if (!expenses || expenses.length === 0) {
            return res.status(404).json({ message: "No expenses found" });
        }
        console.log("Expenses fetched:", expenses);        
        res.json(expenses);
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ error: "Internal Server Error" }); 
    }
})

router.get('/add-expense', async (req,res) => {
    console.log("Add expense page generated");
})

router.post('/add-expense', authenticateToken, async (req,res) => {
    try {
        const newExpense = req.body
        console.log("New expense added: ", newExpense);
        const savedExpense = await Expense.create(newExpense)
        res.status(201).json({ success: true, expense: savedExpense });
    } catch (error) {
        console.error("Error submitting response:", error);
        res.status(500).json({ error: "Internal Server Error" }); 
    }
})

router.get('/:id/edit-expense', authenticateToken, async (req,res) => {
    try {
        const expenseId = req.params.id
        let existingExpense = await Expense.findById(expenseId)
        if (!existingExpense) {
            console.log("Expense not found!!!");
            return res.status(404).json({ message: "Expense not found" });
        }
        console.log("Expense edited to be fetched: ", existingExpense);
        res.status(200).json({ success: true, expense: existingExpense });
    } catch (error) {
        console.error("Error submitting response:", error);
        res.status(500).json({ error: "Internal Server Error" }); 
    }
})

router.put('/:id/edit-expense', authenticateToken, async (req,res) => {
    try {
        const expenseId = req.params.id
        let editedExpense = await Expense.findByIdAndUpdate(expenseId,
        {$set : req.body},
        {new : true, runValidators : true})
        if (!editedExpense || !expenseId) {
            console.log("Expense not found!!!");
            return res.status(404).json({ message: "Expense not found" });
        }
        console.log("Expense edited ", editedExpense);
        res.status(200).json({ success: true, expense: editedExpense });
        res.redirect(`/expenses/view-expense`);
    } catch (error) {
        console.error("Error submitting response:", error);
        res.status(500).json({ error: "Internal Server Error" }); 
    }
})

router.delete('/:id/delete-expense', authenticateToken, async (req,res) => {
    try {
        const expenseId = req.params.id
        let existingExpense = await Expense.findByIdAndDelete(expenseId)
        if (!existingExpense) {
            console.log("Expense not found!!!");
            return res.status(404).json({ message: "Expense not found" });
        }
        console.log("Expense edited to be deleted: ", existingExpense);
        console.log("All expenses: ", Expense);        
        res.status(200).json({ success: true, expense: existingExpense });
    } catch (error) {
        console.error("Error submitting response:", error);
        res.status(500).json({ error: "Internal Server Error" }); 
    }
})

module.exports = router;