var PORT = 8080,

    sys = require('sys'),
    http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs');

String.prototype.repeat = function(num) {
    return new Array(isNaN(num) ? 1 : num+1).join(this);
}

var stockValue = 16.4;
var subscriptions = [];

function respondChunk(response, chunk) {
    chunk = chunk.toString();
    var len = chunk.length.toString(16);
    if (response.isIE) {
        response.write('<script type="text/javascript">parent.push("' + chunk + '")</script>');
    } else {
        response.write(len + "\r\n" + chunk + "\r\n");
    }
}

function publishStockValue(value) {
    sys.puts('publishStockValue:' + value);
    if (!isNaN(value)) {
        stockValue = value;
    }

    var i=0, sub;
    for (i=subscriptions.length-1; i>=0; --i) {
        sub = subscriptions[i];
        if (sub) {
            respondChunk(sub.response, value.toString());
        }
    }
}

function subscribeStockValue(request, response) {
    var nextID = subscriptions.nextID || 0;
    subscriptions[nextID] = {request: request, response: response};
    subscriptions.nextID = nextID + 1;
    return nextID;
}

function unsubscribeStockValue(id) {
    sys.puts('unsubscribeStockValue:' + id);
    subscriptions[id]= null;
}

function handleAJAX(request, response) {
    var urlParams = url.parse(request.url, true);
    var pathname = urlParams.pathname;

    sys.puts(pathname);
    if (pathname.indexOf('/subscribe') === 0) {
        var userAgentString = request.headers['user-agent'];

        response.writeHead(200, {'Content-Type': 'application/octet-stream'});

        response.isIE = userAgentString.match(/MSIE/);
        if (response.isIE) {
            response.write('#'.repeat(256));
        }

        var subID = subscribeStockValue(request, response);
        request.addListener('end', function() {
            unsubscribeStockValue(subID);
        });

        //var stockValue = 16.4;
        /*
        setInterval(function() {
            stockValue += 5;

            respondChunk(response, stockValue.toString());
        }, 1000);
        */

        return true;
    } else if (pathname.indexOf('/publish') === 0) {
        var newVal = urlParams.query ? urlParams.query.val: 0;
        publishStockValue(Number(newVal));

        response.writeHead(200);
        response.end();

        return true;
    }
    return false;
}


http.createServer(function(request, response) {
    var pathname = url.parse(request.url).pathname;
    var filename = path.join(process.cwd(), pathname);

    /*
    request.addListener('data', function(chunk) { request.content += chunk; });
    request.addListener('end', function() {
        sys.puts('end');
    });
    */

    path.exists(filename, function(exists) {
        if (!exists) {
            if (handleAJAX(request, response)) {
                return;
            }

            response.writeHead(404, {"Content-Type": "text/html"});
            response.write("404 Not found");
            response.end();
            return;
        }

        fs.readFile(filename, "binary", function(err, file) {
            if (err) {
                response.writeHead(500, {"Content-Type": "text/html"});
                response.write(err + '');
                response.end();
                return;
            }

            response.writeHead(200);
            response.write(file, "binary");
            response.end();
        });
    });
}).listen(PORT);


sys.puts('Server running at port ' + PORT);

