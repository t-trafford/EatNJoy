/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/orders              ->  index
 * POST    /api/orders              ->  create
 * GET     /api/orders/:id          ->  show
 * PUT     /api/orders/:id          ->  upsert
 * PATCH   /api/orders/:id          ->  patch
 * DELETE  /api/orders/:id          ->  destroy
 */

'use strict';

import {applyPatch} from 'fast-json-patch';
import Order from './order.model';
import mongoose from 'mongoose';
import * as mailer from '../../mailer/mailer';
import { Math } from 'core-js';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      return res
        .status(statusCode)
        .json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function (entity) {
    try {
      applyPatch(entity, patches,
      /*validate*/
      true);
    } catch (err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity
        .remove()
        .then(() => res.status(204).end());
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res
        .status(404)
        .end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res
      .status(statusCode)
      .send(err);
  };
}

// Gets a list of Orders
export function index(req, res) {
  var query = {};
  if (req.user.role != 'manager' && req.user.role != 'employee' && req.user.role != 'driver') {
    if (typeof req.user['_id'] == 'string') {
      query['user'] = mongoose
        .Types
        .ObjectId(req.user['_id']);
    } else if (typeof req.user['_id'] == 'object') {
      query['user'] = req.user['_id'];
    }
  }
  return Order
    .find(query)
    .populate('user', 'email name phone')
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Order from the DB
export function show(req, res) {
  return Order
    .findById(req.params.id)
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Order in the DB
export function create(req, res) {
  req.body.user = req.user;
  return Order
    .create(req.body)
    .then(resp => {
      try {
        sendMails(resp);
      } catch (error) {}
      return res
        .status(201)
        .json(resp);
    }
    //  respondWithResult(res, 201)
    )
    .catch(handleError(res));
}

function sendMails(order) {
  // setup email data with unicode symbols
  let mailOptions = {
    from: '"EatNJoy 👻" eatnjoymanager@gmail.com', // sender address
    to: `eatnjoymanager@gmail.com, ${order.address.user.email}`, // list of receivers
    subject: 'Order Place', // Subject line
    text: 'Order Place', // plain text body
    html: `Hello ${order
      .address
      .user
      .name}
    <p>Thank You for Choosing EatNJoy. Your Order is Received with following details. We will Look Forward to Provide you quality food & best service.</p>
    <table>
      <tr>
        <td>Name: </td>
        <td>${order
      .address
      .user
      .name}</td>
      </tr>
      <tr>
        <td>Food Item: </td>
        <td> ${ (order.item || [])
      .map(s => {
        return '(' + parseInt(s.quantity) + ') ' + s.item.name + ' - $' + ((parseFloat(s.item.price)) * parseFloat(s.quantity)).toFixed(2);
      })}</td>
      </tr>
      <tr>
        <td>Sub total: </td>
        <td>${ '$' + order.price} </td>
      </tr>
      <tr>
        <td>Order Date & Time: </td>
        <td>${order.createdDate}</td>
      </tr>
      <tr>
        <td>Address: </td>
        <td>${order.address.address1}, ${order.address.address2}, ${order.address.city}, ${order.address.state}, ${order.address.country}-${order.address.zip}</td>
      </tr>
    </table>
<br/>
<br/>
Thank You,
<br/>
<span><b>EatNJoy Team</b></span>` // html body
      };

      mailer.sendMail(mailOptions);}

    // Upserts the given Order in the DB at the specified ID
    export function upsert(req, res) {
      if (req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
        Reflect.deleteProperty(req.body, '__v');
      }
      return Order.findOneAndUpdate({
        _id: req.params.id
      }, req.body, {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
          runValidators: true
        })
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
    }

    // Updates an existing Order in the DB
    export function patch(req, res) {
      if (req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
      }
      return Order
        .findById(req.params.id)
        .exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
    }

    // Deletes a Order from the DB
    export function destroy(req, res) {
      return Order
        .findById(req.params.id)
        .exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
    }
