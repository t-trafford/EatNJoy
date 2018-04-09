'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newReservetable;

describe('Reservetable API:', function() {
  describe('GET /api/reservetables', function() {
    var reservetables;

    beforeEach(function(done) {
      request(app)
        .get('/api/reservetables')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          reservetables = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      reservetables.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/reservetables', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/reservetables')
        .send({
          name: 'New Reservetable',
          info: 'This is the brand new reservetable!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newReservetable = res.body;
          done();
        });
    });

    it('should respond with the newly created reservetable', function() {
      newReservetable.name.should.equal('New Reservetable');
      newReservetable.info.should.equal('This is the brand new reservetable!!!');
    });
  });

  describe('GET /api/reservetables/:id', function() {
    var reservetable;

    beforeEach(function(done) {
      request(app)
        .get(`/api/reservetables/${newReservetable._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          reservetable = res.body;
          done();
        });
    });

    afterEach(function() {
      reservetable = {};
    });

    it('should respond with the requested reservetable', function() {
      reservetable.name.should.equal('New Reservetable');
      reservetable.info.should.equal('This is the brand new reservetable!!!');
    });
  });

  describe('PUT /api/reservetables/:id', function() {
    var updatedReservetable;

    beforeEach(function(done) {
      request(app)
        .put(`/api/reservetables/${newReservetable._id}`)
        .send({
          name: 'Updated Reservetable',
          info: 'This is the updated reservetable!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedReservetable = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedReservetable = {};
    });

    it('should respond with the updated reservetable', function() {
      updatedReservetable.name.should.equal('Updated Reservetable');
      updatedReservetable.info.should.equal('This is the updated reservetable!!!');
    });

    it('should respond with the updated reservetable on a subsequent GET', function(done) {
      request(app)
        .get(`/api/reservetables/${newReservetable._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let reservetable = res.body;

          reservetable.name.should.equal('Updated Reservetable');
          reservetable.info.should.equal('This is the updated reservetable!!!');

          done();
        });
    });
  });

  describe('PATCH /api/reservetables/:id', function() {
    var patchedReservetable;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/reservetables/${newReservetable._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Reservetable' },
          { op: 'replace', path: '/info', value: 'This is the patched reservetable!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedReservetable = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedReservetable = {};
    });

    it('should respond with the patched reservetable', function() {
      patchedReservetable.name.should.equal('Patched Reservetable');
      patchedReservetable.info.should.equal('This is the patched reservetable!!!');
    });
  });

  describe('DELETE /api/reservetables/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/reservetables/${newReservetable._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when reservetable does not exist', function(done) {
      request(app)
        .delete(`/api/reservetables/${newReservetable._id}`)
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
