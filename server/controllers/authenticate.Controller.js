const { getToken } = require('../helper/passport-jwt.helper')

const passport = require('passport')
const login = {}
const signup = {}

login.get = async (req, res) => {
    res.render('login', { layout: false, flash: req.flash() })
}

login.post = function (req, res, next) {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        console.log({ err, user, info })
        if (err || !user) {
            // req.flash('error', info.message)
            return res.redirect('/login?failed')
        }
        req.login(user, { session: false }, (err) => {
            if (err) {
                res.send(err)
            }
            // generate a signed son web token with the contents of user object and return it in the response
            const token = getToken(user)
            // req.flash('success', info.message)
            res.cookie('jwt-token', token, {
                maxAge: 3600000,
                path: '/',
                HttpOnly: true,
            })
            return res.redirect('/')
        })
    })(req, res)
}

signup.get = async (req, res) => {
    res.render('signup', { layout: false, flash: req.flash() })
}

signup.post = async (req, res) => {
    res.render('the-view', { layout: false })
}

logout = async (req, res) => {
    res.cookie('jwt-token', '', {
        maxAge: 0,
    })
    res.redirect('/')
}

checkAdmin = function (req, res, next) {
    passport.authenticate(
        'admin',
        { session: false, failureRedirect: '/login', failureFlash: true },
        (err, user, info) => {
            console.log({ err, user, info })
            if (err || !user) {
                req.flash('error', 'You Should Login With Admin Account .')
                return res.redirect('/login?failed')
            }
            next()
        }
    )(req, res)
}

checkUser = function (req, res, next) {
    passport.authenticate(
        'user',
        { session: false, failureRedirect: '/login', failureFlash: true },
        (err, user, info) => {
            console.log({ err, user, info })
            if (err || !user) {
                req.flash(
                    'error',
                    'You Should Login With Normal User Account .'
                )
                return res.redirect('/login?failed')
            }
            next()
        }
    )(req, res)
}

module.exports = { login, signup, logout, checkUser, checkAdmin }
