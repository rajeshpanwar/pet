/**
 * Created by rajesh on 17/10/16.
 */

var express = require('express');
var nconf = require('nconf');
var path = require('path');
var env = process.env.NODE_ENV || "dev";
nconf.use('file', {file: path.join(__dirname, '../config/' + env + '.json')});

console.log("path.join(__dirname, '../config/' + env + '.json'", path.join(__dirname, '../app/config/' + env + '.json'));

var app = express();

app.use(express.logger('dev'));

// Called from Load Balancer to check if app is live and working.
app.use("/islive", function (req, res, next) {
    res.send(200);
});

app.use(function (req, res, next) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    // Following headers are needed for CORS
    res.setHeader('access-control-allow-headers', 'Origin, X-Requested-With, Content-Type, Accept, ajax, access-key,backend,app_request,frontend');
    res.setHeader('access-control-allow-methods', 'POST,HEAD,GET,PUT,DELETE,OPTIONS');
    res.setHeader('access-control-allow-origin', '*');
    res.removeHeader("X-Powered-By");
    next();
});

// serve static files directly
// TODO remove this. All static files should be served from CDN.
app.use(express.static(__dirname + '/frontend'));

app.use(express.bodyParser());

// session

// support _method (PUT in forms etc)
app.use(express.methodOverride());
app.use(express.cookieParser());

var FSStore = require('connect-file-store')(express);

var user_session = express.session({
    key: 'jsessionid',
    secret: 'aersda@#$32sfas2342',
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
    },
    store: new FSStore({
        path: '/tmp/sessions',
        reapInterval: -1
    })
});
app.use(function (req, res, next) {
    user_session(req, res, next);
})


app.use(function (error, req, res, next) {
    res.send(406, "Empty Body.");
});

process.on('uncaughtException', function (err) {
    console.log(err.statusCode);
});

app.options('*', function (req, res, next) {
    res.send(200);
});

app.use(function(req, res, next){

    console.log("Request.session >>>>>>>", req.session.user);

   next();
})


app.use(function(req, res, next){
    if (req.headers.ajax == '1') {
        return next();
    }
    res.sendfile(path.join(__dirname, './frontend/index.html'));
})

app.post('/api/v1/user/registration', function (req, res, next) {
    console.log("------------here ::", req.body);
    require('commands').registration(req, res, next);
})

app.post('/api/v1/user/login', function (req, res, next) {
    console.log("------------here ::", req.body);
    require('commands').login(req, res, next);
})

app.get('/api/v1/pet/list', function(req, res, next){
    require('commands').petlist(req, res, next);
})

app.get('/api/v1/pet/selected-pet', function(req, res, next){
    require('commands').selectPetlist(req, res, next);
})

app.put('/api/v1/user/updatepetSelection', function(req, res, next){
    require('commands').updatepetSelection(req, res, next);
})


var server = app.listen(3000);
console.log('\n  listening on port 3000');

server.timeout = 15 * 60 * 1000;
server.on('close', function () {
    console.log("SERVER EVENT: CLOSE");
});

server.on('clientError', function (arguments) {
    console.log("SERVER EVENT: clientError", arguments);
});

server.on('timeout', function () {
    console.log("SERVER EVENT: timeout");
});


