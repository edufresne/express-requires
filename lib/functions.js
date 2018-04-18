/**
 * Created by ericdufresne on 2018-03-27.
 */
exports.requires = function (req, res) {
    return function (fields) {
        if (!req.failedRequireMiddleware) {
            if (!req.actAsList) {
                for (var i in fields) {
                    if (fields.hasOwnProperty(i)) {
                        var field = fields[i];
                        if (req.body[field] === undefined || req.body[field] === null) {
                            req.failedRequireMiddleware = true;
                            res.error('Missing required field: ' + field, 400);
                            return this;
                        }
                    }
                    else {
                        req.failedRequireMiddleware = true;
                        res.error('Missing required field', 400);
                        return this;
                    }
                }
            }
            else {
                if (!(req.body instanceof Array)) {
                    res.error('Expecting array JSON body', 400);
                }
                else {
                    for (var j in req.body) {
                        if (req.body.hasOwnProperty(j)) {
                            var item = req.body[j];
                            for (var k in fields) {
                                if (fields.hasOwnProperty(k)) {
                                    var field2 = fields[k];
                                    if (item[field2] === undefined || item[field2] === null) {
                                        req.failedRequireMiddleware = true;
                                        res.error('Missing required field: ' + field2 + ' at item: ' + j, 400);
                                    }
                                }

                            }
                        }
                    }
                }
            }

        }
        return this;
    };
};

exports.allows = function (req, res) {
    return function (fields) {
        if (!req.failedRequireMiddleware) {
            if (!req.actAsList) {
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
            else {
                if (!(req.body instanceof Array)) {
                    res.error('Expecting array JSON body', 400);
                }
                else {
                    for (var i in req.body) {
                        if (req.body.hasOwnProperty(i)) {
                            var item = req.body[i];
                            for (var k in item) {
                                if (item.hasOwnProperty(k)) {
                                    if (fields.indexOf(k) < 0) {
                                        req.failedRequireMiddleware = true;
                                        res.error('Unexpected field: ' + k + ' at item: ' + i);
                                    }
                                }
                                else {
                                    req.failedRequireMiddleware = true;
                                    res.error('Unexpected field: ' + k, 400);
                                    return this;
                                }
                            }
                        }
                    }
                }
            }

        }
        return this;
    };
};

exports.list = function () {
    return function () {
        this.actAsList = true;
        return this;
    };

};

exports.check = function () {
    return function () {
        return !this.failedRequireMiddleware;
    };
};