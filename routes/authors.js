const express = require('express')
const router = express.Router()
const Author = require('../models/author')


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


//This will deal with getting the new authors route aka(GET)
router.get ('/new', async (req,res) => {
    res.render('authors/new', {
        author: new Author()
    })
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
        //res.redirect(`authors/${newAuthor.id}`)
        res.redirect('authors')
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage:'oops something error creating the author...'
        })
    }
})



module.exports = router;