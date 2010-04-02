YUI.add('gallery-node-accordion', function(Y) {

/**
* <p>The Accordion Node Plugin makes it easy to transform existing 
* markup into an accordion element with expandable and collapsable elements, 
* elements are  easy to customize, and only require a small set of dependencies.</p>
* 
* 
* <p>To use the Accordion Node Plugin, simply pass a reference to the plugin to a 
* Node instance's <code>plug</code> method.</p>
* 
* <p>
* <code>
* &#60;script type="text/javascript"&#62; <br>
* <br>
* 		//	Call the "use" method, passing in "gallery-node-accordion".  This will <br>
* 		//	load the script and CSS for the Accordion Node Plugin and all of <br>
* 		//	the required dependencies. <br>
* <br>
* 		YUI().use("gallery-node-accordion", function(Y) { <br>
* <br>
* 			//	Use the "contentready" event to initialize the accordion when <br>
* 			//	the element that represente the accordion <br>
* 			//	(&#60;div id="accordion-1"&#62;) is ready to be scripted. <br>
* <br>
* 			Y.on("contentready", function () { <br>
* <br>
* 				//	The scope of the callback will be a Node instance <br>
* 				//	representing the accordion (&#60;div id="accordion-1"&#62;). <br>
* 				//	Therefore, since "this" represents a Node instance, it <br>
* 				//	is possible to just call "this.plug" passing in a <br>
*				//	reference to the Accordion Node Plugin. <br>
* <br>
* 				this.plug(Y.Plugin.NodeAccordion); <br>
* <br>
* 			}, "#accordion-1"); <br>
* <br>		
* 		}); <br>
* <br>	
* 	&#60;/script&#62; <br>
* </code>
* </p>
*
* <p>The Accordion Node Plugin has several configuration properties that can be 
* set via an object literal that is passed as a second argument to a Node 
* instance's <code>plug</code> method.
* </p>
*
* <p>
* <code>
* &#60;script type="text/javascript"&#62; <br>
* <br>
* 		//	Call the "use" method, passing in "gallery-node-accordion".  This will <br>
* 		//	load the script and CSS for the Accordion Node Plugin and all of <br>
* 		//	the required dependencies. <br>
* <br>
* 		YUI().use("gallery-node-accordion", function(Y) { <br>
* <br>
* 			//	Use the "contentready" event to initialize the accordion when <br>
* 			//	the element that represente the accordion <br>
* 			//	(&#60;div id="accordion-1"&#62;) is ready to be scripted. <br>
* <br>
* 			Y.on("contentready", function () { <br>
* <br>
* 				//	The scope of the callback will be a Node instance <br>
* 				//	representing the accordion (&#60;div id="accordion-1"&#62;). <br>
* 				//	Therefore, since "this" represents a Node instance, it <br>
* 				//	is possible to just call "this.plug" passing in a <br>
*				//	reference to the Accordion Node Plugin. <br>
* <br>
* 				this.plug(Y.Plugin.NodeAccordion, { anim: true, effect: Y.Easing.backIn });
* <br><br>
* 			}, "#accordion-1"); <br>
* <br>		
* 		}); <br>
* <br>	
* 	&#60;/script&#62; <br>
* </code>
* </p>
* 
* @module gallery-node-accordion
*/


//	Util shortcuts

var UA = Y.UA,
	getClassName = Y.ClassNameManager.getClassName,
    anims = {},
    wheels = {fast:0.1,slow:0.6,normal:0.4},

	//	Frequently used strings
	ACCORDION = "accordion",
	ACCORDIONITEM = "item",
	SCROLL_HEIGHT = "scrollHeight",
	SCROLL_WIDTH = "scrollWidth",
	WIDTH = "width",
	HEIGHT = "height",
	PX = "px",
	PERIOD = ".",
	HOST = "host",

	//	Attribute keys
	ATTR_ORIENTATION = 'orientation',
	ATTR_FADE 		 = 'fade',
	ATTR_MULTIPLE 	 = 'multiple',
	ATTR_PERSISTENT  = 'persistent',
	ATTR_SPEED  	 = 'speed',
	ATTR_ANIM		 = 'anim',
	ATTR_ITEMS		 = 'items',
	
	//	CSS class names
	CLASS_ACCORDION 			 = getClassName(ACCORDION),
	CLASS_ACCORDION_HIDDEN 		 = getClassName(ACCORDION, 'hidden'),
	CLASS_ACCORDION_ITEM 		 = getClassName(ACCORDION, ACCORDIONITEM),
	CLASS_ACTIVE 				 = getClassName(ACCORDION, ACCORDIONITEM, "active"),
    CLASS_SLIDING 				 = getClassName(ACCORDION, ACCORDIONITEM, "sliding"),
	CLASS_ACCORDION_ITEM_HD 	 = getClassName(ACCORDION, ACCORDIONITEM, "hd"),
	CLASS_ACCORDION_ITEM_BD 	 = getClassName(ACCORDION, ACCORDIONITEM, "bd"),
	CLASS_ACCORDION_ITEM_FT 	 = getClassName(ACCORDION, ACCORDIONITEM, "ft"),
	CLASS_ACCORDION_ITEM_TRIGGER = getClassName(ACCORDION, ACCORDIONITEM, "trigger"),
   	
	//	CSS selectors
	SELECTOR_ACCORDION_ITEM = PERIOD + CLASS_ACCORDION_ITEM,
	SELECTOR_ACCORDION_ITEM_BD = PERIOD + CLASS_ACCORDION_ITEM_BD,
	// few more just in case...
	//SELECTOR_ACCORDION = PERIOD + CLASS_ACCORDION,
	//SELECTOR_ACCORDION_ITEM_TRIGGER = PERIOD + CLASS_ACCORDION_ITEM_TRIGGER,
	
	FC = '>.',
	ITEM_QUERY 			= FC + CLASS_ACCORDION_ITEM,
	ITEM_TRIGGER_QUERY 	= ITEM_QUERY + PERIOD + CLASS_ACCORDION_ITEM_TRIGGER + ', ' +
							ITEM_QUERY + FC + CLASS_ACCORDION_ITEM_HD + PERIOD + CLASS_ACCORDION_ITEM_TRIGGER + ', ' +
							ITEM_QUERY + FC + CLASS_ACCORDION_ITEM_HD + FC + CLASS_ACCORDION_ITEM_TRIGGER + ', ' +
							ITEM_QUERY + FC + CLASS_ACCORDION_ITEM_FT + PERIOD + CLASS_ACCORDION_ITEM_TRIGGER + ', ' +
							ITEM_QUERY + FC + CLASS_ACCORDION_ITEM_FT + FC + CLASS_ACCORDION_ITEM_TRIGGER,
	// few more just in case...
	//ITEM_HD_QUERY = FC+CLASS_ACCORDION_ITEM+FC+CLASS_ACCORDION_ITEM_HD,
	//ITEM_BD_QUERY = FC+CLASS_ACCORDION_ITEM+FC+CLASS_ACCORDION_ITEM_BD,
	//ITEM_FT_QUERY = FC+CLASS_ACCORDION_ITEM+FC+CLASS_ACCORDION_ITEM_FT,
	
	//	Utility functions
	/**
	* The NodeAccordion class is a plugin for a Node instance.  The class is used via  
	* the <a href="Node.html#method_plug"><code>plug</code></a> method of Node and 
	* should not be instantiated directly.
	* @namespace Y.Plugin
	* @class NodeAccordion
	*/
	NodeAccordion = function () {
	
		NodeAccordion.superclass.constructor.apply(this, arguments);
	
	};

NodeAccordion.NAME = "NodeAccordion";
NodeAccordion.NS = ACCORDION;

NodeAccordion.ATTRS = {
	/**
	* Nodes representing the list of active items.
	*
	* @attribute activeItems
	* @readOnly
	* @type Y.NodeList
	*/
	activeItems: {
		readOnly: true,
		getter: function (value) {
			return this._root.all(FC+CLASS_ACTIVE);
		}
	},
	/**
	* Nodes representing the list of items.
	*
	* @attribute items
	* @readOnly
	* @type Y.NodeList
	*/
	items: {
		readOnly: true,
		getter: function (value) {
			return this._root.all(ITEM_QUERY);
		}
	},
	
	/**
	* orientation defines if the accordion will use width or height to expand and collapse items.
	*
	* @attribute orientation
	* @writeOnce
	* @default height
	* @type string
	*/
	orientation: {
		value: HEIGHT,
		writeOnce: true
	},
	/**
	* Boolean indicating that animation should include opacity to fade in/out the content of the item.
	*
	* @attribute fade
	* @default false
	* @type boolean
	*/	
	fade: {
		value: false
	},
	/**
	* Boolean indicating that Y.Anim should be used to expand and collapse items.
	* It also supports a function with an specific effect.
	* <p>
	* <code>
	* &#60;script type="text/javascript"&#62; <br>
	* <br>
	* 		//	Call the "use" method, passing in "anim" and "gallery-node-accordion". <br>
	* <br>
	* 		YUI().use("anim", "gallery-node-accordion", function(Y) { <br>
	* <br>
	* 			Y.one("#myaccordion").plug(Y.Plugin.NodeAccordion, {<br>
	* 				anim: Y.Easing.backIn<br>
	* 			}); <br>
	* <br>	
	* 	&#60;/script&#62; <br>
	* </code>
	* </p>
	* 
	* @attribute anim
	* @default false
	* @type {boolean|function}
	*/
	anim: {
		value: false,
		validator : function (v) {
            return !Y.Lang.isUndefined(Y.Anim);
        }
	},
	/**
	* Boolean indicating that more than one item can be opened at the same time.
	*
	* @attribute multiple
	* @default true
	* @type boolean
	*/
	multiple: {
		value: true
	},
	/**
	* Boolean indicating that one of the items should be open at any given time.
	*
	* @attribute persistent
	* @default false
	* @type boolean
	*/	
	persistent: {
		value: false
	},
	/**
	* Numeric value indicating the speed in mili-seconds for the animation process.
	* Also support three predefined strings in lowercase:
	* <ol>
	* <li>fast = 0.1</li>
	* <li>normal = 0.4</li>
	* <li>slow = 0.6</li>
	* </ol>
	* 
	* @attribute speed
	* @default 0.4
	* @type numeric
	*/	
	speed: {
		value: 0.4,
		validator : function (v) {
            return (Y.Lang.isNumber(v) || (Y.Lang.isString(v) && wheels.hasOwnProperty(v)));
        },
        setter : function (v) {
            return (wheels.hasOwnProperty(v)?wheels[v]:v);
        }
	}

};


Y.extend(NodeAccordion, Y.Plugin.Base, {

	//	Protected properties

	/** 
	* @property _root
	* @description Node instance representing the root node in the accordion.
	* @default null
	* @protected
	* @type Node
	*/
	_root: null,

	//	Public methods

    initializer: function (config) {
		var _root = this.get(HOST),
			aHandlers = [];
		if (_root) {

			this._root = _root;
			
			//	close all items and open the actived ones
			this.get(ATTR_ITEMS).each(function(item) {
				if (item.hasClass(CLASS_ACTIVE)) {
					this.expandItem(item);
				} else {
					this.collapseItem(item);
				}
			}, this);

			//	Wire up all event handlers
			aHandlers.push(_root.delegate('click', function(e) {
				Y.log ('Accordion Trigger: ' + e);
				this.toggleItem(e.currentTarget); // probably is better to pass the ancestor for the item
				e.target.blur();
				e.halt();
			}, ITEM_TRIGGER_QUERY, this));
			aHandlers = this._eventHandlers;

			_root.removeClass(CLASS_ACCORDION_HIDDEN);
		}
    },

	destructor: function () {
		var aHandlers = this._eventHandlers;
		if (aHandlers) {
			Y.Array.each(aHandlers, function (handle) {
				handle.detach();
			});
			this._eventHandlers = null;
		}
    },

	//	Protected methods
	/**
	 * @method _getItem
	 * @description Searching for an item based on a node reference or an index order.
	 * @protected
	 * @param {Node|Number} node Node reference or Node index.
	 * @return {Node} The matching DOM node or null if none found.
	 */
	_getItem: function(node) {
		if (Y.Lang.isNumber(node)) {
			node = this.get(ATTR_ITEMS).item(node);	
		}
		var fn = function(n) { 
			return n.hasClass(CLASS_ACCORDION_ITEM); 
		};
		if (node && !node.hasClass(CLASS_ACCORDION_ITEM)) {
			return node.ancestor( fn );
		}
		return node;
	},	
	
	/**
	 * @method _animate
	 * @description Using Y.Anim to expand or collapse an item.
	 * @protected
	 * @param {String} id Global Unique ID for the animation.
	 * @param {Object} conf Configuration object for the animation.
	 * @param {Function} fn callback function that should be executed after the end of the anim.
	 * @return {Object} Animation handler.
	 */
	_animate: function(id, conf, fn) {
		var anim = anims[id];
		Y.log ('Anim Conf: ' + conf);
		// if the animation is underway: we need to stop it...
		if ((anim) && (anim.get ('running'))) {
        	anim.stop();
        }
	    if (Y.Lang.isFunction(this.get(ATTR_ANIM))) {
			conf.easing = this.get(ATTR_ANIM);
	    }
	    anim = new Y.Anim(conf);
	    anim.on('end', fn, this);
		anim.run();
	    anims[id] = anim;
	    return anim;
	},
		
	/**
	* @method _openItem
	* @description Open an item.
	* @protected
	* @param {Node} item Node instance representing an item.
	*/
	_openItem: function (item) {
		var bd, 
			id, 
			fn, 
			fs,
			i,
			list = this.get(ATTR_ITEMS),
			o = this.get (ATTR_ORIENTATION),
			conf = {
				duration: this.get(ATTR_SPEED),
				to: {
					scroll: []
				}
			},
			mirror;
		// if the item is not already opened
        if (item && list.size() && !item.hasClass(CLASS_ACTIVE) && (bd = item.one(SELECTOR_ACCORDION_ITEM_BD)) && (id = Y.stamp(bd))) {
        	// closing all the selected items if neccesary
            if (!this.get(ATTR_MULTIPLE)) {
            	//	close all items and open the actived ones
				mirror = this._root.one(FC+CLASS_ACTIVE);
            }
            // opening the selected element, based on the orientation, timer and anim attributes...
    	    conf.to[o] = (o==WIDTH?bd.get(SCROLL_WIDTH):bd.get(SCROLL_HEIGHT)); 
    	    conf.node = bd;
    	    item.addClass(CLASS_SLIDING);
        	fn = function() {
                item.removeClass(CLASS_SLIDING);
    		    item.addClass(CLASS_ACTIVE);
        		// broadcasting the corresponding event (close)...
        		// $B.fire ('accordionOpenItem', item);
        	};
        	if (!this.get(ATTR_ANIM)) {
    	        // animation manually
    	        // getting the desired dimension from the current item
    	        fs = bd.get(o);
    	        // override the desired dimension from the mirror if exists
    	        if (Y.Lang.isObject(mirror)) {
    	          	fs = mirror.get(o);
    	          	mirror.addClass(CLASS_SLIDING);
    	        }
        	    for (i=1;i<=fs;i++){
        	        if (Y.Lang.isObject(mirror)) {
        	          mirror.setStyle (o, (fs-i)+PX);
        	        }
        	        bd.setStyle (o, i+PX);
        	    }
        	    if (Y.Lang.isObject(mirror)) {
    	          	mirror.removeClass(CLASS_SLIDING);
    		    	mirror.removeClass(CLASS_ACTIVE);
    	        }
        	    fn();
    		} else {
    			// scrolling effect
	          	conf.to.scroll = [0,0];
	            // appliying fadeIn
	            if (this.get(ATTR_FADE)) { 
	              conf.to.opacity = 1;
	            }
	            if (Y.Lang.isObject(mirror)) {
	            	this._closeItem(mirror);
	            }
	        	this._animate(id, conf, fn);
    	    }
        }
	},

	/**
	* @method _closeItem 
	* @description Closes the specified item.
	* @protected
	* @param {Node} item Node instance representing an item.
	*/
	_closeItem: function (item) {

		var bd, 
			id, 
			fn, 
			fs,
			i,
			list = this.get(ATTR_ITEMS),
			o = this.get (ATTR_ORIENTATION),
			conf = {
				duration: this.get(ATTR_SPEED), 
				to: {
					scroll: []
				}
			};
        if (item && list.size() && (bd = item.one(SELECTOR_ACCORDION_ITEM_BD)) && (id = Y.stamp(bd))) {
            // closing the item, based on the orientation, timer and anim attributes...
            conf.to[o] = (((o==HEIGHT) && UA.ie && (UA.ie<7))?1:0); // hack for vertical accordion issue on Safari and Opera
            conf.node = bd;
    		item.addClass(CLASS_SLIDING);
        	fn = function() {
                item.removeClass(CLASS_SLIDING);
    		    item.removeClass(CLASS_ACTIVE);
        		// broadcasting the corresponding event (close)...
        		// $B.fire ('accordionCloseItem', item);
        	};
    		if (!this.get(ATTR_ANIM)) {
    	        // animation manually
    	        fs = bd.get(o);
        	    for (i=fs;i>=conf.to[o].to;i--){
        	        bd.setStyle (o, i+PX);
        	    }
        	    fn();
    		} else {
	            // scrolling effect
	          	conf.to.scroll = (o==WIDTH?[bd.get(SCROLL_WIDTH),0]:[0,bd.get(SCROLL_HEIGHT)]);
	          	// appliying fadeIn
	          	if (this.get(ATTR_FADE)) { 
              		conf.to.opacity = 0;
              	}
		        this._animate(id, conf, fn);
    		}
        }
        
	},

	//	Generic DOM Event handlers
	/**
	* @method expandAllItems
	* @description Expanding all items.
	* @public
	* @return {object} Plugin reference for chaining
	*/
	expandAllItems: function () {
		Y.log(("Expanding all items (only if attr multiple=true): " + this._root), "info", "nodeAccordion");
		if (this.get(ATTR_MULTIPLE)) {
			this.get(ATTR_ITEMS).each(function (node) {
				this.expandItem(node);
			}, this);
		}
		return this;
	},
	
	/**
	* @method collapseAllItems
	* @description Collapsing all items.
	* @public
	* @return {object} Plugin reference for chaining
	*/
	collapseAllItems: function () {
		Y.log(("Collapsing all items (only if attr multiple=true or attr persistent=false): " + this._root), "info", "nodeAccordion");
		if (this.get(ATTR_MULTIPLE) || !this.get(ATTR_PERSISTENT)) {
			this.get(ATTR_ITEMS).each(function (node) {
				this.collapseItem(node);
			}, this);
		}
		return this;
	},
	
	/**
	* @method expandItem
	* @description Expand a certain item.
	* @public
	* @param {Node} node Node reference
	* @return {object} Plugin reference for chaining
	*/
	expandItem: function ( node ) {
	    var item = this._getItem(node);
	    if (item) {
	    	Y.log(("Expanding an item: " + item), "info", "nodeAccordion");
	    	this._openItem (item);
	    }
		return this;
	},
	
	/**
	* @method collapseItem
	* @description Collapse a certain item.
	* @public
	* @param {Node} node Node reference
	* @return {object} Plugin reference for chaining
	*/
	collapseItem: function ( node ) {
	    var item = this._getItem(node);
	    if (item && item.hasClass(CLASS_ACTIVE) && (this.get(ATTR_MULTIPLE) || !this.get(ATTR_PERSISTENT))) {
	    	Y.log(("Collapse an item: " + item), "info", "nodeAccordion");
	    	this._closeItem(item);
	    }
		return this;
	},
	
	/**
	* @method toggleItem
	* @description toggle a certain item.
	* @public
	* @param {object} node Node reference
	* @return {object} Plugin reference for chaining
	*/
	toggleItem: function ( node ) {
	    var item = this._getItem(node);
	    Y.log ('Looking for accordion item: ' + SELECTOR_ACCORDION_ITEM);
	    if (item) {
	    	// if the item is already opened, and is multiple and not persistent
	        Y.log(("Toggling an item: " + item), "info", "nodeAccordion");
	        ((item.hasClass(CLASS_ACTIVE) && (this.get(ATTR_MULTIPLE) || !this.get(ATTR_PERSISTENT)))?this._closeItem (item):this._openItem (item));
	    }
	    return this;
	}

});

Y.namespace('Plugin');

Y.Plugin.NodeAccordion = NodeAccordion;


}, 'gallery-2010.04.02-17-26' ,{requires:['node-base', 'node-style', 'plugin', 'node-event-delegate', 'classnamemanager'], optional:['anim']});
