const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Movie = require('../models/movie')


//This will deal with getting the authors route; related to the user entering their author
router.get('/', async (req, res) => {
    let searchF = {}
    //if the user search presses enter 
    if(req.query.name != null 
        && req.query.name !== '') {
        searchF.name = new RegExp(req.query.name, 'i')
    }
    try {
        //this will allow the search feature to work 
        //while also waiting for mangodb to successfully get the users recently added author 
        const authors = await Author.find(searchF)
        res.render('authors/index', {authors: authors, searchF: req.query})
    } catch {
        //if an error occurs send the user back to the index
        res.redirect('/')
    }
})


//this will actually create it aka(POST)
//because we are posting to that specific section to create the new author
router.post('/', async (req,res) => {
    //dealing with the action of the user pressing the apply button for the author
    const author = new Author({
        name: req.body.name
    })
    try {
        //due to mongodb and mongoose are based on async calls
        //we need to apply await so we make sure the async call is done to continue
        const newAuthor = await author.save()
        res.redirect(`authors/${newAuthor.id}`)
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage:'oops something error creating the author...'
        })
    }
})

//This will deal with getting the new authors route aka(GET)
router.get ('/new', (req,res) => {
    res.render('authors/new', {
        author: new Author()
    })
})



//Here we are defining a route for dealing with HTTP Get req for the director
//portion
router.get('/:id', async(req, res) => {

    try {
        const author = await Author.findById(req.params.id)
        const movies = await Movie.find({author: author.id}).limit(4).exec()
        res.render('authors/show', {
            author: author,
            moviesByAuthor: movies
        })
    }catch(err){
        res.redirect('/')
    }
})

//Here we are defining a route for dealing with HTTP Get req tp allow the user 
// to edit the director portion
router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', {
            author: author
        })
    }catch {
        res.redirect('/authors')
    }
  
})








router.put('/:id', async (req, res) => {
    let author
        try {
            author = await Author.findById(req.params.id)
            author.name = req.body.name
            await author.save()
            res.redirect(`/authors/${author.id}`)
        } catch {
            if(author == null){
                res.redirect('/')
            }else {
                res.render('authors/edit', {
                    author: author,
                    errorMessage:'oops error updating the author...'
                })
            }
           
        }
})

router.delete('/:id', async(req, res) => {
    let author
    try {
        const author = await Author.deleteOne({_id: req.params.id});
        res.redirect('/authors')
    } catch {
        if(author == null){
            res.redirect('/')
        }else {
            res.redirect(`/authors/${author.id}`)
        }
       
    }
})



module.exports = router;