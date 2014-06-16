/*
var express = require('express')
    , http = require('http')
    , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

// development only
if ('production' == app.get('env')) {
    app.use(express.static(path.join(__dirname, 'dist')));
} else {
    app.use(express.static(path.join(__dirname, 'app')));
    app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port %d in %s mode", app.get('port'), app.get('env'));
});
*/

/**
 * Module dependencies.
 */

var   express = require('express')
    , routes = require('./server/routes/routes')
    , http = require('http')
    , path = require('path')
    , passport = require('passport')
    , util = require('util')
    , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
    , AuthFacebookStrategy = require('passport-facebook').Strategy;
//var mysql      = require('mysql');
var GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET;
var FB_CLIENT_ID, FB_CLIENT_SECRET, FB_CALLBACK_URL;

var allowCORS = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Credentials','true');
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma,X-Requested-With, Accept, Origin, Referer, User-Agent, Content-Type, Authorization");

  // intercept OPTIONS method
  if (req.method.toLowerCase() === "options") {
    return res.send(200);
  }
  else {
    return next();
  }
};

var app = express();

// all environments

app.set('port', process.env.PORT || 9000);
/*
app.set('env','production');
process.env.NODE_ENV = 'production';
*/
app.configure(function(){
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(express.cookieParser('Do not try'));
  app.use(express.cookieSession({
    cookie: {
      path: '/'
    }
  }));
  app.use(express.session());

  app.use(passport.initialize());
  app.use(passport.session());

  //app.use(allowCORS);
  app.use(app.router);
});

if ('production' == app.get('env')) {
  app.use(express.static(path.join(__dirname, 'dist')));

  FB_CLIENT_ID = "302501756541152";
  FB_CLIENT_SECRET = "b52890782700c6a38a47c3bc705755ab";
  FB_CALLBACK_URL = 'http://theklub.info:9000/login/fb/callback';

} else {
  app.use(express.static(path.join(__dirname, 'app')));
  app.use(express.errorHandler());

  FB_CLIENT_ID = "1427968830799722";
  FB_CLIENT_SECRET = "09883cb4f093b1891d19340b2bac4d0f";
  FB_CALLBACK_URL = 'http://localhost:9000/login/fb/callback';
}
console.log(FB_CLIENT_ID, FB_CLIENT_SECRET);

app.use(express.static('/home/ubuntu/bookcase', {maxAge: 31557600000}));

GOOGLE_CLIENT_ID = "449126736782-dhts44nmhag59ctol30mddc0gl9mcamh.apps.googleusercontent.com";
GOOGLE_CLIENT_SECRET = "rU4K6s8T8Fn9RKJocgEhFw38";

/*
 passport.serializeUser(function(user, done) {
 done(null, user);
 });
 passport.deserializeUser(function(obj, done) {
 done(null, obj);
 });
 */
passport.serializeUser(function (user, done) {
  done(null, JSON.stringify(user));
});
passport.deserializeUser(function (data, done) {
  try {
    done(null, JSON.parse(data));
  } catch (e) {
    done(err)
  }
});

passport.use('google', new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:9000/login/google/callback',  //'https://www.example.com/oauth2callback/auth/google/callback'
    scope: 'https://www.googleapis.com/auth/plus.login ' +
      'https://www.googleapis.com/auth/plus.me ' +
      'https://www.googleapis.com/auth/userinfo.email ' +
      'https://www.googleapis.com/auth/userinfo.profile'
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {

      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

passport.use('facebook', new AuthFacebookStrategy({
    clientID: FB_CLIENT_ID,
    clientSecret: FB_CLIENT_SECRET,
    callbackURL: FB_CALLBACK_URL,
    profileFields: [
      'id',
      'name',
      'profileUrl',
      "photos",
      "emails",
      "location"
    ]
  },
  function (accessToken, refreshToken, profile, done) {

    //console.log("facebook json: ", profile);
    /*
    return done(null, {
      username: profile.displayName,
      photoUrl: profile.photos[0].value,
      profileUrl: profile.profileUrl
    });*/
    process.nextTick(function() {
        done(null, {
          id: profile.id,
          username: profile.name,
          photoUrl: profile.photos[0].value,
          profileUrl: profile.profileUrl,
          email: profile.emails[0].value,
          location: profile._json.location.name.split(',')[1].trim()
        });
    })
  }
));

app.get('/login/google',
  passport.authenticate('google'),
  function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });

app.get('/login/google/callback',
  passport.authenticate('google', {  successRedirect: '/',failureRedirect: '/' }),
  function(req, res) {
    console.log('123');
    //res.redirect('/');
  });

app.get('/login/fb',
  passport.authenticate('facebook', {
    scope: ['email','user_location']
  })
);

app.get('/login/fb/callback', function(req, res, next)  {
  passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/' },
    function(err, user, info){
      //res.clearCookie('fblogin', { path: '/'} );
      var s = JSON.stringify(user);
      req.session.fblogin = s;
      req.cookies.fblogin = s;
      res.cookie('fblogin', s);
      console.log('req.cookies: ',req.cookies);
      /*
      console.log(req.cookies);
      console.log('req.cookies: ',req.cookies);
      console.log(user);
      console.log(info) ;
      */
      if (routes.fbLogin(req, res) == false) {
        console.log('routes.fbLogin(req, res) == false: ',req.cookies);

      } else {
        // !!!!!!  TO DO:  use flash    !!!!!!!!

      }
      req.session.fblogin = null;

      return res.redirect('/');

    }) (req, res, next);
  }
);


app.get('/', routes.index);
app.post('/login', routes.login);
app.post('/logout', routes.logout);
app.post('/register', routes.register);
app.post('/passwordreminder', routes.passwordReminder);

//app.post('/file-upload', routes.fileUpload);

app.post('/reader', routes.addReader);
app.put('/reader/:id', routes.editReader);
app.put('/reader/:userID/:bookInd/:oldPage/:newPage', routes.setReaderCurrentBook);
app.delete('/reader/:id', routes.deleteReader);

app.post('/book', routes.addBook);
app.get('/book/:ind', routes.getBook);
app.delete('/book/:ind', routes.deleteBook);

routes.initDB();

console.log(app.get('env'));
http.createServer(app).listen(app.get('port'), function(){
    //console.log('Express server listening on port ' + app.get('port'));
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});
