const Listing = require("./models/listing");
const Review = require("./models/review.js");
const { listingSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const { reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req,res,next) =>{
        if(!req.isAuthenticated()){
            req.session.redirectUrl = req.originalUrl;
            req.flash("error", "You must be logged in to create a listing");
            return res.redirect("/login");
        }    
       next();
}

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not have Permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

//middleware function for listing schema validations
module.exports.validateListing = (req,res,next) => {
    const {error} = listingSchema.validate({ listing: req.body.listing });
    if(error){
        const errorMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errorMsg);
    }else{
    next();
    }
};

//middleware function for review schema validations
module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errorMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errorMsg);
    }else{
        next();
    }
};

module.exports.isAuthor = async (req,res,next) => {
    let { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not have Permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
};