const express = require('express')
const morgan = require('morgan')

const app = express()

const userRoutes = require('./routes/user')

const port = 3000
let count = 0;

app.use(morgan('dev'))
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
