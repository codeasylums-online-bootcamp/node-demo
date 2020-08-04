const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')


const userModel = require('../models/users')

// to create a new user
router.post('/',(req,res)=>{
    const email = req.body.email
    const password = req.body.password

    const newUser = new userModel({
        _id: new mongoose.Types.ObjectId(),
        email: email,
        password: bcryptjs.hashSync(password)
    })

    newUser.save((err,_) => {
        if(err){
            res.json(err).status(400)
        }
        else{
            res.json({msg:"User registered"}).status(201)
        }
    })
})

// get all the users
router.get('/',(req,res)=>{
    userModel
    .find()
    .select('-password -__v')
    .exec()
    .then(users => {
        res.json({users:users}).status(200)
    })
    .catch(err => {
        res.json({err:err}).status(501)
    })
})

router.get('/:id',(req,res)=>{
    const id = req.params.id
    userModel
    .findById(id)
    .select('-password -__v')
    .exec()
    .then(user => {
        res.json({user:user}).status(200)
    })
    .catch(err => {
        res.json({err:err}).status(501)
    })
})

router.post('/login',(req,res)=>{
    const email = req.body.email
    const password = req.body.password

    userModel
    .findOne({email:email})
    .exec()
    .then(doc=>{
        if(doc){
            if(bcryptjs.compareSync(password, doc.password)){
                res.json({msg:"Successfull login"}).status(200)
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

router.put('/change-password',(req,res)=>{
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