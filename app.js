import dbConnection from "./mongodb";
import express from "express";
import cors from "cors"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import todosController from "./controllers/todos"
import userController from "./controllers/userAuthorization"

dotenv.config()
const app = express()

const PORT = process.env.PORT || 8080;
dbConnection();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) =>{
    res.send("Welcome to craft api")
})

app.get('/todos', todosController.getAllTodos);
app.post('/todos', todosController.addTodo);
app.put('/todos/:id', todosController.updateTodo);
app.delete('/todos/:id', todosController.deleteTodo)
app.post('/register', userController.userRegister)
app.post('/login', userController.userLogin)


app.listen(PORT, () => console.log(`App listening on port ${PORT}`))