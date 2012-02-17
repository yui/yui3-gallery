
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
