if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}


const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


app.set("view engine", "ejs");
app.set( "views", path.join(__dirname, "/views"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended : true }));
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);

const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter : 24 * 3600,
});

store.on("error" , () => {
    console.log("Error in Session Store", err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 10,
        maxAge: 1000 * 60 * 60 * 24 * 10,
        httpOnly: true,
    },
};



app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});



main().then(() => {
    console.log("Connected to Mongodb");
}).catch(err => {
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
};


app.use("/listings", listingRouter );
app.use("/listings/:id/reviews" , reviewRouter );
app.use("/", userRouter);

app.all("*" , (req,res,next) => {
    next(new ExpressError(404, "Page not found !!"));
});

app.use((err, req,res, next) => {
    const { status = 500, message = "Something went wrong!" } = err;
//   res.status(status).send(message);
  res.status(status).render("error.ejs", { message });
});

app.listen( port, () => {
    console.log("Listening to port");
});