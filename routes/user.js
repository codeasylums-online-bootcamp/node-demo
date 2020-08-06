const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const config = require('../config.json')
const secret = config.secret

const auth = require('../middleware/authorization')

const userModel = require('../models/users')

const {createUser,listUsers, listUser} = require('../controllers/users')

// to create a new user
router.post('/',createUser)

// get all the users
router.get('/',listUsers)

router.get('/:id',listUser)

router.post('/login',(req,res)=>{
    const email = req.body.email
    const password = req.body.password

    userModel
    .findOne({email:email})
    .exec()
    .then(doc=>{
        if(doc){
            if(bcryptjs.compareSync(password, doc.password)){
                // successfull login
                const token = jwt.sign({ // algorithm, exp, data, secret
                    exp: Math.floor(Date.now() / 1000) + (60*60),
                    data: doc._id
                }, secret, { algorithm: 'HS512'}) // secret <- config.json
                res.json({token:token}).status(200)
            }
            else{
                res.json({msg:"Username/Password mismatch"}).status(403)
            }
        }
        else{
            res.json({msg:"Username/Password mismatch"}).status(403)
        }
    })
    .catch(err=>{
        res.json(err).status(424)
    })
})

router.put('/change-password', auth,(req,res)=>{
    const email = req.body.email
    const password = req.body.password
    const newPassword = req.body.newPassword

    userModel
    .findOne({email:email})
    .exec()
    .then(doc=>{
        if(doc){
            if(bcryptjs.compareSync(password, doc.password)){
                doc.password = bcryptjs.hashSync(newPassword)
                doc.save((err,_) => {
                    if(err){
                        res.json(err).status(400)
                    }
                    else{
                        res.json({msg:"password updated"}).status(201)
                    }
                })
            }
            else{
                res.json({msg:"Username/Password mismatch"}).status(400)
            }
        }
        else{
            res.json({msg:"Username/Password mismatch"}).status(400)
        }
    })
    .catch(err=>{
        res.json(err).status(424)
    })
})

router.delete('/:id',(req,res)=>{
    const id = req.params.id

    userModel.findOneAndRemove({_id:id},err=>{
        if(!err){
            res.json({msg:"User removed"}).status(201)
        } 
        else{
            res.json({err:err}).status(501)
        }
    })

})

module.exports = router