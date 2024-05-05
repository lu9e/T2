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
        res.redirect(`movies/${newMovie.id}`)

    }catch{
        renderNewPage(res, movie, true)
    }
})

//this deals with how we will show the user their movies
//show 
router.get('/:id', async(req, res) => {
    try {
        //we need to get the specific movie the user is looking for 
        //using populate we will be able to grab the movie with the
        //director inside as well. 
        const movie = await Movie.findById(req.params.id).populate('author').exec()

        //once we have the what the user is looking for we want to render it 
        res.render('movies/show', {movie: movie})

    } catch {
        res.redirect('/')
    }
})

//Editing book route
router.get ('/:id/edit', async (req,res) => {
    try {
        const book = await Movie.findById(req.params.id)
        renderEditPage(res, book)
    } catch {
        res.redirect('/')
    }
})

//update movie route
router.put('/:id', async (req,res) => {
    let movie 

    try {
        movie = await Movie.findById(req.params.id)
        movie.title = req.body.title
        movie.author = req.body.author
        movie.releaseDate = new Date(req.body.releaseDate)
        movie.timeCount = req.body.timeCount
        movie.description = req.body.description
        //make sure the cover exists
        if(req.body.cover != null && req.body.cover !== ''){
            saveCover(movie, req.body.cover )
        }
        //once everything frm the specific movie is grab
        //redirect the user
        await movie.save()
        res.redirect(`/movies/${movie.id}`)

    }catch{
        if(movie !=null){
            renderEditPage(res, movie, true)
        }
        else {
            res.redirect('/')
        }
    }
})




//deals with the delete route
//which will remove the movie the user is currently on
router.delete('/:id', async(req, res) => {
    let movie
    try {
        const movie = await Movie.deleteOne({_id: req.params.id});
        res.redirect('/movies')
    } catch {
        if(movie != null){
            res.render('movies/show', {
                movie: movie,
                errorMessage: 'Error deleting book'
            })
        }else {
            res.redirect('/')
        }
    }
})


async function renderNewPage(res, movie, foundError= false) {
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            movie: movie
        }
        if(foundError) params.errorMessage = 'Oops an error was found for your movie :('
        res.render('movies/new', params)
    }catch {
        res.redirect('/movies')
    }
}

async function renderEditPage(res, movie, foundError= false) {
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            movie: movie
        }
        if(foundError){
            if(form === 'edit'){
                params.errorMessage = 'Oops an error:('
            } else {
                params.errorMessage = 'Oops an error:('
            }
        }
        if(foundError) params.errorMessage = 'Oops an error:('
        res.render('movies/edit', params)
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