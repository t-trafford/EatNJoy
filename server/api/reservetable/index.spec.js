'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var reservetableCtrlStub = {
  index: 'reservetableCtrl.index',
  show: 'reservetableCtrl.show',
  create: 'reservetableCtrl.create',
  upsert: 'reservetableCtrl.upsert',
  patch: 'reservetableCtrl.patch',
  destroy: 'reservetableCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var reservetableIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './reservetable.controller': reservetableCtrlStub
});

describe('Reservetable API Router:', function() {
  it('should return an express router instance', function() {
    reservetableIndex.should.equal(routerStub);
  });

  describe('GET /api/reservetables', function() {
    it('should route to reservetable.controller.index', function() {
      routerStub.get
        .withArgs('/', 'reservetableCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/reservetables/:id', function() {
    it('should route to reservetable.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'reservetableCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/reservetables', function() {
    it('should route to reservetable.controller.create', function() {
      routerStub.post
        .withArgs('/', 'reservetableCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/reservetables/:id', function() {
    it('should route to reservetable.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'reservetableCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/reservetables/:id', function() {
    it('should route to reservetable.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'reservetableCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/reservetables/:id', function() {
    it('should route to reservetable.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'reservetableCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
