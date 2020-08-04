const express = require('express')
const router = express.Router()

router.get('/:name/hello',(req,res)=>{ // /adekjgserk/hello
    const name = req.params.name
    res.send(`Welcome user : ${name}`).status(200)
})

router.get('/another',(req,res)=>{ // /another
    res.send("another").status(200)
})

module.exports = router