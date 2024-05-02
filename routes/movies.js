const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const Movie = require('../models/movie')

const uploadPath = path.join('public', Movie.coverImagePath)
const imageType = ['image/jpeg', 'image/png', 'image/gif']
const Author = require('../models/author')



//This will deal will adding the movie route
router.get('/', async (req, res) => {

    let query = Movie.find()
    if(req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    try {
        const movies = await query.exec()
        res.render('movies/index', {
            movies: movies,
            searchF: req.query
        })
    } catch {
        res.redirect('/')
    }
})


//This will deal with getting the movie route aka(GET)
router.get ('/new', async (req,res) => {
    renderNewPage(res, new Movie())
})



//this will actually create it aka(POST)
//because we are posting to that specific section to create the movie
router.post('/', async (req,res) => {
    const movie = new Movie({
        title: req.body.title,
        author: req.body.author,
        releaseDate: new Date(req.body.releaseDate),
        timeCount: req.body.timeCount,
        description: req.body.description
    })

    saveCover(movie, req.body.cover)

    try {
        const newMovie = await movie.save()
        //res.redirect(`movies/${newMovie.id}`)
        res.redirect('movies')

    }catch{
        renderNewPage(res, movie, true)
    }
})



async function renderNewPage(res, movie, foundError= false) {
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            movie: movie
        }
        if(foundError) params.errorMessage = 'Oops an error was found trying to add your movie :('
        res.render('movies/new', params)
    }catch {
        res.redirect('/movies')
    }
}

function saveCover(movie, coverEncoded) {
    if(coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageType.includes(cover.type)) {
        movie.coverImage = new Buffer.from(cover.data, 'base64')
        movie.coverImageType = cover.type
    }
}



module.exports = router;