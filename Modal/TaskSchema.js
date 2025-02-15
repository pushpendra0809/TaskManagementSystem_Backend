import mongoose from "mongoose";

const Task = mongoose.Schema({
   PostBy:{
      type: String,  required:true, trim:true, 
   },
   title:{
      type: String,  required:true, trim:true, 
   },
   status:{
      type:String, require:true, trim:true,
   },
   description:{
      type:String, trim:true,
   },
   due_date:{
      type:Date, 
   },
   userId:{
    type:String, require:true, trim:true,  immutable: true,
   },
   Assign_To:{
      type:String, trim:true,
   },
   date:{
      type:Date, default:Date.now
   }

})
const TaskModel  = mongoose.model("TaskDetailes", Task)
export default TaskModel;