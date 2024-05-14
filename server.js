//load in environmental variables
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session= require('express-session')

const initializePassport = require ('./pConfig')
initializePassport(
    passport, email => users.find(user => user.email === email),
        id => users.find(user => user.id === id)
)


//password storage
const users = []

const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')

const movieRouter = require('./routes/movies')


app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))
app.use('/public/', express.static('./public'));







//dealing with auth:
//allows the user input into our form to be accesable inside the req
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())


//------







//----------
const mongoose = require('mongoose')
const { reset } = require('nodemon')
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connection to mongoose was a success!'))



app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/movies', movieRouter)







//setting up the authentication routes:

//auth route


//login route
app.get('/login', (req, res) => {
    res.render('login.ejs')
})


app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

//register route
app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.post('/register', async (req,res) => {

    try {
        //we are hashing the users password 10 times using bcrypt
        //this is a security measure for the program 

        //since its async we need to await for the hash password
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        //now push the hashed password to the var of users
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })

        //successful transaction send the user to the login page:
        res.redirect('/login')

    } catch {
        //unsuccessful transaction return the user to the register page to try again:
        res.redirect('/register')

    }

    console.log(users)
})






//END OF AUTH ROUTES






app.listen(process.env.PORT || 3000)