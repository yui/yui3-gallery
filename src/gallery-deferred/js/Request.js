
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
		 * @for io
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
		/**
		 * Takes an object with "success" and "failure" properties, such as one
		 * from a IO configuration, and registers those callbacks as promise handlers
		 * @method _eventsToCallbacks
		 * @for io
		 * @private
		 * @static  
		 * @param {io.Request} request
		 * @param {Object} Object with "success" and/or "failure" properties
		 */
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
		 * Creates an IO promise instead of a plain promise like Y.defer
		 * @method defer
		 * @for io
		 * @static
		 * @param {Function} function to make into a deferred
		 * @return {io.Request} request
		 */
		defer: function (fn) {
			var request = new Y.io.Request();
			fn.call(this, request);
			return request;
		},
		
        /**
         * Add a deferred function to Y.io and add it as a method of Y.Request
         * @method addMethod
         * @for io
         * @static
         * @param {String} name Name of the method
         * @param {Function} fn Method
         */
		addMethod: function (name, fn) {
			Y.io[name] = fn;
			Request.prototype[name] = fn;
		},
		
		/**
		 * Adds multiple methods to Y.io and Y.Request from an object
		 * @method addMethods
		 * @for io
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
		 * Makes an IO request and returns a new io.Request object for it.
		 * It also normalizes callbacks as event handlers with an EventFacade
		 * @method _deferIO
		 * @for io
		 * @private
		 * @static
		 */
		_deferIO: function (uri, config) {
			config = Y.io._normalizeConfig(config);
			
			return this.defer(function (request) {
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
				
				Y.mix(request, Y.io(uri, config));
			});
		},
		/**
		 * Normalizes the Y.Get API so that it looks the same to the Y.io methods
		 * @method _deferGet
		 * @param {String} 
		 * @for io
		 * @private
		 * @static
		 */
		_deferGet: function (method, uri, config) {
			var callback;
			if (Y.Lang.isFunction(config)) {
				callback = config;
				config = {};
			}
			if (!config) {
				config = {};
			}
			return this.defer(function (request) {
				if (callback) {
					request.then(callback);
				}
				if (config.on) {
					Y.io._eventsToCallbacks(request, config.on);
					config.on = null;
				}
				Y.Get[method](uri, config, function (err) {
					if (err) {
						request.reject(err);
					} else {
						request.resolve();
					}
				});
			});
		},
		
		/**
		 * Makes a new GET HTTP request
		 * @method get
		 * @param {String} uri Path to the request resource
		 * @param {Function|Object} config Either a callback for the complete event or a full configuration option
		 * @return {io.Request}
		 * @for io
		 * @static
		 */
		get: function (uri, config) {
			return this._deferIO(uri, Y.io._normalizeConfig(config, {
				method: 'GET'
			}));
		},
		
		/**
		 * Makes a new POST HTTP request
		 * @method post
		 * @param {String} uri Path to the request resource
		 * @param {Function|Object} config Either a callback for the complete event or a full configuration option
		 * @return {io.Request}
		 * @for io
		 * @static
		 */
		post: function (uri, data, config) {
			return this._deferIO(uri, Y.io._normalizeConfig(config, {
				method: 'POST',
				data: data
			}));
		},
		
		/**
		 * Makes a new POST HTTP request sending the content of a form
		 * @method postForm
		 * @for io
		 * @static
		 * @param {String} uri Path to the request resource
		 * @param {String} id The id of the form to serialize and send in the request
		 * @param {Function|Object} config Either a callback for the complete event or a full configuration option
		 * @return {io.Request}
		 */
		postForm: function (uri, id, config) {
			return this._deferIO(uri, Y.io._normalizeConfig(config, {
				method: 'POST',
				form: { id: id }
			}));
		},
		/**
		 * Alias for Y.io.js
		 * @method script
		 * @for io
		 * @static
		 */
		script: function () {
			return this.js.apply(this, arguments);
		},
		/**
		 * Loads a script through Y.Get.script
		 * All its options persist, but it also accepts an "on" object
		 * with "success" and "failure" properties like the rest of the Y.io methods
		 * @method js
		 * @for io
		 * @static
		 * @param {String} uri Path to the request resource
		 * @param {Function|Object} config Either a callback for the complete event or a full configuration option
		 * @return {io.Request}
		 */
		js: function (uri, config) {
			return this._deferGet('js', uri, config);
		},
		/**
		 * Loads a stylesheet through Y.Get.css
		 * All its options persist, but it also accepts an "on" object
		 * with "success" and "failure" properties like the rest of the Y.io methods
		 * @method css
		 * @for io
		 * @static
		 * @param {String} uri Path to the request resource
		 * @param {Function|Object} config Either a callback for the complete event or a full configuration option
		 * @return {io.Request}
		 */
		css: function (uri, config) {
			return this._deferGet('css', uri, config);
		}
	});
	
	if (Y.JSON) {
		/**
		 * Makes a new GET HTTP request and parses the result as JSON data
		 * @method getJSON
		 * @for io
		 * @static
		 * @param {String} uri Path to the request resource
		 * @param {Function|Object} config Either a callback for the complete event or a full configuration option
		 * @return {io.Request}
		 */
		Y.io.addMethod('getJSON', function (uri, config) {
			config = Y.io._normalizeConfig(config);
			config.parser = Y.JSON.parse;
			
			return this._deferIO(uri, config);
		});
	}

	if (Y.jsonp) {
		/**
		 * Makes a new JSONP request
		 * @method jsonp
		 * @for io
		 * @static
		 * @param {String} uri Path to the jsonp service
		 * @param {Function|Object} config Either a callback for the complete event or a full configuration option
		 * @return {io.Request}
		 */
		Y.io.addMethod('jsonp', function (uri, config) {
			config = Y.io._normalizeConfig(config);
			
			return this.defer(function (request) {
				if (config.on) {
					Y.io._eventsToCallbacks(request, config.on);
				}
				
				config.on = {
					success: Y.bind(request.resolve, request),
					failure: Y.bind(request.reject, request)
				};
				
				Y.jsonp(uri, config);
			});
		});
	}
}
