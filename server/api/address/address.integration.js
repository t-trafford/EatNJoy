'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newAddress;

describe('Address API:', function() {
  describe('GET /api/addresss', function() {
    var addresss;

    beforeEach(function(done) {
      request(app)
        .get('/api/addresss')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          addresss = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      addresss.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/addresss', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/addresss')
        .send({
          name: 'New Address',
          info: 'This is the brand new address!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newAddress = res.body;
          done();
        });
    });

    it('should respond with the newly created address', function() {
      newAddress.name.should.equal('New Address');
      newAddress.info.should.equal('This is the brand new address!!!');
    });
  });

  describe('GET /api/addresss/:id', function() {
    var address;

    beforeEach(function(done) {
      request(app)
        .get(`/api/addresss/${newAddress._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          address = res.body;
          done();
        });
    });

    afterEach(function() {
      address = {};
    });

    it('should respond with the requested address', function() {
      address.name.should.equal('New Address');
      address.info.should.equal('This is the brand new address!!!');
    });
  });

  describe('PUT /api/addresss/:id', function() {
    var updatedAddress;

    beforeEach(function(done) {
      request(app)
        .put(`/api/addresss/${newAddress._id}`)
        .send({
          name: 'Updated Address',
          info: 'This is the updated address!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedAddress = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedAddress = {};
    });

    it('should respond with the updated address', function() {
      updatedAddress.name.should.equal('Updated Address');
      updatedAddress.info.should.equal('This is the updated address!!!');
    });

    it('should respond with the updated address on a subsequent GET', function(done) {
      request(app)
        .get(`/api/addresss/${newAddress._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let address = res.body;

          address.name.should.equal('Updated Address');
          address.info.should.equal('This is the updated address!!!');

          done();
        });
    });
  });

  describe('PATCH /api/addresss/:id', function() {
    var patchedAddress;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/addresss/${newAddress._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Address' },
          { op: 'replace', path: '/info', value: 'This is the patched address!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedAddress = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedAddress = {};
    });

    it('should respond with the patched address', function() {
      patchedAddress.name.should.equal('Patched Address');
      patchedAddress.info.should.equal('This is the patched address!!!');
    });
  });

  describe('DELETE /api/addresss/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/addresss/${newAddress._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when address does not exist', function(done) {
      request(app)
        .delete(`/api/addresss/${newAddress._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
