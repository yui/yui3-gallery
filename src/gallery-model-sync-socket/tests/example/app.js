
/**
 * Module dependencies
 */

var fs = require('fs'),
    combo = require('combohandler'),
    express = require('express'),
    Collection = require('./utils/db').Collection;

    yui3Path = __dirname + '/../../../../../yui3',
    yui3GalleryPath = __dirname + '/../../../../';

var app = module.exports = express();

app.configure(function () {
    app.set("view options", {layout: false});
    app.engine('.html', function (path, options, fn) {
        fs.readFile(path, 'utf8', function (err, str) {
            if (err) {
                return fn(err);
            }
            fn(null, str);
        });
    });
    app.set('views', __dirname + '/views');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

// Routes

app.get('/', function (req, res) {
    res.render('index.html');
});

// YUI 3 combo handler.
app.get('/yui3', combo.combine({ rootPath: yui3Path }), function (req, res) {
    res.send(res.body, 200);
});

// YUI 3 Gallery combo handler.
app.get('/yui3-gallery', combo.combine({ rootPath: yui3GalleryPath }), function (req, res) {
    res.send(res.body, 200);
});

var server = app.listen(3000),
    io = require('socket.io').listen(server),
    db = new Collection();

io.sockets.on('connection', function (socket) {
    socket.on('posts:update', function (data, callback) {
        db.update(data);
        socket.emit('posts/' + data.id + ':update', {data: data});
        socket.broadcast.emit('posts/' + data.id + ':update', {data: data});
    });

    socket.on('posts:read', function (data, callback) {
        socket.emit('posts:read', {data: db.toJSON()});
    });

    socket.on('posts:construct', function (data, callback) {
        data = db.add(data);
        socket.emit('posts:construct', {data: data});
        socket.broadcast.emit('posts:construct', {data: data});
    });

    socket.on('posts:delete', function (data, callback) {
        db.remove(data);
        socket.emit('posts/' + data.id + ':delete');
        socket.broadcast.emit('posts/' + data.id + ':delete');
    });
});
