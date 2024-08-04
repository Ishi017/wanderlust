const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;


const listingSchema = new Schema ({
    title: {
        type : String,
        required: true,
    },
    description: {
        type : String,
    },
    image: {
        filename: {
            type: String,
            default: "listingimage",
        },
        url: {
            type: String,
            default : "https://upload.wikimedia.org/wikipedia/commons/c/cc/Taj_Mahal_Palace%2C_Mumbai_%28Bombay%29.jpg",
        set : (v) => v === ""? "https://upload.wikimedia.org/wikipedia/commons/c/cc/Taj_Mahal_Palace%2C_Mumbai_%28Bombay%29.jpg" : v, 
        }
    },
    price: {
        type : Number,
        min : 0,
    },
    location: {
        type : String,
    },
    country: {
        type : String,
    },
    reviews: [ 
        {
        type: Schema.Types.ObjectId,
        ref: "Review",
        }, 
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
        await Review.deleteMany({_id: { $in : listing.reviews }});
    }
    
})

const Listing = mongoose.model( "Listing" , listingSchema ) ;
module.exports = Listing;