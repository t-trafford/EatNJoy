/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/reservetables              ->  index
 * POST    /api/reservetables              ->  create
 * GET     /api/reservetables/:id          ->  show
 * PUT     /api/reservetables/:id          ->  upsert
 * PATCH   /api/reservetables/:id          ->  patch
 * DELETE  /api/reservetables/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Reservetable from './reservetable.model';
import mongoose from 'mongoose';
import * as mailer from '../../mailer/mailer';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function (entity) {
    try {
      // eslint-disable-next-line prefer-reflect
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch (err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Reservetables
export function index(req, res) {
  var query = {};
  if (typeof req.user['_id'] == 'string') {
    query['user'] = mongoose.Types.ObjectId(req.user['_id']);
  } else if (typeof req.user['_id'] == 'object') {
    query['user'] = req.user['_id'];
  }
  return Reservetable.find(query)
    .populate('user', 'email name phone').exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Reservetable from the DB
export function show(req, res) {
  return Reservetable.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Reservetable in the DB
export function create(req, res) {
  req.body.user = req.user;
  return Reservetable.create(req.body)
    .then(resp => {
      try {
        sendMails(resp);
      } catch (error) {
        
      }
      return res.status(201).json(resp);
    }
      //  respondWithResult(res, 201)
    )
    // .then(respondWithResult(res, 201))
    .catch(handleError(res));
}


function sendMails(reserv) {
  // setup email data with unicode symbols
  let mailOptions = {
    from: '"EatNJoy 👻" eatnjoymanager@gmail.com', // sender address
    to: `eatnjoymanager@gmail.com, ${reserv.email}`, // list of receivers
    subject: 'Table Reserved', // Subject line
    text: 'Table Reserved', // plain text body
    html: `Hello ${reserv.name}
    <p> Thank You for Choosing EatNJoy. Your Table is booked with following details. We will Look Forward to Provide you quality food & best service.</p>
    <table>
      <tr>
        <td>Reservation on Name: </td>
        <td>${reserv.name}</td>
      </tr>
      <tr>
      <td>For Person: </td>
      <td>${reserv.person}</td>
    </tr>
      <tr>
        <td>Date & Time: </td>
        <td>${reserv.time}</td>
      </tr>
  </table>
<br/>
<br/>
<div>
Thank You,
<br/>
<span><b>EatNJoy Team</b></span>
</div>` // html body
  };

  mailer.sendMail(mailOptions);

}

// Upserts the given Reservetable in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Reservetable.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Reservetable in the DB
export function patch(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Reservetable.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Reservetable from the DB
export function destroy(req, res) {
  return Reservetable.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
