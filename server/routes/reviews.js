var fs = require('fs');
var path = require('path');
var mongo = require('mongodb');
var async = require('async');

var routes = require('../routes/routes');
var photodb = routes.getdb();

/*********************************************/
/*                                           */
/*               Review                      */
/*                                           */
/*********************************************/
exports.getAllReviews = function(req, res) {
  var options = { sort: {date:-1}};

  photodb.collection('reviews', function(err, collection){
    if (err)
      console.log("Get all reviews (1): "+ err);
    else {
      collection.find({}, options).toArray(function (err, items) {
        if (err)
          console.log("Get all reviews (2): " + err);
        else{
          items.forEach(function(el, ind){
            el.date = (new Date(el.date)).toDateString();
          });
          res.send(200, { reviews: items });
          //res.json({thumbs:items});
        }
      });
     }
  });
};

exports.GetReview = function(req, res) {};

exports.addReview = function(req, res) {};

exports.editReview = function(req, res) {};

exports.deleteReview = function(req, res) {};

exports.deleteAllReviews = function(req, res) {};
