import TaskModel from "../Modal/TaskSchema.js";

const Task  = {

    createTask : async (req,res) => {
        try {
            const {PostBy, title, status, description, due_date, userId, Assign_To,date} = req.body

            if(PostBy && title && status && description  && due_date && userId && Assign_To ){
                 const doc = new TaskModel({
                    PostBy: PostBy,
                    title: title,
                    status: status,
                    description: description,
                    due_date: due_date,
                    userId: userId,
                    Assign_To: Assign_To,
                    date:date
                 })
                 const result = await doc.save()
                 res.status(200).send({"status":"Success", "message":"Product is successfully created", "result": result})
            }else{
                res.status(400).send({"status":"failled", "message":"All field are required"})
            }
        } catch (error) {
            res.status(500).send({"status":"failled","message":"An error occour", error: error.message})
        }
    },

    AllTask : async (req,res) =>{
        try {
            const result = await TaskModel.find()
            if(result){
                res.status(200).send({"status":"success", "message":"All products ssuccessfully Shown", "result": result})
            }else{
                res.status(400).send({"status":"failled", "message":"Give valid information"})
            }
        } catch (error) {
            res.status(500).send({"status":"failled","message":"An error occour", error: error.message})

        }
    }, 
    AllTaskByUser : async (req,res) =>{
        try {
            const userId = req.params.userId;
            const result = await TaskModel.find({userId:userId})
            if(result){
                res.status(200).send({"status":"success", "message":"All products ssuccessfully Shown", "result": result})
            }else{
                res.status(400).send({"status":"failled", "message":"Give valid information"})
            }
        } catch (error) {
            res.status(500).send({"status":"failled","message":"An error occour", error: error.message})

        }
    }, 


  
    TaskByID: async (req,res) =>{
        try {
            const id  = req.params.id;

            if (!id) {
                return res.status(400).send({ "status": "failed", "message": "Property ID is required" });
              }

            const result = await TaskModel.findById(id)
            if(result){
                res.status(200).send({"status":"Success", "message":"Property Successfully Get", "result":result})
            }else{
                res.status(400).send({"status":"failed","message":"Please Give Valid Information"})
            }
        } catch (error) {
            res.status(500).send({"status":"failed", "message":"An error occurred", "error":error.message})
        }
     },


     TaskUpdate: async (req, res) => {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).send({ "status": "failed", "message": "Task ID is required" });
            }
            
            const updateData = { ...req.body };

            const result = await TaskModel.findByIdAndUpdate(id, updateData, { new: true });
            if (result) {
                res.status(200).send({ "status": "Success", "message": "Property Successfully Updated", "result": result });
            } else {
                res.status(400).send({ "status": "failed", "message": "Please provide valid information" });
            }
        } catch (error) {
            res.status(500).send({ "status": "failed", "message": "An error occurred during update.", "error": error.message });
        }
    },


    TaskDelete: async (req,res) =>{
        try {
            const id  = req.params.id;

            if (!id) {
                return res.status(400).send({ "status": "failed", "message": "Property ID is required" });
              }

            const result = await TaskModel.findByIdAndDelete(id)
            if(result){
                res.status(200).send({"status":"Success", "message":"Property Successfully Delete", "result":result})
            }else{
                res.status(400).send({"status":"failed","message":"Please Give Valid Information"})
            }
        } catch (error) {
            res.status(500).send({"status":"failed", "message":"An error occurred", "error":error.message})
        }
     },


   
  

   

}
export default Task 