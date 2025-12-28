if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const MONGO_URL= "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrap = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/reviews.js");
const listings = require("./routes/listings.js")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users.js");
const userroute = require("./routes/user.js");
const wrapAsync = require("./utils/wrapAsync.js");
const reviewcontoller = require("C:/Users/yashl/OneDrive/Desktop/AIRBNB/controllers/reviewc.js");
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views/listings"));
app.use((express.urlencoded({extended : true})));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")));


const sessionOptions = {
secret: "mysupersecretcode",
resave: false,
saveUninitialized: true,
cookie:{
expires: Date.now() +7*24*60*60 * 1000,
maxAge: 7 * 24 * 60 * 60 * 1000,
httpOnly: true,
},
}

// app.get("/",(req,res)=>{
//     res.send("hiiii");
// });
app.use(session(sessionOptions));
app.use(flash());

app.use(passport. initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user;
    next();

});

main().then(()=>{
    console.log("connected to DB");

}).catch(err=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}



app.use("/listings",listings);
app.use("/",userroute);

app.post("/listings/:id/reviews",wrapAsync(reviewcontoller.createReview) )
app.delete(
"/listings/:id/review/:reviewId",
wrapAsync(reviewcontoller.destroyReview));


// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

app.all("/*splat", (req, res, next) =>{
    next(new ExpressError(404, "Page Not Found!"));
})
app.use((err, req, res, next) => {
let {statusCode, message} = err;
res.status(statusCode).render("error.ejs",{message})
//res.status(statusCode).send(message);
});
app.listen(8080, ()=>{
    console.log("server is listening");
});

