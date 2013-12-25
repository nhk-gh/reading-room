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

app.set('port', process.env.PORT || 3000);

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);

if ('production' == app.get('env')) {
    app.use(express.static(path.join(__dirname, 'dist')));
    console.log("env");
} else {
    app.use(express.static(path.join(__dirname, 'app')));
    app.use(express.errorHandler());
    console.log("----- " + path.join(__dirname, 'app'));
}

app.get('/', routes.index);
app.get('/awesomeThings', routes.awesomeThings);

app.post('/readers', routes.addReader);
app.put('/readers:id', routes.editReader);
app.delete('/readers:id', routes.deleteReader);

app.post('/book', routes.addBook);
app.put('/book:id', routes.editBook);
app.delete('/book:id', routes.deleteBook);



http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
