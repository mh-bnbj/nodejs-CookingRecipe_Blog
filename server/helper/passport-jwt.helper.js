const User = require('../models/User.Model')

const jwt = require('jsonwebtoken')

const passport = require('passport')

const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt

const LocalStrategy = require('passport-local').Strategy

passport.use(
    'local',
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true,
        },
        async function (req, username, password, done) {
            console.log('test 1.1')

            try {
                const user = await User.findOne({ username: username }).exec()
                console.log('user : ', user)
                if (!user) {
                    return done(null, false, {
                        message: 'Incorrect username .',
                    })
                }
                if (!user.verifyPassword(parseInt(password))) {
                    return done(null, false, {
                        message: 'Incorrect password .',
                    })
                }
                if (!user.verifyAdmin(req.body.admin ? true : false)) {
                    return done(null, false, {
                        message: 'your admin status is Incorrect .',
                    })
                }
                return done(null, user, { message: 'Logged In Successfully' })
            } catch (err) {
                return done(err)
            }
        }
    )
)

var opts_user = {}
opts_user.jwtFromRequest = function (req) {
    var token = null
    if (req && req.cookies) {
        token = req.cookies['jwt-token']
    }
    return token
}
opts_user.secretOrKey = 'user secure secret'

var opts_admin = {}
opts_admin.jwtFromRequest = function (req) {
    var token = null
    if (req && req.cookies) {
        token = req.cookies['jwt-token']
    }
    return token
}
opts_admin.secretOrKey = 'admin secure secret'

passport.use(
    'user',
    new JwtStrategy(opts_user, async function (jwt_payload, done) {
        try {
            let user = await User.findById(jwt_payload.sub).exec()
            if (user) {
                return done(null, user)
            } else {
                return done(null, false)
                // or you could create a new account
            }
        } catch (err) {
            return done(err, false)
        }
    })
)

passport.use(
    'admin',
    new JwtStrategy(opts_admin, async function (jwt_payload, done) {
        try {
            let user = await User.findById(jwt_payload.sub).exec()
            if (user) {
                return done(null, user)
            } else {
                return done(null, false)
                // or you could create a new account
            }
        } catch (err) {
            return done(err, false)
        }
    })
)

const getToken = (user) => {
    if (user.admin)
        return jwt.sign(
            {
                sub: user._id,
                username: user.username,
            },
            'admin secure secret',
            { expiresIn: '1 hours' }
        )
    else
        return jwt.sign(
            {
                sub: user._id,
                username: user.username,
            },
            'user secure secret',
            { expiresIn: '1 hours' }
        )
}

module.exports = { getToken }

// const token_user = jwt.sign(
//     {
//         sub: user.id,
//         username: user.username,
//     },
//     'user secure secret',
//     { expiresIn: '3 hours' }
// )

// const token_admin = jwt.sign(
//     {
//         sub: user.id,
//         username: user.username,
//     },
//     'admin secure secret',
//     { expiresIn: '3 hours' }
// )
