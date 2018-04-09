'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var cardCtrlStub = {
  index: 'cardCtrl.index',
  show: 'cardCtrl.show',
  create: 'cardCtrl.create',
  upsert: 'cardCtrl.upsert',
  patch: 'cardCtrl.patch',
  destroy: 'cardCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var cardIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './card.controller': cardCtrlStub
});

describe('Card API Router:', function() {
  it('should return an express router instance', function() {
    cardIndex.should.equal(routerStub);
  });

  describe('GET /api/cards', function() {
    it('should route to card.controller.index', function() {
      routerStub.get
        .withArgs('/', 'cardCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/cards/:id', function() {
    it('should route to card.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'cardCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/cards', function() {
    it('should route to card.controller.create', function() {
      routerStub.post
        .withArgs('/', 'cardCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/cards/:id', function() {
    it('should route to card.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'cardCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/cards/:id', function() {
    it('should route to card.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'cardCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/cards/:id', function() {
    it('should route to card.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'cardCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
