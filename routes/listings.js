const express = require("express")
const router = express.Router();
const wrap = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const listingcontroller = require("C:/Users/yashl/OneDrive/Desktop/AIRBNB/controllers/listing.js");
const multer= require("multer")
const {storage} = require("../cloudconfig.js");
const upload = multer({storage})
router.get("/", wrap(listingcontroller.index)); //index

router.get("/new", wrap(listingcontroller.renderNewform)); //rendernewform

router.get("/:id", wrap(listingcontroller.showlisting)); //showlisting

router.post("/",upload.single("listing[image]"),wrap(listingcontroller.createlisting)
);
// ("/", wrap(listingcontroller.createlisting
   
// ));
router.get("/:id/edit", wrap(listingcontroller.editlisting))

router.put("/:id",upload.single("listing[image]"), wrap(listingcontroller.updatelisting))
router.delete("/:id", wrap(listingcontroller.destroylisting))

module.exports = router;