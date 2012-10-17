if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["/build/gallery-deferred/gallery-deferred.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-deferred/gallery-deferred.js",
    code: []
};
_yuitest_coverage["/build/gallery-deferred/gallery-deferred.js"].code=["YUI.add('gallery-deferred', function(Y) {","","/**","Wraps the execution of synchronous or asynchronous operations, providing a","promise object that can be used to subscribe to the various ways the operation","may terminate.","","When the operation completes successfully, call the Deferred's `resolve()`","method, passing any relevant response data for subscribers.  If the operation","encounters an error or is unsuccessful in some way, call `reject()`, again","passing any relevant data for subscribers.","","The Deferred object should be shared only with the code resposible for","resolving or rejecting it. Public access for the Deferred is through its","_promise_, which is returned from the Deferred's `promise()` method. While both","Deferred and promise allow subscriptions to the Deferred's state changes, the","promise may be exposed to non-controlling code. It is the preferable interface","for adding subscriptions.","","Subscribe to state changes in the Deferred with the promise's","`then(callback, errback)` method.  `then()` wraps the passed callbacks in a","new Deferred and returns the corresponding promise, allowing chaining of","asynchronous or synchronous operations. E.g.","`promise.then(someAsyncFunc).then(anotherAsyncFunc)`","","@module deferred","@since 3.7.0","**/","var slice   = [].slice,","    isArray = Y.Lang.isArray;","    ","/**","Represents an operation that may be synchronous or asynchronous.  Provides a","standard API for subscribing to the moment that the operation completes either","successfully (`resolve()`) or unsuccessfully (`reject()`).","","@class Deferred","@constructor","**/","function Deferred() {","    this._subs = {","        resolve: [],","        reject : []","    };","","    this._promise = new Y.Promise(this);","","    this._status = 'in progress';","","}","","Y.mix(Deferred.prototype, {","    /**","    Returns the promise for this Deferred.","","    @method promise","    @return {Promise}","    **/","    promise: function (obj) {","        return Y.Lang.isObject(obj) ? Y.mix(obj, this._promise, true) : this._promise;","    },","","    /**","    Resolves the Deferred, signaling successful completion of the","    represented operation. All \"resolve\" subscriptions are executed with","    all arguments passed in. Future \"resolve\" subscriptions will be","    executed immediately with the same arguments. `reject()` and `notify()`","    are disabled.","","    @method resolve","    @param {Any} arg* Any data to pass along to the \"resolve\" subscribers","    @return {Deferred} the instance","    @chainable","    **/","    resolve: function () {","        this._result = slice.call(arguments);","","        this._notify(this._subs.resolve, this.promise(), this._result);","","        this._subs = { resolve: [] };","","        this._status = 'resolved';","","        return this;","    },","","    /**","    Resolves the Deferred, signaling *un*successful completion of the","    represented operation. All \"reject\" subscriptions are executed with","    all arguments passed in. Future \"reject\" subscriptions will be","    executed immediately with the same arguments. `resolve()` and `notify()`","    are disabled.","","    @method reject","    @param {Any} arg* Any data to pass along to the \"reject\" subscribers","    @return {Deferred} the instance","    @chainable","    **/","    reject: function () {","        this._result = slice.call(arguments);","","        this._notify(this._subs.reject, this.promise(), this._result);","","        this._subs = { reject: [] };","","        this._status = 'rejected';","","        return this;","    },","","    /**","    Schedule execution of a callback to either or both of \"resolve\" and","    \"reject\" resolutions for the Deferred.  The callbacks","    are wrapped in a new Deferred and that Deferred's corresponding promise","    is returned.  This allows operation chaining ala","    `functionA().then(functionB).then(functionC)` where `functionA` returns","    a promise, and `functionB` and `functionC` _may_ return promises.","","    @method then","    @param {Function} [callback] function to execute if the Deferred","                resolves successfully","    @param {Function} [errback] function to execute if the Deferred","                resolves unsuccessfully","    @return {Promise} The promise of a new Deferred wrapping the resolution","                of either \"resolve\" or \"reject\" callback","    **/","    then: function (callback, errback) {","        var then    = new Y.Deferred(),","            promise = this.promise(),","            resolveSubs = this._subs.resolve || [],","            rejectSubs  = this._subs.reject  || [];","","        function wrap(fn, method) {","            return function () {","                var args = slice.call(arguments);","","                // Wrapping all callbacks in setTimeout to guarantee","                // asynchronicity. Because setTimeout can cause unnecessary","                // delays that *can* become noticeable in some situations","                // (especially in Node.js), I'm using Y.soon if available.","                // As of today, Y.soon is only available in the gallery as","                // gallery-soon, but maybe it could get promoted to core?","                (Y.soon || setTimeout)(function () {","                    var result = fn.apply(promise, args),","                        resultPromise;","","                    if (result && typeof result.promise === 'function') {","                        resultPromise = result.promise();","","                        if (resultPromise.getStatus() !== 'in progress') {","                            then[method].apply(then, resultPromise.getResult());","                        } else {","                            result.promise().then(","                                Y.bind(then.resolve, then), // callback","                                Y.bind(then.reject, then)); // errback","                        }","                    } else {","                        then[method].apply(then,","                            (isArray(result) ? result : [result]));","                    }","                }, 0);","            };","        }","","        resolveSubs.push((typeof callback === 'function') ?","            wrap(callback, 'resolve') : Y.bind('resolve', then));","","        rejectSubs.push((typeof errback === 'function') ?","            wrap(errback, 'reject') : Y.bind('reject', then));","","        if (this._status === 'resolved') {","            this.resolve.apply(this, this._result);","        } else if (this._status === 'rejected') {","            this.reject.apply(this, this._result);","        }","","        resolveSubs = rejectSubs = null;","","        return then.promise();","    },","","    /**","    Returns the current status of the Deferred as a string \"in progress\",","    \"resolved\", or \"rejected\".","","    @method getStatus","    @return {String}","    **/","    getStatus: function () {","        return this._status;","    },","","    /**","    Returns the result of the Deferred.  Use `getStatus()` to test that the","    promise is resolved before calling this.","","    @method getResult","    @return {Any[]} Array of values passed to `resolve()` or `reject()`","    **/","    getResult: function () {","        return this._result;","    },","","    /**","    Executes an array of callbacks from a specified context, passing a set of","    arguments.","","    @method _notify","    @param {Function[]} subs The array of subscriber callbacks","    @param {Object} context The `this` object for the callbacks","    @param {Any[]} args Any arguments to pass the callbacks","    @protected","    **/","    _notify: function (subs, context, args) {","        var i, len;","","        if (subs) {","            for (i = 0, len = subs.length; i < len; ++i) {","                subs[i].apply(context, args);","            }","        }","    }","","}, true);","","Y.Deferred = Deferred;","/**","The public API for a Deferred.  Used to subscribe to the notification events for","resolution or progress of the operation represented by the Deferred.","","@class Promise","@constructor","@param {Deferred} deferred The Deferred object that the promise represents","**/","function Promise(deferred) {","    var self = this;","    Y.Array.each(['then', 'promise', 'getStatus', 'getResult'], function (method) {","        self[method] = function () {","            return deferred[method].apply(deferred, arguments);","        };","    });","}","/**","Schedule execution of a callback to either or both of \"resolve\" and","\"reject\" resolutions for the associated Deferred.  The callbacks","are wrapped in a new Deferred and that Deferred's corresponding promise","is returned.  This allows operation chaining ala","`functionA().then(functionB).then(functionC)` where `functionA` returns","a promise, and `functionB` and `functionC` _may_ return promises.","","@method then","@param {Function} [callback] function to execute if the Deferred","            resolves successfully","@param {Function} [errback] function to execute if the Deferred","            resolves unsuccessfully","@return {Promise} The promise of a new Deferred wrapping the resolution","            of either \"resolve\" or \"reject\" callback","**/","","/**","Returns this promise.  Meta, or narcissistic?  Useful to test if an object","is a Deferred or Promise when the intention is to call its `then()`,","`getStatus()`, or `getResult()` method.","","@method promise","@return {Promise} This.","**/","","/**","Returns the current status of the Deferred. Possible results are","\"in progress\", \"resolved\", and \"rejected\".","","@method getStatus","@return {String}","**/","","/**","Returns the result of the Deferred.  Use `getStatus()` to test that the","promise is resolved before calling this.","","@method getResult","@return {Any[]} Array of values passed to `resolve()` or `reject()`","**/","","Y.Promise = Promise;","","/**"," * Returns a promise for a (possibly) asynchronous call."," * Calls a given function that receives the new promise as parameter and must call resolve()"," * or reject() at a certain point"," * @method defer"," * @param {Function} fn A function that encloses an async call."," * @return {Promise} a promise"," * @static"," * @for YUI"," */","Y.defer = function (fn, context) {","	var deferred = new Y.Deferred();","	fn(deferred);","	return deferred.promise();","};","","/**","Adds a `Y.when()` method to wrap any number of callbacks or promises in a","Y.Deferred, and return the associated promise that will resolve when all","callbacks and/or promises have completed.  Each callback is passed a Y.Deferred","that it must `resolve()` when it completes.","","@module deferred","@submodule deferred-when","**/","","/**","Wraps any number of callbacks in a Y.Deferred, and returns the associated","promise that will resolve when all callbacks have completed.  Each callback is","passed a Y.Deferred that it must `resolve()` when that callback completes.","","@for YUI","@method when","@param {Function|Promise} operation* Any number of functions or Y.Promise","            objects","@return {Promise}","**/","Y.when = function () {","    var funcs     = slice.call(arguments),","        allDone   = new Y.Deferred(),","        failed    = Y.bind('reject', allDone),","        remaining = funcs.length,","        results   = [];","","    function oneDone(i) {","        return function () {","            var args = slice.call(arguments);","","            results[i] = args.length > 1 ? args : args[0];","","            remaining--;","","            if (!remaining && allDone.getStatus() !== 'rejected') {","                allDone.resolve.apply(allDone, results);","            }","        };","    }","","    Y.Array.each(funcs, function (fn, i) {","        var finished = oneDone(i),","            deferred;","","        // accept promises as well as functions","        if (typeof fn === 'function') {","            deferred = new Y.Deferred();","        ","            deferred.then(finished, failed);","            ","            // It's up to each passed function to resolve/reject the deferred","            // that is assigned to it.","            fn.call(Y, deferred);","","        } else if (fn && typeof fn.then === 'function') {","            fn.then(finished, failed);","        } else {","            remaining--;","            results[i] = fn;","        }","    });","","    funcs = null;","","    // For some crazy reason, only values, not functions or promises were passed","    // in, so we're done already.","    if (!remaining) {","        allDone.resolve.apply(allDone, results);","    }","","    return allDone.promise();","};","","/**","A deferred plugin for Node that has methods for dealing with asynchronous calls such as transition()","@class Plugin.NodeDeferred","@constructor","@extends Promise","@param {Object} config An object literal containing plugin configuration","*/","function NodeDeferred(config) {","    this.host = config.host;","    this._config = config;","}","NodeDeferred.prototype.then = function (successFn) {","    return new Y.Deferred().resolve().then(successFn).promise();","};","","Y.mix(NodeDeferred, {","    /**","    Plugin namespace","    @property {String} NS","    @default 'deferred'","    @static","    */","    NS: 'deferred',","    ","    /**","    Imports a method from Y.Node so that they return instances of this same plugin representing promises","    @method deferMethod","    @param {String} method Name of the method to import from Y.Node","    @static","    */","    deferMethod: function (method) {","        NodeDeferred.prototype[method] = function () {","            var host = this.host,","                args = slice.call(arguments),","                callback,","                next;","","            if (typeof args[args.length - 1] === 'function') {","                callback = args.pop();","            }","","            next = this.then(function () {","                var deferred = new Y.Deferred();","","                host[method].apply(host, args.concat([function () {","                    deferred.resolve.apply(deferred, arguments);","                }]));","","                return callback ? deferred.then(callback) : deferred.promise();","            });","","            return next.promise(new this.constructor(this._config));","        };","    },","    /**","    Imports a method from Y.Node making it chainable but not returning promises","    @method importMethod","    @param {String} method Name of the method to import from Y.Node","    @static","    */","    importMethod: function(method) {","        NodeDeferred.prototype[method] = function () {","            var args = arguments,","                host = this.host;","            return this.then(function () {","                host[method].apply(host, args);","            });","        };","    }","});","","/**","Deferred version of the Node method","@method hide","@return {NodeDeferred}","*/","/**","Deferred version of the Node method","@method load","@return {NodeDeferred}"," */","/**","Deferred version of the Node method","@method show","@return {NodeDeferred}"," */","/**","Deferred version of the Node method","@method transition","@return {NodeDeferred}"," */","/**","Deferred version of the Node method","@method once","@return {NodeDeferred}"," */","/**","Deferred version of the Node method","@method onceAfter","@return {NodeDeferred}"," */","Y.Array.each(['hide', 'load', 'show', 'transition', 'once', 'onceAfter'], NodeDeferred.deferMethod);","/**","Same as the Node method ","@method addClass","@chainable"," */","/**","Same as the Node method ","@method append","@chainable"," */","/**","Same as the Node method ","@method appendTo","@chainable"," */","/**","Same as the Node method ","@method blur","@chainable"," */","/**","Same as the Node method ","@method clearData","@chainable"," */","/**","Same as the Node method ","@method destroy","@chainable"," */","/**","Same as the Node method ","@method empty","@chainable"," */","/**","Same as the Node method ","@method focus","@chainable"," */","/**","Same as the Node method ","@method insert","@chainable"," */","Y.Array.each(['addClass', 'append', 'appendTo', 'blur', 'clearData', 'destroy', 'empty', 'focus', 'insert',","/**","Same as the Node method ","@method insertBefore","@chainable"," */","/**","Same as the Node method ","@method prepend","@chainable"," */","/**","Same as the Node method ","@method remove","@chainable"," */","/**","Same as the Node method ","@method removeAttribute","@chainable"," */","/**","Same as the Node method ","@method removeChild","@chainable"," */","/**","Same as the Node method ","@method removeClass","@chainable"," */","/**","Same as the Node method ","@method replaceChild","@chainable"," */","    'insertBefore', 'prepend', 'remove', 'removeAttribute', 'removeChild', 'removeClass', 'replaceChild',","/**","Same as the Node method ","@method replaceClass","@chainable"," */","/**","Same as the Node method ","@method select","@chainable"," */","/**","Same as the Node method ","@method set","@chainable"," */","/**","Same as the Node method ","@method setAttrs","@chainable"," */","/**","Same as the Node method ","@method setContent","@chainable"," */","/**","Same as the Node method ","@method setData","@chainable"," */","/**","Same as the Node method ","@method setStyle","@chainable"," */","/**","Same as the Node method ","@method setStyles","@chainable"," */","    'replaceClass', 'select', 'set', 'setAttrs', 'setContent', 'setData', 'setStyle', 'setStyles', ","/**","Same as the Node method ","@method setX","@chainable"," */","/**","Same as the Node method ","@method setXY","@chainable"," */","/**","Same as the Node method ","@method setY","@chainable"," */","/**","Same as the Node method ","@method simulate","@chainable"," */","/**","Same as the Node method ","@method swapXY","@chainable"," */","/**","Same as the Node method ","@method toggleClass","@chainable"," */","/**","Same as the Node method ","@method wrap","@chainable"," */","/**","Same as the Node method ","@method unwrap","@chainable"," */","    'setX', 'setXY', 'setY', 'simulate', 'swapXY', 'toggleClass', 'wrap', 'unwrap'], NodeDeferred.importMethod);","","if (Y.Node && Y.Plugin) {    ","    Y.Plugin.NodeDeferred = NodeDeferred;","}","","/**","Represents the promise of an IO transaction being completed","@class Transaction","@constructor","@extends Promise","*/","function Transaction() {","}","","Transaction.NAME = 'transaction';","","","/**","Makes a new GET HTTP request","@method get","@param {String} uri Path to the request resource","@param {Function|Object} config Either a callback for the complete event or a full configuration option","@chainable","*/","/**","Makes a new POST HTTP request","@method post","@param {String} uri Path to the request resource","@param {Function|Object} config Either a callback for the complete event or a full configuration option","@chainable","*/","/**","Makes a new POST HTTP request sending the content of a form","@method postForm","@param {String} uri Path to the request resource","@param {String} id The id of the form to serialize and send in the request","@param {Function|Object} config Either a callback for the complete event or a full configuration option","@chainable","*/","/**","Makes a new GET HTTP request and parses the result as JSON data","@method getJSON","@param {String} uri Path to the request resource","@param {Function|Object} config Either a callback for the complete event or a full configuration option","@chainable","*/","/**","Makes a new JSONP request","@method jsonp","@param {String} uri Path to the jsonp service","@param {Function|Object} config Either a callback for the complete event or a full configuration option","@chainable","*/","if (Y.io) {","","    Y.Transaction = Transaction;","","    Y.mix(Y.io, {","        ","        /**","        Utility function for normalizing an IO configuration object.","        If a function is providad instead of a configuration object, the function is used","        as a 'complete' event handler.","        @method _normalizeConfig","        @for io","        @private","        @static","        */","        _normalizeConfig: function (config, args) {","            if (Y.Lang.isFunction(config)) {","                config = { on: { complete: config } };","            } else {","                config = config || {};","                config.on = config.on || {};","            }","            return Y.merge(config, args);","        },","        /**","        Takes an object with \"success\" and \"failure\" properties, such as one","        from a IO configuration, and registers those callbacks as promise handlers","        @method _eventsToCallbacks","        @for io","        @private","        @static  ","        @param {Transaction} request","        @param {Object} Object with \"success\" and/or \"failure\" properties","        */","        _eventsToCallbacks: function (promise, events) {","            if (events.success || events.failure) {","                promise = promise.then(events.success, events.failure);","            }","            if (events.complete) {","                promise = promise.then(events.complete, events.complete);","            }","            return promise;","        },","","        /**","        Add a deferred function to Y.io and add it as a method of Y.Transaction","        @method addMethod","        @for io","        @static","        @param {String} name Name of the method","        @param {Function} fn Method","        */","        addMethod: function (name, fn) {","            Y.io[name] = fn;","            Transaction.prototype[name] = fn;","        },","        ","        /**","        Adds multiple methods to Y.io and Y.Transaction from an object","        @method addMethods","        @for io","        @static","        @param {Obejct} methods Key/value pairs of names and functions","        */","        addMethods: function (methods) {","            Y.Object.each(methods, function (fn, name) {","                Y.io.addMethod(name, fn);","            });","        },","        then: function (fn) {","            return new Y.Deferred().resolve().then(fn).promise(new Y.Transaction());","        }","    });","","    Y.io.addMethods({","        /**","        Makes an IO request and returns a new Transaction object for it.","        It also normalizes callbacks as event handlers with an EventFacade","        @method _deferIO","        @for io","        @private","        @static","        */","        _deferIO: function (uri, config) {","            var deferred = new Y.Deferred(),","                self = this,","                on = config.on,","                next;","","            config.on = {","                success: function (id, response) {","                    if (config.parser) {","                        try {","                            response.data = config.parser(response.responseText);","                        } catch (e) {","                            deferred.reject.apply(deferred, arguments);","                            return;","                        }","                    }","                    deferred.resolve.apply(deferred, arguments);","                },","                failure: function () {","                    deferred.reject.apply(deferred, arguments);","                }","            };","","            next = this.then(function () {","                var xhr = Y.io(uri, config),","                    promise = deferred.promise(new self.constructor());","","                promise.abort = function () {","                    if (xhr) {","                        xhr.abort();","                    }","                    deferred.reject.apply(deferred, arguments);","                };","","                return promise;","            });","","            if (on) {","                next = Y.io._eventsToCallbacks(next, on);","            }","","            return next.promise(new Y.Transaction());","        },","        /**","        Normalizes the Y.Get API so that it looks the same to the Y.io methods","        @method _deferGet","        @param {String} ","        @for io","        @private","        @static","        */","        _deferGet: function (method, uri, config) {","            var callback,","                next;","","            if (Y.Lang.isFunction(config)) {","                callback = config;","                config = {};","            }","            if (!config) {","                config = {};","            }","","            next = this.then(function () {","                var deferred = new Y.Deferred();","","                Y.Get[method](uri, config, function (err) {","                    if (err) {","                        deferred.reject(err);","                    } else {","                        deferred.resolve();","                    }","                });","                return deferred.promise();","            });","","            if (callback) {","                next = next.then(callback, callback);","            }","            if (config.on) {","                next = Y.io._eventsToCallbacks(next, config.on);","            }","","            return next.promise(new Y.Transaction());","        },","        ","        /**","        Makes a new GET HTTP request","        @method get","        @param {String} uri Path to the request resource","        @param {Function|Object} config Either a callback for the complete event or a full configuration option","        @return {Transaction}","        @for io","        @static","        */","        get: function (uri, config) {","            return this._deferIO(uri, Y.io._normalizeConfig(config, {","                method: 'GET'","            }));","        },","        ","        /**","        Makes a new POST HTTP request","        @method post","        @param {String} uri Path to the request resource","        @param {Function|Object} config Either a callback for the complete event or a full configuration option","        @return {Transaction}","        @for io","        @static","        */","        post: function (uri, data, config) {","            return this._deferIO(uri, Y.io._normalizeConfig(config, {","                method: 'POST',","                data: data","            }));","        },","","        /**","        Makes a new PUT HTTP request","        @method put","        @param {String} uri Path to the request resource","        @param {Function|Object} config Either a callback for the complete event or a full configuration option","        @return {Transaction}","        @for io","        @static","        */","        put: function (uri, data, config) {","            return this._deferIO(uri, Y.io._normalizeConfig(config, {","                method: 'PUT',","                data: data","            }));","        },","","        /**","        Makes a new DELETE HTTP request","        @method del","        @param {String} uri Path to the request resource","        @param {Function|Object} config Either a callback for the complete event or a full configuration option","        @return {Transaction}","        @for io","        @static","        */","        del: function (uri, data, config) {","            return this._deferIO(uri, Y.io._normalizeConfig(config, {","                method: 'DELETE',","                data: data","            }));","        },","        ","        /**","        Makes a new POST HTTP request sending the content of a form","        @method postForm","        @for io","        @static","        @param {String} uri Path to the request resource","        @param {String} id The id of the form to serialize and send in the request","        @param {Function|Object} config Either a callback for the complete event or a full configuration option","        @return {Transaction}","        */","        postForm: function (uri, id, config) {","            return this._deferIO(uri, Y.io._normalizeConfig(config, {","                method: 'POST',","                form: { id: id }","            }));","        },","        /**","        Alias for Y.io.js","        @method script","        @for io","        @static","        */","        script: function () {","            return this.js.apply(this, arguments);","        },","        /**","        Loads a script through Y.Get.script","        All its options persist, but it also accepts an \"on\" object","        with \"success\" and \"failure\" properties like the rest of the Y.io methods","        @method js","        @for io","        @static","        @param {String} uri Path to the request resource","        @param {Function|Object} config Either a callback for the complete event or a full configuration option","        @return {Transaction}","        */","        js: function (uri, config) {","            return this._deferGet('js', uri, config);","        },","        /**","        Loads a stylesheet through Y.Get.css","        All its options persist, but it also accepts an \"on\" object","        with \"success\" and \"failure\" properties like the rest of the Y.io methods","        @method css","        @for io","        @static","        @param {String} uri Path to the request resource","        @param {Function|Object} config Either a callback for the complete event or a full configuration option","        @return {Transaction}","        */","        css: function (uri, config) {","            return this._deferGet('css', uri, config);","        }","    });","    ","    if (Y.JSON) {","        /**","        Makes a new GET HTTP request and parses the result as JSON data","        @method getJSON","        @for io","        @static","        @param {String} uri Path to the request resource","        @param {Function|Object} config Either a callback for the complete event or a full configuration option","        @return {Transaction}","        */","        Y.io.addMethod('getJSON', function (uri, config) {","            config = Y.io._normalizeConfig(config);","            config.parser = Y.JSON.parse;","            ","            return this._deferIO(uri, config);","        });","    }","","    if (Y.jsonp) {","        /**","        Makes a new JSONP request","        @method jsonp","        @for io","        @static","        @param {String} uri Path to the jsonp service","        @param {Function|Object} config Either a callback for the complete event or a full configuration option","        @return {Transaction}","        */","        Y.io.addMethod('jsonp', function (uri, config) {","            var on, next;","            config = Y.io._normalizeConfig(config);","","            on = config.on;","","            next = this.then(function () {","                var deferred = new Y.Deferred(),","                    failFn = function () {","                        deferred.reject.apply(deferred, arguments);","                    };","                ","                config.on = {","                    success: function (id, response) {","                        deferred.resolve.apply(deferred, arguments);","                    },","                    failure: failFn,","                    timeout: failFn","                };","                ","                Y.jsonp(uri, config);","","                return deferred.promise();","            });","","            if (on) {","                next = Y.io._eventsToCallbacks(next, on);","            }","","            return next.promise(new Y.Transaction());","        });","    }","}","","","}, 'gallery-2012.10.17-20-00' ,{optional:['node','plugin','node-load','transition','io-base','json','jsonp']});"];
_yuitest_coverage["/build/gallery-deferred/gallery-deferred.js"].lines = {"1":0,"29":0,"40":0,"41":0,"46":0,"48":0,"52":0,"60":0,"76":0,"78":0,"80":0,"82":0,"84":0,"100":0,"102":0,"104":0,"106":0,"108":0,"128":0,"133":0,"134":0,"135":0,"143":0,"144":0,"147":0,"148":0,"150":0,"151":0,"153":0,"158":0,"165":0,"168":0,"171":0,"172":0,"173":0,"174":0,"177":0,"179":0,"190":0,"201":0,"215":0,"217":0,"218":0,"219":0,"226":0,"235":0,"236":0,"237":0,"238":0,"239":0,"285":0,"297":0,"298":0,"299":0,"300":0,"324":0,"325":0,"331":0,"332":0,"333":0,"335":0,"337":0,"339":0,"340":0,"345":0,"346":0,"350":0,"351":0,"353":0,"357":0,"359":0,"360":0,"362":0,"363":0,"367":0,"371":0,"372":0,"375":0,"385":0,"386":0,"387":0,"389":0,"390":0,"393":0,"409":0,"410":0,"415":0,"416":0,"419":0,"420":0,"422":0,"423":0,"426":0,"429":0,"439":0,"440":0,"442":0,"443":0,"479":0,"525":0,"645":0,"646":0,"655":0,"658":0,"697":0,"699":0,"701":0,"713":0,"714":0,"716":0,"717":0,"719":0,"732":0,"733":0,"735":0,"736":0,"738":0,"750":0,"751":0,"762":0,"763":0,"767":0,"771":0,"781":0,"786":0,"788":0,"789":0,"790":0,"792":0,"793":0,"796":0,"799":0,"803":0,"804":0,"807":0,"808":0,"809":0,"811":0,"814":0,"817":0,"818":0,"821":0,"832":0,"835":0,"836":0,"837":0,"839":0,"840":0,"843":0,"844":0,"846":0,"847":0,"848":0,"850":0,"853":0,"856":0,"857":0,"859":0,"860":0,"863":0,"876":0,"891":0,"907":0,"923":0,"940":0,"952":0,"966":0,"980":0,"984":0,"994":0,"995":0,"996":0,"998":0,"1002":0,"1012":0,"1013":0,"1014":0,"1016":0,"1018":0,"1019":0,"1021":0,"1024":0,"1026":0,"1032":0,"1034":0,"1037":0,"1038":0,"1041":0};
_yuitest_coverage["/build/gallery-deferred/gallery-deferred.js"].functions = {"Deferred:40":0,"promise:59":0,"resolve:75":0,"reject:99":0,"(anonymous 3):143":0,"(anonymous 2):134":0,"wrap:133":0,"then:127":0,"getStatus:189":0,"getResult:200":0,"_notify:214":0,"]:238":0,"(anonymous 4):237":0,"Promise:235":0,"defer:297":0,"(anonymous 5):332":0,"oneDone:331":0,"(anonymous 6):345":0,"when:324":0,"NodeDeferred:385":0,"then:389":0,"(anonymous 8):422":0,"(anonymous 7):419":0,"]:409":0,"deferMethod:408":0,"(anonymous 9):442":0,"]:439":0,"importMethod:438":0,"Transaction:655":0,"_normalizeConfig:712":0,"_eventsToCallbacks:731":0,"addMethod:749":0,"(anonymous 10):762":0,"addMethods:761":0,"then:766":0,"success:787":0,"failure:798":0,"abort:807":0,"(anonymous 11):803":0,"_deferIO:780":0,"(anonymous 13):846":0,"(anonymous 12):843":0,"_deferGet:831":0,"get:875":0,"post:890":0,"put:906":0,"del:922":0,"postForm:939":0,"script:951":0,"js:965":0,"css:979":0,"(anonymous 14):994":0,"failFn:1020":0,"success:1025":0,"(anonymous 16):1018":0,"(anonymous 15):1012":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-deferred/gallery-deferred.js"].coveredLines = 188;
_yuitest_coverage["/build/gallery-deferred/gallery-deferred.js"].coveredFunctions = 57;
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 1);
YUI.add('gallery-deferred', function(Y) {

/**
Wraps the execution of synchronous or asynchronous operations, providing a
promise object that can be used to subscribe to the various ways the operation
may terminate.

When the operation completes successfully, call the Deferred's `resolve()`
method, passing any relevant response data for subscribers.  If the operation
encounters an error or is unsuccessful in some way, call `reject()`, again
passing any relevant data for subscribers.

The Deferred object should be shared only with the code resposible for
resolving or rejecting it. Public access for the Deferred is through its
_promise_, which is returned from the Deferred's `promise()` method. While both
Deferred and promise allow subscriptions to the Deferred's state changes, the
promise may be exposed to non-controlling code. It is the preferable interface
for adding subscriptions.

Subscribe to state changes in the Deferred with the promise's
`then(callback, errback)` method.  `then()` wraps the passed callbacks in a
new Deferred and returns the corresponding promise, allowing chaining of
asynchronous or synchronous operations. E.g.
`promise.then(someAsyncFunc).then(anotherAsyncFunc)`

@module deferred
@since 3.7.0
**/
_yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 29);
var slice   = [].slice,
    isArray = Y.Lang.isArray;
    
/**
Represents an operation that may be synchronous or asynchronous.  Provides a
standard API for subscribing to the moment that the operation completes either
successfully (`resolve()`) or unsuccessfully (`reject()`).

@class Deferred
@constructor
**/
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 40);
function Deferred() {
    _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "Deferred", 40);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 41);
this._subs = {
        resolve: [],
        reject : []
    };

    _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 46);
this._promise = new Y.Promise(this);

    _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 48);
this._status = 'in progress';

}

_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 52);
Y.mix(Deferred.prototype, {
    /**
    Returns the promise for this Deferred.

    @method promise
    @return {Promise}
    **/
    promise: function (obj) {
        _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "promise", 59);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 60);
return Y.Lang.isObject(obj) ? Y.mix(obj, this._promise, true) : this._promise;
    },

    /**
    Resolves the Deferred, signaling successful completion of the
    represented operation. All "resolve" subscriptions are executed with
    all arguments passed in. Future "resolve" subscriptions will be
    executed immediately with the same arguments. `reject()` and `notify()`
    are disabled.

    @method resolve
    @param {Any} arg* Any data to pass along to the "resolve" subscribers
    @return {Deferred} the instance
    @chainable
    **/
    resolve: function () {
        _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "resolve", 75);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 76);
this._result = slice.call(arguments);

        _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 78);
this._notify(this._subs.resolve, this.promise(), this._result);

        _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 80);
this._subs = { resolve: [] };

        _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 82);
this._status = 'resolved';

        _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 84);
return this;
    },

    /**
    Resolves the Deferred, signaling *un*successful completion of the
    represented operation. All "reject" subscriptions are executed with
    all arguments passed in. Future "reject" subscriptions will be
    executed immediately with the same arguments. `resolve()` and `notify()`
    are disabled.

    @method reject
    @param {Any} arg* Any data to pass along to the "reject" subscribers
    @return {Deferred} the instance
    @chainable
    **/
    reject: function () {
        _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "reject", 99);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 100);
this._result = slice.call(arguments);

        _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 102);
this._notify(this._subs.reject, this.promise(), this._result);

        _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 104);
this._subs = { reject: [] };

        _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 106);
this._status = 'rejected';

        _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 108);
return this;
    },

    /**
    Schedule execution of a callback to either or both of "resolve" and
    "reject" resolutions for the Deferred.  The callbacks
    are wrapped in a new Deferred and that Deferred's corresponding promise
    is returned.  This allows operation chaining ala
    `functionA().then(functionB).then(functionC)` where `functionA` returns
    a promise, and `functionB` and `functionC` _may_ return promises.

    @method then
    @param {Function} [callback] function to execute if the Deferred
                resolves successfully
    @param {Function} [errback] function to execute if the Deferred
                resolves unsuccessfully
    @return {Promise} The promise of a new Deferred wrapping the resolution
                of either "resolve" or "reject" callback
    **/
    then: function (callback, errback) {
        _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "then", 127);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 128);
var then    = new Y.Deferred(),
            promise = this.promise(),
            resolveSubs = this._subs.resolve || [],
            rejectSubs  = this._subs.reject  || [];

        _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 133);
function wrap(fn, method) {
            _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "wrap", 133);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 134);
return function () {
                _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "(anonymous 2)", 134);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 135);
var args = slice.call(arguments);

                // Wrapping all callbacks in setTimeout to guarantee
                // asynchronicity. Because setTimeout can cause unnecessary
                // delays that *can* become noticeable in some situations
                // (especially in Node.js), I'm using Y.soon if available.
                // As of today, Y.soon is only available in the gallery as
                // gallery-soon, but maybe it could get promoted to core?
                _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 143);
(Y.soon || setTimeout)(function () {
                    _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "(anonymous 3)", 143);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 144);
var result = fn.apply(promise, args),
                        resultPromise;

                    _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 147);
if (result && typeof result.promise === 'function') {
                        _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 148);
resultPromise = result.promise();

                        _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 150);
if (resultPromise.getStatus() !== 'in progress') {
                            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 151);
then[method].apply(then, resultPromise.getResult());
                        } else {
                            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 153);
result.promise().then(
                                Y.bind(then.resolve, then), // callback
                                Y.bind(then.reject, then)); // errback
                        }
                    } else {
                        _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 158);
then[method].apply(then,
                            (isArray(result) ? result : [result]));
                    }
                }, 0);
            };
        }

        _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 165);
resolveSubs.push((typeof callback === 'function') ?
            wrap(callback, 'resolve') : Y.bind('resolve', then));

        _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 168);
rejectSubs.push((typeof errback === 'function') ?
            wrap(errback, 'reject') : Y.bind('reject', then));

        _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 171);
if (this._status === 'resolved') {
            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 172);
this.resolve.apply(this, this._result);
        } else {_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 173);
if (this._status === 'rejected') {
            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 174);
this.reject.apply(this, this._result);
        }}

        _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 177);
resolveSubs = rejectSubs = null;

        _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 179);
return then.promise();
    },

    /**
    Returns the current status of the Deferred as a string "in progress",
    "resolved", or "rejected".

    @method getStatus
    @return {String}
    **/
    getStatus: function () {
        _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "getStatus", 189);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 190);
return this._status;
    },

    /**
    Returns the result of the Deferred.  Use `getStatus()` to test that the
    promise is resolved before calling this.

    @method getResult
    @return {Any[]} Array of values passed to `resolve()` or `reject()`
    **/
    getResult: function () {
        _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "getResult", 200);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 201);
return this._result;
    },

    /**
    Executes an array of callbacks from a specified context, passing a set of
    arguments.

    @method _notify
    @param {Function[]} subs The array of subscriber callbacks
    @param {Object} context The `this` object for the callbacks
    @param {Any[]} args Any arguments to pass the callbacks
    @protected
    **/
    _notify: function (subs, context, args) {
        _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "_notify", 214);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 215);
var i, len;

        _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 217);
if (subs) {
            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 218);
for (i = 0, len = subs.length; i < len; ++i) {
                _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 219);
subs[i].apply(context, args);
            }
        }
    }

}, true);

_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 226);
Y.Deferred = Deferred;
/**
The public API for a Deferred.  Used to subscribe to the notification events for
resolution or progress of the operation represented by the Deferred.

@class Promise
@constructor
@param {Deferred} deferred The Deferred object that the promise represents
**/
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 235);
function Promise(deferred) {
    _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "Promise", 235);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 236);
var self = this;
    _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 237);
Y.Array.each(['then', 'promise', 'getStatus', 'getResult'], function (method) {
        _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "(anonymous 4)", 237);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 238);
self[method] = function () {
            _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "]", 238);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 239);
return deferred[method].apply(deferred, arguments);
        };
    });
}
/**
Schedule execution of a callback to either or both of "resolve" and
"reject" resolutions for the associated Deferred.  The callbacks
are wrapped in a new Deferred and that Deferred's corresponding promise
is returned.  This allows operation chaining ala
`functionA().then(functionB).then(functionC)` where `functionA` returns
a promise, and `functionB` and `functionC` _may_ return promises.

@method then
@param {Function} [callback] function to execute if the Deferred
            resolves successfully
@param {Function} [errback] function to execute if the Deferred
            resolves unsuccessfully
@return {Promise} The promise of a new Deferred wrapping the resolution
            of either "resolve" or "reject" callback
**/

/**
Returns this promise.  Meta, or narcissistic?  Useful to test if an object
is a Deferred or Promise when the intention is to call its `then()`,
`getStatus()`, or `getResult()` method.

@method promise
@return {Promise} This.
**/

/**
Returns the current status of the Deferred. Possible results are
"in progress", "resolved", and "rejected".

@method getStatus
@return {String}
**/

/**
Returns the result of the Deferred.  Use `getStatus()` to test that the
promise is resolved before calling this.

@method getResult
@return {Any[]} Array of values passed to `resolve()` or `reject()`
**/

_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 285);
Y.Promise = Promise;

/**
 * Returns a promise for a (possibly) asynchronous call.
 * Calls a given function that receives the new promise as parameter and must call resolve()
 * or reject() at a certain point
 * @method defer
 * @param {Function} fn A function that encloses an async call.
 * @return {Promise} a promise
 * @static
 * @for YUI
 */
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 297);
Y.defer = function (fn, context) {
	_yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "defer", 297);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 298);
var deferred = new Y.Deferred();
	_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 299);
fn(deferred);
	_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 300);
return deferred.promise();
};

/**
Adds a `Y.when()` method to wrap any number of callbacks or promises in a
Y.Deferred, and return the associated promise that will resolve when all
callbacks and/or promises have completed.  Each callback is passed a Y.Deferred
that it must `resolve()` when it completes.

@module deferred
@submodule deferred-when
**/

/**
Wraps any number of callbacks in a Y.Deferred, and returns the associated
promise that will resolve when all callbacks have completed.  Each callback is
passed a Y.Deferred that it must `resolve()` when that callback completes.

@for YUI
@method when
@param {Function|Promise} operation* Any number of functions or Y.Promise
            objects
@return {Promise}
**/
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 324);
Y.when = function () {
    _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "when", 324);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 325);
var funcs     = slice.call(arguments),
        allDone   = new Y.Deferred(),
        failed    = Y.bind('reject', allDone),
        remaining = funcs.length,
        results   = [];

    _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 331);
function oneDone(i) {
        _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "oneDone", 331);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 332);
return function () {
            _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "(anonymous 5)", 332);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 333);
var args = slice.call(arguments);

            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 335);
results[i] = args.length > 1 ? args : args[0];

            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 337);
remaining--;

            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 339);
if (!remaining && allDone.getStatus() !== 'rejected') {
                _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 340);
allDone.resolve.apply(allDone, results);
            }
        };
    }

    _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 345);
Y.Array.each(funcs, function (fn, i) {
        _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "(anonymous 6)", 345);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 346);
var finished = oneDone(i),
            deferred;

        // accept promises as well as functions
        _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 350);
if (typeof fn === 'function') {
            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 351);
deferred = new Y.Deferred();
        
            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 353);
deferred.then(finished, failed);
            
            // It's up to each passed function to resolve/reject the deferred
            // that is assigned to it.
            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 357);
fn.call(Y, deferred);

        } else {_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 359);
if (fn && typeof fn.then === 'function') {
            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 360);
fn.then(finished, failed);
        } else {
            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 362);
remaining--;
            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 363);
results[i] = fn;
        }}
    });

    _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 367);
funcs = null;

    // For some crazy reason, only values, not functions or promises were passed
    // in, so we're done already.
    _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 371);
if (!remaining) {
        _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 372);
allDone.resolve.apply(allDone, results);
    }

    _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 375);
return allDone.promise();
};

/**
A deferred plugin for Node that has methods for dealing with asynchronous calls such as transition()
@class Plugin.NodeDeferred
@constructor
@extends Promise
@param {Object} config An object literal containing plugin configuration
*/
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 385);
function NodeDeferred(config) {
    _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "NodeDeferred", 385);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 386);
this.host = config.host;
    _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 387);
this._config = config;
}
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 389);
NodeDeferred.prototype.then = function (successFn) {
    _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "then", 389);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 390);
return new Y.Deferred().resolve().then(successFn).promise();
};

_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 393);
Y.mix(NodeDeferred, {
    /**
    Plugin namespace
    @property {String} NS
    @default 'deferred'
    @static
    */
    NS: 'deferred',
    
    /**
    Imports a method from Y.Node so that they return instances of this same plugin representing promises
    @method deferMethod
    @param {String} method Name of the method to import from Y.Node
    @static
    */
    deferMethod: function (method) {
        _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "deferMethod", 408);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 409);
NodeDeferred.prototype[method] = function () {
            _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "]", 409);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 410);
var host = this.host,
                args = slice.call(arguments),
                callback,
                next;

            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 415);
if (typeof args[args.length - 1] === 'function') {
                _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 416);
callback = args.pop();
            }

            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 419);
next = this.then(function () {
                _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "(anonymous 7)", 419);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 420);
var deferred = new Y.Deferred();

                _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 422);
host[method].apply(host, args.concat([function () {
                    _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "(anonymous 8)", 422);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 423);
deferred.resolve.apply(deferred, arguments);
                }]));

                _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 426);
return callback ? deferred.then(callback) : deferred.promise();
            });

            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 429);
return next.promise(new this.constructor(this._config));
        };
    },
    /**
    Imports a method from Y.Node making it chainable but not returning promises
    @method importMethod
    @param {String} method Name of the method to import from Y.Node
    @static
    */
    importMethod: function(method) {
        _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "importMethod", 438);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 439);
NodeDeferred.prototype[method] = function () {
            _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "]", 439);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 440);
var args = arguments,
                host = this.host;
            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 442);
return this.then(function () {
                _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "(anonymous 9)", 442);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 443);
host[method].apply(host, args);
            });
        };
    }
});

/**
Deferred version of the Node method
@method hide
@return {NodeDeferred}
*/
/**
Deferred version of the Node method
@method load
@return {NodeDeferred}
 */
/**
Deferred version of the Node method
@method show
@return {NodeDeferred}
 */
/**
Deferred version of the Node method
@method transition
@return {NodeDeferred}
 */
/**
Deferred version of the Node method
@method once
@return {NodeDeferred}
 */
/**
Deferred version of the Node method
@method onceAfter
@return {NodeDeferred}
 */
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 479);
Y.Array.each(['hide', 'load', 'show', 'transition', 'once', 'onceAfter'], NodeDeferred.deferMethod);
/**
Same as the Node method 
@method addClass
@chainable
 */
/**
Same as the Node method 
@method append
@chainable
 */
/**
Same as the Node method 
@method appendTo
@chainable
 */
/**
Same as the Node method 
@method blur
@chainable
 */
/**
Same as the Node method 
@method clearData
@chainable
 */
/**
Same as the Node method 
@method destroy
@chainable
 */
/**
Same as the Node method 
@method empty
@chainable
 */
/**
Same as the Node method 
@method focus
@chainable
 */
/**
Same as the Node method 
@method insert
@chainable
 */
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 525);
Y.Array.each(['addClass', 'append', 'appendTo', 'blur', 'clearData', 'destroy', 'empty', 'focus', 'insert',
/**
Same as the Node method 
@method insertBefore
@chainable
 */
/**
Same as the Node method 
@method prepend
@chainable
 */
/**
Same as the Node method 
@method remove
@chainable
 */
/**
Same as the Node method 
@method removeAttribute
@chainable
 */
/**
Same as the Node method 
@method removeChild
@chainable
 */
/**
Same as the Node method 
@method removeClass
@chainable
 */
/**
Same as the Node method 
@method replaceChild
@chainable
 */
    'insertBefore', 'prepend', 'remove', 'removeAttribute', 'removeChild', 'removeClass', 'replaceChild',
/**
Same as the Node method 
@method replaceClass
@chainable
 */
/**
Same as the Node method 
@method select
@chainable
 */
/**
Same as the Node method 
@method set
@chainable
 */
/**
Same as the Node method 
@method setAttrs
@chainable
 */
/**
Same as the Node method 
@method setContent
@chainable
 */
/**
Same as the Node method 
@method setData
@chainable
 */
/**
Same as the Node method 
@method setStyle
@chainable
 */
/**
Same as the Node method 
@method setStyles
@chainable
 */
    'replaceClass', 'select', 'set', 'setAttrs', 'setContent', 'setData', 'setStyle', 'setStyles', 
/**
Same as the Node method 
@method setX
@chainable
 */
/**
Same as the Node method 
@method setXY
@chainable
 */
/**
Same as the Node method 
@method setY
@chainable
 */
/**
Same as the Node method 
@method simulate
@chainable
 */
/**
Same as the Node method 
@method swapXY
@chainable
 */
/**
Same as the Node method 
@method toggleClass
@chainable
 */
/**
Same as the Node method 
@method wrap
@chainable
 */
/**
Same as the Node method 
@method unwrap
@chainable
 */
    'setX', 'setXY', 'setY', 'simulate', 'swapXY', 'toggleClass', 'wrap', 'unwrap'], NodeDeferred.importMethod);

_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 645);
if (Y.Node && Y.Plugin) {    
    _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 646);
Y.Plugin.NodeDeferred = NodeDeferred;
}

/**
Represents the promise of an IO transaction being completed
@class Transaction
@constructor
@extends Promise
*/
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 655);
function Transaction() {
}

_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 658);
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
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 697);
if (Y.io) {

    _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 699);
Y.Transaction = Transaction;

    _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 701);
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
            _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "_normalizeConfig", 712);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 713);
if (Y.Lang.isFunction(config)) {
                _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 714);
config = { on: { complete: config } };
            } else {
                _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 716);
config = config || {};
                _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 717);
config.on = config.on || {};
            }
            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 719);
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
            _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "_eventsToCallbacks", 731);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 732);
if (events.success || events.failure) {
                _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 733);
promise = promise.then(events.success, events.failure);
            }
            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 735);
if (events.complete) {
                _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 736);
promise = promise.then(events.complete, events.complete);
            }
            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 738);
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
            _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "addMethod", 749);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 750);
Y.io[name] = fn;
            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 751);
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
            _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "addMethods", 761);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 762);
Y.Object.each(methods, function (fn, name) {
                _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "(anonymous 10)", 762);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 763);
Y.io.addMethod(name, fn);
            });
        },
        then: function (fn) {
            _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "then", 766);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 767);
return new Y.Deferred().resolve().then(fn).promise(new Y.Transaction());
        }
    });

    _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 771);
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
            _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "_deferIO", 780);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 781);
var deferred = new Y.Deferred(),
                self = this,
                on = config.on,
                next;

            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 786);
config.on = {
                success: function (id, response) {
                    _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "success", 787);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 788);
if (config.parser) {
                        _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 789);
try {
                            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 790);
response.data = config.parser(response.responseText);
                        } catch (e) {
                            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 792);
deferred.reject.apply(deferred, arguments);
                            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 793);
return;
                        }
                    }
                    _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 796);
deferred.resolve.apply(deferred, arguments);
                },
                failure: function () {
                    _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "failure", 798);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 799);
deferred.reject.apply(deferred, arguments);
                }
            };

            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 803);
next = this.then(function () {
                _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "(anonymous 11)", 803);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 804);
var xhr = Y.io(uri, config),
                    promise = deferred.promise(new self.constructor());

                _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 807);
promise.abort = function () {
                    _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "abort", 807);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 808);
if (xhr) {
                        _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 809);
xhr.abort();
                    }
                    _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 811);
deferred.reject.apply(deferred, arguments);
                };

                _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 814);
return promise;
            });

            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 817);
if (on) {
                _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 818);
next = Y.io._eventsToCallbacks(next, on);
            }

            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 821);
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
            _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "_deferGet", 831);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 832);
var callback,
                next;

            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 835);
if (Y.Lang.isFunction(config)) {
                _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 836);
callback = config;
                _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 837);
config = {};
            }
            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 839);
if (!config) {
                _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 840);
config = {};
            }

            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 843);
next = this.then(function () {
                _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "(anonymous 12)", 843);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 844);
var deferred = new Y.Deferred();

                _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 846);
Y.Get[method](uri, config, function (err) {
                    _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "(anonymous 13)", 846);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 847);
if (err) {
                        _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 848);
deferred.reject(err);
                    } else {
                        _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 850);
deferred.resolve();
                    }
                });
                _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 853);
return deferred.promise();
            });

            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 856);
if (callback) {
                _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 857);
next = next.then(callback, callback);
            }
            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 859);
if (config.on) {
                _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 860);
next = Y.io._eventsToCallbacks(next, config.on);
            }

            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 863);
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
            _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "get", 875);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 876);
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
            _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "post", 890);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 891);
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
            _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "put", 906);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 907);
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
            _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "del", 922);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 923);
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
            _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "postForm", 939);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 940);
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
            _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "script", 951);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 952);
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
            _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "js", 965);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 966);
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
            _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "css", 979);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 980);
return this._deferGet('css', uri, config);
        }
    });
    
    _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 984);
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
        _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 994);
Y.io.addMethod('getJSON', function (uri, config) {
            _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "(anonymous 14)", 994);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 995);
config = Y.io._normalizeConfig(config);
            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 996);
config.parser = Y.JSON.parse;
            
            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 998);
return this._deferIO(uri, config);
        });
    }

    _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 1002);
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
        _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 1012);
Y.io.addMethod('jsonp', function (uri, config) {
            _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "(anonymous 15)", 1012);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 1013);
var on, next;
            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 1014);
config = Y.io._normalizeConfig(config);

            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 1016);
on = config.on;

            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 1018);
next = this.then(function () {
                _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "(anonymous 16)", 1018);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 1019);
var deferred = new Y.Deferred(),
                    failFn = function () {
                        _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "failFn", 1020);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 1021);
deferred.reject.apply(deferred, arguments);
                    };
                
                _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 1024);
config.on = {
                    success: function (id, response) {
                        _yuitest_coverfunc("/build/gallery-deferred/gallery-deferred.js", "success", 1025);
_yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 1026);
deferred.resolve.apply(deferred, arguments);
                    },
                    failure: failFn,
                    timeout: failFn
                };
                
                _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 1032);
Y.jsonp(uri, config);

                _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 1034);
return deferred.promise();
            });

            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 1037);
if (on) {
                _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 1038);
next = Y.io._eventsToCallbacks(next, on);
            }

            _yuitest_coverline("/build/gallery-deferred/gallery-deferred.js", 1041);
return next.promise(new Y.Transaction());
        });
    }
}


}, 'gallery-2012.10.17-20-00' ,{optional:['node','plugin','node-load','transition','io-base','json','jsonp']});
