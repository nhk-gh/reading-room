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


function User(){
  this.password = '';     /*password*/
  this.userName = '';
  this.logged = false;
  this.firstName =  '';
  this.lastName =  '';
  this.fullName =  '';
  this.country =  '';
  this.email =  '';
  this.currentBook =  1;
  this.bookshelf = [];


}

var populateCollection = function(collection_name, d) {
  var items;
  var toCreate = true;

  d.collection(collection_name, function(err, collection){
    collection.find().toArray(function(err, docs){
      //console.log(collection_name);

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
                    author: 'Naum Krivoruk',
                    title: 'Memories',
                    publisher:'Bla-bla-bla',
                    icon: 'images/popular-woodworking-magazine-free-bookcase-plans.jpg',
                    path: '',
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
  //console.log(req.cookies);
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
                    //console.log(req.session.user);
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
        console.log(req.body.username);

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
  //res.send("Hura!!!.. " + req.files.file.name);
  /*console.log(req.files);
  console.log(req.body);
  console.log(req.params); */

  photodb.collection('users', function(err, collection){
    var usr;

    if (err) {
      console.log('File upload: can not open \'users\' collection');
      res.send(500);
    } else {
      // find user
      collection.findOne(
        {
          'firstName': req.session.user.firstName,
          'lastName': req.session.user.lastName
        }, function(err, result) {
          if (err)
          {
            console.log("Upload photo (0) " + err);
            res.send(500);
          } else {
            //user found!
            usr = result;
            var book = req.files.file;
            var tmp_path = book.path; //the temporary location of the book
            var target_dir = '/home/ubuntu/bookcase/' + usr._id;
            var target_path = target_dir + "/" + book.name;

            // check if book is already in bookcase
            collection.findOne(
              {
                'firstName': req.session.user.firstName,
                'lastName': req.session.user.lastName,
                'bookshelf.title': req.body.title,
                'bookshelf.author': req.body.author
              }, function(err, result) {
                if (err)
                {
                  console.log("Upload photo (1) " + err);
                  res.send(500);
                } else {
                  if (result !== null) {
                    console.log("Upload photo (2): file already exist" );
                    res.send(409, 'File already exist!');
                  } else {

                    // fill book data
                    var newBook = {};
                    newBook.author = req.body.author;
                    newBook.title = req.body.title;
                    newBook.publisher = req.body.publisher;
                    newBook.icon = 'images/book-icon.png';
                    newBook.path = target_path;
                    newBook.currentChapter = 1,
                    newBook.chapters = [];

                    usr.bookshelf.push(newBook);

                    //console.log(usr);

                    async.series([
                      //check for target folder and create it if not exists
                      function (callback) {
                        fs.stat(target_dir, function (err, stat) {
                          if (err || !stat.isDirectory()) {
                            //folder do not exists, create it
                            fs.mkdir(target_dir, function (err) {
                              if (err) {
                                console.log(err);
                                callback(err);
                              }
                              else
                                callback(null);
                            });
                          }
                          else
                            callback(null);
                        });
                      },

                      // folder exists (or created successfully):
                      // move the photo from the temporary location to the intended location
                      function(callback){
                        fs.rename(tmp_path, target_path, function(err) {
                          if (err) {
                            console.log(err);
                            callback(err);
                          }
                          else
                            callback(null);
                        });
                      },

                      //add data about photo to DB
                      function(callback){
                        collection.update({_id: usr._id},
                          {$set:
                            {
                              bookshelf:usr.bookshelf
                            }
                          },
                          {w:1},
                          function (err, updated) {
                            //usr = updated;
                            //console.log(usr);
                            callback(err);
                          });
                        }],

                        //error function (the third param.) of async.each
                        function(err){
                          if (!err){
                            res.send(200, {user:usr});
                          }
                          else{
                            console.log(err);
                            res.send(417);
                          }
                          //res.render("addphoto", {title:"Add photo", genre: items, loggedUser: req.session.user, info:info});

                        });
                    }
              }
            });
          }
        });
    }
  });
};

/*********************************************/
/*                                           */
/*         Library Manipulations             */
/*                                           */
/*********************************************/

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