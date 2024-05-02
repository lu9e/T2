const mongoose = require('mongoose')
const Movie = require('./movie')

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

authorSchema.pre("deleteOne", async function (next) {
    try {
        const query = this.getFilter();
        const hasMovie = await Movie.exists({ author: query._id });
  
        if (hasMovie) {
            next(new Error("ERROR MOVIE FOUND."));
        } else {
            next();
        }
    } catch (err) {
        next(err);
    }
});

module.exports= mongoose.model('Author', authorSchema)