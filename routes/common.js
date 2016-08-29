
// 로그인 인증 확인 함수
function isAuthenticated (req, res, next) {
    if (!req.user) {
        return res.status(401).send({
            message: 'login required'
        });
    }
    next();
}

// HTTPS 통신 확인 함수
function isSecure(req, res, next) {
    if (!req.secure) {
        return res.status(426).send({
            message: 'https upgrade required'
        })
    }
    next();
}


module.exports.isAuthenticated  = isAuthenticated ;
module.exports.isSecure = isSecure;