const Admin = require("../../../../models/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

module.exports.regesterAdmin = async (req, res) => {
  try {
    let isEmailExist = await Admin.findOne({ email: req.body.email });
    if (!isEmailExist) {
      if (req.body.password == req.body.coPass) {
        req.body.password = await bcrypt.hash(req.body.password, 10);

        let adminData = await Admin.create(req.body);
        if (adminData) {
          return res
            .status(200)
            .json({ msg: "added successfully", data: adminData });
        } else {
          return res.status(200).json({ msg: "not added" });
        }
      } else {
        return res.status(200).json({ message: "enter same password" });
      }
    } else {
      return res.status(200).json({ message: "email already in use" });
    }
  } catch (err) {
    return res.status(400).json({ message: "something is wrong", error: err });
  }
};

module.exports.loginAdmin = async (req, res) => {
  try {
    let checkAdmin = await Admin.findOne({ email: req.body.email });
    if (checkAdmin) {
      let comparepassword = await bcrypt.compare(
        req.body.password,
        checkAdmin.password
      );
      if (comparepassword) {
        checkAdmin = checkAdmin.toObject();
        delete checkAdmin.password;
        let adminToken = jwt.sign({ adminData: checkAdmin }, "alpesh", {
          expiresIn: "1d",
        });
        res
          .status(200)
          .json({ message: "User signin successfully", token: adminToken });
      } else {
        return res.status(200).json({ message: "invalid email" });
      }
    }
  } catch (err) {
    return res.status(400).json({ message: "something is wrong", error: err });
  }
};

module.exports.adminProfile = async (req, res) => {
  try {
    let adminData = await Admin.findOne({ _id: req.user._id });
    if (adminData) {
      return res.status(200).json({ message: "admin data", data: adminData });
    } else {
      return res.status(400).json({ message: "something is wrong" });
    }
  } catch (err) {
    return res.status(400).json({ message: "something is wrong", error: err });
  }
};

module.exports.adminLogOut = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "something is wrong1", error: err });
      } else {
        return res.status(200).json({ message: "logout" });
      }
    });
  } catch (err) {
    return res.status(400).json({ message: "something is wrong2", error: err });
  }
};

module.exports.adminProfileEdit = async (req, res) => {
  console.log(req.params);
  console.log(req.body);
  console.log(req.user);
  try {
    let checkData = await Admin.findById(req.params.id);
    if (checkData) {
      let updateData = await Admin.findByIdAndUpdate(req.params.id, req.body);
      if (updateData) {
        let editData = await Admin.findById(req.params.id);
        return res
          .status(200)
          .json({ message: "Update successfully", data: editData });
      } else {
        return res.status(200).json({ message: "data not update" });
      }
    } else {
      return res.status(200).json({ message: "something is wrong" });
    }
  } catch (error) {
    return res.status(400).json({ message: "something is wrong", error: err });
  }
};

module.exports.adminChangePassword = async (req, res) => {
  try {
    let signinuser = await Admin.findOne({ email: req.user.email });
    let comparepassword = await bcrypt.compare(
      req.body.cPass,
      signinuser.password
    );
    if (comparepassword) {
      if (req.body.cPass != req.body.nPass) {
        if (req.body.nPass == req.body.coPass) {
          req.body.password = await bcrypt.hash(req.body.nPass, 10);
          let updatePass = await Admin.findByIdAndUpdate(
            req.user._id,
            req.body
          );
          if (updatePass) {
            let adminUpdatedData = await Admin.findById(req.user._id);
            return res
              .status(200)
              .json({
                message: "password updated successfuly",
                data: adminUpdatedData,
              });
          } else {
            return res.status(200).json({ message: "password not update" });
          }
        } else {
          return res.status(200).json({ message: "enter same password" });
        }
      } else {
        return res.status(200).json({ message: "try deference password" });
      }
    } else {
      return res.status(200).json({ message: "enter correct password" });
    }
  } catch (err) {
    return res.status(400).json({ message: "something is wrong", error: err });
  }
};

module.exports.sendMail = async (req, res) => {
  try {
    let checkEmail = await Admin.findOne({ email: req.body.email });
    if (checkEmail) {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: "alpeshboghara47@gmail.com",
          pass: "kkysolmwyawikzlk",
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      let otp = Math.ceil(Math.random() * 10000);
      const info = await transporter.sendMail({
        from: "alpeshboghara47@gmail.com", // sender address
        to: req.body.email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: `<b>${otp}</b>`, // html body
      });
      let data = {
        email:req.body.email,otp
      }
      if (info) {
        return res.status(200).json({ message: "otp sent",data});
      } else {
        return res.status(200).json({ message: "otp not sent"});
      }
    } else {
      return res.status(200).json({ message: "invalid mail"});
    }
  } catch (err) {
    return res.status(400).json({ message: "something is wrong", error: err });
  }
};
module.exports.adminForgotPassword = async (req, res) => {
  try {
    console.log(req.params)
    console.log(req.body)
    let adminData = await Admin.findOne({email:req.params.email})
    if(adminData){
      if (req.body.newPassword == req.body.confirmPassword) {
        req.body.password = await bcrypt.hash(req.body.newPassword,10)
        let updatedData = await Admin.findByIdAndUpdate(adminData._id,req.body)
        if (updatedData) {
          let newData = await Admin.findById(adminData._id)
          return res.status(400).json({ message: "password updated successfully",data:newData});
        } else {
          return res.status(400).json({ message: "password not update"});
        }
      } else {
        return res.status(400).json({ message: "enter same password",});
      }
    }else{
      return res.status(400).json({ message: "enter valid email",});
    }
  } catch (err) {
    return res.status(400).json({ message: "something is wrong", error: err });
  }
};
