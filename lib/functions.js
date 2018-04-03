/**
 * Created by ericdufresne on 2018-03-27.
 */
exports.requires = function (req, res) {
  return function (fields) {
    if (!req.failedRequireMiddleware){
      for (var i in fields){
        if (fields.hasOwnProperty(i)){
          var field = fields[i];
          if (req.body[field] === undefined || req.body[field] === null){
            req.failedRequireMiddleware = true;
            res.error('Missing required field: '+field, 400);
            return this;
          }
        }
        else{
          req.failedRequireMiddleware = true;
          res.error('Missing required field', 400);
          return this;
        }
      }
    }
    return this;
  };
};

exports.allows = function (req, res) {
  return function (fields) {
    if (!req.failedRequireMiddleware){
      for (var key in req.body) {
        if (req.body.hasOwnProperty(key)) {
          if (fields.indexOf(key) < 0) {
            req.failedRequireMiddleware = true;
            res.error('Unexpected field: ' + key, 400);
            return this;
          }
        }
        else {
          req.failedRequireMiddleware = true;
          res.error('Unexpected field: ' + key, 400);
          return this;
        }
      }
    }
    return this;
  };
};

exports.check = function () {
  return function () {
    return !this.failedRequireMiddleware;
  };
};