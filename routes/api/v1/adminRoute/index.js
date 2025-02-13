const express = require("express");
const routes = express.Router();
const adminCtrl = require("../../../../controller/api/v1/adminController/adminController");
const passport = require("passport");

routes.post("/regesterAdmin", adminCtrl.regesterAdmin);

routes.post("/loginAdmin",adminCtrl.loginAdmin)

routes.get("/adminProfile",passport.authenticate("jwt",{failureRedirect:"/api/failToLogin"}),adminCtrl.adminProfile)

routes.get("/adminLogOut",passport.authenticate("jwt",{failureRedirect:"/api/failToLogin"}),adminCtrl.adminLogOut)

routes.put("/adminProfileEdit/:id",passport.authenticate("jwt",{failureRedirect:"/api/failToLogin"}),adminCtrl.adminProfileEdit)

routes.post("/adminChangePassword",passport.authenticate("jwt",{failureRedirect:"/api/failToLogin"}),adminCtrl.adminChangePassword)

routes.post("/adminForgotPassword/:email",passport.authenticate("jwt",{failureRedirect:"/api/failToLogin"}),adminCtrl.adminForgotPassword)

routes.post("/sendMail",adminCtrl.sendMail)

routes.get("/failToLogin", async(req,res)=>{
    try {
        return res.status(200).json({ message: "Unauthorise user"}); 
    } catch (err) {
        return res.status(400).json({ message: "shomething is wrong", error: err }); 
    }
} )
module.exports = routes;
