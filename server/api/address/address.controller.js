/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/addresss              ->  index
 * POST    /api/addresss              ->  create
 * GET     /api/addresss/:id          ->  show
 * PUT     /api/addresss/:id          ->  upsert
 * PATCH   /api/addresss/:id          ->  patch
 * DELETE  /api/addresss/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Address from './address.model';
import mongoose from 'mongoose';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      // eslint-disable-next-line prefer-reflect
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Addresss
export function index(req, res) {
  var query = {};
  if (typeof req.user['_id'] == 'string') {
    query['user']=mongoose.Types.ObjectId(req.user['_id']);
  }else if (typeof req.user['_id'] == 'object') {
    query['user']=req.user['_id'];
  }
  return Address.find(query)
  .populate('user', 'email name phone').exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Address from the DB
export function show(req, res) {
  return Address.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Address in the DB
export function create(req, res) {
  req.body.user = req.user;
  return Address.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Address in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Address.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Address in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Address.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Address from the DB
export function destroy(req, res) {
  return Address.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
