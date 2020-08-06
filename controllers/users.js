const createUser = (req,res)=>{
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
}

const listUsers = (req,res)=>{
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
}

const listUser = (req,res)=>{
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
}

module.exports = {createUser,listUsers,listUser}