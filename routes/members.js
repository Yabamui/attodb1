var express = require('express');
var router = express.Router();
var isSecure = require('./common').isSecure;
var isAuthenticated = require('./common').isAuthenticated
var formidable = require('formidable');
var path = require('path');
var Member = require('../models/member');
var passport = require('passport');

router.post('/', isSecure, function(req, res, next) {
    var action = 'member';

    if (!req.body.member_email || !req.body.member_password ||
        !req.body.member_name || !req.body.member_phone ||
        !req.body.member_registration_token) {
        return res.status(401).send({
            message : '회원가입에 실패했습니다.'
        });
    }

    Member.findByEmail(req.body.member_email, action, function(err, result) {
        if (err) {
            return next(err);
        }

        if (!result) {
            var member = {};
            member.member_email = req.body.member_email;
            member.member_password = req.body.member_password;
            member.member_name = req.body.member_name;
            member.member_zipcode = parseInt(req.body.member_zipcode || 0);
            member.member_address = req.body.member_address || 'null';
            member.member_phone = parseInt(req.body.member_phone);
            member.member_registration_token = req.body.member_registration_token;

            Member.registerUser(member, function(err, user) {
                console.log('find : '+user.id)
                if (err) {
                    return next(err);
                }
                passport.serializeUser(function(user, done) {
                    done(null, user.id);
                });

                req.login(user, function(err) {
                    if (err) {
                        return next(err);
                    }
                    delete user.password;
                    res.send({
                        message : '회원가입에 성공하였습니다.',
                        data : user
                    })
                });
            });
        }

        if (result) {
            return res.send({
                message : '이미 가입한 이메일입니다.'
            })
        }
    });
});

router.delete('/me', isAuthenticated, function(req, res, next) {

    Member.deleteByMemberId(req.user.id, function(err) {
        if (err) {
            return next(err);
        }

        req.logout();
        res.send({
            message : '계정 탈퇴에 성공하였습니다.'
        });
    });
});

router.put('/me', isSecure, isAuthenticated, function(req, res, next) {
    var action = req.body.action;

    if (action === 'password') {
        var userId = req.user.id;
        var password = req.body.password;
        var newPassword = req.body.newpassword;

        Member.updatePassword(userId, password, newPassword, function(err, result) {
            if (err) {
                return next(err);
            }
            // update 결과에 따른 반환값 설정
            if (!result) {
                return res.send({
                    message: '비밀번호를 변경할 수 없습니다.'
                })
            }
            res.send({
                message : '비밀번호가 정상적으로 변경되었습니다.'
            });
        });
    } else {
        var form = new formidable.IncomingForm();
        form.uploadDir = path.join(__dirname, '../upload/member_profile');
        form.keepExtensions = true;
        form.multiples = false;

        form.parse(req, function(err, fields, files) {
            if (err) {
                return next(err)
            }

            var user = {};
            var img_path = path.join(__dirname,'../upload/member_profile/', path.basename(files.member_profile_img.path));
            console.log('img_path : ' +img_path);
            user.member_id = req.user.id;
            user.member_phone = parseInt(fields.member_phone);
            user.member_zipcode_1 = parseInt(fields.member_zipcode_1);
            user.member_address_1 = fields.member_address_1;
            user.member_alias = fields.member_alias;
            user.member_gender = parseInt(fields.member_gender);
            user.member_img_path = img_path;

            Member.updateMember(user, function(err, result) {
                if (err) {
                    return next(err);
                }
                if (!result) {
                    return res.send({
                        message: '회원 프로필 수정을 할 수 없습니다.'
                    })
                }
                res.send({
                    message: '회원 프로필 수정이 정상적으로 처리되었습니다.'
                })
            })
        });
    }
});

router.get('/me', function(req, res, next) {
    var userId = req.user.id;
    var action = 'me';

    Member.findByMemberId(userId, action, function(err, result) {
        if (err) {
            return next(err);
        }
        console.log('result.img_path 1 : '+result.img_path);
        result.img_path = process.env.IMG_PATH + path.basename(result.img_path);
        console.log('result.img_path 2 : '+result.img_path);
        res.send({
            message : '프로필 정보가 정상적으로 조회되었습니다.',
            data: {
                member_id : result.id,
                member_alias : result.alias,
                member_phone : result.phone,
                member_profile_img : result.img_path,
                member_zipcode_1 : result.zipcode_1,
                member_address_1 : result.address_1
            }
        });
    });
});

module.exports = router;
