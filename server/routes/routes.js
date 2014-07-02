var fs = require('fs');
var path = require('path');
var mongo = require('mongodb');
var async = require('async');
var encrypt = require('../lib/encrypt');
var mailer = require('nodemailer');
var txtreader = require('buffered-reader');

/*********************************************/
/*                                           */
/*      Data Base Manipulations              */
/*                                           */
/*********************************************/
var db = mongo.Db;
var dbserver = mongo.Server;
var ObjectID = mongo.ObjectID;
var dbport = 27019;//mongo.Connection.DEFAULT_PORT;
var photodb;

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
                    currentChapter: '1',
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
                id: 1,
                book: 'I, Robot',                  // title
                author:'Isaac Azimov',                 // author
                reviewer: 'Naum Krivoruk', // full name
                date: Date.now(),
                review:'Amazing!',
                links:[{
                  link: '' // link for the legal downloading of the book
                }]
              },
              {
                id: 2,
                book: 'Deadworld',                  // title
                author:'Harry Harrison',                 // author
                reviewer: 'Naum Krivoruk', // full name
                date: Date.now(),
                review:'Another amazing book!',
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

exports.getdb = function(){
  if (photodb === undefined)
    initDB();

  return photodb;
};
/*********************************************/
/*                                           */
/*               Main Page                   */
/*                                           */
/*********************************************/
exports.index = function(req, res){
  //console.log(req.cookies);
  //console.log(req.cookies.passport);
  if ('production' == process.env.NODE_ENV) {
    //res.sendfile('/home/nhk/WebstormProjects/ReadingRoom/dist/index.html');
    res.sendfile(path.resolve(__dirname + '../../../dist/index.html'));
  } else {
    //res.sendfile('/home/nhk/WebstormProjects/ReadingRoom/app/index.html');
    res.sendfile(path.resolve(__dirname + '../../../app/index.html'));
  }
};

/*********************************************/
/*                                           */
/*          Authentication                   */
/*                                           */
/*********************************************/
exports.fbLogin = function(req, res) {
  var usr, encryptId;
  var retVal = false;

  if (req.session.fblogin) {
    usr =  JSON.parse(req.session.fblogin);
    encryptId = encrypt.encrypt(usr.id.toString());

    photodb.collection("users", function(err, collection) {
      if (err) {
        console.log("fbLogin: Can not open 'users' collection!");
        return false;
      } else {
        collection.findOne({userName:usr.username.givenName, password: encryptId }, function(err, result) {
          if(err) {
            console.log(err);
            return false;
          }
          if(result !== null) {
            // user found
            console.log('user found !');
            console.log(result);
            req.session.user = result;
            return true;

          } else {
            var newusr = {
              userName: usr.username.givenName,
              firstName: usr.username.givenName,
              lastName: usr.username.familyName,
              password: encryptId,
              fullName: usr.username.givenName + " " + usr.username.familyName,
              logged: true,
              country: usr.location,
              email: usr.profileUrl,
              currentBook: 0,
              remember: false,
              bookshelf:[]
            };

            collection.insert(newusr, {w:1}, function(err, result) {
              //assert.equal(null, err);
              console.log('insertion result: ',result);
              if (err) {
                console.log("fbLogin: failed to insert into 'users' collection!");
                return false;
              }
              else {
                req.session.user = result[0];
                return true;
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
            res.send({message:'Login error: invalid username', error: 403});
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
              res.send({message:'Login error: invalid password', error: 403});
            }
            else {
              collection.update({email:req.body.username, password: encryptPasswrd},
                {$set:{logged: true}}, {w:1}, function(err){
                  if (err)
                    console.log(err);
                  else{
                    result.logged = true;
                    req.session.user = result;
                    //console.log('req.session.user: ',req.session.user);
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
              remember: false,
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
            function(error){
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
            function(err){
              if (err)
                console.log(err);
              else{
                req.session.user = null;
                res.send({message:'Ok', error: 200});
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
exports.addBook = function(req, res){
  var getBookIndex = function(book){
    /*if (books.length === 0) {
      return 1;
    }
    else {
      return books.length + 1;
    }*/
    return encrypt.getHash(book.author + book.title + book.publisher + book.icon + book.type + book.path)
  };

  photodb.collection('users', function(err, collection){
    var usr;

    if (err) {
      console.log('File upload: can not open \'users\' collection');
      res.send(500);
    } else {
      // find user
      collection.findOne(
        {
          _id: new ObjectID(req.session.user._id)
          /*'firstName': req.session.user.firstName,
           'lastName': req.session.user.lastName,  */
        }, function(err, result) {
          if (err)
          {
            console.log("Upload book (0) " + err);
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
                _id: new ObjectID(req.session.user._id),
                /*'firstName': req.session.user.firstName,
                 'lastName': req.session.user.lastName,  */
                'bookshelf.title': req.body.title,
                'bookshelf.author': req.body.author
              }, function(err, result) {
                if (err)
                {
                  console.log("Upload book (1) " + err);
                  res.send(500);
                } else {
                  if (result !== null) {
                    console.log("Upload book (2): file already exist" );
                    res.send(409, 'File already exist!');
                  } else {

                    // fill book data
                    var newBook = {};
                    newBook.author = req.body.author;
                    newBook.title = req.body.title;
                    newBook.publisher = req.body.publisher;
                    //newBook.icon = 'images/book-icon.png';
                    newBook.type= book.type; //mime type
                    newBook.path = target_path;
                    newBook.currentChapter = '1';
                    newBook.chapters = [];
                    newBook.ind = getBookIndex(newBook);
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
                      // move the book from the temporary location to the intended location
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

                      //add data about book to DB
                      function(callback){
                        collection.update({_id: usr._id},
                          {$set:
                            {
                              bookshelf:usr.bookshelf
                            }
                          },
                          {w:1},
                          function (err) {
                            //usr = updated;
                            //console.log(usr);
                            callback(err);
                          });
                        }],

                        //error function (the third param.) of async.each
                        function(err){
                          if (!err){
                            res.send(200, {user:usr});
                            //console.log(usr);
                          }
                          else{
                            res.send(500);
                          }
                          //res.render("addphoto", {title:"Add book", genre: items, loggedUser: req.session.user, info:info});

                        });
                    }
              }
            });
          }
        });
    }
  });
};

exports.getBook = function(req, res){
  photodb.collection('users', function(err, collection){
    if (err) {
      console.log('Get book: can not open \'users\' collection');
      res.send(500);
    } else {
      // find book
      var asyncErr = null;
      var usrId;

      async.waterfall([
        // find selected book
        function(callback){
          collection.findOne(
            {
              _id: new ObjectID(req.session.user._id),
              /*'firstName': req.session.user.firstName,
              'lastName': req.session.user.lastName,  */
              'bookshelf.ind': req.params.ind
            }, function(err, result) {
              if (err)
              {
                console.log("Get book (1) " + err);
                //res.send(500);
                asyncErr = new Error("Get book (1) " + err);
                asyncErr.code = 500;
                callback(asyncErr);

              } else {
                if (result === null) {
                  console.log("Get book (2): book not found" );
                  //res.send(409, 'Book not found!');
                  asyncErr = new Error("Get book (2): book not found");
                  asyncErr.code = 409;
                  callback(asyncErr);

                } else {
                  var book;

                  for (var i=0; i<result.bookshelf.length; i++) {
                    if (result.bookshelf[i].ind == req.params.ind) {
                      book = result.bookshelf[i];
                      break;
                    }
                  }
                  usrId = result._id;
                  callback(null, book);
                }
              }
            })
        },
        // set selected book as current book
        function(book, callback) {
          collection.update({_id: usrId},
            {$set:
              {
                currentBook: book.ind
              }
            },
            {w:1},
            function (err) {
              if (err) {
                console.log("Get book (3) " + err);
                //res.send(500);
                asyncErr = new Error("Get book (3) " + err);
                asyncErr.code = 500;
                callback(asyncErr);
              } else {
                callback(null, book);
              }
            })
        },

        // if book is in TXT format - read it; PDF format - do nothing
        function(book, callback){
          if (book.type === 'text/plain') {
            var lines = 0;
            var totalPages = 0;
            var page = '';
            var bookContent = [];
            var strOnPage = 60;
            var DataReader = txtreader.DataReader;

            new DataReader (book.path, { encoding: "utf8" })
              .on ("error", function (error) {
                console.log ("Get book (4) " + error);
                asyncErr = new Error("Get book (4) " + error);
                asyncErr.code = 500;
                callback(asyncErr);
              })
              .on ("line", function (line/*, nextByteOffset*/){
                page += line +'\r\n';

                if (++lines >= strOnPage) {
                  bookContent.push(page);
                  //console.log(lines);
                  page = '';
                  lines = 0;
                  totalPages++;
                }
              })
              .on ("end", function () {
                if (page !== ''){
                  bookContent.push(page);
                  page = '';
                  totalPages++;
                }
                book.content = bookContent;
                book.totalPages = totalPages;
                //console.log(totalPages);

                callback(null, book);
              })
              .read ();

          } else if (book.type === 'application/pdf') {
            callback(null, book);
          }
        }],

        function(err, result){
          if (err) {
            res.send(err.code, err.message);
          } else {
            res.send(200, {book: result});
          }
        });
    }
  });
};

exports.deleteBook = function(req, res) {

  photodb.collection('users', function(err, collection) {
    var usr;

    if (err) {
      console.log('Delete book: can not open \'users\' collection');
      res.send(500);
    } else {
      // find user
      collection.findOne({
        _id: new ObjectID(req.session.user._id)
        /*'firstName': req.session.user.firstName,
         'lastName': req.session.user.lastName,  */
      }, function(err, result) {
        if (err) {
          console.log("Delete book error (0): " + err);
          res.send(500);
        } else {
          usr = result;
          //var target_dir = '/home/ubuntu/bookcase/' + usr._id;
          var target_path;

          // remove book from bookshelf
          console.log(req.params) ;
          for (var i=0; i<usr.bookshelf.length; i++) {
            if (usr.bookshelf[i].ind == req.params.ind) {
              target_path = usr.bookshelf[i].path;
              usr.bookshelf.splice(i,1);
              break;
            }
          }

          //delete book from disk
          fs.unlink(target_path, function(err) {
            if (err) {
              console.log("Delete book error (1): " + err);
            }
            else {
              collection.update({}, {$pull:{'bookshelf':{'ind':req.params.ind}},
                                     $set: {'currentBook': '0'} }, function(err){
                if (err) {
                  console.log("Delete book error (2): " + err);
                } else {
                  res.send(usr);
                }
              });
            }
          });
        }
      })
    }
  });
};

exports.setReaderCurrentBook = function(req, res) {
 // console.log(req.params);
  //console.log(req.params.userID);
  if (req.params.userID) {
    photodb.collection('users', function(err, collection) {
      if (err) {
        console.log('resetReaderCurrentBook: can not open \'users\' collection');
        res.send(500);
      } else {

        // update user's currentBook fields
        if (req.query.reset == 'true' ) {
          // reset current book to 0 when leaving book page (to bookshelf (today - 18.03.2014) or any page in future
          collection.update({ _id: new ObjectID(req.session.user._id) }, {$set: {'currentBook': '0' }},  {w:1},
            function(err, result) {
              if (err) {
                console.log("rsetReaderCurrentBook error (2): " + err);
                res.send(500, "rsetReaderCurrentBook error (2): " + err);
              } else {
                console.log("resetReaderCurrentBook Ok");
                res.send(200, "resetReaderCurrentBook Ok");
              }
            });
        } else {
          // remember book and page on page load
          collection.update(
            {
              _id: new ObjectID(req.params.userID),
              'bookshelf.ind': req.params.bookInd,
              'bookshelf.currentChapter': req.params.oldPage
            },
            {
              $set:
              {
                'bookshelf.$.currentChapter': req.params.newPage,
                'currentBook': req.params.bookInd
              }
            },
            {w:1},
            function(err, result) {
              //console.log(result);
              if (err) {
                console.log("setReaderCurrentBook error (2): " + err);
                res.send(500, "setReaderCurrentBook error (2): " + err);
              } else {
                console.log("setReaderCurrentBook Ok");
                res.send(200, "setReaderCurrentBook Ok");
              }
            });
        }
      }
    });
  } else {
    res.send(409);
  }
};

exports.addReader = function(req, res){
  res.send('New reader added');
};

exports.editReader = function(req, res){
  res.send('Reader edited');
};

exports.deleteReader = function(req, res){
  res.send('Reader deleted');
};
/*
exports.addBook = function(reg,res){
  res.send('New book added');
};
*/

