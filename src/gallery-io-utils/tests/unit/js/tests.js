YUI.add('module-tests', function(Y) {

    var Assert = Y.Test.Assert;

    var suite = new Y.Test.Suite('io-utils');

    Y.Test.Case.prototype.success = function (promise, fn) {
        var test = this;

        promise.then(function (value) {
            test.resume(function () {
                fn.call(this, value);
            });
        }, function (err) {
            test.resume(function () {
                Assert.fail('Promise rejected instead of fulfilled');
                throw err;
            });
        });

        return this;
    };

    Y.Test.Case.prototype.failure = function (promise, fn) {
        var test = this;

        promise.then(function (value) {
            test.resume(function () {
                Assert.fail('Promise fulfilled instead of rejected');
            });
        }, function (err) {
            test.resume(function () {
                fn.call(this, err);
            });
        });

        return this;
    };

    suite.add(new Y.Test.Case({
        name: 'Y.io.xhr() tests',
        'simple XHR request': function () {
            var request = Y.io.xhr('echo/get?foo=bar');

            Assert.isInstanceOf(Y.Promise, request, 'return value should be a promise');

            this.success(request, function (xhr) {
                Assert.areEqual('foo=bar', xhr.responseText, 'server response does not match an echo');
            });

            this.wait();
        },

        'request timeout': function () {
            this.failure(Y.io.xhr('delay/1', {timeout: 10}), function (err) {
                Assert.isNumber(err.status, 'Error should have a status number');
            });

            this.wait();
        },

        'request failure': function () {
            this.failure(Y.io.xhr('echo/status/404'), function (err) {
                Assert.areEqual(404, err.status, 'Error should be a 404');
            });

            this.wait();
        },

        'abort() should reject the promise': function () {
            var request = Y.io.xhr('delay/1');

            request.abort();

            this.failure(request, function (err) {
                Assert.areEqual('abort', err.statusText, 'Error should be abortion');
            });

            this.wait();
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'HTTP verbs',

        'GET HTTP request': function () {
            this.success(Y.io.get('echo/get/?response=helloworld'), function (xhr) {
                Assert.areEqual('helloworld', xhr.responseText, 'GET request failure');
            });

            this.wait();
        },

        'POST HTTP request': function () {
            this.success(Y.io.post('echo/post/?response=helloworld'), function (xhr) {
                Assert.areEqual('helloworld', xhr.responseText, 'POST request failure');
            });

            this.wait();
        },

        'PUT HTTP request': function () {
            this.success(Y.io.put('echo/put/?response=helloworld'), function (xhr) {
                Assert.areEqual('helloworld', xhr.responseText, 'PUT request failure');
            });

            this.wait();
        },

        'DELETE HTTP request': function () {
            this.success(Y.io.DELETE('echo/delete/?response=helloworld'), function (xhr) {
                Assert.areEqual('helloworld', xhr.responseText, 'DELETE request failure');
            });

            this.wait();
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'JSON requests',

        'simple JSON request': function () {
            this.success(Y.io.json('echo/get/?response={"foo":"bar"}'), function (data) {
                Assert.areEqual('bar', data.foo, 'GET request failure');
            });

            this.wait();
        },

        'catching parse error': function () {
            this.failure(Y.io.json('echo/get/?response=asdf'), function (err) {
                Assert.isInstanceOf(Error, err, 'error should be a syntax error');
            });

            this.wait();
        },

        'reviver function': function () {
            var date = new Date().toJSON(),
                DATEPATTERN = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/;

            var request = Y.io.json('echo/get/?response={"date":"' + date + '"}', {
                reviver: function(key, value) {
                    return DATEPATTERN.test(value) ? new Date(value) : value;
                }
            });

            this.success(request, function (data) {
                Assert.isInstanceOf(Date, data.date, 'Date was not revived');
                Assert.areSame(date, data.date.toJSON(), 'Date was not properly parsed');
            });

            this.wait();
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'HTTP verbs with JSON',

        'GET JSON request': function () {
            this.success(Y.io.getJSON('echo/get/?response={"foo":"bar"}'), function (data) {
                Assert.areEqual('bar', data.foo, 'GET request failure');
            });

            this.wait();
        },

        'POST JSON request': function () {
            this.success(Y.io.postJSON('echo/json/', {"foo":"bar"}), function (data) {
                Assert.areEqual('bar', data.foo, 'POST request failure');
            });

            this.wait();
        },

        'PUT JSON request': function () {
            this.success(Y.io.putJSON('echo/json/', {"foo":"bar"}), function (data) {
                Assert.areEqual('bar', data.foo, 'PUT request failure');
            });

            this.wait();
        },

        'DELETE JSON request': function () {
            this.success(Y.io.deleteJSON('echo/delete/?response={"foo":"bar"}'), function (data) {
                Assert.areEqual('bar', data.foo, 'DELETE request failure');
            });

            this.wait();
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'jsonp requests',

        'simple jsonp request': function () {
            var request = Y.io.jsonp('echo/get/?response={callback}({"foo":"bar"})');

            this.success(request, function (data) {
                Assert.areEqual('bar', data.foo, 'did not get the correct response from echoecho');
            });

            this.wait();
        },

        'jsonp request timeout': function () {
            this.failure(Y.io.jsonp('delay/1', {timeout: 50}), function (err) {
                Assert.isTrue(err.errors.length > 0, 'transaction should have an error');
            });

            this.wait();
        }
    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'test' ] });
