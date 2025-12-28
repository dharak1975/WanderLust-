const express = require("express");
const router = express.Router();
const User = require("../models/users.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport")
const usercontroller = require("C:/Users/yashl/OneDrive/Desktop/AIRBNB/controllers/userc.js")

router.get("/signup",wrapAsync(usercontroller.rendersignupform));

router.post("/signup", wrapAsync(usercontroller.signup));

router.get("/login",(usercontroller.renderloginform))

router.post(
"/login",
passport.authenticate("local", {
failureRedirect: "/login",
failureFlash: true,
}),
usercontroller.login)

router.get("/logout", usercontroller.logout);

module.exports = router ;