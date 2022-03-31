import Todo from '../models/todo'

exports.getAllTodos = async(req, res) =>{
    try{
        const todos = await Todo.find()
        return res.status(200).send(todos)
    } catch (err){
        res.send(err)
    }
}

exports.addTodo = (req, res) =>{
        const data = {
            title:req.body.title,
            description:req.body.description,
            completed:req.body.completed
        }
        const todo = new Todo(data)
        todo.save().then(doc =>{
            res.status(201).send({message: "Your todo has been successfully uploaded", doc})
        }).catch(err =>{
            res.status(500).send({message: "Something went wrong while processing your request", err})
        })
}