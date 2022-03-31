import mongoose from "mongoose";

const Schema = mongoose.Schema;
const todoSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        required:true
    }
})

const todoModel = mongoose.model('Todo', todoSchema);

module.exports = todoModel