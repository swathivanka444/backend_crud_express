const mongoose=require('mongoose')
const usersSchema=new mongoose.Schema({
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }

})

const users=new mongoose.model("users",usersSchema);
module.exports=users;
