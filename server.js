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
    , path = require('path');

var app = express();

// all environments

app.set('port', process.env.PORT || 9000);
/*
app.set('env','production');
process.env.NODE_ENV = 'production';
*/
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('Do not try'));
app.use(express.session());

app.use(app.router);

if ('production' == app.get('env')) {
    app.use(express.static(path.join(__dirname, 'dist')));
} else {
    app.use(express.static(path.join(__dirname, 'app')));
    app.use(express.errorHandler());
}
app.use(express.static('/home/ubuntu/bookcase', {maxAge: 31557600000}));

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

http.createServer(app).listen(app.get('port'), function(){
    //console.log('Express server listening on port ' + app.get('port'));
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});
