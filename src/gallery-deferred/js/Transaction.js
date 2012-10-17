
/**
Represents the promise of an IO transaction being completed
@class Transaction
@constructor
@extends Promise
*/
function Transaction() {
}

Transaction.NAME = 'transaction';


/**
Makes a new GET HTTP request
@method get
@param {String} uri Path to the request resource
@param {Function|Object} config Either a callback for the complete event or a full configuration option
@chainable
*/
/**
Makes a new POST HTTP request
@method post
@param {String} uri Path to the request resource
@param {Function|Object} config Either a callback for the complete event or a full configuration option
@chainable
*/
/**
Makes a new POST HTTP request sending the content of a form
@method postForm
@param {String} uri Path to the request resource
@param {String} id The id of the form to serialize and send in the request
@param {Function|Object} config Either a callback for the complete event or a full configuration option
@chainable
*/
/**
Makes a new GET HTTP request and parses the result as JSON data
@method getJSON
@param {String} uri Path to the request resource
@param {Function|Object} config Either a callback for the complete event or a full configuration option
@chainable
*/
/**
Makes a new JSONP request
@method jsonp
@param {String} uri Path to the jsonp service
@param {Function|Object} config Either a callback for the complete event or a full configuration option
@chainable
*/
if (Y.io) {

    Y.Transaction = Transaction;

    Y.mix(Y.io, {
        
        /**
        Utility function for normalizing an IO configuration object.
        If a function is providad instead of a configuration object, the function is used
        as a 'complete' event handler.
        @method _normalizeConfig
        @for io
        @private
        @static
        */
        _normalizeConfig: function (config, args) {
            if (Y.Lang.isFunction(config)) {
                config = { on: { complete: config } };
            } else {
                config = config || {};
                config.on = config.on || {};
            }
            return Y.merge(config, args);
        },
        /**
        Takes an object with "success" and "failure" properties, such as one
        from a IO configuration, and registers those callbacks as promise handlers
        @method _eventsToCallbacks
        @for io
        @private
        @static  
        @param {Transaction} request
        @param {Object} Object with "success" and/or "failure" properties
        */
        _eventsToCallbacks: function (promise, events) {
            if (events.success || events.failure) {
                promise = promise.then(events.success, events.failure);
            }
            if (events.complete) {
                promise = promise.then(events.complete, events.complete);
            }
            return promise;
        },

        /**
        Add a deferred function to Y.io and add it as a method of Y.Transaction
        @method addMethod
        @for io
        @static
        @param {String} name Name of the method
        @param {Function} fn Method
        */
        addMethod: function (name, fn) {
            Y.io[name] = fn;
            Transaction.prototype[name] = fn;
        },
        
        /**
        Adds multiple methods to Y.io and Y.Transaction from an object
        @method addMethods
        @for io
        @static
        @param {Obejct} methods Key/value pairs of names and functions
        */
        addMethods: function (methods) {
            Y.Object.each(methods, function (fn, name) {
                Y.io.addMethod(name, fn);
            });
        },
        then: function (fn) {
            return new Y.Deferred().resolve().then(fn).promise(new Y.Transaction());
        }
    });

    Y.io.addMethods({
        /**
        Makes an IO request and returns a new Transaction object for it.
        It also normalizes callbacks as event handlers with an EventFacade
        @method _deferIO
        @for io
        @private
        @static
        */
        _deferIO: function (uri, config) {
            var deferred = new Y.Deferred(),
                self = this,
                on = config.on,
                next;

            config.on = {
                success: function (id, response) {
                    if (config.parser) {
                        try {
                            response.data = config.parser(response.responseText);
                        } catch (e) {
                            deferred.reject.apply(deferred, arguments);
                            return;
                        }
                    }
                    deferred.resolve.apply(deferred, arguments);
                },
                failure: function () {
                    deferred.reject.apply(deferred, arguments);
                }
            };

            next = this.then(function () {
                var xhr = Y.io(uri, config),
                    promise = deferred.promise(new self.constructor());

                promise.abort = function () {
                    if (xhr) {
                        xhr.abort();
                    }
                    deferred.reject.apply(deferred, arguments);
                };

                return promise;
            });

            if (on) {
                next = Y.io._eventsToCallbacks(next, on);
            }

            return next.promise(new Y.Transaction());
        },
        /**
        Normalizes the Y.Get API so that it looks the same to the Y.io methods
        @method _deferGet
        @param {String} 
        @for io
        @private
        @static
        */
        _deferGet: function (method, uri, config) {
            var callback,
                next;

            if (Y.Lang.isFunction(config)) {
                callback = config;
                config = {};
            }
            if (!config) {
                config = {};
            }

            next = this.then(function () {
                var deferred = new Y.Deferred();

                Y.Get[method](uri, config, function (err) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve();
                    }
                });
                return deferred.promise();
            });

            if (callback) {
                next = next.then(callback, callback);
            }
            if (config.on) {
                next = Y.io._eventsToCallbacks(next, config.on);
            }

            return next.promise(new Y.Transaction());
        },
        
        /**
        Makes a new GET HTTP request
        @method get
        @param {String} uri Path to the request resource
        @param {Function|Object} config Either a callback for the complete event or a full configuration option
        @return {Transaction}
        @for io
        @static
        */
        get: function (uri, config) {
            return this._deferIO(uri, Y.io._normalizeConfig(config, {
                method: 'GET'
            }));
        },
        
        /**
        Makes a new POST HTTP request
        @method post
        @param {String} uri Path to the request resource
        @param {Function|Object} config Either a callback for the complete event or a full configuration option
        @return {Transaction}
        @for io
        @static
        */
        post: function (uri, data, config) {
            return this._deferIO(uri, Y.io._normalizeConfig(config, {
                method: 'POST',
                data: data
            }));
        },

        /**
        Makes a new PUT HTTP request
        @method put
        @param {String} uri Path to the request resource
        @param {Function|Object} config Either a callback for the complete event or a full configuration option
        @return {Transaction}
        @for io
        @static
        */
        put: function (uri, data, config) {
            return this._deferIO(uri, Y.io._normalizeConfig(config, {
                method: 'PUT',
                data: data
            }));
        },

        /**
        Makes a new DELETE HTTP request
        @method del
        @param {String} uri Path to the request resource
        @param {Function|Object} config Either a callback for the complete event or a full configuration option
        @return {Transaction}
        @for io
        @static
        */
        del: function (uri, data, config) {
            return this._deferIO(uri, Y.io._normalizeConfig(config, {
                method: 'DELETE',
                data: data
            }));
        },
        
        /**
        Makes a new POST HTTP request sending the content of a form
        @method postForm
        @for io
        @static
        @param {String} uri Path to the request resource
        @param {String} id The id of the form to serialize and send in the request
        @param {Function|Object} config Either a callback for the complete event or a full configuration option
        @return {Transaction}
        */
        postForm: function (uri, id, config) {
            return this._deferIO(uri, Y.io._normalizeConfig(config, {
                method: 'POST',
                form: { id: id }
            }));
        },
        /**
        Alias for Y.io.js
        @method script
        @for io
        @static
        */
        script: function () {
            return this.js.apply(this, arguments);
        },
        /**
        Loads a script through Y.Get.script
        All its options persist, but it also accepts an "on" object
        with "success" and "failure" properties like the rest of the Y.io methods
        @method js
        @for io
        @static
        @param {String} uri Path to the request resource
        @param {Function|Object} config Either a callback for the complete event or a full configuration option
        @return {Transaction}
        */
        js: function (uri, config) {
            return this._deferGet('js', uri, config);
        },
        /**
        Loads a stylesheet through Y.Get.css
        All its options persist, but it also accepts an "on" object
        with "success" and "failure" properties like the rest of the Y.io methods
        @method css
        @for io
        @static
        @param {String} uri Path to the request resource
        @param {Function|Object} config Either a callback for the complete event or a full configuration option
        @return {Transaction}
        */
        css: function (uri, config) {
            return this._deferGet('css', uri, config);
        }
    });
    
    if (Y.JSON) {
        /**
        Makes a new GET HTTP request and parses the result as JSON data
        @method getJSON
        @for io
        @static
        @param {String} uri Path to the request resource
        @param {Function|Object} config Either a callback for the complete event or a full configuration option
        @return {Transaction}
        */
        Y.io.addMethod('getJSON', function (uri, config) {
            config = Y.io._normalizeConfig(config);
            config.parser = Y.JSON.parse;
            
            return this._deferIO(uri, config);
        });
    }

    if (Y.jsonp) {
        /**
        Makes a new JSONP request
        @method jsonp
        @for io
        @static
        @param {String} uri Path to the jsonp service
        @param {Function|Object} config Either a callback for the complete event or a full configuration option
        @return {Transaction}
        */
        Y.io.addMethod('jsonp', function (uri, config) {
            var on, next;
            config = Y.io._normalizeConfig(config);

            on = config.on;

            next = this.then(function () {
                var deferred = new Y.Deferred(),
                    failFn = function () {
                        deferred.reject.apply(deferred, arguments);
                    };
                
                config.on = {
                    success: function (id, response) {
                        deferred.resolve.apply(deferred, arguments);
                    },
                    failure: failFn,
                    timeout: failFn
                };
                
                Y.jsonp(uri, config);

                return deferred.promise();
            });

            if (on) {
                next = Y.io._eventsToCallbacks(next, on);
            }

            return next.promise(new Y.Transaction());
        });
    }
}
