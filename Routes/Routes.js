import express from "express";
const routes = express.Router()
import User from "../Controller/User.js";
import Task  from "../Controller/Task.js";

routes.post("/registration", User.registration)
routes.post("/login", User.login)
routes.post("/forgot-password", User.forgotPassword)
routes.post("/change-password", User.changePassword)
routes.get("/users", User.AllUser)
routes.get("/users/:id", User.UserByID)
routes.put("/users/:id", User.UserUpdate)
routes.delete("/users/:id",User.UserDelete)

routes.post("/task",   Task.createTask)
routes.get("/task",  Task.AllTask)
routes.get("/task/:id",  Task.TaskByID)
routes.get("/taskbyuser/:userId",  Task.AllTaskByUser)
routes.put("/task/:id",  Task.TaskUpdate)
routes.delete("/task/:id", Task.TaskDelete)





export default routes 