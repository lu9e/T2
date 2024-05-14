
const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')



function initialize(passport, getUserByEmail, getUserById) {
    //the params  we need to make sure the user credentials is correct is email,password and done to continue
    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email)
        //the user does not exist || making sure there is a user to find 
        if(user == null) {
            return done(null, false, {message: 'User Email Not Found!'})
        }


        //a user was found
        try{

            if(await bcrypt.compare(password, user.password)) {
                //the users password matches 
                return done(null, user)

                
            } else {
                //password did not match 
                return done(null, false, {message : 'Incorrect Password'})
            }

        }catch(e) {
            //an error
            return done(e)
        }
    }


    passport.use(new localStrategy({ usernameField: 'email'}, 
    authenticateUser))

    passport.serializeUser((user, done) => done(null, user.id))

    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}


module.exports = initialize