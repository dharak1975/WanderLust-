const Listing = require("../models/listing.js");

module.exports.index = async (req,res)=>{
   const allListings = await Listing.find({});
    res.render("C:/Users/yashl/OneDrive/Desktop/AIRBNB/views/listings/index.ejs", {allListings});
};

module.exports.renderNewform = async (req,res)=>{
    if(!req.isAuthenticated()){
        req.flash("success","you must be logged in to add new place")
       return res.redirect("/login")
    }
    res.render("new.ejs")

};

module.exports.showlisting = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "review",populate:{path:"author",},}).populate("owner");
    res.render("show.ejs", {listing})

};

module.exports.createlisting = async (req,res,next)=>{
    let url = req. file.path;
let filename = req.file.filename;
    if (!req.body. listing) {
throw new ExpressError(400, "Send valid data for listing");}
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","New Location Created!");
    res.redirect("/listings");}

module.exports.editlisting = async (req,res)=>{
     if(!req.isAuthenticated()){
        req.flash("success","you must be logged in to EDIT")
       return res.redirect("/login")
    }
     let {id} = req.params;
    const listing = await Listing.findById(id);
     res.render("edit.ejs", {listing})
}
module.exports.updatelisting = async (req,res)=>{
    if (!req.body. listing) {
throw new ExpressError(400, "Send valid data for listing");}
     let {id} = req.params;
    let listing =  await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined"){
     let url = req. file.path;
let filename = req.file.filename;
listing.image = {url,filename};
    await listing.save();}
    req.flash("success","Updated Successfully!")
     res.redirect(`/listings/${id}`)
}

module.exports.destroylisting = async (req,res)=>{
    if(!req.isAuthenticated()){
        req.flash("success","you must be logged in to DELETE")
       return res.redirect("/login")
    }
    let {id} = req.params;
    let deletedListing =  await Listing.findByIdAndDelete(id);
     req.flash("success","Deleted Successfully!");
    res.redirect("/listings")
}