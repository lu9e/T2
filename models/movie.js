const mongoose = require('mongoose')
const coverImagePath = 'uploads/movieCovers'
const path=require('path')

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    releaseDate: {
        type: Date,
        required: true
    },
    timeCount: {
        type: Number,
        required: true
    },
    addedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    }
})

movieSchema.virtual('coverImagePath').get(function () {
    if(this.coverImageName != null ){
        return path.join('/', coverImagePath, this.coverImageName)
    }
})


module.exports= mongoose.model('Movie', movieSchema)
module.exports.coverImagePath = coverImagePath