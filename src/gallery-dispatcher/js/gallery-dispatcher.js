/**
* <p>The Dispatcher satisfies a very common need of developers using the 
* YUI library: dynamic execution of HTML Fragments or remote content. Typical strategies to 
* fulfill this need, like executing the innerHTML property or referencing remote 
* scripts, are unreliable due to browser incompatibilities. The Dispatcher normalize 
* this behavior across all a-grade browsers.
* 
* <p>To use the Dispatcher Module, simply create a new object based on Y.Dispatcher
* and pass a reference to a node that should be handled.</p>
* 
* <p>
* <code>
* &#60;script type="text/javascript"&#62; <br>
* <br>
*		//	Call the "use" method, passing in "gallery-dispatcher".	 This will <br>
*		//	load the script for the Dispatcher Module and all of <br>
*		//	the required dependencies. <br>
* <br>
*		YUI().use("gallery-dispatcher", function(Y) { <br>
* <br>
*			(new Y.Dispatcher ({<br>
*				node: '#demoajax',<br>
*				content: 'Please wait... (Injecting fragment.html)'<br>
*			})).set('uri', 'fragment.html');<br>
* <br>
* <br>		
*	&#60;/script&#62; <br>
* </code>
* </p>
*
* <p>The Dispatcher has several configuration properties that can be 
* set via an object literal that is passed as a first argument during the
* initialization, or using "set" method.
* </p>
*
* @module gallery-dispatcher
*/

//	Util shortcuts
var getClassName = Y.ClassNameManager.getClassName,

//	Frequently used strings
DISPATCHER = "dispatcher",
SC = "script",
DISPATCHER_FETCH = 'fetch',
DISPATCHER_PURGE = 'purge',
DISPATCHER_BEFOREEXECUTE = 'beforeExecute',
DISPATCHER_LOAD = 'load',
DISPATCHER_READY = 'ready',

//	Attribute keys
ATTR_URI = 'uri',
ATTR_CONTENT = 'content',
ATTR_AUTOPURGE = 'autopurge',
ATTR_LOADING = 'loading',
ATTR_NODE = 'node',

//	CSS class names
CLASS_DISPATCHER_LOADING = getClassName(DISPATCHER, 'loading'),

// shorthands
L = Y.Lang,
isBoolean = L.isBoolean,
isString = L.isString,

/**
	* The Dispatcher class represents an object that can manage Node Elements to
	* inject HTML content as the content of the Node..
	* @namespace Y
	* @class Dispatcher
	*/
Dispatcher = function() {
	Dispatcher.superclass.constructor.apply(this, arguments);
};

//	Utility functions
function _parseContent(content) {
	var fragment = Y.Node.create('<div></div>'),
	o = {};

	fragment.setContent(content);

	o.js = fragment.all(SC).each(function(n) {
		n.get('parentNode').removeChild(n);
	});
	o.content = fragment.get('innerHTML');
	return o;
}

// Dispatcher definition
Y.mix(Dispatcher, {

	EVENT_PREFIX: DISPATCHER,
	/**
	 * Static property used to define the default attribute configuration of
	 * the component.
	 *
	 * @property Y.Dispatcher.ATTRS
	 * @Type Object
	 * @static
	 */
	ATTRS: {

		/**
		* YUI Node Object that represent a dynamic area in the page.  
		* @attribute node
		* @default null
		* @type object
		*/
		node: {
			value: null,
			setter: function(n) {
				// stopping the current process if needed to define a new node
				this.stop();
				return Y.one(n);
			}
		},

		/**
		* If dispatcher should purge the DOM elements before replacing the content
		* @attribute autopurge
		* @default true
		* @type boolean
		*/
		autopurge: {
			value: true,
			validator: isBoolean
		},
		/**
		* URL that should be injected within the host
		* @attribute uri
		* @default null
		* @type string
		*/
		uri: {
			value: null,
			validator: function(v) {
				return (v && isString(v) && (v !== ''));
			}
		},
		/**
		* default content for the dynamic area
		* @attribute content
		* @default empty
		* @type string
		*/
		content: {
			value: '',
			validator: isString
		},
		/**
		* Boolean indicating that a process is undergoing.
		* 
		* @attribute loading
		* @default false
		* @readonly
		* @type {boolean}
		*/
		loading: {
			value: false,
			validator: isBoolean,
			readOnly: true,
			setter: function(v) {
				Y.log('setting status to ' + v, 'info', DISPATCHER);
				if (v) {
					this.fire(DISPATCHER_FETCH);
					this.get(ATTR_NODE).addClass(CLASS_DISPATCHER_LOADING);
				} else {
					this.fire(DISPATCHER_LOAD);
					this.get(ATTR_NODE).removeClass(CLASS_DISPATCHER_LOADING);
				}
				return v;
			}
		}
	}
});

Y.extend(Dispatcher, Y.Base, {

	//	Protected properties
	_queue: null,
	_io: null,

	//	Public methods
	initializer: function(config) {
		config = config || {};
		Y.log('Initializer', 'info', DISPATCHER);
		this._queue = new Y.AsyncQueue();

		this._initEvents();

		this.after(ATTR_CONTENT + "Change",
			function(e) {
				this._dispatch(e.newVal);
			},
			this);

		this.after(ATTR_URI + "Change",
			function(e) {
				this._fetch(e.newVal);
			},
			this);

		// making the trick for content and uri in case the user want to set up thru config
		if (config[ATTR_CONTENT]) {
			this._dispatch(this.get(ATTR_CONTENT));
		}
		if (config[ATTR_URI]) {
			this._fetch(this.get(ATTR_URI));
		}

	},

	destructor: function() {
		this.stop();
		this._queue = null;
		this._io = null;
	},
	/**
	 * @method stop
	 * @description Cancel the current loading and execution process immediately
	 * @public
	 * @return	{object} reference for chaining
	 */
	stop: function() {
		this._queue.stop();
		if (this._io) {
			this._io.abort();
		}
		return this;
	},
	/**
	 * Publishes Dispatcher's events
	 *
	 * @method _initEvents
	 * @protected
	 */
	_initEvents: function() {

		/**
		 * Signals when dispatcher starts loading a new remote content (Y.io->start).
		 *
		 * @event fetch
		 * @param event {Event.Facade} An Event Facade object
		 */
		this.publish(DISPATCHER_FETCH);

		/**
		 * Signals the moment when a node become ready, right after the 
		 * html injecting and the execution of the scripts.
		 *
		 * @event ready
		 * @param event {Event.Facade} An Event Facade object
		 */
		this.publish(DISPATCHER_READY);

		/**
		 * Signals the old content has been clean up (Purge), and it's 
		 * ready to get the new content.
		 *
		 * @event purge
		 * @param event {Event.Facade} An Event Facade object
		 */
		this.publish(DISPATCHER_PURGE);

		/**
		 * Signals rigth after injecting the new content but before executing the script tags.
		 *
		 * @event beforeExecute
		 * @param event {Event.Facade} An Event Facade object
		 */
		this.publish(DISPATCHER_BEFOREEXECUTE);

		/**
		 * Signals when the remote content gets ready to be injected in the page (Y.io->success)
		 *
		 * @event load
		 * @param event {Event.Facade} An Event Facade object
		 */
		this.publish(DISPATCHER_LOAD);

	},
	/**
	 * @method _dispatch
	 * @description Dispatch a content into the code, parsing out the scripts, 
	 * injecting the code into the DOM, then executing the scripts.
	 * @protected
	 * @param {string} content html content that should be injected in the page
	 * @return null
	 */
	_dispatch: function(content) {
		var that = this,
		o = _parseContent(content),
		q = this._queue,
		n = this.get(ATTR_NODE);

		// stopping any previous process, just in case...
		this.stop();

		if (!n) {
			Y.log('Dispatcher requires a NODE to dispatch the content', 'error', DISPATCHER);
			return;
		}

		Y.log('dispatching a new content', 'info', DISPATCHER);

		// autopurging children collection
		if (this.get(ATTR_AUTOPURGE)) {
			q.add({
				fn: function() {
					Y.log('purging children collection', 'info', DISPATCHER);
					n.get('children').each(function(c) {
						c.purge(true);
					});
					that.fire(DISPATCHER_PURGE, n);
				}
			});
		}
		// injecting new content
		q.add({
			fn: function() {
				Y.log('setting new content: ' + o.content, 'info', DISPATCHER);
				n.setContent(o.content);
				that.fire(DISPATCHER_BEFOREEXECUTE, n);
			}
		});
		// executing JS blocks before the injection
		o.js.each(function(jsNode) {
			if (jsNode && jsNode.get('src')) {
				q.add({
					fn: function() {
						Y.log('external script tag: ' + jsNode.get('src'), 'info', DISPATCHER);
						//q.next();
						Y.Get.script(jsNode.get('src'), {
							onFailure: function(o) {
								Y.log('external script tag fail to load: ' + jsNode.get('src'), 'error', DISPATCHER);
							},
							onEnd: function(o) {
								o.purge();
								//removes the script node immediately after executing it
								q.run();
							}
						});
					},
					autoContinue: false
				});
			} else {
				q.add({
					fn: function() {
						// inject js;
						Y.log('inline script tag: ' + jsNode.get('innerHTML'), 'info', DISPATCHER);
						var d = jsNode.get('ownerDocument'),
						h = d.one('head') || d.get('documentElement'),
						newScript = Y.Node.create('<' + SC + '></' + SC + '>');
						h.replaceChild(jsNode, h.appendChild(newScript));
						if (jsNode._node.text) {
							newScript._node.text = jsNode._node.text;
						}
						jsNode.remove();
						//removes the script node immediately after executing it
					}
				});
			}
		});
		q.add({
			fn: function() {
				that.fire(DISPATCHER_READY);
			}
		});
		// executing the queue
		this._queue.run();
	},
	/**
	* @description Fetching a remote file using Y.io. The response will be dispatched thru _dispatch method...
	* @method _fetch
	* @protected
	* @param {string} uri uri that should be loaded using Y.io
	* @param {object} cfg configuration object that will be used as base configuration for Y.io 
	* (http://developer.yahoo.com/yui/3/io/#configuration)
	* @return object  Reference to the connection handler
	*/
	_fetch: function(uri, cfg) {

		// stopping any previous process, just in case...
		this.stop();

		if (!uri) {
			return false;
		}

		Y.log('dispatching a new url ' + uri, 'info', DISPATCHER);

		cfg = cfg || {
			method: 'GET'
		};
		cfg.on = {
			start: function() {
				this._set(ATTR_LOADING, true);
				Y.log('Start Loading', 'info', DISPATCHER);
			},
			success: function(tid, o) {
				Y.log('Success: ' + o.responseText, 'info', DISPATCHER);
				this.set(ATTR_CONTENT, o.responseText);
			},
			failure: function(tid, o) {
				Y.log('Failure: ' + uri, 'warn', DISPATCHER);
			},
			end: function() {
				this._set(ATTR_LOADING, false);
				Y.log('End Loading', 'info', DISPATCHER);
			}
		};
		cfg.context = this;
		return (this._io = Y.io(uri, cfg));
	}
});

Y.Dispatcher = Dispatcher;