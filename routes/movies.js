const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const Movie = require('../models/movie')

const uploadPath = path.join('public', Movie.coverImagePath)
const imageType = ['image/jpeg', 'image/png', 'image/gif']
const Author = require('../models/author')


const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageType.includes(file.mimetype))
    }
})


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
router.post('/', upload.single('cover'), async (req,res) => {
    const fileName = req.file != null ? req.file.filename : null
    const movie = new Movie({
        title: req.body.title,
        author: req.body.author,
        releaseDate: new Date(req.body.releaseDate),
        timeCount: req.body.timeCount,
        coverImageName: fileName,
        description: req.body.description
    })

    try {
        const newMovie = await movie.save()
        //res.redirect(`movies/${newMovie.id}`)
        res.redirect('movies')

    }catch{
        if(movie.coverImageName != null){
            removeErrorCover(movie.coverImageName)
        }

        renderNewPage(res, movie, true)
    }
})


function removeErrorCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if(err){
            console.error(err)
        }
    })
}


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





module.exports = router;