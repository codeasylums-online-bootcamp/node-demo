const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    email : {type:String,required:true, unique:true},
    password : {type:String,required:true},
    created_at: {type: Date, required:true, default: Date.now()}
});

module.exports = mongoose.model('User',userSchema);