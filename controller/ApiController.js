const path = require("path");
const ejs = require("ejs");
const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const CryptoJS = require("crypto-js");
const mailer = require("nodemailer");
const nodemailer = require("nodemailer");
const { email, emailPassword } = require("../config/config");

// Email
const sendResetPasswordMail = async (name, email, user_id) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: "luciferlordsa321@gmail.com",
        pass: "gobxbiovuyuiggxh",
      },
    });
    const emailTemplate = path.join(__dirname, "../view/Email/Email.ejs");
    const data = await ejs.renderFile(emailTemplate, {
      name,
      email,
      user_id,
    });

    var mailOptions = {
      from: "luciferlordsa321@gmail.com",
      to: email,
      bcc: "neet18101@gmail.com",
      subject: "Verify Your Account",
      html: data,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email Sent " + info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const signupUser = async (req, res, next) => {
  try {
    const { name, email, password, phonenumber, image } = req.body;
    if (!email || !password || !phonenumber || !name) {
      res.status(400).send("All fields are required");
    }

    const checkEmail = await userModel.findOne({ email: email });
    if (checkEmail) {
      res.status(200).send({ success: false, msg: "Emai Already Exists" });
    } else {
      const userData = new userModel({
        name,
        email,
        password,
        phonenumber,
        image,
      });
      const userKaDataSaver = await userData.save();
      sendResetPasswordMail(
        userKaDataSaver.name,
        userKaDataSaver.email,
        userKaDataSaver._id
      );
      return res.status(200).send({
        success: true,
        msg: "Sign up successfully & Please Verify Your Email",
      });
    }

    res.status(200).send("Sign up successfully");
  } catch (error) {
    console.log(error.message);
  }
};

// Login Api
// secure Password
const create_token = async (data) => {
  try {
    const userDataString = JSON.stringify(data);
    const secretKey = process.env.SECERT_JWT_TOKEN;
    // Encrypt userDataString using AES encryption
    const encryptedData = CryptoJS.AES.encrypt(
      userDataString,
      secretKey
    ).toString();

    return encryptedData;

    //
  } catch (error) {
    console.log(error.message);
  }
};
// login Function
const user_loin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await userModel.findOne({ email: email });

    if (userData) {
      const isPasswordValid = await bcrypt.compare(password, userData.password);
      if (isPasswordValid) {
        const dataStore = {
          name: userData.name,
          email: userData.email,
          phonenumber: userData.phonenumber,
          image: userData.image,
          isNew: true,
        };
        const tokenData = await create_token(dataStore);
        const response = {
          success: true,
          msg: "Login Successfully",
          token: tokenData,
        };
        return res.status(200).send(response);
      } else {
        return res
          .status(200)
          .send({ success: false, msg: "Invalid Credentials" });
      }
    } else {
      return res
        .status(200)
        .send({ success: false, msg: "Invalid Credentials" });
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};
// ListPropertys

const listProperty = async (req, res) => {
  try {
    console.log(req.body);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  signupUser,
  user_loin,
};
