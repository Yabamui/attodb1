var async = require('async');
var dbPool = require('./common').dbPool;
var fs = require('fs');

//  이메일을 이용한 정보조회
function findByEmail(email, action, callback) {

    var sql = 'select id, name, email, password from member where email = ?;';

    dbPool.getConnection(function(err, dbConn) {
        if (err) {
            return callback(err);
        }
        dbConn.query(sql, [email], function(err, results) {
            dbConn.release();
            if (err) {
                return callback(err);
            }

            if (results.length === 0) {
                return callback(null, null);
            }
            
            //  action = login 은 /auth/login url 처리
            if (action === 'login') {
                var user = {};
                user.id = results[0].id;
                user.name = results[0].name;
                user.email = results[0].email;
                user.password = results[0].password;
                return callback(null, user);
            }

            //  action = member 는 /member url 에서 가입확인 처리
            if (action === 'member') {
                return callback(null, true);
            }
        });
    });
}

function verifyPassword(password, hashpassword, callback) {

    var sql = 'select sha2(?, 512) password;';

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        }

        dbConn.query(sql, [password], function (err, result) {
            dbConn.release();
            if (err) {
                return callback(err);
            }
            if (result[0].password !== hashpassword) {
                return callback(null, false);
            }
            return callback(null, true);
        });
    });
}

function findByMemberId(userId, action, callback) {
    var sql_select_ = 'select id, name, email, alias, img_path, phone, '+
                      'zipcode_1, address_1 from member where id = ?;';
    

    dbPool.getConnection(function(err, dbConn) {
        if (err) {
            return callback(err);
        }

        dbConn.query(sql_select_, [userId], function(err, results) {
            dbConn.release();
            if (err) {
                return callback(err);
            }

            // 자기 프로필 조회
            if (action == 'me') {
                var user = {};
                user.id = results[0].id;
                user.alias = results[0].alias;
                user.phone = results[0].phone;
                user.zipcode_1 = results[0].zipcode_1;
                user.address_1 = results[0].address_1;
                user.img_path = results[0].img_path;
                return callback(null, user);
            }

            // deserializeUser 조회
            var user = {};
            user.id = results[0].id;
            user.name = results[0].name;
            user.email = results[0].email;
            callback(null, user);
        });
    });
}

function deleteByMemberId(userId, callback) {
    var sql_select_filepath = 'select img_path from member where id = ?;';
    var sql_delete_member = 'update member '+
                            'set email = \'null\', password = \'null\', registration_token = \'null\', '+
                            'name = \'null\', phone = 1111, zipcode_1 = null, address_1 = null, '+
                            'zipcode_2 = null, address_2 = null, auth = null, img_path = null, '+
                            'alias = null, gender = null, facebook = null '+
                            'where id = ?;';

    dbPool.getConnection(function(err, dbConn) {
        if (err) {
            return callback(err);
        }

        dbConn.beginTransaction(function(err) {
            if (err) {
                dbConn.release();
                return callback(err);
            }

            async.series([deleteRealFile, deleteMember], function(err) {
                if (err) {
                    return dbConn.rollback(function() {
                        callback(err);
                        dbConn.release();
                    });
                }

                dbConn.commit(function() {
                    callback(null);
                    dbConn.release();
                });
            });
        });

        function deleteRealFile(callback) {
            dbConn.query(sql_select_filepath, [userId], function(err, results) {
                if (err) {
                    return callback(err);
                }

                // 등록되지 않은 프로파일 처리
                if (!results[0].img_path) {
                    return callback(null)
                }

                fs.unlink(results[0].img_path, function(err) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null);
                });
            });
        }

        function deleteMember(callback) {
            dbConn.query(sql_delete_member, [userId], function(err) {
                if (err) {
                    return callback(err);
                }
                callback(null);

            })
        }

    });
}

function findOrCreate(profile, callback) {

    var sql_select_facebookId = 'select id, name, email, facebook from member where facebook = ?;';
    var sql_insert_facebookId = 'insert into member(name, email, facebook) values(?, ?, ?);';

    dbPool.getConnection(function(err, dbConn) {
        if (err) {
            return callback(err);
        }

        dbConn.query(sql_select_facebookId, [profile.id], function(err, results) {
            if (err) {
                dbConn.release();
                return callback(err);
            }

            if (results.length !== 0) {
                dbConn.release();
                return callback(null, results[0]);
            }

            dbConn.query(sql_insert_facebookId, [profile.displayName, profile.emails[0].value, profile.id], function(err, result) {
                dbConn.release();
                if (err) {
                    return callback(err);
                }
                var user = {};
                user.id = result.insertId;
                user.name = profile.displayName;
                user.email = profile.emails[0].value;
                user.facebookid = profile.id;
                callback(null, user);
            })
        })
    })
    // return callback(null, {
    //     id: 2,
    //     name: profile.displayName,
    //     email: profile.emails[0].value,
    //     facebookid: profile.id
    // });
}

function registerUser(member, callback) {
    var sql_insert_member = 'insert into member(email, password, registration_token, name, phone, zipcode_1, address_1) '+
                            'values (?, sha2(?,512), ?, ?, ?, ?, ?);';

    var sql_select_member = 'select email, password from member where id = ?;';

    dbPool.getConnection(function(err, dbConn) {
        if (err) {
            return callback(err);
        }

        dbConn.query(sql_insert_member, [member.member_email, member.member_password,
            member.member_registration_token, member.member_name, member.member_phone, 
            member.member_zipcode, member.member_address_1], function(err, result) {
            if (err) {
                dbConn.release();
                return callback(err);
            }
            dbConn.query(sql_select_member, [result.insertId], function(err, results) {
                dbConn.release();
                if (err) {
                    return callback(err);
                }

                var member = {};
                member.id = result.insertId;
                member.email = results[0].email;
                member.password = results[0].password;

                callback(null, member);
            });

        });
    });
}

function updateMember(member, callback) {
    var sql_update_member = 'update member set phone = ?, zipcode_1 = ?, address_1 = ?, alias = ?, gender = ?, img_path = ? where id =?;';
    var sql_select_member = 'select phone, zipcode_1, address_1, alias, gender, img_path from member where id = ?';
    var sql_select_filepath = 'select img_path from member where id =?';

    dbPool.getConnection(function(err, dbConn) {
        if (err) {
            return callback(err);
        }

        dbConn.beginTransaction(function(err) {
            if (err) {
                return callback(err);
            }

            async.series([deleteRealFile, updateMember], function(err, result) {
                if (err) {
                    return dbConn.rollback(function() {
                        callback(err);
                        dbConn.release();
                    });
                }
                console.log('result : '+result[1]);
                dbConn.commit(function() {
                    callback(null, result[1]);
                    dbConn.release();
                });
            });
        });

        function deleteRealFile(callback) {
            dbConn.query(sql_select_filepath, [member.member_id], function(err, result) {
                if (err) {
                    return callback(err);
                }
                console.log('result[0].img_path : ' +result[0].img_path);
                if (result[0].img_path !== null){
                    fs.unlink(result[0].img_path, function(err) {
                        if (err) {
                            return callback(err);
                        }

                    });
                }
                callback(null);
            });
        }

        function updateMember(callback) {
            dbConn.query(sql_select_member, [member.member_id], function(err, result) {
               if (err) {
                   return callback(err);
               }
                member.member_phone = member.member_phone || result[0].phone;
                member.member_zipcode_1 = member.member_zipcode_1 || result[0].member_zipcode_1;
                member.member_address_1 = member.member_address_1 || result[0].member_address_1;
                member.member_alias = member.member_alias || result[0].member_alias;
                member.member_gender = member.member_gender || result[0].member_gender;
                console.log('member : ' +member);
                // var sql_update_member = 'update member set phone = ?, zipcode_1 = ?, address_1 = ?, alias = ?, gender = ?, img_path = ?;';
                dbConn.query(sql_update_member, [member.member_phone, member.member_zipcode_1, member.member_address_1,
                    member.member_alias, member.member_gender, member.member_img_path, member.member_id], function(err, result) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null, result.changedRows);
                });
            });
        }
    });
}

function listUsers(pageNo, rowCount, callback) {

}

function updateRegistrationToken(userId, regiToken, callback) {
    var sql = 'update member set registration_token = ? where id = ?;';

    dbPool.getConnection(function(err, dbConn) {
        if (err) {
            return callback(err);
        }

        dbConn.query(sql, [regiToken, userId], function(err, result) {
            dbConn.release();
            if (err) {
                return callback(err);
            }

            callback(null, result.changedRows);
        })
    })
}

function updatePassword(userId, password, newpassword, callback) {
    var sql_select_password = 'select password from member where id = ?;';
    var sql_sha_password = 'select sha2(?, 512) hashpassword;';
    var sql_update_password = 'update member set password = sha2(?, 512) where id = ?;';

    dbPool.getConnection(function(err, dbConn) {
        if (err) {
            return callback(err);
        }

        async.waterfall([selectpassword, shaPassword, verifyPassword], function(err, result) {
            // result false 시 비밀 번호 변경하지 않음
            if (!result) {
                return callback(null);
            }
            dbConn.query(sql_update_password, [newpassword, userId], function(err, result) {
                dbConn.release();
               if (err) {
                   return callback(err);
               }
               callback(null, result.changedRows);
            });
        });

        // DB password 조회
        function selectpassword(done) {
            dbConn.query(sql_select_password, [userId], function(err, result) {
                if (err) {
                    return done(err);
                }
                done(null, result[0].password);
            });
        }

        // 현재 password sha2 해쉬
        function shaPassword(realPassword, done) {
            dbConn.query(sql_sha_password, [password], function(err, result) {
                if (err) {
                    return done(err);
                }
                done(null, realPassword, result[0].hashpassword);
            });
        }

        // DB password 와 현재 passwordhash 비교
        function verifyPassword(realPassword, hashPassword, done) {
            if (realPassword !== hashPassword) {
                return done(null, false);
            }
            done(null, true);
        }
    });
}

function insertImage(id, files) {
    var sql_insert_files = '';

}

function updateImage(id, files) {

}

function deleteImage(id, table, callback) {
    var sql_select_img_path = 'select img_path from ? where id = ?;';

    dbPool.getConnection(function(err, dbConn) {
        dbConn.query(sql_select_img_path, [table, id], function(err, result) {
           if (err) {
               return callback(err);
           }
           async.each(result, function(item, done) {
               if (err) {
                   return done(err)
               }
               fs.unlink(item.img_path, function(err) {
                   if (err) {
                       return done(err);
                   }
               });
           });
            callback(null);
        });
    });
}

module.exports.findByEmail = findByEmail;
module.exports.verifyPassword = verifyPassword;
module.exports.findByMemberId = findByMemberId;
module.exports.deleteByMemberId = deleteByMemberId;
module.exports.findOrCreate = findOrCreate;
module.exports.registerUser = registerUser;
module.exports.updateMember = updateMember;
module.exports.listUsers = listUsers;
module.exports.updateRegistrationToken = updateRegistrationToken;
module.exports.updatePassword = updatePassword;