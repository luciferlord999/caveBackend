const express = require("express");
const cors = require("cors");
const api_route = express();
const session = require("express-session");
const config = require("../config/config");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const verifyToken = require("../middleware/userAuth");
const jwt = require("jsonwebtoken");
const secretKey = "hello6g7yg678g8y"; // Replace with a strong secret in production
api_route.use(cors());
api_route.use(bodyParser.json());
api_route.use(bodyParser.urlencoded({ extended: true }));
const apiController = require("../controller/ApiController");
const authenticateToken = require("../middleware/authenticateToken");
//============ API Routes User========================//
api_route.get("/token", (req, res) => {
  const userData = {
    email: "navneet",
  };
  jwt.sign({ ...userData }, secretKey, { expiresIn: "360d" }, (err, token) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json({ token });
  });
});
api_route.post("/register", authenticateToken, apiController.signupUser);
api_route.post("/login", authenticateToken, apiController.user_loin);
module.exports = api_route;
