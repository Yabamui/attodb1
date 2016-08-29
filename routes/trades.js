var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
    res.send({
        'message' : '거래글 등록이 정상 처리됐습니다.',
        'data' : {
            'trade_id' : 'trade_id',
            'trade_title' : 'trade_title',
            'trade_product_category_1' : 'product_category_1',
            'trade_product_category_2' : 'product_category_2',
            'trade_product_imges_info' : [
                'trade_product_img'
            ],
            'trade_price' : 'price',
            'trade_dtime' :  'trade_dtime',
            'trade_product_contents' : 'product_contents',
            'trade_status' : 'status_Information',
            'trade_key_word_lists' : {
                key_word_1 : 'key_word_1',
                key_word_2 : 'key_word_2',
                key_word_3 : 'key_word_3'
            },
            'member_info' : {
                'member_alias' : 'member_alias',
                'member_profile_img' : 'profile_img_url'
            }
        }
    });
});

router.delete('/:tid', function(req, res, next) {
    res.send({
        message :  '거래글이 정상적으로 삭제되었습니다.'
    });
});

router.put('/:tid', function(req, res, next) {
    var action = req.body.action

    if (action === 'modify') {
        return res.send({
            'message' : '거래글 수정이 정상 처리됐습니다.',
            'data' : {
                'trade_id' : 'trade_id',
                'trade_title' : 'trade_title',
                'trade_product_category_1' : 'product_category_1',
                'trade_product_category_2' : 'product_category_2',
                'trade_product_imges_info' : [
                    'trade_product_img_url'
                ],
                'trade_price' : 'price',
                'trade_dtime' :  'trade_dtime',
                'trade_product_contents' : 'product_contents',
                'trade_status' : 'status_Information',
                'trade_key_word_lists' : {
                    key_word_1 : 'key_word_1',
                    key_word_2 : 'key_word_2',
                    key_word_3 : 'key_word_3'
                },
                'member_info' : {
                    'member_alias' : 'member_alias',
                    'member_profile_img' : 'member_profile_img_url'
                }
            }
        });
    }

    if (action === 'accept') {
        return res.send({
            message : '제작자에게 거래 성사 요청을 하였습니다.'
        });
    }


});

router.get('/', function(req, res, next) {
    var action = req.query.action || undefined;

    if (!action) {
        var pageNo = req.query.pageNo;
        var rowCount = req.query.rowCount;
        return res.send({
            'message': '거래글 리스트 조회가 정상 처리되었습니다.',
            'paging': {
                'prev': 'URL/trade/pageNO=(number)&countNO=(number)',
                'next': 'URL/trade/pageNO=(number)&countNO=(number)'
            },
            'data': [{
                'trade_id': 'trade_id',
                'trade_title': 'trade_title',
                'trade_product_img': 'product_img_url',
                'trade_price': 'price',
                'trade_dtime': 'trade_dtime',
                'trade_status': 'status_Information',
                'trade_key_word_lists': {
                    key_word_1: 'key_word_1',
                    key_word_2: 'key_word_2',
                    key_word_3: 'key_word_3'
                },
                'member_info': {
                    'member_alias': 'member_alias',
                    'member_profile_img': 'member_profile_img_url'
                }
            }]
        });
    }

    if (action === 'keyword') {
        return res.send({
            'message' : '거래글 키워드 조회가 정상 처리되었습니다.',
            'paging' : {
                'prev' : 'URL/trade/pageNO=(number)&countNO=(number)',
                'next' : 'URL/trade/pageNO=(number)&countNO=(number)'
            },
            'data' : [{
                'trade_id' : 'trade_id',
                'trade_title' : 'trade_title',
                'trade_product_img' : 'trade_product_img_url',
                'trade_price' : 'price',
                'trade_dtime' :  'trade_dtime',
                'trade_status' : 'status_Information',
                'trade_key_word_lists' : {
                    key_word_1 : 'key_word_1',
                    key_word_2 : 'key_word_2',
                    key_word_3 : 'key_word_3'
                },
                'member_alias' : 'member_alias',
                'member_profile_img' : 'member_profile_img_url'
            }]
        });
    }

    if (action === 'tradeid') {
        return res.send({
            'message' : '거래글 상세 검색이정상 처리됐습니다.',
            'data' : {
                'trade_id' : 'trade_id',
                'trade_title' : 'trade_title',
                'trade_product_category_1' : 'product_category_1',
                'trade_product_category_2' : 'product_category_2',
                'trade_product_imges_info' : [
                    'trade_product_img_url'
                ],
                'trade_price' : 'price',
                'trade_dtime' :  'trade_dtime',
                'trade_product_contents' : 'product_contents',
                'trade_status' : 'status_Information',
                'trade_key_word_lists' : {
                    key_word_1 : 'key_word_1',
                    key_word_2 : 'key_word_2',
                    key_word_3 : 'key_word_3'
                },
                'member_info' : {
                    'member_alias' : 'member_alias',
                    'member_profile_img' : 'member_profile_img_url'
                }
            }
        });
    }

    if (action === 'productorder') {
        return res.send({
            'message' : '제작 주문서 정보 검색이정상 처리됐습니다.',
                'data' : {
            'trade_id' : 'trade_id',
            'trade_title' : 'trade_title',
                'trade_product_imges_info' : [
                'trade_product_img_url'
            ],
                'trade_price' : 'price',
            'trade_dtime' :  'trade_dtime',
                'trade_product_contents' : 'product_contents',
                'trade_status' : 'status_Information',
            'trade_key_word_lists' : {
                key_word_1 : 'key_word_1',
                key_word_2 : 'key_word_2',
                key_word_3 : 'key_word_3'
            },
            'member_info' : {
                'member_alias' : 'member_alias',
                    'member_profile_img' : 'member_profile_img_url',
                    'member_score' : 'score'
            }
        }
        });
    }

    if (action === 'self') {
        return res.send({
            'message' : '내 거래글 리스트 조회가 정상 처리되었습니다.',
            'paging' : {
                'prev' : 'URL/trade/pageNO=(number)&countNO=(number)',
                'next' : 'URL/trade/pageNO=(number)&countNO=(number)'
            },
            'data' : [{

                'trade_id' : 'trade_id',
                'trade_title' : 'trade_title',
                'trade_product_img' : 'product_img_url',
                'trade_price' : 'price',
                'trade_dtime' :  'trade_dtime',
                'trade_status' : 'status_Information',
                'trade_key_word_lists' : {
                    key_word_1 : 'key_word_1',
                    key_word_2 : 'key_word_2',
                    key_word_3 : 'key_word_3'
                },
                'member_alias' : 'member_alias',
                'member_profile_img' : 'member_profile_img_url'
            }]
        });
    }
});

module.exports = router;
