const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner , validateListing }  = require("../middleware.js");
const listingController = require("../controllers/listing.js")
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//index & create
router.route("/")
.get( wrapAsync( listingController.index ))
.post( isLoggedIn ,upload.single("listing[image]"), validateListing, wrapAsync( listingController.create ))

//new
router.get("/new" ,isLoggedIn, listingController.new );

//show && update && delete
router.route("/:id")
.get( wrapAsync(listingController.show ))
.put( isLoggedIn, isOwner , upload.single("listing[image]"), validateListing , wrapAsync( listingController.update))
.delete( wrapAsync( isLoggedIn, isOwner , listingController.delete))
 
//edit
router.get("/:id/edit" ,isLoggedIn, isOwner , listingController.edit );
 
 module.exports = router;