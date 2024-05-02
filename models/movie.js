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
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
        type: String,
        require: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    }
})

movieSchema.virtual('coverImagePath').get(function () {
    if(this.coverImage != null && this.coverImageType != null){
        return `data: ${this.coverImageType}; charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})


module.exports= mongoose.model('Movie', movieSchema)
module.exports.coverImagePath = coverImagePath