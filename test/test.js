/**
 * Created by ericdufresne on 2018-01-01.
 */
process.env.NODE_ENV = 'test';
var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('./server/bin/www');
var app = require('./server/app');
var should = chai.should();
var expect = chai.expect;

chai.use(chaiHttp);

describe('Middleware Tests', function () {

    after(function () {
        process.exit(0);
    });

    describe('Requires Tests', function () {
        it('Should be successful', function (done) {
            chai.request(app).post('/test-requires').send({
                field1: 'field1',
                field2: 'field2',
                field3: 'field3'
            }).end(function (err, res) {
                res.should.have.status(204);
                done();
            });
        });
        it('Should be unsuccessful', function (done) {
            chai.request(app).post('/test-requires').send({
                field1: 'field1',
                field3: 'field3'
            }).end(function (err, res) {
                res.should.have.status(400);
                res.body.should.have.property('message').eq('Missing required field: field2');
                done();
            });
        });
    });
    describe('Allows Tests', function () {
        it('Should be successful', function (done) {
            chai.request(app).post('/test-allows').send({
                field1: 'field1'
            }).end(function (err, res) {
                res.should.have.status(204);
                done();
            });
        });
        it('Should also be successful with more fields', function (done) {
            chai.request(app).post('/test-allows').send({
                field1: 'field1',
                field2: 'field2',
                field3: 'field3'
            }).end(function (err, res) {
                res.should.have.status(204);
                done();
            });
        });
        it('Should be unsuccessful', function (done) {
            chai.request(app).post('/test-allows').send({
                field1: 'field1',
                field2: 'field2',
                field3: 'field3',
                id: 1
            }).end(function (err, res) {
                res.should.have.status(400);
                res.body.should.have.property('message').eq('Unexpected field: id');
                done();
            });
        });
    });
    describe('Chain Tests', function () {
        it('Should be successful chain', function (done) {
            chai.request(app).post('/test-chain').send({
                field1: 'field1',
                field2: 'field2',
                field3: 'field3'
            }).end(function (err, res) {
                res.should.have.status(204);
                done();
            });
        });
        it('Should be unsuccessful. Unexpected parameter', function (done) {
            chai.request(app).post('/test-chain').send({
                field1: 'field1',
                field2: 'field2',
                field3: 'field3',
                id: 1
            }).end(function (err, res) {
                res.should.have.status(400);
                res.body.should.have.property('message').eq('Unexpected field: id');
                done();
            });
        });
        it('Should be unsuccessful. Missing field', function (done) {
            chai.request(app).post('/test-chain').send({
                field2: 'field2',
                field3: 'field3'
            }).end(function (err, res) {
                res.should.have.status(400);
                res.body.should.have.property('message').eq('Missing required field: field1');
                done();
            });
        });
        it('Should be unsuccessful. Missing field', function (done) {
            chai.request(app).post('/opts/test-requires').send({
                field2: 'field'
            }).end(function (err, res) {
                res.should.have.status(400);
                res.body.should.have.property('success').eq(false);
                res.body.should.have.property('code').eq(400);
                done();
            });
        });
        it('Should be unsuccessful. Unexpected field', function (done) {
            chai.request(app).post('/opts/test-allows').send({
                id: 3
            }).end(function (err, res) {
                res.should.have.status(400);
                res.body.should.have.property('success').eq(false);
                res.body.should.have.property('code').eq(400);
                done();
            });
        });

        it('Should be unsuccessful. Missing field', function (done) {
            chai.request(app).post('/opts/test-chain').send({
                field1: 'field1',
                field2: 'field2'
            }).end(function (err, res) {
                res.should.have.status(400);
                res.body.should.have.property('success').eq(false);
                res.body.should.have.property('code').eq(400);
                done();
            });
        });

        it('Should be unsuccessful. Unexpected field', function (done) {
            chai.request(app).post('/opts/test-chain').send({
                field1: 'field1',
                field2: 'field2',
                field3: 'field3',
                id: 1
            }).end(function (err, res) {
                res.should.have.status(400);
                res.body.should.have.property('success').eq(false);
                res.body.should.have.property('code').eq(400);
                done();
            });
        });
    });
    describe('List Requires Tests', function () {
        it('Should be successful. All fields', function (done) {
            chai.request(app).post('/test-list-requires').send([
                {
                    field1: 'field1',
                    field2: 'field2',
                    field3: 'field3'
                },
                {
                    field1: 'field1',
                    field2: 'field2',
                    field3: 'field3'
                }
            ]).end(function (err, res) {
                res.should.have.status(204);
                done();
            });
        });
        it('Should be unsuccessful. Missing field', function (done) {
            chai.request(app).post('/test-list-requires').send([
                {
                    field1: 'field1',
                    field2: 'field2',
                    field3: 'field3'
                },
                {
                    field1: 'field1',
                    field2: 'field2'
                }
            ]).end(function (err, res) {
                res.should.have.status(400);
                done();
            });
        });
    });
    describe('List Allows Tests', function () {
        it('Should be successful', function (done) {
            chai.request(app).post('/test-list-allows').send([
                {
                    field1: 'field1',
                    field2: 'field2',
                    field3: 'field3'
                },
                {
                    field1: 'field1',
                    field2: 'field2'
                }
            ]).end(function (err, res) {
                res.should.have.status(204);
                done();
            });
        });

        it('Should not be successful', function (done) {
            chai.request(app).post('/test-list-allows').send([
                {
                    field1: 'field1',
                    field2: 'field2',
                    field3: 'field3'
                },
                {
                    field1: 'field1',
                    field2: 'field2',
                    id: 1
                }
            ]).end(function (err, res) {
                res.should.have.status(400);
                done();
            });
        });
    });

    describe('List Chain Tests', function () {
        it('Should be successful', function (done) {
            chai.request(app).post('/test-list-chain').send([
                {
                    field1: 'field1',
                    field2: 'field2',
                    field3: 'field3'
                },
                {
                    field1: 'field1',
                    field2: 'field2',
                    field3: 'field3'
                }
            ]).end(function (err, res) {
                res.should.have.status(204);
                done();
            });
        });

        it('Should not be successful', function (done) {
            chai.request(app).post('/test-list-chain').send([
                {
                    field1: 'field1',
                    field2: 'field2',
                    field3: 'field3'
                },
                {
                    field1: 'field1',
                    field2: 'field2'
                }
            ]).end(function (err, res) {
                res.should.have.status(400);
                done();
            });
        });

        it('Should not be successful', function (done) {
            chai.request(app).post('/test-list-chain').send([
                {
                    field1: 'field1',
                    field2: 'field2',
                    field3: 'field3'
                },
                {
                    field1: 'field1',
                    field2: 'field2',
                    field3: 'field3',
                    id: 3
                }
            ]).end(function (err, res) {
                res.should.have.status(400);
                done();
            });
        });
    });
});