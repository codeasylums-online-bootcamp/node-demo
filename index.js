const express = require('express')
const morgan = require('morgan')
const parser = require('body-parser');
const mongoose = require('mongoose')

const app = express()

const userRoutes = require('./routes/user')

const port = 3000
let count = 0;

app.use(morgan('dev'))
app.use(parser.json())
app.use(parser.urlencoded({extended:true}))

mongoose.connect('mongodb://localhost:27017/node-demo',{useNewUrlParser: true,useUnifiedTopology: true ,useCreateIndex: true },function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log("DB connected");
    }
});
// /count
app.use('*',(request,response,next) => {
    count++
    next()
})

app.get('/count',(request,response,next)=>{
    response.send(`the count is: ${count}`).status(200)
})

app.use('/user',userRoutes) // 

// name = "satyarth"
// `abc xyz hello ${name}` => "abc xyz hello satyarth"

app.use('*',(req,res)=>{
    res.send("Endpoint doesnt exist").status(404)
})

app.listen(port,() => {
    console.log(`Server started at ${port}`)
})
