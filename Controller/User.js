import UserModal from "../Modal/UserSchema.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
const User = {

      registration: async (req,res) =>{
        try {
            const {firstname, lastname, email, password, Userrole,  } = req.body;

            const existingUser = await UserModal.findOne({ email: email });
            if (existingUser) {
              return res.status(400).send({"status":"failed", "message":"User already registered with this email."});
            }else{
                if(firstname && lastname && email && password && Userrole ){
                    

                    const hashPassword = await bcrypt.hash(req.body.password, 10) 
                    const doc = new UserModal({
                        firstname:firstname,
                        lastname:lastname,
                        email:email,
                        password:hashPassword,
                        Userrole: Userrole,
                    })
                    const result = await doc.save();
        
                    const save_user = await UserModal.findOne({email:email})
                    const token = jwt.sign({userID : save_user._Id}, process.env.JWT_SECRET_KEY, {expiresIn:"5d"})
        
                   return res.status(201).send({"status":"success", "message":"Registration Success","token":token});
                    
                }else{
                    return res.status(400).send({"status":"failed", "message":"All field are required."});
                }
            }

           
        } catch (error) {
            return res.status(500).send({
                status: "failed",
                message: "An error occurred during registration.",
                error: error.message,
              });
        }
     },


      login: async (req,res) =>{
        try {
           const { email, password} = req.body;
           if(email && password){

           const result =await UserModal.findOne({email:email})
           if (result != null ){
            const isMatch = await bcrypt.compare(password, result.password)
            if(result.email == email && isMatch){

                const token = jwt.sign({userID: result._id}, process.env.JWT_SECRET_KEY,{expiresIn:"5d"})
               res.send({"status":"success", "message":"Login Success", "token":token ,  "user": {
                firstname: result.firstname,
                lastname: result.lastname,
                email: result.email,
                Userrole: result.Userrole,
                password: result.password
              }})
            }else{
             res.send({"status":"failed", "message":"Email and Password is not Valid"})
            }
           }else{
            res.send({"status":"failed", "message":"You are not a Registered User"})
           }
        }else{
            return res.status(400).send({"status":"failed", "message":"All Field are Required."});
        }
               
        } catch (error) {
            return res.status(500).send({
                status: "failed",
                message: "An error occurred during loging.",
                error: error.message,
              });
        }
     },


     forgotPassword: async (req, res) => {
        try {
          const { email, newPassword } = req.body;
    
          if (!email || !newPassword) {
            return res.status(400).send({ "status": "failed", "message": "Email and new password are required." });
          }
    
          const user = await UserModal.findOne({ email: email });
          if (!user) {
            return res.status(404).send({ "status": "failed", "message": "User not found." });
          }
    
          const hashedPassword = await bcrypt.hash(newPassword, 10);
    
          await UserModal.findOneAndUpdate({ email: email }, { password: hashedPassword });
    
          return res.status(200).send({ "status": "success", "message": "Password successfully reset. You can now log in with your new password." });
        } catch (error) {
          return res.status(500).send({
            "status": "failed",
            "message": "An error occurred while resetting the password.",
            "error": error.message,
          });
        }
      },
    
      changePassword: async (req, res) => {
        try {
          const authHeader = req.headers.authorization;
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).send({ status: "failed", message: "Unauthorized. Token is required." });
          }
          const token = authHeader.split(" ")[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
          if (!decoded) {
            return res.status(401).send({ status: "failed", message: "Invalid or expired token." });
          }
          const user = await UserModal.findById(decoded.userID);
          if (!user) {
            return res.status(404).send({ status: "failed", message: "User not found." });
          }
          const { currentPassword, newPassword } = req.body;
          if (!currentPassword || !newPassword) {
            return res.status(400).send({ status: "failed", message: "Current password and new password are required." });
          }
          const isMatch = await bcrypt.compare(currentPassword, user.password);
          if (!isMatch) {
            return res.status(400).send({ status: "failed", message: "Current password is incorrect." });
          }
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          user.password = hashedPassword;
          await user.save();
          return res.status(200).send({ status: "success", message: "Password successfully updated." });
        } catch (error) {
          return res.status(500).send({ status: "failed", message: "An error occurred.", error: error.message });
        }
      },


      AllUser: async (req,res) =>{
        try {
            const result = await UserModal.find()
            if(result){
                res.status(200).send({"status":"success", "message":"All products ssuccessfully Shown", "result": result})
            }else{
                res.status(400).send({"status":"failled", "message":"Give valid information"})
            }
        } catch (error) {
            res.status(500).send({"status":"failled","message":"An error occour", error: error.message})

        }
      }, 



      UserByID: async (req,res) =>{
        try {
            const id  = req.params.id;

            if (!id) {
                return res.status(400).send({ "status": "failed", "message": "Property ID is required" });
              }

            const result = await UserModal.findById(id)
            if(result){
                res.status(200).send({"status":"Success", "message":"Property Successfully Get", "result":result})
            }else{
                res.status(400).send({"status":"failed","message":"Please Give Valid Information"})
            }
        } catch (error) {
            res.status(500).send({"status":"failed", "message":"An error occurred", "error":error.message})
        }
      },


      UserUpdate: async (req, res) => {
        try {
            const id = req.params.id;
            const updateData = { ...req.body };

            const result = await UserModal.findByIdAndUpdate(id, updateData, { new: true });
            if (result) {
                res.status(200).send({ "status": "Success", "message": "Property Successfully Updated", "result": result });
            } else {
                res.status(400).send({ "status": "failed", "message": "Please provide valid information" });
            }
        } catch (error) {
            res.status(500).send({ "status": "failed", "message": "An error occurred during update.", "error": error.message });
        }
      },


      UserDelete: async (req,res) =>{
        try {
            const id  = req.params.id;

            if (!id) {
                return res.status(400).send({ "status": "failed", "message": "Property ID is required" });
              }

            const result = await UserModal.findByIdAndDelete(id)
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


export default User