/**
 * Created by ericdufresne on 2018-03-27.
 */
var functions = require('./functions');
var Responder = require('express-api-responder');

module.exports = function (opts) {

  return function (req, res, done) {
    var responder = Responder(opts);
    responder(req, res, function(){});
    req.failedRequireMiddleware = false;
    req.requires = functions.requires;
    req.allows = functions.allows;
    req.end = functions.end;
    done();
  }
};