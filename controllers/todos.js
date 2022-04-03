import Todo from "../models/todo";
import Joi from 'joi'
exports.getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    return res.status(200).send(todos);
  } catch (err) {
    res.send(err);
  }
};

exports.addTodo = (req, res) => {
  const data = {
    title: req.body.title,
    completed: req.body.completed,
  };
  const todo = new Todo(data);
  todo
    .save()
    .then((doc) => {
      res
        .status(201)
        .send({ message: "Your todo has been successfully uploaded", doc });
    })
    .catch((err) => {
      res
        .status(500)
        .send({
          message: "Something went wrong while processing your request",
          err,
        });
    });
};

exports.updateTodo = async (req, res) => {
  const todo = await Todo.updateOne(
    { _id: req.params.id },
    {
      $set: {
        title: req.body.title,
        //description: req.body.description,
        completed: req.body.completed,
      },
    }
  );
  if (!todo) {
    res
      .status()
      .send({ message: "The todo with that particular ID not found", todo });
  }
  const { error } = validateTodo(req.body); // result.error
    if (error) {
        res.status(400).send({message: error.details[0].message});
        return;
    }

   return res.status(201).send({ message: "The todo updated successfully", todo });
};

exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.deleteOne({ _id: req.params.id });
    if (!todo) {
      res
        .status(404)
        .send({ message: "Something went wrong while processing your request"});
    }
    res.status(200).send({ message: "Todo deleted successfully", todo });
  } catch (err) {
      const { message } = err
      res.status(200).send({msg: "The book with that particular ID not found", message})
  }
};

function validateTodo(todo) {
  const schema = Joi.object({
      title: Joi.string().min(3).required()
  });
  return schema.validate(todo);
}