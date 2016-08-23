var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var FacebookTokenStrategy = require('passport-facebook-token');
var Member = require('../models/member');

passport.use(new LocalStrategy({
    usernameField: 'email', passwordField: 'password'}, function(email, password, done) {
    Member.findByEmail(email, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            customer.verifyPassword(password, user.password, function(err, result) {
                if (err) {
                    return done(err);
                }
                if (!result) {
                    return done(null, false);
                }
                delete user.password;
                done(null, user)
            });
        });
}));


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    Member.findByMemberId(id, function(err, user) {
        if (err) {
            return done(err);
        }
        done(null, user);
    });
});


router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send({
                message: 'login failed!!!'
            });
        }
        req.login(user, function(err) {
            if (err) {
                return next(err);
            }
            next();
        });
    })(req, res, next);
}, function(req, res, next) {
    var user = {};
    user.email = req.user.email;
    user.name = req.user.name;
    res.send({
        message: 'local login',
        user: user
    });
});

router.get('/logout', function(req, res, next) {
    req.logout();
    res.send({
        message: 'local logout'
    });
});

router.post('', function)

module.exports = router;
