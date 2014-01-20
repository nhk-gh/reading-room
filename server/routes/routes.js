var fs = require('fs');
var path = require('path');
var mongo = require('mongodb');
var async = require('async');
var encrypt = require('../lib/encrypt');
var mailer = require('nodemailer');

/*********************************************/
/*                                           */
/*      Data Base Manipulations              */
/*                                           */
/*********************************************/
var db = mongo.Db;
var dbserver = mongo.Server;
var ObjectID = mongo.ObjectID;
var dbport = 27018;//mongo.Connection.DEFAULT_PORT;
var photodb;

var populateCollection = function(collection_name, d) {
  var items;
  var toCreate = true;

  d.collection(collection_name, function(err, collection){
    collection.find().toArray(function(err, docs){
      if (docs.length == 0){
        switch (collection_name){
          case 'users':
            items = [{
                password: '46e0bfdedb9a7dc40bf6e756957650c6',     /*password*/
                userName: 'nhk',
                logged: false,
                firstName: 'Naum',
                lastName: 'Krivoruk',
                fullName: 'Naum Krivoruk',
                country: 'Israel',
                email: 'naum.krivoruk@gmail.com',
                currentBook: 1,
                bookshelf:[{
                   // book
                    ind: 1,
                    author: '',
                    title: '',
                    publisher:'',
                    currentChapter: 1,
                    chapters:[{
                        //chapter
                        ind: 1,
                        title:'',
                        offset: 0
                      }]
                  }]
              }];
            break;

          case 'reviews':
            items = [{
                book: '',                  // title
                author:'',                 // author
                reviewer: 'Naum Krivoruk', // full name
                date: Date.now(),
                review:'Interesting!',
                links:[{
                  link: '' // link for the legal downloading of the book
                }]
              }
            ];
            break;

          default:
            toCreate = false;
            break;
        }
      }
      else{
        toCreate = false;
      }

      if (toCreate === true)
        collection.save(items, {safe:true}, function() {
        });
    });

  });
};

var initDB = function(){
  if (photodb === undefined){
    photodb = new db('rr_db', new dbserver('localhost', dbport, {auto_reconnect: true,socketOptions: {keepAlive:null}}));

    photodb.open(function(err, d){
      if(!err) {
        console.log('Connected to database (localhost:' + dbport + ')');

        populateCollection('users',d) ;
        populateCollection('reviews',d);
        //populateCollection('photos', d);
        //populateCollection('comments', d);
      }
    });
  }
};
exports.initDB = initDB;

/*********************************************/
/*                                           */
/*               Main Page                   */
/*                                           */
/*********************************************/
exports.index = function(req, res){
  console.log(req.cookies);
  //console.log(req.cookies.rem);
  //console.log(JSON.parse(req.cookies.rem).e);

  res.sendfile('/home/nhk/WebstormProjects/ReadingRoom/app/index.html');
};

/*********************************************/
/*                                           */
/*          Authentication                   */
/*                                           */
/*********************************************/
exports.register = function(req, res) {

  if(req.method.toLowerCase() !== "post") {
    res.send({error: 'Method Not Allowed', code: 405});
  }
  else {
    photodb.collection("users", function(err, collection){
      if (err)
        console.log("Register: Can not open 'users' collection!");
      else {
        collection.findOne({userName:req.body.userName}, function(err, result) {
          if(err) console.log(err);

          if(result != null) {
            res.send({message:'User name is already in use', error: 403});
          }
          else {
            //auth(result);
            var usr = {
              userName: req.body.userName,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              password: encrypt.encrypt(req.body.password),
              fullName: req.body.firstName + " " + req.body.lastName,
              logged: true,
              country: req.body.country,
              email: req.body.email,
              currentBook: 0,
              bookshelf:[]
            };
            collection.insert(usr, {w:1}, function(err, result) {
              //assert.equal(null, err);
              if (err) {
                console.log("Register: failed to insert into 'users' collection!");
                res.send({message:'Can not register new user', error: 500, user: null});
              }
              else {
                req.session.user = result[0];
                //console.log(result[0]);
                res.send({message:'Ok', error: 200, user: result[0]});
              }
            });
          }
        });
      }
    });
  }
};

exports.login = function(req, res) {

  if(req.method.toLowerCase() != 'post') {
    res.send({error: 'Method Not Allowed', code: 405});
  }
  else {
    photodb.collection('users', function(err, collection){
      if (err)
        console.log('Login: Can not open "users" collection!');
      else {
        collection.findOne({email:req.body.username}, function(err, result) {
          if(err) console.log(err);

          if(result == null) {
            res.send({message:'invalid username', error: 403});
          }
          else {
            //auth(result);
            var encryptPasswrd;// = encrypt.encrypt(req.body.password);
            if (req.body.encrypted) {
              encryptPasswrd =  req.body.password;
            }
            else {
              encryptPasswrd = encrypt.encrypt(req.body.password);
            }

            if(encryptPasswrd != result.password) {
              res.send({message:'invalid password', error: 403});
            }
            else {
              collection.update({email:req.body.username, password: encryptPasswrd},
                {$set:{logged: true}}, {w:1}, function(err){
                  if (err)
                    console.log(err);
                  else{
                    result.logged = true;
                    req.session.user = result;

                    /*if (!req.cookies.rem) {
                      res.cookie('rem', JSON.stringify({ e:result.email, p:result.password }),
                                                       { maxAge: 2592000000, httpOnly: true });
                    //}*/

                    res.send({message:'Ok', error: 200, user: result});
                  }
                });
            }
          }
        });
      }
    });
  }
};

exports.passwordReminder = function(req, res){
  var searchStr = {};

  if (req.body.lookfor == "username"){
    searchStr = {userName: req.body.name};
  }
  else{
    searchStr = {fullName: req.body.name};
  }
  searchStr.email = req.body.email;

  photodb.collection("users", function(err, collection){
    if (err)
      console.log("Reminder: Can not open 'users' collection!");
    else {
      collection.findOne(searchStr, function(err, result) {
        if(err) console.log(err);

        if(result == null) {
          res.send({message:'Sorry, but you really do not remember your registration data', error: 403});
        }
        else {
          var transport = new mailer.createTransport("SMTP",
            {service: "Gmail",
              auth: {
                user: "naum.krivoruk@gmail.com",
                pass: "nhk110859"
              }
            }
          );
          var pswrd = encrypt.decrypt(result.password);

          transport.sendMail(
            {
              from: "<naum.krivoruk@gmail.com>", // sender address
              to: req.body.email, // list of receivers
              subject: "Your password", // Subject line
              text: "Your password is: " + pswrd // plaintext body
            },
            function(error, response){
              if(error){
                console.log(error);
                res.send({message:error.message, error: 403});
              }
              else{
                res.send({message:'Registration data sent to your e-mail address!', error: 200});
              }
            }
          );


        }
      });
    }
  });
};

exports.logout = function(req, res) {

  photodb.collection("users", function(err, collection){
    if (err)
      console.log("Login: Can not open 'users' collection!");
    else {
      collection.findOne({email:req.body.username}, function(err, result) {
        if(err) console.log(err);

        if(result == null) {
          res.send({message:'invalid username', error: 403});
        }
        else {
          collection.update({email:req.body.username},{$set:{logged: false, remember: false}}, {w:1},
            function(err, rs){
              if (err)
                console.log(err);
              else{
                req.session.user = null;
                res.send({message:'Ok', error: 200});
              }

            });
        }
      });
    };
  });
};

/*********************************************/
/*                                           */
/*         Drag & Drop + upload                */
/*                                           */
/*********************************************/

exports.fileUpload = function(req, res){
  //console.log(req.files);
  res.send("Hura!");
};

/*********************************************/
/*                                           */
/*         Library Manipulations             */
/*                                           */
/*********************************************/

exports.awesomeThings = function(reg,res){
    res.send(['Ilia', 'Alexander']);
};

exports.addReader = function(reg,res){
  res.send('New reader added');
};

exports.editReader = function(reg,res){
  res.send('Reader edited');
};

exports.deleteReader = function(reg,res){
  res.send('Reader deleted');
};

exports.addBook = function(reg,res){
  res.send('New book added');
};

exports.editBook = function(reg,res){
  res.send('Book edited');
};

exports.deleteBook = function(reg,res){
  res.send('Book deleted');
};