'use strict';

var express = require('express');

var router = express.Router();

var mime = require('mime');
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/client/assets/images/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.slice(0, file.originalname.lastIndexOf('.')) + '-' + Date.now() + '.' + mime.getExtension(file.mimetype));
  }
});

var upload = multer({
  storage: storage
}).any();

router.post('/', function (req, res, next) {
  var path = '';
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.status(422).send("an Error occured");
    }
    return res.status(200).json(req.files);
  });
});


module.exports = router;
