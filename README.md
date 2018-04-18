# express-requires
[![version](https://img.shields.io/npm/v/express-requires.svg)](https://www.npmjs.org/package/express-requires)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)
[![Build Status](https://travis-ci.org/edufresne/express-requires.svg?branch=master)](https://travis-ci.org/edufresne/express-requires)
[![Coverage Status](https://coveralls.io/repos/github/edufresne/express-requires/badge.svg?branch=master)](https://coveralls.io/github/edufresne/express-requires?branch=master)

An express middleware for validating request fields and query parameters and returns a nicely formatted informative response.
Performs two simple use cases:
- Prevent unexpected parameters from being accepted
- Requiring parameters to be passed to continue
- Or both chained together

### Setup
```
npm install express-requires --save
```
Can be used on your whole app or just a single router
```javascript
var requires = require('express-requires')
app.use(requires());
// or

var router = express.Router();
router.use(requires());

//How to use
router.post('/person/new', function(req, res) {
  var fields = ['firstName', 'lastName'];
  if (req.requires(fields).allows(fields).check()){
    //..Continue if returns true. If not do nothing because a response is formatted and returned.
  }
})
```
A bad request would return error code`400`
```json
{
  "message": "Unexpected field: sample"
}
```
```json
{
  "message": "Missing required field: firstName"
}
```

Can change the order to make a certain error condition take precedence.
```javascript
req.requires(fields).check()
req.allows(fields).check()
req.requires(fields).allows(fields).check()
req.allows(fields).require(fields).chec()
```

### Validating Lists
The above validations can also be done on a list object.
```javascript
router.post('/person/bluk-create', function(req, res) {
    var fields = ['firstName', 'lastName'];
    if (req.list().requires(fields).allows(fields).check()){
        //...
    }
})
```
Example Request
```json
{
  "firstName": "test",
  "lastName": "test2"
}
```
Response
```json
{
  "message": "Expected JSON array body"
}
```
Example 2
```json
[
  {
    "firstName": "test",
    "lastName": "test2"
  },
  {
    "firstName": "test3"
  }
]
```
Response
```json
{
  "message": "Missing required field: lastName at item 1"
}
```
### Extra Options
Can optionally add the code and success flag to the response body in event of an error.
```javascript
app.use(requires({
  includeCode: 'code',
  includeSuccess: 'success'
}));
```
Returns
```json
{
  "message": "Missing required field: lastName",
  "code": 400,
  "success": false
}
```

### Run Tests
The tests use a mock express server with the middleware in place and a series of mocha chai tests
```
npm test
npm cover
```

