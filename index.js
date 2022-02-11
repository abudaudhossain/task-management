const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const mongoose = require('mongoose')
require('dotenv').config;
const cors = require('cors');


const { HomePage } = require("./controllers/taskManagement");
// const  ejs = require('ejs');



const port = process.env.PORT || 3000;

app.use(express.json({limit: "500mb"}));
app.use(express.urlencoded({extended: true, limit: '5mb'}));
app.set("view engine", "ejs");
app.use(cookieParser());

//database connection with mongoose

const dbURL = "mongodb://localhost:27017/task-management";

mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db =mongoose.connection;

db.on("error", (error) => console.log(error));
db.once('open', () => console.log("Mong DB connect success"));

app.use('/', require('./routes/app'))




app.listen(port, ()=>{
    console.log(`Listening ${port}`)
})
