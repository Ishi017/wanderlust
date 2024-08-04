const Listing = require("../models/listing.js");

//index
module.exports.index = async (req,res) => {
    const allListings = await Listing.find();
    res.render( "listings/index.ejs" , {allListings, currentPath: req.path} );
}

//new
module.exports.new = (req,res) => {
    res.render("listings/new.ejs");
}

//show
module.exports.show = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing){
     req.flash("error" , "Required listing does not exist!");
     res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}

//create
 module.exports.create = async (req,res,next) => {
     let url = req.file.path;
     let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success" , "New Listing Created !");
    res.redirect("/listings");
}

//edit
module.exports.edit = async (req,res) => {
    let {id} = req.params;
    const list = await Listing.findById(id);
    if(!list){
       req.flash("error" , "Required listing does not exist!");
       res.redirect("/listings");
    }
    let originalImageUrl = list.image.url;
    originalImageUrl.replace("/upload", "/upload/h_150, w_250");
    res.render("listings/edit.ejs", { list , originalImageUrl });  
}

//update
module.exports.update = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file != "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
}

    req.flash("success" , " Listing Updated !");
    res.redirect(`/listings/${id}`);
}

//delete
module.exports.delete = async (req,res) => {
    let {id} = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    req.flash("success" , " Listing Deleted !");
    console.log(deletedList);
    res.redirect("/listings");
}

//category
module.exports.category = async (req, res) => {
    try {
        const { category } = req.params;
        const listings = await Listing.find({ categories: category });
        // console.log(req.path);
        res.render('listings/index.ejs', { allListings: listings, category , currentPath: req.path});
    } catch (error) {
        console.error(error);
        res.redirect('/listings');
    }
}

