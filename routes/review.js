const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isAuthor }  = require("../middleware.js");
const reviewController = require("../controllers/review.js");

//review
//post review 
router.post("/" ,isLoggedIn , validateReview ,  wrapAsync( reviewController.post ));

//delete review
router.delete("/:reviewId" , isLoggedIn, isAuthor, wrapAsync( reviewController.delete))

module.exports = router;