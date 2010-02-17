/**
* <p>The Dispatcher Node Plugin makes it easy to transform existing 
* markup into an dispatcher element with expandable and collapsable elements, 
* elements are  easy to customize, and only require a small set of dependencies.</p>
* 
* 
* <p>To use the Dispatcher Node Plugin, simply pass a reference to the plugin to a 
* Node instance's <code>plug</code> method.</p>
* 
* <p>
* <code>
* &#60;script type="text/javascript"&#62; <br>
* <br>
* 		//	Call the "use" method, passing in "node-dispatcher".  This will <br>
* 		//	load the script and CSS for the Dispatcher Node Plugin and all of <br>
* 		//	the required dependencies. <br>
* <br>
* 		YUI().use("gallery-dispatcher", function(Y) { <br>
* <br>
* 			//	Use the "contentready" event to initialize the dispatcher when <br>
* 			//	the element that represente the dispatcher <br>
* 			//	(&#60;div id="dispatcher-1"&#62;) is ready to be scripted. <br>
* <br>
* 			Y.on("contentready", function () { <br>
* <br>
* 				//	The scope of the callback will be a Node instance <br>
* 				//	representing the dispatcher (&#60;div id="dispatcher-1"&#62;). <br>
* 				//	Therefore, since "this" represents a Node instance, it <br>
* 				//	is possible to just call "this.plug" passing in a <br>
*				//	reference to the Dispatcher Node Plugin. <br>
* <br>
* 				this.plug(Y.Plugin.NodeDispatcher); <br>
* <br>
* 			}, "#dispatcher-1"); <br>
* <br>		
* 		}); <br>
* <br>	
* 	&#60;/script&#62; <br>
* </code>
* </p>
*
* <p>The Dispatcher Node Plugin has several configuration properties that can be 
* set via an object literal that is passed as a second argument to a Node 
* instance's <code>plug</code> method.
* </p>
*
* <p>
* <code>
* &#60;script type="text/javascript"&#62; <br>
* <br>
* 		//	Call the "use" method, passing in "node-dispatcher".  This will <br>
* 		//	load the script and CSS for the Dispatcher Node Plugin and all of <br>
* 		//	the required dependencies. <br>
* <br>
* 		YUI().use("node-dispatcher", function(Y) { <br>
* <br>
* 			//	Use the "contentready" event to initialize the dispatcher when <br>
* 			//	the element that represente the dispatcher <br>
* 			//	(&#60;div id="dispatcher-1"&#62;) is ready to be scripted. <br>
* <br>
* 			Y.on("contentready", function () { <br>
* <br>
* 				//	The scope of the callback will be a Node instance <br>
* 				//	representing the dispatcher (&#60;div id="dispatcher-1"&#62;). <br>
* 				//	Therefore, since "this" represents a Node instance, it <br>
* 				//	is possible to just call "this.plug" passing in a <br>
*				//	reference to the Dispatcher Node Plugin. <br>
* <br>
* 				this.plug(Y.Plugin.NodeDispatcher, { anim: true, effect: Y.Easing.backIn });
* <br><br>
* 			}, "#dispatcher-1"); <br>
* <br>		
* 		}); <br>
* <br>	
* 	&#60;/script&#62; <br>
* </code>
* </p>
* 
* @module node-dispatcher
*/


//	Util shortcuts

var UA = Y.UA,
	getClassName = Y.ClassNameManager.getClassName,

	//	Frequently used strings
	DISPATCHER = "dispatcher",
	PERIOD = ".",
	DISPATCHER_START = 'start',
    DISPATCHER_PURGE = 'purge',
    DISPATCHER_CHANGE = 'change',
    DISPATCHER_LOAD = 'load',
    
	//	Attribute keys
	ATTR_URI 		 = 'uri',
	ATTR_CONTENT 	 = 'content',
	
	//	CSS class names
	CLASS_DISPATCHER 			 = getClassName(DISPATCHER),
	CLASS_DISPATCHER_LOADING 	 = getClassName(DISPATCHER, 'loading'),
   	
	//	CSS selectors
	SELECTOR_DISPATCHER = PERIOD + CLASS_DISPATCHER,       
	
	// shorthands
    L = Y.Lang,
    isBoolean= L.isBoolean,
    isString = L.isString,
    isObject = L.isObject,	
    
	/**
	* The NodeDispatcher class is a plugin for a Node instance.  The class is used via  
	* the <a href="Node.html#method_plug"><code>plug</code></a> method of Node and 
	* should not be instantiated directly.
	* @namespace plugin
	* @class NodeDispatcher
	*/
	Dispatcher = function () {
		Dispatcher.superclass.constructor.apply(this, arguments);
	};

//	Utility functions

function _parseContent ( content ) {
	var fragment = Y.Node.create('<div></div>'),
		o = {};
	
	fragment.setContent (content);
	o.css = fragment.all('style, link[type=text/css]').each(function (n) {
		fragment.removeChild (n);
	});
	o.js = fragment.all('script').each(function (n) {
		fragment.removeChild (n);
	});
	o.content = fragment.get ('innerHTML');
	return o;
}

// Dispatcher definition

Y.mix(Dispatcher, {

    /**
     * The identity of the component.
     *
     * @property Dispatcher.NAME
     * @type String
     * @static
     */
    NAME : DISPATCHER,

    /**
     * @property Dispatcher._hashtable
     * @type Array
     * @static
     */
    _hashtable : [],

    /**
     * Static property used to define the default attribute configuration of
     * the component.
     *
     * @property Dispatcher.ATTRS
     * @Type Object
     * @static
     */
    ATTRS : {

 		/**
 		* If dispatcher should purge the DOM elements before replacing the content
 		* @attribute autopurge
 		* @default true
 		* @type boolean
 		*/	
 		autopurge: {
 			value: true,
 			validator : isBoolean
 		},
 		/**
 		* URL that should be injected within the host
 		* @attribute uri
 		* @default null
 		* @type string
 		*/	
 		uri: {
 			value: null,
 			setter : function (v) {
 				Y.log ('dispatching a new url','info',DISPATCHER);
 				this.stop ();
 				this._io = this._fetch(v);
				return v;
			},
 			validator : isString
 		},
 		/**
 		* default content for the dynamic area
 		* @attribute content
 		* @default null
 		* @type string
 		*/	
 		content: {
 			value: '',
 			setter : function (v) {
 				Y.log ('dispatching a new content','info',DISPATCHER);
 				this.stop();
 				v = this._dispatch(v); // discarding the file name
	            return v;
			},
 			validator : isString
 		},
	    /**
		* Boolean indicating that a process is undergoing.
		* 
		* @attribute loading
		* @default false
		* @type {boolean}
		*/
		loading: {
			value: false,
			validator: isBoolean,
			setter: function (v) {
				Y.log ('setting status','info',DISPATCHER);
				if (v) {
					this._node.addClass (CLASS_DISPATCHER_LOADING);
				} else {
					this._node.removeClass (CLASS_DISPATCHER_LOADING);
				}
				return v;
			} 
		}
     }
});

Y.extend(Dispatcher, Y.Base, {

	//	Protected properties

   /**
    * ...
    *
    * @property _history
    * @type Array
    * @protected
    */
   _history : [],
   _node: null,
   _queue: null,
   _io: null,

	//	Public methods

    initializer: function (config) {
		Y.log ('Initializer','info',DISPATCHER);
		this._queue = new Y.AsyncQueue ();
		if (!isObject(config) || !config.node || !(this._node = Y.one(config.node))) {
			Y.log ('Dispatcher requires a NODE to be instantiated','info',DISPATCHER);
			// how can we stop the initialization?
			return;
		}

		/**
         * Signals the end of a thumb drag operation.  Payload includes
         * the DD.Drag instance's drag:end event under key ddEvent.
         *
         * @event slideEnd
         * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
         *  <dl>
         *      <dt>ddEvent</dt>
         *          <dd><code>drag:end</code> event from the managed DD.Drag instance</dd>
         *  </dl>
         */
        this.publish(DISPATCHER_START);
        this.publish(DISPATCHER_PURGE);
        this.publish(DISPATCHER_CHANGE);
        this.publish(DISPATCHER_LOAD);
	},

	destructor: function () {
		this.stop();
		this._node = null;
		this._queue = null;
		this._io = null;
    },
    stop: function () {
    	this._queue.stop ();
    	if (this._io) {
    		this._io.abort();
    	}
    	return this;
    },
	/**
	 * Dispatching the next node of the handle
	 * @method dispatch
	 * @return null
	 */
	_dispatch: function(content) {
    	var o = _parseContent (content),
    		q = this._queue,
    		n = this._node;
    	// injecting CSS blocks first
    	o.css.each (function (cssNode) {
    		if (cssNode && cssNode.get ('href')) {
	    		q.add ({
					fn: function () {
	    				Y.log ('external link tag: '+cssNode.get ('href'),'info',DISPATCHER);
	    				//q.next();
	    				Y.Get.css(cssNode.get ('href'), { 
	    					onFailure: function(o) {
	    						Y.log ('external link tag fail to load: '+cssNode.get ('href'),'warn',DISPATCHER);
							},
							onEnd: function () {
								q.run();
							}
						});
					},
					autoContinue: false
	    		});  			
    		} else {
	    		q.add ({
					fn: function () {
		    			// inject css;
		    			Y.log ('inline style tag: '+cssNode.get ('innerHTML'),'info',DISPATCHER);
		    			var d = cssNode.get('ownerDocument'),
							h = d.one('head') || d.get ('documentElement'),
							newStyle = Y.Node.create('<style></style>');
						h.replaceChild(cssNode, h.appendChild(newStyle));
					}
	    		});
    		}
    	});
    	// autopurging children collection
    	if (this.get ('autopurge')) {
    		q.add ({
    			fn: function () {
    				Y.log ('purging children collection','info',DISPATCHER);
	        		n.get ('children').each(function(c) {
	        			c.purge (true);
	        		});
	        	}
    		});
		}
    	// injecting new content
    	q.add ({
			fn: function () {
				Y.log ('setting new content: '+o.content,'info',DISPATCHER);
    			n.setContent (o.content);
			}
		});
    	// executing JS blocks before the injection
    	o.js.each (function (jsNode) {
    		if (jsNode && jsNode.get ('src')) {
	    		q.add ({
					fn: function () {
						Y.log ('external script tag: '+jsNode.get ('src'),'info',DISPATCHER);
						//q.next();
						Y.Get.script(jsNode.get ('src'), { 
							onFailure: function(o) {
	    						Y.log ('external script tag fail to load: '+jsNode.get ('src'),'error',DISPATCHER);
							},
							onEnd: function (o) {
								o.purge(); //removes the script node immediately after executing it
								q.run();
							}
						});
					},
					autoContinue: false
	    		});  			
    		} else {
	    		q.add ({
					fn: function () {
		    			// inject js;
						Y.log ('inline script tag: '+jsNode.get ('innerHTML'),'info',DISPATCHER);
						var d = jsNode.get('ownerDocument'),
							h = d.one('head') || d.get ('documentElement'),
							newScript = Y.Node.create('<script></script>');
						h.replaceChild(jsNode, h.appendChild(newScript));
						if (jsNode._node.text) {
					        newScript._node.text = jsNode._node.text;
						}
						jsNode.remove(); //removes the script node immediately after executing it
					}
	    		});    			
    		}
    	});
    	// executing the queue
    	this._queue.run();
	},
	/**
	* * Fetching a remote file that will be processed thru this object...
	* @param {object} uri       URI to be loaded using IO
	* @return object  Reference to the connection handler
	*/
	_fetch: function ( uri, cfg ){
		cfg = cfg || {
			method: 'GET'
		};
		cfg.on = {
			start: function () {
		   		Y.log ('Start','info',DISPATCHER);
	   		},
			success: function (tid, o) {
		   		Y.log ('Success: '+o.responseText,'info',DISPATCHER);
		   		this.set(ATTR_CONTENT, o.responseText);
	   		},
	   		failure: function (tid, o) {
	   			Y.log ('Failure','warn',DISPATCHER);
		   	},
			end: function () {
		   		Y.log ('End','info',DISPATCHER);
	   		}
		};
		cfg.context = this;
		return Y.io(uri, cfg);
	},

	/**
	 * Destroy Custom Event will be fired before remove the innerHTML in the displaying process
	 * @method _destroy
	 * @param {Object} el    	DOM Element reference
	 * @param {Object} config    User configuration (useful for future implementations)
	 * @return void
	 */
    _destroy: function ( node, callback ) {
		// if the injected code tries to set up a destroyer method, this method should be 
		// set in a FIFO, and if the area that contains the node will be destroyed, the 
		// callback will be called.
	}	
});

Y.Dispatcher = Dispatcher;