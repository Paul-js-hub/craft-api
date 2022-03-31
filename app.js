import dbConnection from "./mongodb";
import express from "express";
import cors from "cors"
import bodyParser from "body-parser"
import dotenv from "dotenv"

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


app.listen(PORT, () => console.log(`App listening on port ${PORT}`))