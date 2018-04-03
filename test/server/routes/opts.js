/**
 * Created by ericdufresne on 2018-03-27.
 */
var express = require('express');
var router = express.Router();
var requires = require('../../../index');
router.use(requires({
  includeSuccess: 'success',
  includeCode: 'code'
}));

router.post('/test-requires', function (req, res) {
  if (req.requires(['field1', 'field2', 'field3']).check()){
    res.noContent();
  }
});

router.post('/test-allows', function (req, res) {
  if (req.allows(['field1', 'field2', 'field3']).check()){
    res.noContent();
  }
});

router.post('/test-chain', function (req, res) {
  var fields = ['field1', 'field2', 'field3'];
  if (req.allows(fields).requires(fields).check()){
    res.noContent();
  }
});

module.exports = router;