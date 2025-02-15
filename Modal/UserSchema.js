import mongoose from "mongoose";

const UserSchema = mongoose.Schema({

    firstname:{
        type: String,  required:true,trim:true, 
    },
    lastname:{
        type: String, required:true,trim:true, 
    },
    email:{
        type: String, required:true, trim:true, unique:true, 
    },
    password:{
        type:String, required:true,trim:true, 
    },
    join:{
        type:Date, default: Date.now,
    },
    Userrole: {
        type: String, required:true 
    },

})

const UserModal = mongoose.model("TaskManagementUser",UserSchema)

export default UserModal