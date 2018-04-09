'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var addressCtrlStub = {
  index: 'addressCtrl.index',
  show: 'addressCtrl.show',
  create: 'addressCtrl.create',
  upsert: 'addressCtrl.upsert',
  patch: 'addressCtrl.patch',
  destroy: 'addressCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var addressIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './address.controller': addressCtrlStub
});

describe('Address API Router:', function() {
  it('should return an express router instance', function() {
    addressIndex.should.equal(routerStub);
  });

  describe('GET /api/addresss', function() {
    it('should route to address.controller.index', function() {
      routerStub.get
        .withArgs('/', 'addressCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/addresss/:id', function() {
    it('should route to address.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'addressCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/addresss', function() {
    it('should route to address.controller.create', function() {
      routerStub.post
        .withArgs('/', 'addressCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/addresss/:id', function() {
    it('should route to address.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'addressCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/addresss/:id', function() {
    it('should route to address.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'addressCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/addresss/:id', function() {
    it('should route to address.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'addressCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
