'use strict';

var express = require('express');
var controller = require('./item.controller');
var multer = require('multer');
var path = require('path');
var mime = require('mime');

var router = express.Router();


router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);




module.exports = router;
