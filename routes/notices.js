var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
    res.send({
        'message' : '알림이 정상적으로 전송되었습니다.'
    });
});

router.get('/', function(req, res, next) {
    res.send({
        'message' : '알림 리스트 검색이 정상 처리되었습니다.',
        'data' : {
            'notice_id' : 'notice_id',
            'notice_contents' : 'notice_contents',
            'trade_id' : 'trade_id'
        }
    });
});

module.exports = router;
