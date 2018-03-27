/**
 * Created by ericdufresne on 2018-03-27.
 */
exports.requires = function (fields) {
  if (!this.failedRequireMiddleware){
    for (var field in fields){
      if (fields.hasOwnProperty(field)){
        if (this.body.indexOf(field) < 0){
          this.failedRequireMiddleware = true;
          this.error(400, 'Missing required field: '+field);
          return this;
        }
      }
      else{
        this.failedRequireMiddleware = true;
        this.error(400, 'Missing required field: '+field);
        return this;
      }
    }
  }
  return this;
};

exports.allows = function (fields) {
  if (!this.failedRequireMiddleware){
    for (var key in this.body) {
      if (this.body.hasOwnProperty(key)) {
        if (fields.indexOf(key) < 0) {
          this.failedRequireMiddleware = true;
          this.error(400, 'Unexpected field: ' + key);
          return this;
        }
      }
      else {
        this.failedRequireMiddleware = true;
        this.error(400, 'Unexpected field: ' + key);
        return this;
      }
    }
  }
  return this;
};

exports.end = function () {
  return this.failedRequireMiddleware;
};