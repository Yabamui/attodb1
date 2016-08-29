var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
    res.send({
        'message' : '포트 폴리오가 등록되었습니다.'
    });
});

router.delete('/:pid', function(req, res, next) {
    res.send({
        'message' : '포트 폴리오가 삭제되었습니다.'
    });
});

router.put('/:pid', function(req, res, next) {
    res.send({
        'message' : '포트 폴리오가 수정되었습니다.'
    });
});

router.get('/', function(req, res, next) {
    res.send({
        'message' : '포트 폴리오 리스트 검색이 정상 처리되었습니다.',
        'paging' : {
            'prev' : 'URL/trade/pageNO=(number)&countNO=(number)',
            'next' : 'URL/trade/pageNO=(number)&countNO=(number)'
        },
        'data' : [{
            'maker_id' : 'maker_id',
            'portfolio_id' : 'portfolio_id',
            portfolio_img_info: [
                'portfolio_img_url'
            ],
            'portfolio_key_word_lists' : {
                key_word_1 : 'key_word_1',
                key_word_2 : 'key_word_2',
                key_word_3 : 'key_word_3'
            }
        }]
    });
});

router.get('/', function(req, res, next) {
    var action = req.query.portfolioNo;

    if (action === 'portfolioNo') {
        res.send({
            'message' : '포트 폴리오 상세 검색이 정상 처리되었습니다.',
            'data' : {
                'maker_id' : 'maker_id',
                'portfolio_id' : 'portfolio_id',
                'portfolio_img_info' : [
                    'portfolio_img'
                ],
                'portfolio_key_word_lists' : {
                    key_word_1 : 'key_word_1',
                    key_word_2 : 'key_word_2',
                    key_word_3 : 'key_word_3'
                },
            }
        });
    }
});

module.exports = router;
