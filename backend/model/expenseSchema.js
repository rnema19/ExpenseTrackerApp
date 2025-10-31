const mongoose = require('mongoose');
const { Schema } = mongoose;

const expenseSchema = new Schema({
    exp_id : { type : Number, autoincrement : true, null : false },
    title : {type : String, null : false},
    amount : {type : Number, null : false},
    category : {type : String, null : false},
    date : {type : Date, null : false},
},
{
    Collections: 'expenses'
}
)

module.exports = mongoose.model("Expenses", expenseSchema)