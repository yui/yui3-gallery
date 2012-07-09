
/**
 * A deferred plugin for Node that has methods for dealing with asynchronous calls such as transition()
 * @class Plugin.NodeDeferred
 * @constructor
 * @extends Promise
 * @param {Object} config An object literal containing plugin configuration
 */
function NodeDeferred(config) {
	NodeDeferred.superclass.constructor.apply(this, arguments);
	this.host = config.host;
}

if (Y.Node && Y.Plugin) {
	
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
				var args,
					deferred,
					callback;
				// this.host[NS] === this means this is the first time the plugin is instanciated and plugged
				// in that case it should be resolved, because it doesn't represent any promises yet
				if (this.host.deferred === this) {
					this.resolve();
				}
				
				if (this.host[method]) {
					args = YArray(arguments);
					
					if (Lang.isFunction(args[args.length - 1])) {
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
					if (method == 'load' && Y.instanceOf(this.host, Y.NodeList)) {
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
				var args = arguments;
				return this.done(function () {
					this.host[method].apply(this.host, args);
				});
			};
		}
	});
	
	/**
	 * Deferred version of the Node method
	 * @method hide
	 * @return {NodeDeferred}
	 */
	/**
	 * Deferred version of the Node method
	 * @method load
	 * @return {NodeDeferred}
	 */
	/**
	 * Deferred version of the Node method
	 * @method show
	 * @return {NodeDeferred}
	 */
	/**
	 * Deferred version of the Node method
	 * @method transition
	 * @return {NodeDeferred}
	 */
	/**
	 * Deferred version of the Node method
	 * @method once
	 * @return {NodeDeferred}
	 */
	/**
	 * Deferred version of the Node method
	 * @method onceAfter
	 * @return {NodeDeferred}
	 */
	Y.each(['hide', 'load', 'show', 'transition', 'once', 'onceAfter'], NodeDeferred.deferMethod);
	/**
	 * Same as the Node method 
	 * @method addClass
	 * @chainable
	 */
	/**
	 * Same as the Node method 
	 * @method append
	 * @chainable
	 */
	/**
	 * Same as the Node method 
	 * @method appendTo
	 * @chainable
	 */
	/**
	 * Same as the Node method 
	 * @method blur
	 * @chainable
	 */
	/**
	 * Same as the Node method 
	 * @method clearData
	 * @chainable
	 */
	/**
	 * Same as the Node method 
	 * @method destroy
	 * @chainable
	 */
	/**
	 * Same as the Node method 
	 * @method empty
	 * @chainable
	 */
	/**
	 * Same as the Node method 
	 * @method focus
	 * @chainable
	 */
	/**
	 * Same as the Node method 
	 * @method insert
	 * @chainable
	 */
	Y.each(['addClass', 'append', 'appendTo', 'blur', 'clearData', 'destroy', 'empty', 'focus', 'insert',
	/**
	 * Same as the Node method 
	 * @method insertBefore
	 * @chainable
	 */
	/**
	 * Same as the Node method 
	 * @method prepend
	 * @chainable
	 */
	/**
	 * Same as the Node method 
	 * @method remove
	 * @chainable
	 */
	/**
	 * Same as the Node method 
	 * @method removeAttribute
	 * @chainable
	 */
	/**
	 * Same as the Node method 
	 * @method removeChild
	 * @chainable
	 */
	/**
	 * Same as the Node method 
	 * @method removeClass
	 * @chainable
	 */
	/**
	 * Same as the Node method 
	 * @method replaceChild
	 * @chainable
	 */
			'insertBefore', 'prepend', 'remove', 'removeAttribute', 'removeChild', 'removeClass', 'replaceChild',
	/**
	 * Same as the Node method 
	 * @method replaceClass
	 * @chainable
	 */
	/**
	 * Same as the Node method 
	 * @method select
	 * @chainable
	 */
	/**
	 * Same as the Node method 
	 * @method set
	 * @chainable
	 */
	/**
	 * Same as the Node method 
	 * @method setAttrs
	 * @chainable
	 */
	/**
	 * Same as the Node method 
	 * @method setContent
	 * @chainable
	 */
	/**
	 * Same as the Node method 
	 * @method setData
	 * @chainable
	 */
	/**
	 * Same as the Node method 
	 * @method setStyle
	 * @chainable
	 */
	/**
	 * Same as the Node method 
	 * @method setStyles
	 * @chainable
	 */
			'replaceClass', 'select', 'set', 'setAttrs', 'setContent', 'setData', 'setStyle', 'setStyles', 
	/**
	 * Same as the Node method 
	 * @method setX
	 * @chainable
	 */
	/**
	 * Same as the Node method 
	 * @method setXY
	 * @chainable
	 */
	/**
	 * Same as the Node method 
	 * @method setY
	 * @chainable
	 */
	/**
	 * Same as the Node method 
	 * @method simulate
	 * @chainable
	 */
	/**
	 * Same as the Node method 
	 * @method swapXY
	 * @chainable
	 */
	/**
	 * Same as the Node method 
	 * @method toggleClass
	 * @chainable
	 */
	/**
	 * Same as the Node method 
	 * @method wrap
	 * @chainable
	 */
	/**
	 * Same as the Node method 
	 * @method unwrap
	 * @chainable
	 */
			'setX', 'setXY', 'setY', 'simulate', 'swapXY', 'toggleClass', 'wrap', 'unwrap'], NodeDeferred.importMethod);
	
	Y.Plugin.NodeDeferred = NodeDeferred;
}
