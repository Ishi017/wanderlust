const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");
const Listing = require('../models/listing'); 

//signup
router.route("/signup")
.get( userController.signupGet )
.post( wrapAsync( userController.signupPost))

router.route("/login")
.get( userController.loginGet )
.post( saveRedirectUrl , passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
userController.loginPost )

router.get("/logout",  userController.logout );

//misc routes
router.get("/aboutus", (req,res) => {
    res.render("aboutUs.ejs");
});


module.exports = router;