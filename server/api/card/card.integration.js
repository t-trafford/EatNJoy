'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newCard;

describe('Card API:', function() {
  describe('GET /api/cards', function() {
    var cards;

    beforeEach(function(done) {
      request(app)
        .get('/api/cards')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          cards = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      cards.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/cards', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/cards')
        .send({
          name: 'New Card',
          info: 'This is the brand new card!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newCard = res.body;
          done();
        });
    });

    it('should respond with the newly created card', function() {
      newCard.name.should.equal('New Card');
      newCard.info.should.equal('This is the brand new card!!!');
    });
  });

  describe('GET /api/cards/:id', function() {
    var card;

    beforeEach(function(done) {
      request(app)
        .get(`/api/cards/${newCard._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          card = res.body;
          done();
        });
    });

    afterEach(function() {
      card = {};
    });

    it('should respond with the requested card', function() {
      card.name.should.equal('New Card');
      card.info.should.equal('This is the brand new card!!!');
    });
  });

  describe('PUT /api/cards/:id', function() {
    var updatedCard;

    beforeEach(function(done) {
      request(app)
        .put(`/api/cards/${newCard._id}`)
        .send({
          name: 'Updated Card',
          info: 'This is the updated card!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedCard = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedCard = {};
    });

    it('should respond with the updated card', function() {
      updatedCard.name.should.equal('Updated Card');
      updatedCard.info.should.equal('This is the updated card!!!');
    });

    it('should respond with the updated card on a subsequent GET', function(done) {
      request(app)
        .get(`/api/cards/${newCard._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let card = res.body;

          card.name.should.equal('Updated Card');
          card.info.should.equal('This is the updated card!!!');

          done();
        });
    });
  });

  describe('PATCH /api/cards/:id', function() {
    var patchedCard;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/cards/${newCard._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Card' },
          { op: 'replace', path: '/info', value: 'This is the patched card!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedCard = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedCard = {};
    });

    it('should respond with the patched card', function() {
      patchedCard.name.should.equal('Patched Card');
      patchedCard.info.should.equal('This is the patched card!!!');
    });
  });

  describe('DELETE /api/cards/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/cards/${newCard._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when card does not exist', function(done) {
      request(app)
        .delete(`/api/cards/${newCard._id}`)
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
