const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {connection}=require("./config/db")

const app = express();


app.use(bodyParser.json());




const booksRouter = require('./routes/books');
app.use('/books', booksRouter);

app.listen(8080, async()=>{

    try{
    
    await connection
    
    console.log("Connected to Mongo")
    
    } catch(err) {
    
    console.log("Not able to comnnect to Mongo")
     console.log(err)
    }
    console.log('Server started on port 8080')
})    
