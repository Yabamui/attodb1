var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookTokenStrategy = require('passport-facebook-token');
var Member = require('../models/member');
var isSecure = require('./common').isSecure;
var isAuthenticated = require('./common').isAuthenticated;


passport.use(new LocalStrategy({usernameField: 'member_email', passwordField: 'member_password'}, function(email, password, done) {
    var action = 'login';

    Member.findByEmail(email, action, function(err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false);
            }

            Member.verifyPassword(password, user.password, function(err, result) {
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
    var action = '';
    Member.findByMemberId(id, action, function(err, user) {
        if (err) {
            return done(err);
        }
        done(null, user);
    });
});


passport.use(new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET
}, function(accessToken, refreshToken, profile, done) {
    Member.findOrCreate(profile, function (err, user) {
        if (err) {
            return done(err);
        }
        return done(null, user);
    });
}));


router.post('/login', isSecure, function(req, res, next) {
    passport.authenticate('local', function(err, user) {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(401).send({
                message: '회원 로그인에 실패하였습니다.'
            });
        }

        Member.updateRegistrationToken(user.id, req.body.member_registration_token, function(err, result) {
            if (err) {
                return next(err);
            }

            req.login(user, function(err) {
                if (err) {
                    return next(err);
                }
                next();
            });
        });
    })(req, res, next);
}, function(req, res, next) {
    var user = {};
    user.email = req.user.email;
    user.name = req.user.name;
    res.send({
        message: '회원 로그인이 정상적으로 성공되었습니다.',
        user: user
    });
});

router.get('/logout', isAuthenticated, function(req, res, next) {
    req.logout();
    res.send({
        'message' : '로그 아웃에 성공하였습니다.'
    });
});


router.post('/facebook/token', isSecure, passport.authenticate('facebook-token', {scope : ['email']}), function(req, res, next) {
    res.send({
        message: req.user
    });
});

module.exports = router;
