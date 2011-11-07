YUI.add('gallery-deferred', function(Y) {

/*
 * Copyright (c) 2011, Juan Ignacio Dopazo. All rights reserved.
 * Code licensed under the BSD License
 * http://yuilibrary.com/gallery/show/deferred
 */
/**
 * @module gallery-deferred
 * @requires event-custom
 */
var Lang = Y.Lang,
	YArray = Y.Array,
	AP = Array.prototype,
	PUSH = AP.push,
	
	RESOLVED = 1,
	REJECTED = 2;
	
/**
 * A deferred keeps two lists of callbacks, one for the success scenario and another for the failure case.
 * It runs these callbacks once a call to resolve() or reject() is made.
 * 
 * This class is designed to augment others
 * @class Promise
 * @constructor
 */
function Promise(config) {
	this._config = config || {};
	this._done = [];
	this._fail = [];
	this._args = [];
	this.status = 0;
}
Y.mix(Promise.prototype, {
	/**
	 * @method then
	 * @description Adds callbacks to the list of callbacks tracked by the promise
	 * @param {Function|Array} doneCallbacks A function or array of functions to run when the promise is resolved
	 * @param {Function|Array} failCallbacks A function or array of functions to run when the promise is rejected
	 * @chainable
	 */
	then: function (doneCallbacks, failCallbacks) {
		if (doneCallbacks) {
			doneCallbacks = Promise._flatten(doneCallbacks)
			if (this.status === RESOLVED) {
				YArray.each(doneCallbacks, function (callback) {
					callback.apply(this, this._args);
				}, this);
			} else {
				PUSH.apply(this._done, doneCallbacks);
			}
		}
		if (failCallbacks) {
			failCallbacks = Promise._flatten(failCallbacks)
			if (this.status === REJECTED) {
				YArray.each(failCallbacks, function (callback) {
					callback.apply(this, this._args);
				}, this);
			} else {
				PUSH.apply(this._fail, failCallbacks);
			}
		}
		return this;
	},
	
	/**
	 * @method done
	 * @description Listens to the 'success' event
	 * @param {Function|Array} doneCallbacks Takes any number of functions or arrays of functions to run when the promise is resolved
	 * @chainable 
	 */
	done: function () {
		return this.then(YArray(arguments));
	},
	
	/**
	 * @method fail
	 * @description Listens to the 'failure' event
	 * @param {Function|Array} failCallbacks Takes any number of functions or arrays of functions to run when the promise is rejected
	 * @chainable 
	 */
	fail: function () {
		return this.then(null, YArray(arguments));
	},
	
	/**
	 * @method always
	 * @description Listens to the 'complete' event
	 * @param {Function|Array} callbacks Takes any number of functions or arrays of functions to run when the promise is rejected or resolved
	 * @chainable 
	 */
	always: function () {
		var args = YArray(arguments);
		return this.then(args, args);
	},
	
	/**
	 * @method resolve
	 * @description Resolves the promise and notifies all callbacks
	 * @param {Object} o Any number of arguments that will be passed to the success callbacks
	 * @chainable
	 */
	resolve: function () {
		this.status = RESOLVED;
		return this._notify(YArray(arguments));
	},
	
	/**
	 * @method reject
	 * @description Rejects the promise and notifies all callbacks
	 * @param {Object} o Any number of arguments that will be passed to the failure callbacks
	 * @chainable
	 */
	reject: function () {
		this.status = REJECTED;
		return this._notify(YArray(arguments));
	},
	
	_notify: function (args) {
		var callbacks = [],
			self = this;
		if (this.status === RESOLVED) {
			callbacks = this._done;
			this._done = [];
		} else if (this.status === REJECTED){
			callbacks = this._fail;
			this._fail = [];
		}
		YArray.each(callbacks, function (callback) {
			callback.apply(self, args);
		});
		return this;
	},
	
	/**
	 * @method defer
	 * @description Returns a new promise. This method will be mostly used by implementors that extend this class to create
	 * additional asynchronous functionalityu. For example:
	 * <pre><code>
	 * wait: function (delay) {
	 *		return this.defer(function (promise) {
	 *		Y.later(delay || 0, promise, promise.resolve);
	 * });
	 * }</code></pre>
	 * @return {Promise}
	 */
	defer: function (callback, context) {
		var promise = new this.constructor(this._config);
		this.then(Y.bind(callback, context || this, promise));
		return promise;
	}
	
});

/*
 * Turns a value into an array with the value as its first element, or takes an array and spreads
 * each array element into elements of the parent array
 * @method _flatten
 * @param {Object|Array} args The value or array to spread
 * @return Array
 * @private
 * @static
 */
Promise._flatten = function (arr) {
	var i = 0;
	arr = Lang.isArray(arr) ? arr.concat() : [arr];
	while (i < arr.length) {
		if (Lang.isArray(arr[i])) {
			AP.splice.apply(arr, [i, 1].concat(arr[i]));
		} else {
			i++;
		}
	}
	return arr;
};

Y.Promise = Promise;

/**
 * Methods for working with asynchronous calls
 * @class YUI~deferred
 * @static
 */

/**
 * Returns a promise for a (possibly) asynchronous call.
 * Calls a given function that receives the new promise as parameter and must call resolve()
 * or reject() at a certain point
 * @method Y.defer
 * @param {Function} fn A function that encloses an async call.
 * @return {Promise} a promise
 */
Y.defer = function (fn, context) {
	var promise = new Y.Promise();
	fn(promise);
	return promise;
};

/**
 * @method Y.when
 * @description Waits for a series of asynchronous calls to be completed
 * @param {Promise|Array|Function} deferred Any number of Promise instances or arrays of instances. If a function is provided, it is executed at once
 * @return {Promise} a promise
 */
Y.when = function () {
	var deferreds = Y.Promise._flatten(YArray(arguments)),
		args = [],
		resolved = 0,
		rejected = 0;
			
	return Y.defer(function (promise) {
		function notify(_args) {
			args.push(YArray(_args));
			if (resolved + rejected === deferreds.length) {
				if (rejected > 0) {
					promise.reject.apply(promise, args);
				} else {
					promise.resolve.apply(promise, args);
				}
			}
		}
			
		function done() {
			resolved++;
			notify(arguments);
		}
		
		function fail() {
			rejected++;
			notify(arguments);
		}

		YArray.each(deferreds, function (deferred) {
			if (Y.Lang.isFunction(deferred)) {
				done(deferred());
			} else {
				deferred.then(done, fail);
			}
		});
	});
};

	/**
	 * Represents the promise of an IO request being completed
	 * @class io.Request
	 * @constructor
	 * @extends Promise
	 */
	function Request() {
		Request.superclass.constructor.apply(this, arguments);
	}
	Y.extend(Request, Y.Promise, null, {
		NAME: 'io-request'
	});
	/**
	 * Makes a new GET HTTP request
	 * @method get
	 * @param {String} uri Path to the request resource
	 * @param {Function|Object} config Either a callback for the complete event or a full configuration option
	 * @chainable
	 */
	/**
	 * Makes a new POST HTTP request
	 * @method post
	 * @param {String} uri Path to the request resource
	 * @param {Function|Object} config Either a callback for the complete event or a full configuration option
	 * @chainable
	 */
	/**
	 * Makes a new POST HTTP request sending the content of a form
	 * @method postForm
	 * @param {String} uri Path to the request resource
	 * @param {String} id The id of the form to serialize and send in the request
	 * @param {Function|Object} config Either a callback for the complete event or a full configuration option
	 * @chainable
	 */
	/**
	 * Makes a new GET HTTP request and parses the result as JSON data
	 * @method getJSON
	 * @param {String} uri Path to the request resource
	 * @param {Function|Object} config Either a callback for the complete event or a full configuration option
	 * @chainable
	 */
	/**
	 * Makes a new JSONP request
	 * @method jsonp
	 * @param {String} uri Path to the jsonp service
	 * @param {Function|Object} config Either a callback for the complete event or a full configuration option
	 * @chainable
	 */
	if (Y.io) {
		Y.mix(Y.io, {
			
			Request: Request,
			
			/**
			 * Utility function for normalizing an IO configuration object.
			 * If a function is providad instead of a configuration object, the function is used
			 * as a 'complete' event handler.
			 * @method _normalizeConfig
			 * @for Y.io
			 * @private
			 * @static
			 */
			_normalizeConfig: function (config, args) {
				if (Y.Lang.isFunction(config)) {
					config = { on: { complete: config } };
				} else {
					config = config || {};
					config.on = config.on || {};
				}
				return Y.mix(config, args, true);
			},
			
			_eventsToCallbacks: function (request, events) {
				Y.each(events, function (callback, eventName) {
					if (eventName === 'success') {
						request.done(callback);
					} else if (eventName === 'failure') {
						request.fail(callback);
					} else {
						request.always(callback);
					}
				});
			},
			
			/**
			 * Makes an IO request and returns a new io.Request object for it.
			 * It also normalizes callbacks as event handlers with an EventFacade
			 * @method _defer
			 * @for Y.io
			 * @private
			 * @static
			 */
			_defer: function (uri, config) {
				config = Y.io._normalizeConfig(config);
				var request = new Y.io.Request();
				
				if (config.on) {
					Y.io._eventsToCallbacks(request, config.on);
				}
				
				config.on = {
					success: function (id, response) {
						if (config.parser) {
							try {
								args.data = config.parser(response.responseText);
							} catch (e) {
								request.reject.apply(request, arguments);
								return;
							}
						}
						request.resolve.apply(request, arguments);
					},
					failure: Y.bind(request.reject, request)
				};
				
				return Y.mix(request, Y.io(uri, config));
			},
			
	        /**
	         * Add a deferred function to Y.io and add it as a method of Y.Request
	         * @method addMethod
	         * @for Y.io
	         * @static
	         * @param {String} name Name of the method
	         * @param {Function} fn Method
	         */
			addMethod: function (name, fn) {
				Y.io[name] = fn;
				Request.prototype[name] = function () {
					return Y.io[name].apply(Y.io, arguments);
				};
			},
			
			/**
			 * Adds multiple methods to Y.io and Y.Request from an object
			 * @method addMethods
			 * @for Y.io
			 * @static
			 * @param {Obejct} methods Key/value pairs of names and functions
			 */
			addMethods: function (methods) {
				Y.each(methods, function (fn, name) {
					Y.io.addMethod(name, fn);
				});
			}
		});
	
		Y.io.addMethods({
			/**
			 * Makes a new GET HTTP request
			 * @method get
			 * @param {String} uri Path to the request resource
			 * @param {Function|Object} config Either a callback for the complete event or a full configuration option
			 * @return io.Request
			 * @for Y.io
			 * @static
			 */
			get: function (uri, config) {
				return Y.io._defer(uri, Y.io._normalizeConfig(config, {
					method: 'GET'
				}));
			},
			
			/**
			 * Makes a new POST HTTP request
			 * @method post
			 * @param {String} uri Path to the request resource
			 * @param {Function|Object} config Either a callback for the complete event or a full configuration option
			 * @return io.Request
			 * @for Y.io
			 * @static
			 */
			post: function (uri, data, config) {
				return Y.io._defer(uri, Y.io._normalizeConfig(config, {
					method: 'POST',
					data: data
				}));
			},
			
			/**
			 * Makes a new POST HTTP request sending the content of a form
			 * @method postForm
			 * @param {String} uri Path to the request resource
			 * @param {String} id The id of the form to serialize and send in the request
			 * @param {Function|Object} config Either a callback for the complete event or a full configuration option
			 * @return io.Request
			 * @for Y.io
			 * @static
			 */
			postForm: function (uri, id, config) {
				return Y.io._defer(uri, Y.io._normalizeConfig(config, {
					method: 'POST',
					form: { id: id }
				}));
			}
		});
		
		if (Y.JSON) {
			/**
			 * Makes a new GET HTTP request and parses the result as JSON data
			 * @method getJSON
			 * @param {String} uri Path to the request resource
			 * @param {Function|Object} config Either a callback for the complete event or a full configuration option
			 * @return io.Request
			 * @for Y.io
			 * @static
			 */
			Y.io.addMethod('getJSON', function (uri, config) {
				config = Y.io._normalizeConfig(config);
				config.parser = Y.JSON.parse;
				
				return Y.io._defer(uri, config);
			});
		}

		if (Y.jsonp) {
			/**
			 * Makes a new JSONP request
			 * @method jsonp
			 * @param {String} uri Path to the jsonp service
			 * @param {Function|Object} config Either a callback for the complete event or a full configuration option
			 * @return io.Request
			 * @for Y.io
			 * @static
			 */
			Y.io.addMethod('jsonp', function (uri, config) {
				config = Y.io._normalizeConfig(config);
				var request = new Y.io.Request();
				
				if (config.on) {
					Y.io._eventsToCallbacks(request, config.on);
				}
				
				config.on = {
					success: Y.bind(request.resolve, request),
					failure: Y.bind(request.reject, request)
				};
				
				Y.jsonp(uri, config);
				
				return request;
			});
		}
	}

	if (Y.Node && Y.Plugin) {
		/**
		 * A deferred plugin for Node that has methods for dealing with asynchronous calls such as transition()
		 * @class Node.Promise
		 * @constructor
		 * @extends Promise
		 * @param {Object} config An object literal containing plugin configuration
		 */
		function NodeDeferred(config) {
			NodeDeferred.superclass.constructor.apply(this, arguments);
			this.host = config.host;
		}

		Y.extend(NodeDeferred, Y.Promise, null, {
			/**
			 * Plugin namespace
			 * @property {String} NS
			 * @default 'deferred'
			 * @static
			 */
			NS: 'deferred',
			
			/**
			 * Imports a method from Y.Node so that they return instances of this same plugin representing promises
			 * @method deferMethod
			 * @param {String} method Name of the method to import from Y.Node
			 * @static
			 */
			deferMethod: function (method) {
				NodeDeferred.prototype[method] = function () {
					// this.host[NS] === this means this is the first time the plugin is instanciated and plugged
					// in that case it should be resolved, because it doesn't represent any promises yet
					if (this.host.deferred === this) {
						this.resolve();
					}
					
					if (this.host[method]) {
						var args = Y.Array(arguments),
							deferred,
							callback;
							
						if (Y.Lang.isFunction(args[args.length - 1])) {
							callback = args.pop();
						}
						
						deferred = this.defer(function (promise) {
							this.host[method].apply(this.host, args.concat([Y.bind(promise.resolve, promise)]));
						});
						if (callback) {
							deferred.done(callback);
						}
						return deferred;
						
					} else {
						if (Y.instanceOf(this.host, Y.NodeList) && method == 'load') {
							Y.error('NodeList doesn\'t have a ' + method + '() method');
						} else {
							Y.error('Missing required module for ' + method);
						}
					}
					return this;
				};
			},
			/**
			 * Imports a method from Y.Node making it chainable but not returning promises
			 * @method importMethod
			 * @param {String} method Name of the method to import from Y.Node
			 * @static
			 */
			importMethod: function(method) {
				NodeDeferred.prototype[method] = function () {
					this.host[method].apply(this.host, arguments);
					return this;
				};
			}
		});
		
		Y.each(['hide', 'load', 'show', 'transition', 'once', 'onceAfter'], NodeDeferred.deferMethod);
		Y.each(['addClass', 'append', 'appendTo', 'blur', 'clearData', 'destroy', 'empty', 'focus', 'insert',
				'insertBefore', 'plug', 'prepend', 'remove', 'removeAttribute', 'removeChild', 'removeClass', 'replaceChild',
				'replaceClass', 'select', 'set', 'setAttrs', 'setContent', 'setData', 'setStyle', 'setStyles', 
				'setX', 'setXY', 'setY', 'simulate', 'swapXY', 'toggleClass', 'unplug', 'wrap', 'unwrap'], NodeDeferred.importMethod);
		
		Y.Plugin.NodeDeferred = NodeDeferred;
	}


}, 'gallery-2011.10.06-19-55' ,{optional:['node','plugin','node-load','transition','io-base','json','jsonp'], requires:['event-custom']});
