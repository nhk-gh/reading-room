var fs = require('fs');
var path = require('path');
var mongo = require('mongodb');
var async = require('async');
var encrypt = require('../lib/encrypt');

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
      console.log("Get all reviews error (1): "+ err);
    else {
      collection.find({}, options).toArray(function (err, items) {
        if (err) {
          console.log("Get all reviews error (2): " + err);
        } else {
          items.forEach(function(el){
            el.date = (new Date(el.date)).toDateString();
          });
          res.send(200, { reviews: items });
          //res.json({thumbs:items});
        }
      });
     }
  });
};

/*
collection.insert(
  {
    author: req.query.user, // username
    date: new Date(),
    photoid: req.query.photoid,
    text: req.query.comment
  },
  {w:1},
  function (err) {
    if (err){
      console.log("Add comment (2): " + err);
      callback(err);
    }
    else
      callback(null);
  }
);
 */

exports.addReview = function(req, res) {
  var getReviewIndex = function(r){
    return encrypt.getHash(r.author + r.book + r.reviewer + r.date);
  };
  photodb.collection('reviews', function(err, collection){
    if (err) {
      console.log("Add review error (1): "+ err);
    } else {
      var rev = req.body.review;
      rev.date = Date.now();
      rev.id = getReviewIndex(rev);
      rev.links = [];

      collection.insert(rev, {w:1}, function (err, result) {
        if (err) {
          console.log("Add review error (2): "+ err);
          res.send(500, 'Failed to save review (internal server error)');
        } else {
          result[0].date = (new Date(result[0].date)).toDateString();
          res.send(200, { newReview: result[0] });
        }
      });
    }
  });
};

exports.getReview = function(req, res) {};

exports.editReview = function(req, res) {};

exports.deleteReview = function(req, res) {};

exports.deleteAllReviews = function(req, res) {};
