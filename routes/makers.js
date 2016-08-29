var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
    res.send({
        'message' : '아토 제작자 등록이 정상 처리되었습니다.',
        'data' : {
            'maker_id' : 'maker_id',
            'maker_line_tag' : 'line_tag',
            'maker_product_category_1' : 'product_category_1',
            'maker_product_category_2' : 'product_category_2',
            'maker_score' : 'score',
            'mader_representation_img' : 'representation_img'
        }
    });
});

router.put('/:mid', function(req, res, next) {
    var action = req.body.action;

    if (action === 'modify') {
        return res.send({
            'message' : '아토 제작자 수정이 정상 처리되었습니다.',
            'data' : {
                'maker_id' : 'maker_id',
                'maker_line_tag' : 'line_tag',
                'maker_product_category_1' : 'product_category_1',
                'maker_product_category_2' : 'product_category_2',
                'maker_score' : 'score',
                'mader_representation_img' : 'representation_img'
            }
        });
    }

    if (action === 'score') {
        return res.send({
            'message' : '아토 제작자 별점 등록이 정상 처리되었습니다.',
        });
    }

});

router.get('/', function(req, res, next) {
    res.send({
        'message' : '아토 제작자 리스트 검색이 정상 처리되었습니다.',
        'paging' : {
            'prev' : 'URL/trade/pageNO=(number)&countNO=(number)',
            'next' : 'URL/trade/pageNO=(number)&countNO=(number)'
        },
        'data' : [{
            'maker_id' : 'maker_id',
            'maker_product_category_1' : 'product_category_1',
            'maker_product_category_2' : 'product_category_2',
            'maker_score' : 'score',
            'mader_representation_img' : 'representation_img'
        }]
    });
});

router.get('/', function(req, res, next) {
    var action = req.query.action;

    if (action === keyword) {
        return res.send({
            'message' : '아토 제작자 키워드 검색이 정상 처리되었습니다.',
            'data' : {
                'maker_id' : 'maker_id',
                'maker_line_tag' : 'line_tag',
                'maker_product_category' : 'product_category',
                'maker_score' : 'score',
                'mader_representation_img' : 'representation_img'
            }
        });
    }

    if (action === makerid) {
        return res.send({
            'message' : '아토 제작자 상세 검색이 정상 처리되었습니다.',
            'data' : {
                'maker_id' : 'maker_id',
                'maker_line_tag' : 'line_tag',
                'maker_product_category' : 'product_category',
                'maker_score' : 'score',
                'mader_representation_img' : 'representation_img'
            }
        });
    }

});

module.exports = router;
