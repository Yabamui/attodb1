var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
    res.send({
        'message' : '협상카드 등록이 정상 처리됐습니다.',
        'data' : {
            'negotiation_id' : 'negotiation_id',
            'negotiation_price' : 'price',
            'negotiation_dtime' :  'negotiation_dtime',
            'negotiation_product_contents' : 'product_contents',
            'negotiation_product_imges' :[
                'product_img_url'
            ],
            'maker_info' : {
                maker_id : 'maker_id',
                maker_name : 'member.name',
                maker_profile_img : 'maker_representation_img_url',
                maker_score : 'score'
            }
        }
    });
});

router.delete('/:nid', function(req, res, next) {
    res.send({
        'message' :  '협상카드가 정상적으로 삭제되었습니다.'
    });
});

router.put('/:nid', function(req, res, next) {

    if (action === 'modify') {
        return res.send({
            'message' : '협상카드 수정이 정상 처리됐습니다.',
            'data' : {
                'negotiation_id' : 'negotiation_id',
                'negotiation_price' : 'price',
                'negotiation_dtime' :  'negotiation_dtime',
                'negotiation_product_contents' : 'product_contents',
                'negotiation_product_imges' :[
                    'product_img_url'
                ],
                'maker_info' : {
                    maker_id : 'maker_id',
                    maker_name : 'member.name',
                    maker_profile_img : 'maker_representation_img_url',
                    maker_score : 'score'
                }
            }
        });
    }

    if (action === 'accept') {
        return res.send({
            message : '소비자의 거래 성사 요청을 수락하였습니다.'
        });
    }

    if(action === 'frequency') {
        return res.send({
            message : '수거일 선택이 완료되었습니다.'
        });
    }
});

router.get('/', function(req, res, next) {
    var action = req.query.action || undefined;

    if (!action) {
        return res.send({
            'message' : '협상카드 리스트 조회가 정상 처리되었습니다.',
            'paging' : {
                'prev' : 'URL/trade/pageNO=(number)&countNO=(number)',
                'next' : 'URL/trade/pageNO=(number)&countNO=(number)'
            },
            'data' : [{
                'negotiation_id' : 'negotiation_id',
                'negotiation_price' : 'price',
                'negotiation_dtime' :  'negotiation_dtime',
                'maker_info' : {
                    maker_id : 'maker_id',
                    maker_name : 'member.name',
                    maker_profile_img : 'maker_representation_img_url',
                    maker_score : 'score'
                }
            }]
        });
    }

    if (action === 'negoid') {
        return res.send({
            'message' : '협상카드 검색이 정상 처리됐습니다.',
            'data' : {
                'negotiation_id' : 'negotiation_id',
                'negotiation_price' : 'price',
                'negotiation_dtime' :  'negotiation_dtime',
                'negotiation_product_contents' : 'product_contents',
                'negotiation_product_imges' :[
                    'product_img_url'
                ],
                'maker_info' : {
                    maker_id : 'maker_id',
                    maker_name : 'member.name',
                    maker_profile_img : 'representation_img',
                    maker_score : 'score'
                }
            }
        });
    }

    if (action === 'frequency') {
        return res.send({
            'message' : '협상카드 수거일 정보가 정상 처리됐습니다.',
            'data' : {
                'negotiation_id' : 'negotiation_id',
                'frequency_dtime' : 'frequency_dtime'
            }
        });
    }

    if (action === 'self') {
        return res.send({
            'message' : '내 협상카드 조회가 정상 처리되었습니다.',
            'paging' : {
                'prev' : 'URL/trade/pageNO=(number)&countNO=(number)',
                'next' : 'URL/trade/pageNO=(number)&countNO=(number)'
            },
            'data' : [{
                'negotiation_id' : 'negotiation_id',
                'negotiation_price' : 'price',
                'negotiation_dtime' :  'negotiation_dtime',
                'negotiation_product_contents' : 'product_contents',
                'negotiation_product_imges' :[
                    'product_img_url'
                ],
                'maker_info' : {
                    maker_id : 'maker_id',
                    maker_name : 'member.name',
                    maker_profile_img : 'representation_img',
                    maker_score : 'score'
                }
            }]
        });
    }

});

module.exports = router;
