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
_yuitest_coverage["/build/gallery-flyweight-tree/gallery-flyweight-tree.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-flyweight-tree/gallery-flyweight-tree.js",
    code: []
};
_yuitest_coverage["/build/gallery-flyweight-tree/gallery-flyweight-tree.js"].code=["YUI.add('gallery-flyweight-tree', function(Y) {","","'use strict';","/*jslint white: true */","var Lang = Y.Lang,","	DOT = '.',","	DEFAULT_POOL = '_default',","	getCName = Y.ClassNameManager.getClassName,","	cName = function (name) {","		return getCName('flyweight-tree-node', name);","	},","	CNAME_NODE = cName(''),","	CNAME_CHILDREN = cName('children'),","	CNAME_COLLAPSED = cName('collapsed'),","	CNAME_EXPANDED = cName('expanded'),","	CNAME_NOCHILDREN = cName('no-children'),","	CNAME_FIRSTCHILD = cName('first-child'),","	CNAME_LASTCHILD = cName('last-child'),","	CNAME_LOADING = cName('loading'),","	BYPASS_PROXY = \"_bypassProxy\",","	VALUE = 'value',","	YArray = Y.Array,","	FWMgr,","	FWNode;","","/**","* @module gallery-flyweight-tree","*","*/","","/**"," * Extension to handle its child nodes by using the flyweight pattern."," * @class FlyweightTreeManager"," * @constructor"," */","FWMgr = function () {","	this._pool = {};","	this._initialValues = {};","};","","FWMgr.ATTRS = {","	/**","	 * Default object type of the child nodes if no explicit type is given in the configuration tree.","	 * It can be specified as an object reference, these two are equivalent: `Y.FWTreeNode` or  `'FWTreeNode'`.  ","	 * ","	 * @attribute defaultType","	 * @type {String | Object}","	 * @default 'FlyweightTreeNode'","	 */","	defaultType: {","		value: 'FlyweightTreeNode'			","	},","	/**","	 * Function used to load the nodes dynamically.","	 * Function will run in the scope of the FlyweightTreeManager instance and will","	 * receive:","	 * ","	 * * node {FlyweightTreeNode} reference to the parent of the children to be loaded.","	 * * callback {Function} function to call with the configuration info for the children.","	 * ","	 * The function shall fetch the nodes and create a configuration object ","	 * much like the one a whole tree might receive.  ","	 * It is not limited to just one level of nodes, it might contain children elements as well.","	 * When the data is processed, it should call the callback with the configuration object.","	 * The function is responsible of handling any errors.","	 * If the the callback is called with no arguments, the parent node will be marked as having no children.","	 * @attribute dynamicLoader","	 * @type {Function}","	 * @default null","	 */","	dynamicLoader: {","		validator: Lang.isFunction,","		value: null","	}","};","","","FWMgr.prototype = {","	/**","	 * Clone of the configuration tree.","	 * The FlyweightTreeNode instances will use the nodes in this tree as the storage for their state.","	 * @property _tree","	 * @type Object","	 * @private","	 */","	_tree: null,","	/**","	 * Pool of FlyweightTreeNode instances to use and reuse by the manager.  ","	 * It contains a hash of arrays indexed by the node type. ","	 * Each array contains a series of FlyweightTreeNode subclasses of the corresponding type.","	 * @property _pool","	 * @type {Object}","	 * @private","	 */","	_pool: null,","	/**","	 * List of dom events to be listened for at the outer contained and fired again","	 * at the node once positioned over the source node.","	 * @property _domEvents","	 * @type Array of strings","	 * @protected","	 * @default null","	 */","	_domEvents: null,","	","	/**","	 * Method to load the configuration tree.","	 * This is not done in the constructor so as to allow the subclass ","	 * to process the tree definition anyway it wants, adding defaults and such","	 * and to name the tree whatever is suitable.","	 * For TreeView, the configuration property is named `tree`, for a form, it is named `form`.","	 * It also sets initial values for some default properties such as `parent` references and `id` for all nodes.","	 * @method _loadConfig","	 * @param tree {Array} Configuration for the first level of nodes. ","	 * Contains objects with the following attributes:","	 * @param tree.label {String} Text or HTML markup to be shown in the node","	 * @param [tree.expanded=true] {Boolean} Whether the children of this node should be visible.","	 * @param [tree.children] {Array} Further definitions for the children of this node","	 * @param [tree.type=FWTreeNode] {FWTreeNode | String} Class used to create instances for this node.  ","	 * It can be a reference to an object or a name that can be resolved as `Y[name]`.","	 * @param [tree.id=Y.guid()] {String} Identifier to assign to the DOM element containing this node.","	 * @param [tree.template] {String} Template for this particular node. ","	 * @protected","	 */","	_loadConfig: function (tree) {","		var self = this;","		self._tree = {","			children: Y.clone(tree)","		};","		self._initNodes(this._tree);","		if (self._domEvents) {","			Y.Array.each(self._domEvents, function (event) {","				self.after(event, self._afterDomEvent, self);","			});","		}","	},","	/** Initializes the node configuration with default values and management info.","	 * @method _initNodes","	 * @param parent {Object} Parent of the nodes to be set","	 * @private","	 */","	_initNodes: function (parent) {","		var self = this;","		Y.Array.each(parent.children, function (child) {","			child._parent = parent;","			child.id = child.id || Y.guid();","			self._initNodes(child);","		});","	},","","	/** Generic event listener for DOM events listed in the {{#crossLink \"_domEvents\"}}{{/crossLink}} array.","	 *  It will locate the node that caused the event, slide a suitable instance on it and fire the","	 *  same event on that node.","	 *  @method _afterEvent","	 *  @param ev {EventFacade} Event facade as produced by the event","	 *  @private","	 */","	_afterDomEvent: function (ev) {","		var node = this._poolFetchFromEvent(ev);","		if (node) {","			node.fire(ev.type.split(':')[1], {domEvent:ev.domEvent});","			this._poolReturn(node);			","		}","	},","	/**","	 * Returns a string identifying the type of the object to handle the node","	 * or null if type was not a FlyweightNode instance.","	 * @method _getTypeString","	 * @param node {Object} Node in the tree configuration","	 * @return {String} type of node.","	 * @private","	 */","	_getTypeString: function (node) {","		var type = node.type || DEFAULT_POOL;","		if (!Lang.isString(type)) {","			if (Lang.isObject(type)) {","				type = type.NAME;","			} else {","				throw \"Node contains unknown type\";","			}","		}","		return type;","	},","	/**","	 * Pulls from the pool an instance of the type declared in the given node","	 * and slides it over that node.","	 * If there are no instances of the given type in the pool, a new one will be created via {{#crossLink \"_createNode\"}}{{/crossLink}}","	 * If an instance is held (see: {{#crossLink \"FlyweightTreeNode/hold\"}}{{/crossLink}}), it will be returned instead.","	 * @method _poolFetch","	 * @param node {Object} reference to a node within the configuration tree","	 * @return {FlyweightTreeNode} Usually a subclass of FlyweightTreeNode positioned over the given node","	 * @protected","	 */","	_poolFetch: function(node) {","		var pool,","			fwNode = node._held,","			type = this._getTypeString(node);","			","		if (fwNode) {","			return fwNode;","		}","		pool = this._pool[type];","		if (pool === undefined) {","			pool = this._pool[type] = [];","		}","		if (pool.length) {","			fwNode = pool.pop();","			fwNode._slideTo(node);","			return fwNode;","		}","		return this._createNode(node);","	},","	/**","	 * Returns the FlyweightTreeNode instance to the pool.","	 * Instances held (see: {{#crossLink \"FlyweightTreeNode/hold\"}}{{/crossLink}}) are never returned.","	 * @method _poolReturn","	 * @param fwNode {FlyweightTreeNode} Instance to return.","	 * @protected","	 */","	_poolReturn: function (fwNode) {","		if (fwNode._node._held) {","			return;","		}","		var pool,","			type = this._getTypeString(fwNode._node);","		pool = this._pool[type];","		if (pool) {","			pool.push(fwNode);","		}","		","	},","	/**","	 * Returns a new instance of the type given in node or the ","	 * {{#crossLink \"defaultType\"}}{{/crossLink}} if none specified","	 * and slides it on top of the node provided.","	 * @method _createNode","	 * @param node {Object} reference to a node within the configuration tree","	 * @return {FlyweightTreeNode} Instance of the corresponding subclass of FlyweightTreeNode","	 * @protected","	 */","	_createNode: function (node) {","		var newNode,","			Type = node.type || this.get('defaultType');","		if (Lang.isString(Type)) {","			Type = Y[Type];","		}","		if (Type) {","			newNode = new Type();","			if (newNode instanceof Y.FlyweightTreeNode) {","				// I need to do this otherwise Attribute will initialize ","				// the real node with default values when activating a lazyAdd attribute.","				newNode._slideTo({});","				Y.Array.each(Y.Object.keys(newNode._state.data), newNode._addLazyAttr, newNode);","				// newNode.getAttrs();","				// That's it (see above)","				newNode._root =  this;","				newNode._slideTo(node);","				return newNode;","			}","		}","		return null;","	},","	/**","	 * Returns an instance of Flyweight node positioned over the root","	 * @method getRoot","	 * @return {FlyweightTreeNode} ","	 */","	getRoot: function () {","		return this._poolFetch(this._tree);","	},","	/**","	 * Returns a string with the markup for the whole tree. ","	 * A subclass might opt to produce markup for those parts visible. (lazy rendering)","	 * @method _getHTML","	 * @return {String} HTML for this widget","	 * @protected","	 */","	_getHTML: function () {","		var s = '',","			root = this.getRoot();","		root.forSomeChildren( function (fwNode, index, array) {","			s += fwNode._getHTML(index, array.length, 0);","		});","		this._poolReturn(root);","		return s;","	},","	/**","	 * Locates a node in the tree by the element that represents it.","	 * @method _findNodeByElement","	 * @param el {Node} Any element belonging to the tree","	 * @return {Object} Node that produced the markup for that element or null if not found","	 * @protected","	 */","	_findNodeByElement: function(el) {","		var id = el.ancestor(DOT + FWNode.CNAME_NODE, true).get('id'),","			found = null,","			scan = function (node) {","				if (node.id === id) {","					found = node;","					return true;","				}","				if (node.children) {","					return Y.Array.some(node.children, scan);","				}","				return false;","			};","		if (scan(this._tree)) {","			return found;","		}","		return null;","	},","	/**","	 * Returns a FlyweightTreeNode instance from the pool, positioned over the node whose markup generated some event.","	 * @method _poolFetchFromEvent","	 * @param ev {EventFacade}","	 * @return {FlyweightTreeNode} The FlyweightTreeNode instance or null if not found.","	 * @private","	 */","	_poolFetchFromEvent: function (ev) {","		var found = this._findNodeByElement(ev.domEvent.target);","		if (found) {","			return this._poolFetch(found);","		}","		return null;			","	},","	/**","	 * Traverses the whole configuration tree, calling a given function for each node.","	 * If the function returns true, the traversing will terminate.","	 * @method _forSomeCfgNode","	 * @param fn {Function} Function to call on each configuration node","	 *		@param fn.cfgNode {Object} node in the configuratino tree","	 *		@param fn.depth {Integer} depth of this node within the tee","	 *		@param fn.index {Integer} index of this node within the array of its siblings","	 * @param scope {Object} scope to run the function in, defaults to this.","	 * @return true if any of the function calls returned true (the traversal was terminated earlier)","	 * @protected","	 */","	_forSomeCfgNode: function(fn, scope) {","		scope = scope || this;","		var loop = function(cfgNode, depth) {","			return Y.Array.some(cfgNode.children || [], function(childNode, index) {","				fn.call(scope, childNode,depth, index);","				return loop(childNode,depth + 1);","			});","		};","		return loop(this._tree, 0);","	},","	/**","	 * Executes the given function over all the nodes in the tree or until the function returns true.","	 * If dynamic loading is enabled, it will not run over nodes not yet loaded.","	 * @method forSomeNodes","	 * @param fn {function} function to execute on each node.  It will receive:","	 *	@param fn.node {FlyweightTreeNode} node being visited.","	 *	@param fn.depth {Integer} depth from the root. The root node is level zero and it is not traversed.","	 *	@param fn.index {Integer} position of this node within its branch","	 *	@param fn.array {Array} array containing itself and its siblings","	 * @param scope {Object} Scope to run the function in.  Defaults to the FlyweightTreeManager instance.","	 * @return {Boolean} true if any function calls returned true (the traversal was interrupted)","	 */","	forSomeNodes: function (fn, scope) {","		scope = scope || this;","		","		var forOneLevel = function (node, depth) {","			node.forSomeChildren(function (node, index, array) {","				if (fn.call(scope,node, depth, index, array) === true) {","					return true;","				}","				return forOneLevel(node, depth+1);","			});","		};","		return forOneLevel(this.getRoot(), 1);","	}","};","","Y.FlyweightTreeManager = FWMgr;","/**","* An implementation of the flyweight pattern.  ","* This object can be slid on top of a literal object containing the definition ","* of a tree and will take its state from that node it is slid upon.","* It relies for most of its functionality on the flyweight manager object,","* which contains most of the code.","* @module gallery-flyweight-tree","*/","","/**","* An implementation of the flyweight pattern.  This class should not be instantiated directly.","* Instances of this class can be requested from the flyweight manager class","* @class FlyweightTreeNode","* @extends Base","* @constructor  Do not instantiate directly.","*/","FWNode = Y.Base.create(","	'flyweight-tree-node',","	Y.Base,","	[],","	{","		/**","		 * Reference to the node in the configuration tree it has been slid over.","		 * @property _node","		 * @type {Object}","		 * @private","		 **/","		_node:null,","		/**","		 * Reference to the FlyweightTreeManager instance this node belongs to.","		 * It is set by the root and should be considered read-only.","		 * @property _root","		 * @type FlyweightTreeManager","		 * @private","		 */","		_root: null,","		/**","		 * Returns a string with the markup for this node along that of its children","		 * produced from its attributes rendered","		 * via the first template string it finds in these locations:","		 *","		 * * It's own {{#crossLink \"template\"}}{{/crossLink}} configuration attribute","		 * * The static {{#crossLink \"FlyweightTreeNode/TEMPLATE\"}}{{/crossLink}} class property","		 *","		 * @method _getHTML","		 * @param index {Integer} index of this node within the array of siblings","		 * @param nSiblings {Integer} number of siblings including this node","		 * @param depth {Integer} number of levels to the root","		 * @return {String} markup generated by this node","		 * @protected","		 */","		_getHTML: function(index, nSiblings, depth) {","			// assumes that if you asked for the HTML it is because you are rendering it","			var self = this,","				node = this._node,","				attrs = this.getAttrs(),","				s = '', ","				templ = node.template,","				childCount = node.children && node.children.length,","				nodeClasses = [CNAME_NODE],","				superConstructor = this.constructor;","				","			while (!templ) {","				templ = superConstructor.TEMPLATE;","				superConstructor = superConstructor.superclass.constructor;","				","			}","","			node._rendered = true;","			if (childCount) {","				if (attrs.expanded) {","					node._childrenRendered = true;","					this.forSomeChildren( function (fwNode, index, array) {","						s += fwNode._getHTML(index, array.length, depth+1);","					});","					nodeClasses.push(CNAME_EXPANDED);","				} else {","					nodeClasses.push(CNAME_COLLAPSED);","				}","			} else {","				if (this._root.get('dynamicLoader') && !node.isLeaf) {","					nodeClasses.push(CNAME_COLLAPSED);","				} else {","					nodeClasses.push(CNAME_NOCHILDREN);","				}","			}","			if (index === 0) {","				nodeClasses.push(CNAME_FIRSTCHILD);","			} ","			if (index === nSiblings - 1) {","				nodeClasses.push(CNAME_LASTCHILD);","			}","			attrs.children = s;","			attrs.cname_node = nodeClasses.join(' ');","			attrs.cname_children = CNAME_CHILDREN;","","			return Lang.sub(templ, attrs);","","		},","		/**","		 * Method to slide this instance on top of another node in the configuration object","		 * @method _slideTo","		 * @param node {Object} node in the underlying configuration tree to slide this object on top of.","		 * @private","		 */","		_slideTo: function (node) {","			this._node = node;","			this._stateProxy = node;","		},","		/**","		 * Executes the given function on each of the child nodes of this node.","		 * @method forSomeChildren","		 * @param fn {Function} Function to be executed on each node","		 *		@param fn.child {FlyweightTreeNode} Instance of a suitable subclass of FlyweightTreeNode, ","		 *		positioned on top of the child node","		 *		@param fn.index {Integer} Index of this child within the array of children","		 *		@param fn.array {Array} array containing itself and its siblings","		 * @param scope {object} The falue of this for the function.  Defaults to the parent.","		**/","		forSomeChildren: function(fn, scope) {","			var root = this._root,","				children = this._node.children,","				child, ret;","			scope = scope || this;","			if (children && children.length) {","				YArray.some(children, function (node, index, array) {","					child = root._poolFetch(node);","					ret = fn.call(scope, child, index, array);","					root._poolReturn(child);","					return ret;","				});","			}","		},","		/**","		 * Getter for the expanded configuration attribute.","		 * It is meant to be overriden by the developer.","		 * The supplied version defaults to true if the expanded property ","		 * is not set in the underlying configuration tree.","		 * It can be overriden to default to false.","		 * @method _expandedGetter","		 * @return {Boolean} The expanded state of the node.","		 * @protected","		 */","		_expandedGetter: function () {","			return this._node.expanded !== false;","		},","		/**","		 * Setter for the expanded configuration attribute.","		 * It renders the child nodes if this branch has never been expanded.","		 * Then sets the className on the node to the static constants ","		 * CNAME_COLLAPSED or CNAME_EXPANDED from Y.FlyweightTreeManager","		 * @method _expandedSetter","		 * @param value {Boolean} new value for the expanded attribute","		 * @private","		 */","		_expandedSetter: function (value) {","			var self = this,","				node = self._node,","				root = self._root,","				el = Y.one('#' + node.id),","				dynLoader = root.get('dynamicLoader');","				","			node.expanded = value = !!value;","			if (dynLoader && !node.isLeaf && (!node.children  || !node.children.length)) {","				this._loadDynamic();","				return;","			}","			if (node.children && node.children.length) {","				if (value) {","					if (!node._childrenRendered) {","						self._renderChildren();","					}","					el.replaceClass(CNAME_COLLAPSED, CNAME_EXPANDED);","				} else {","					el.replaceClass(CNAME_EXPANDED, CNAME_COLLAPSED);","				}","			}","		},","		/**","		 * Triggers the dynamic loading of children for this node.","		 * @method _loadDynamic","		 * @private","		 */","		_loadDynamic: function () {","			var self = this,","				root = self._root;","			Y.one('#' + this.get('id')).replaceClass(CNAME_COLLAPSED, CNAME_LOADING);","			root.get('dynamicLoader').call(root, self, Y.bind(self._dynamicLoadReturn, self));","			","		},","		/**","		 * Callback for the dynamicLoader method.","		 * @method _dynamicLoadReturn","		 * @param response {Array} array of child nodes ","		 * @private","		 */","		_dynamicLoadReturn: function (response) {","			var self = this,","				node = self._node,","				root = self._root;","","			if (response) {","","				node.children = response;","				root._initNodes(node);","				self._renderChildren();","			} else {","				node.isLeaf = true;","			}","			// isLeaf might have been set in the response, not just in the line above.","			Y.one('#' + node.id).replaceClass(CNAME_LOADING, (node.isLeaf?CNAME_NOCHILDREN:CNAME_EXPANDED));","		},","		/**","		 * Renders the children of this node.  ","		 * It the children had been rendered, they will be replaced.","		 * @method _renderChildren","		 * @private","		 */","		_renderChildren: function () {","			var s = '',","				node = this._node,","				depth = this.get('depth');","			node._childrenRendered = true;","			this.forSomeChildren(function (fwNode, index, array) {","				s += fwNode._getHTML(index, array.length, depth + 1);","			});","			Y.one('#' + node.id + ' .' + CNAME_CHILDREN).setContent(s);","		},","		/**","		 * Prevents this instance from being returned to the pool and reused.","		 * Remember to {{#crossLink \"release\"}}{{/crossLink}} this instance when no longer needed.","		 * @method hold","		 * @chainable","		 */","		hold: function () {","			return (this._node._held = this);","		},","		/**","		 * Allows this instance to be returned to the pool and reused.","		 * ","		 * __Important__: This instance should not be used after being released","		 * @method release","		 * @chainable","		 */","		release: function () {","			this._node._held = null;","			this._root._poolReturn(this);","			return this;","		},","		/**","		 * Returns the parent node for this node or null if none exists.","		 * The copy is not on {{#crossLink \"hold\"}}{{/crossLink}}.  ","		 * Remember to release the copy to the pool when done.","		 * @method getParent","		 * @return FlyweightTreeNode","		 */","		getParent: function() {","			var node = this._node._parent;","			return (node?this._root._poolFetch(node):null);","		},","		/**","		 * Returns the next sibling node for this node or null if none exists.","		 * The copy is not on {{#crossLink \"hold\"}}{{/crossLink}}.  ","		 * Remember to release the copy to the pool when done.","		 * @method getNextSibling","		 * @return FlyweightTreeNode","		 */","		getNextSibling: function() {","			var parent = this._node._parent,","				siblings = (parent && parent.children) || [],","				index = siblings.indexOf(this) + 1;","			if (index === 0 || index > siblings.length) {","				return null;","			}","			return this._root._poolFetch(siblings[index]);","		},","		/**","		 * Returns the previous sibling node for this node or null if none exists.","		 * The copy is not on {{#crossLink \"hold\"}}{{/crossLink}}.  ","		 * Remember to release the copy to the pool when done.","		 * @method getPreviousSibling","		 * @return FlyweightTreeNode","		 */","		getPreviousSibling: function() {","			var parent = this._node._parent,","				siblings = (parent && parent.children) || [],","				index = siblings.indexOf(this) - 1;","			if (index < 0) {","				return null;","			}","			return this._root._poolFetch(siblings[index]);","		},","		","		/**","		 * Sugar method to toggle the expanded state of the node.","		 * @method toggle","		 * @chainable","		 */","		toggle: function() {","			this.set('expanded', !this.get('expanded'));","			return this;","		},","		/**","		 * Returns true if this node is the root node","		 * @method isRoot","		 * @return {Boolean} true if root node","		 */","		isRoot: function() {","			return this._root._tree === this._node;","		},","		/**","		* Gets the stored value for the attribute, from either the","		* internal state object, or the state proxy if it exits","		*","		* @method _getStateVal","		* @private","		* @param {String} name The name of the attribute","		* @return {Any} The stored value of the attribute","		*/","		_getStateVal : function(name) {","			var node = this._node;","			if (this._state.get(name, BYPASS_PROXY) || !node) {","				return this._state.get(name, VALUE);","			}","			if (node.hasOwnProperty(name)) {","				return node[name];","			}","			return this._state.get(name, VALUE);","		},","","		/**","		* Sets the stored value for the attribute, in either the","		* internal state object, or the state proxy if it exits","		*","		* @method _setStateVal","		* @private","		* @param {String} name The name of the attribute","		* @param {Any} value The value of the attribute","		*/","		_setStateVal : function(name, value) {","			var node = this._node;","			if (this._state.get(name, BYPASS_PROXY) || this._state.get(name, 'initializing') || !node) {","				this._state.add(name, VALUE, value);","			} else {","				node[name] = value;","			}","		}","	},","	{","		/**","		 * Template string to be used to render this node.","		 * It should be overriden by the subclass.","		 *    ","		 * It contains the HTML markup for this node plus placeholders,","		 * enclosed in curly braces, that have access to any of the ","		 * configuration attributes of this node plus the following","		 * additional placeholders:","		 * ","		 * * children: The markup for the children of this node will be placed here","		 * * cname_node: The className for the HTML element enclosing this node.","		 *   The template should always use this className to help it locate the DOM element for this node.","		 * * cname_children: The className for the HTML element enclosing the children of this node.","		 * The template should always use this className to help it locate the DOM element that contains the children of this node.","		 * ","		 * The template should also add the `id` attribute to the DOM Element representing this node. ","		 * @property TEMPLATE","		 * @type {String}","		 * @default '<div id=\"{id}\" class=\"{cname_node}\"><div class=\"content\">{label}</div><div class=\"{cname_children}\">{children}</div></div>'","		 * @static","		 */","		TEMPLATE: '<div id=\"{id}\" class=\"{cname_node}\"><div class=\"content\">{label}</div><div class=\"{cname_children}\">{children}</div></div>',","		/**","		 * CCS className constant to use as the class name for the DOM element representing the node.","		 * @property CNAME_NODE","		 * @type String","		 * @static","		 */","		CNAME_NODE: CNAME_NODE,","		/**","		 * CCS className constant to use as the class name for the DOM element that will containe the children of this node.","		 * @property CNAME_CHILDREN","		 * @type String","		 * @static","		 */","		CNAME_CHILDREN: CNAME_CHILDREN,","		/**","		 * CCS className constant added to the DOM element for this node when its state is not expanded.","		 * @property CNAME_COLLAPSED","		 * @type String","		 * @static","		 */","		CNAME_COLLAPSED: CNAME_COLLAPSED,","		/**","		 * CCS className constant added to the DOM element for this node when its state is expanded.","		 * @property CNAME_EXPANDED","		 * @type String","		 * @static","		 */","		CNAME_EXPANDED: CNAME_EXPANDED,","		/**","		 * CCS className constant added to the DOM element for this node when it has no children.","		 * @property CNAME_NOCHILDREN","		 * @type String","		 * @static","		 */","		CNAME_NOCHILDREN: CNAME_NOCHILDREN,","		/**","		 * CCS className constant added to the DOM element for this node when it is the first in the group.","		 * @property CNAME_FIRSTCHILD","		 * @type String","		 * @static","		 */","		CNAME_FIRSTCHILD: CNAME_FIRSTCHILD,","		/**","		 * CCS className constant added to the DOM element for this node when it is the last in the group.","		 * @property CNAME_LASTCHILD","		 * @type String","		 * @static","		 */","		CNAME_LASTCHILD: CNAME_LASTCHILD,","		/**","		 * CCS className constant added to the DOM element for this node when dynamically loading its children.","		 * @property CNAME_LOADING","		 * @type String","		 * @static","		 */","		CNAME_LOADING: CNAME_LOADING,","		ATTRS: {","			/**","			 * Reference to the FlyweightTreeManager this node belongs to","			 * @attribute root","			 * @type {FlyweightTreeManager}","			 * @readOnly","			 * ","			 */","","			root: {","				_bypassProxy: true,","				readOnly: true,","				getter: function() {","					return this._root;","				}","			},","","			/**","			 * Template to use on this particular instance.  ","			 * The renderer will default to the static TEMPLATE property of this class ","			 * (the preferred way) or the nodeTemplate configuration attribute of the root.","			 * See the TEMPLATE static property.","			 * @attribute template","			 * @type {String}","			 * @default undefined","			 */","			template: {","				validator: Lang.isString","			},","			/**","			 * Label for this node. Nodes usually have some textual content, this is the place for it.","			 * @attribute label","			 * @type {String}","			 * @default ''","			 */","			label: {","				validator: Lang.isString,","				value: ''","			},","			/**","			 * Id to assign to the DOM element that contains this node.  ","			 * If none was supplied, it will generate one","			 * @attribute id","			 * @type {Identifier}","			 * @default guid()","			 * @readOnly","			 */","			id: {","				readOnly: true","			},","			/**","			 * Returns the depth of this node from the root.","			 * This is calculated on-the-fly.","			 * @attribute depth","			 * @type Integer","			 * @readOnly","			 */","			depth: {","				_bypassProxy: true,","				readOnly: true,","				getter: function () {","					var count = 0, ","						node = this._node;","					while (node._parent) {","						count += 1;","						node = node._parent;","					}","					return count-1;","				}","			},","			/**","			 * Expanded state of this node.","			 * @attribute expanded","			 * @type Boolean","			 * @default true","			 */","			expanded: {","				_bypassProxy: true,","				getter: '_expandedGetter',","				setter: '_expandedSetter'","			}","		}","	}",");","Y.FlyweightTreeNode = FWNode;","","","","}, 'gallery-2012.10.03-20-02' ,{requires:['base-base', 'base-build', 'classnamemanager'], skinnable:false});"];
_yuitest_coverage["/build/gallery-flyweight-tree/gallery-flyweight-tree.js"].lines = {"1":0,"3":0,"5":0,"10":0,"36":0,"37":0,"38":0,"41":0,"78":0,"126":0,"127":0,"130":0,"131":0,"132":0,"133":0,"143":0,"144":0,"145":0,"146":0,"147":0,"159":0,"160":0,"161":0,"162":0,"174":0,"175":0,"176":0,"177":0,"179":0,"182":0,"195":0,"199":0,"200":0,"202":0,"203":0,"204":0,"206":0,"207":0,"208":0,"209":0,"211":0,"221":0,"222":0,"224":0,"226":0,"227":0,"228":0,"242":0,"244":0,"245":0,"247":0,"248":0,"249":0,"252":0,"253":0,"256":0,"257":0,"258":0,"261":0,"269":0,"279":0,"281":0,"282":0,"284":0,"285":0,"295":0,"298":0,"299":0,"300":0,"302":0,"303":0,"305":0,"307":0,"308":0,"310":0,"320":0,"321":0,"322":0,"324":0,"339":0,"340":0,"341":0,"342":0,"343":0,"346":0,"361":0,"363":0,"364":0,"365":0,"366":0,"368":0,"371":0,"375":0,"392":0,"429":0,"438":0,"439":0,"440":0,"444":0,"445":0,"446":0,"447":0,"448":0,"449":0,"451":0,"453":0,"456":0,"457":0,"459":0,"462":0,"463":0,"465":0,"466":0,"468":0,"469":0,"470":0,"472":0,"482":0,"483":0,"496":0,"499":0,"500":0,"501":0,"502":0,"503":0,"504":0,"505":0,"520":0,"532":0,"538":0,"539":0,"540":0,"541":0,"543":0,"544":0,"545":0,"546":0,"548":0,"550":0,"560":0,"562":0,"563":0,"573":0,"577":0,"579":0,"580":0,"581":0,"583":0,"586":0,"595":0,"598":0,"599":0,"600":0,"602":0,"611":0,"621":0,"622":0,"623":0,"633":0,"634":0,"644":0,"647":0,"648":0,"650":0,"660":0,"663":0,"664":0,"666":0,"675":0,"676":0,"684":0,"696":0,"697":0,"698":0,"700":0,"701":0,"703":0,"716":0,"717":0,"718":0,"720":0,"816":0,"864":0,"866":0,"867":0,"868":0,"870":0,"887":0};
_yuitest_coverage["/build/gallery-flyweight-tree/gallery-flyweight-tree.js"].functions = {"cName:9":0,"FWMgr:36":0,"(anonymous 2):132":0,"_loadConfig:125":0,"(anonymous 3):144":0,"_initNodes:142":0,"_afterDomEvent:158":0,"_getTypeString:173":0,"_poolFetch:194":0,"_poolReturn:220":0,"_createNode:241":0,"getRoot:268":0,"(anonymous 4):281":0,"_getHTML:278":0,"scan:297":0,"_findNodeByElement:294":0,"_poolFetchFromEvent:319":0,"(anonymous 5):341":0,"loop:340":0,"_forSomeCfgNode:338":0,"(anonymous 6):364":0,"forOneLevel:363":0,"forSomeNodes:360":0,"(anonymous 7):448":0,"_getHTML:427":0,"_slideTo:481":0,"(anonymous 8):501":0,"forSomeChildren:495":0,"_expandedGetter:519":0,"_expandedSetter:531":0,"_loadDynamic:559":0,"_dynamicLoadReturn:572":0,"(anonymous 9):599":0,"_renderChildren:594":0,"hold:610":0,"release:620":0,"getParent:632":0,"getNextSibling:643":0,"getPreviousSibling:659":0,"toggle:674":0,"isRoot:683":0,"_getStateVal:695":0,"_setStateVal:715":0,"getter:815":0,"getter:863":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-flyweight-tree/gallery-flyweight-tree.js"].coveredLines = 188;
_yuitest_coverage["/build/gallery-flyweight-tree/gallery-flyweight-tree.js"].coveredFunctions = 46;
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 1);
YUI.add('gallery-flyweight-tree', function(Y) {

_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 3);
'use strict';
/*jslint white: true */
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 5);
var Lang = Y.Lang,
	DOT = '.',
	DEFAULT_POOL = '_default',
	getCName = Y.ClassNameManager.getClassName,
	cName = function (name) {
		_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "cName", 9);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 10);
return getCName('flyweight-tree-node', name);
	},
	CNAME_NODE = cName(''),
	CNAME_CHILDREN = cName('children'),
	CNAME_COLLAPSED = cName('collapsed'),
	CNAME_EXPANDED = cName('expanded'),
	CNAME_NOCHILDREN = cName('no-children'),
	CNAME_FIRSTCHILD = cName('first-child'),
	CNAME_LASTCHILD = cName('last-child'),
	CNAME_LOADING = cName('loading'),
	BYPASS_PROXY = "_bypassProxy",
	VALUE = 'value',
	YArray = Y.Array,
	FWMgr,
	FWNode;

/**
* @module gallery-flyweight-tree
*
*/

/**
 * Extension to handle its child nodes by using the flyweight pattern.
 * @class FlyweightTreeManager
 * @constructor
 */
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 36);
FWMgr = function () {
	_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "FWMgr", 36);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 37);
this._pool = {};
	_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 38);
this._initialValues = {};
};

_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 41);
FWMgr.ATTRS = {
	/**
	 * Default object type of the child nodes if no explicit type is given in the configuration tree.
	 * It can be specified as an object reference, these two are equivalent: `Y.FWTreeNode` or  `'FWTreeNode'`.  
	 * 
	 * @attribute defaultType
	 * @type {String | Object}
	 * @default 'FlyweightTreeNode'
	 */
	defaultType: {
		value: 'FlyweightTreeNode'			
	},
	/**
	 * Function used to load the nodes dynamically.
	 * Function will run in the scope of the FlyweightTreeManager instance and will
	 * receive:
	 * 
	 * * node {FlyweightTreeNode} reference to the parent of the children to be loaded.
	 * * callback {Function} function to call with the configuration info for the children.
	 * 
	 * The function shall fetch the nodes and create a configuration object 
	 * much like the one a whole tree might receive.  
	 * It is not limited to just one level of nodes, it might contain children elements as well.
	 * When the data is processed, it should call the callback with the configuration object.
	 * The function is responsible of handling any errors.
	 * If the the callback is called with no arguments, the parent node will be marked as having no children.
	 * @attribute dynamicLoader
	 * @type {Function}
	 * @default null
	 */
	dynamicLoader: {
		validator: Lang.isFunction,
		value: null
	}
};


_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 78);
FWMgr.prototype = {
	/**
	 * Clone of the configuration tree.
	 * The FlyweightTreeNode instances will use the nodes in this tree as the storage for their state.
	 * @property _tree
	 * @type Object
	 * @private
	 */
	_tree: null,
	/**
	 * Pool of FlyweightTreeNode instances to use and reuse by the manager.  
	 * It contains a hash of arrays indexed by the node type. 
	 * Each array contains a series of FlyweightTreeNode subclasses of the corresponding type.
	 * @property _pool
	 * @type {Object}
	 * @private
	 */
	_pool: null,
	/**
	 * List of dom events to be listened for at the outer contained and fired again
	 * at the node once positioned over the source node.
	 * @property _domEvents
	 * @type Array of strings
	 * @protected
	 * @default null
	 */
	_domEvents: null,
	
	/**
	 * Method to load the configuration tree.
	 * This is not done in the constructor so as to allow the subclass 
	 * to process the tree definition anyway it wants, adding defaults and such
	 * and to name the tree whatever is suitable.
	 * For TreeView, the configuration property is named `tree`, for a form, it is named `form`.
	 * It also sets initial values for some default properties such as `parent` references and `id` for all nodes.
	 * @method _loadConfig
	 * @param tree {Array} Configuration for the first level of nodes. 
	 * Contains objects with the following attributes:
	 * @param tree.label {String} Text or HTML markup to be shown in the node
	 * @param [tree.expanded=true] {Boolean} Whether the children of this node should be visible.
	 * @param [tree.children] {Array} Further definitions for the children of this node
	 * @param [tree.type=FWTreeNode] {FWTreeNode | String} Class used to create instances for this node.  
	 * It can be a reference to an object or a name that can be resolved as `Y[name]`.
	 * @param [tree.id=Y.guid()] {String} Identifier to assign to the DOM element containing this node.
	 * @param [tree.template] {String} Template for this particular node. 
	 * @protected
	 */
	_loadConfig: function (tree) {
		_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_loadConfig", 125);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 126);
var self = this;
		_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 127);
self._tree = {
			children: Y.clone(tree)
		};
		_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 130);
self._initNodes(this._tree);
		_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 131);
if (self._domEvents) {
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 132);
Y.Array.each(self._domEvents, function (event) {
				_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "(anonymous 2)", 132);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 133);
self.after(event, self._afterDomEvent, self);
			});
		}
	},
	/** Initializes the node configuration with default values and management info.
	 * @method _initNodes
	 * @param parent {Object} Parent of the nodes to be set
	 * @private
	 */
	_initNodes: function (parent) {
		_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_initNodes", 142);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 143);
var self = this;
		_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 144);
Y.Array.each(parent.children, function (child) {
			_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "(anonymous 3)", 144);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 145);
child._parent = parent;
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 146);
child.id = child.id || Y.guid();
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 147);
self._initNodes(child);
		});
	},

	/** Generic event listener for DOM events listed in the {{#crossLink "_domEvents"}}{{/crossLink}} array.
	 *  It will locate the node that caused the event, slide a suitable instance on it and fire the
	 *  same event on that node.
	 *  @method _afterEvent
	 *  @param ev {EventFacade} Event facade as produced by the event
	 *  @private
	 */
	_afterDomEvent: function (ev) {
		_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_afterDomEvent", 158);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 159);
var node = this._poolFetchFromEvent(ev);
		_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 160);
if (node) {
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 161);
node.fire(ev.type.split(':')[1], {domEvent:ev.domEvent});
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 162);
this._poolReturn(node);			
		}
	},
	/**
	 * Returns a string identifying the type of the object to handle the node
	 * or null if type was not a FlyweightNode instance.
	 * @method _getTypeString
	 * @param node {Object} Node in the tree configuration
	 * @return {String} type of node.
	 * @private
	 */
	_getTypeString: function (node) {
		_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_getTypeString", 173);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 174);
var type = node.type || DEFAULT_POOL;
		_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 175);
if (!Lang.isString(type)) {
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 176);
if (Lang.isObject(type)) {
				_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 177);
type = type.NAME;
			} else {
				_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 179);
throw "Node contains unknown type";
			}
		}
		_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 182);
return type;
	},
	/**
	 * Pulls from the pool an instance of the type declared in the given node
	 * and slides it over that node.
	 * If there are no instances of the given type in the pool, a new one will be created via {{#crossLink "_createNode"}}{{/crossLink}}
	 * If an instance is held (see: {{#crossLink "FlyweightTreeNode/hold"}}{{/crossLink}}), it will be returned instead.
	 * @method _poolFetch
	 * @param node {Object} reference to a node within the configuration tree
	 * @return {FlyweightTreeNode} Usually a subclass of FlyweightTreeNode positioned over the given node
	 * @protected
	 */
	_poolFetch: function(node) {
		_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_poolFetch", 194);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 195);
var pool,
			fwNode = node._held,
			type = this._getTypeString(node);
			
		_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 199);
if (fwNode) {
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 200);
return fwNode;
		}
		_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 202);
pool = this._pool[type];
		_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 203);
if (pool === undefined) {
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 204);
pool = this._pool[type] = [];
		}
		_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 206);
if (pool.length) {
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 207);
fwNode = pool.pop();
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 208);
fwNode._slideTo(node);
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 209);
return fwNode;
		}
		_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 211);
return this._createNode(node);
	},
	/**
	 * Returns the FlyweightTreeNode instance to the pool.
	 * Instances held (see: {{#crossLink "FlyweightTreeNode/hold"}}{{/crossLink}}) are never returned.
	 * @method _poolReturn
	 * @param fwNode {FlyweightTreeNode} Instance to return.
	 * @protected
	 */
	_poolReturn: function (fwNode) {
		_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_poolReturn", 220);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 221);
if (fwNode._node._held) {
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 222);
return;
		}
		_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 224);
var pool,
			type = this._getTypeString(fwNode._node);
		_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 226);
pool = this._pool[type];
		_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 227);
if (pool) {
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 228);
pool.push(fwNode);
		}
		
	},
	/**
	 * Returns a new instance of the type given in node or the 
	 * {{#crossLink "defaultType"}}{{/crossLink}} if none specified
	 * and slides it on top of the node provided.
	 * @method _createNode
	 * @param node {Object} reference to a node within the configuration tree
	 * @return {FlyweightTreeNode} Instance of the corresponding subclass of FlyweightTreeNode
	 * @protected
	 */
	_createNode: function (node) {
		_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_createNode", 241);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 242);
var newNode,
			Type = node.type || this.get('defaultType');
		_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 244);
if (Lang.isString(Type)) {
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 245);
Type = Y[Type];
		}
		_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 247);
if (Type) {
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 248);
newNode = new Type();
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 249);
if (newNode instanceof Y.FlyweightTreeNode) {
				// I need to do this otherwise Attribute will initialize 
				// the real node with default values when activating a lazyAdd attribute.
				_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 252);
newNode._slideTo({});
				_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 253);
Y.Array.each(Y.Object.keys(newNode._state.data), newNode._addLazyAttr, newNode);
				// newNode.getAttrs();
				// That's it (see above)
				_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 256);
newNode._root =  this;
				_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 257);
newNode._slideTo(node);
				_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 258);
return newNode;
			}
		}
		_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 261);
return null;
	},
	/**
	 * Returns an instance of Flyweight node positioned over the root
	 * @method getRoot
	 * @return {FlyweightTreeNode} 
	 */
	getRoot: function () {
		_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "getRoot", 268);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 269);
return this._poolFetch(this._tree);
	},
	/**
	 * Returns a string with the markup for the whole tree. 
	 * A subclass might opt to produce markup for those parts visible. (lazy rendering)
	 * @method _getHTML
	 * @return {String} HTML for this widget
	 * @protected
	 */
	_getHTML: function () {
		_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_getHTML", 278);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 279);
var s = '',
			root = this.getRoot();
		_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 281);
root.forSomeChildren( function (fwNode, index, array) {
			_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "(anonymous 4)", 281);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 282);
s += fwNode._getHTML(index, array.length, 0);
		});
		_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 284);
this._poolReturn(root);
		_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 285);
return s;
	},
	/**
	 * Locates a node in the tree by the element that represents it.
	 * @method _findNodeByElement
	 * @param el {Node} Any element belonging to the tree
	 * @return {Object} Node that produced the markup for that element or null if not found
	 * @protected
	 */
	_findNodeByElement: function(el) {
		_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_findNodeByElement", 294);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 295);
var id = el.ancestor(DOT + FWNode.CNAME_NODE, true).get('id'),
			found = null,
			scan = function (node) {
				_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "scan", 297);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 298);
if (node.id === id) {
					_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 299);
found = node;
					_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 300);
return true;
				}
				_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 302);
if (node.children) {
					_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 303);
return Y.Array.some(node.children, scan);
				}
				_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 305);
return false;
			};
		_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 307);
if (scan(this._tree)) {
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 308);
return found;
		}
		_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 310);
return null;
	},
	/**
	 * Returns a FlyweightTreeNode instance from the pool, positioned over the node whose markup generated some event.
	 * @method _poolFetchFromEvent
	 * @param ev {EventFacade}
	 * @return {FlyweightTreeNode} The FlyweightTreeNode instance or null if not found.
	 * @private
	 */
	_poolFetchFromEvent: function (ev) {
		_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_poolFetchFromEvent", 319);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 320);
var found = this._findNodeByElement(ev.domEvent.target);
		_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 321);
if (found) {
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 322);
return this._poolFetch(found);
		}
		_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 324);
return null;			
	},
	/**
	 * Traverses the whole configuration tree, calling a given function for each node.
	 * If the function returns true, the traversing will terminate.
	 * @method _forSomeCfgNode
	 * @param fn {Function} Function to call on each configuration node
	 *		@param fn.cfgNode {Object} node in the configuratino tree
	 *		@param fn.depth {Integer} depth of this node within the tee
	 *		@param fn.index {Integer} index of this node within the array of its siblings
	 * @param scope {Object} scope to run the function in, defaults to this.
	 * @return true if any of the function calls returned true (the traversal was terminated earlier)
	 * @protected
	 */
	_forSomeCfgNode: function(fn, scope) {
		_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_forSomeCfgNode", 338);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 339);
scope = scope || this;
		_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 340);
var loop = function(cfgNode, depth) {
			_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "loop", 340);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 341);
return Y.Array.some(cfgNode.children || [], function(childNode, index) {
				_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "(anonymous 5)", 341);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 342);
fn.call(scope, childNode,depth, index);
				_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 343);
return loop(childNode,depth + 1);
			});
		};
		_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 346);
return loop(this._tree, 0);
	},
	/**
	 * Executes the given function over all the nodes in the tree or until the function returns true.
	 * If dynamic loading is enabled, it will not run over nodes not yet loaded.
	 * @method forSomeNodes
	 * @param fn {function} function to execute on each node.  It will receive:
	 *	@param fn.node {FlyweightTreeNode} node being visited.
	 *	@param fn.depth {Integer} depth from the root. The root node is level zero and it is not traversed.
	 *	@param fn.index {Integer} position of this node within its branch
	 *	@param fn.array {Array} array containing itself and its siblings
	 * @param scope {Object} Scope to run the function in.  Defaults to the FlyweightTreeManager instance.
	 * @return {Boolean} true if any function calls returned true (the traversal was interrupted)
	 */
	forSomeNodes: function (fn, scope) {
		_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "forSomeNodes", 360);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 361);
scope = scope || this;
		
		_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 363);
var forOneLevel = function (node, depth) {
			_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "forOneLevel", 363);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 364);
node.forSomeChildren(function (node, index, array) {
				_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "(anonymous 6)", 364);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 365);
if (fn.call(scope,node, depth, index, array) === true) {
					_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 366);
return true;
				}
				_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 368);
return forOneLevel(node, depth+1);
			});
		};
		_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 371);
return forOneLevel(this.getRoot(), 1);
	}
};

_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 375);
Y.FlyweightTreeManager = FWMgr;
/**
* An implementation of the flyweight pattern.  
* This object can be slid on top of a literal object containing the definition 
* of a tree and will take its state from that node it is slid upon.
* It relies for most of its functionality on the flyweight manager object,
* which contains most of the code.
* @module gallery-flyweight-tree
*/

/**
* An implementation of the flyweight pattern.  This class should not be instantiated directly.
* Instances of this class can be requested from the flyweight manager class
* @class FlyweightTreeNode
* @extends Base
* @constructor  Do not instantiate directly.
*/
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 392);
FWNode = Y.Base.create(
	'flyweight-tree-node',
	Y.Base,
	[],
	{
		/**
		 * Reference to the node in the configuration tree it has been slid over.
		 * @property _node
		 * @type {Object}
		 * @private
		 **/
		_node:null,
		/**
		 * Reference to the FlyweightTreeManager instance this node belongs to.
		 * It is set by the root and should be considered read-only.
		 * @property _root
		 * @type FlyweightTreeManager
		 * @private
		 */
		_root: null,
		/**
		 * Returns a string with the markup for this node along that of its children
		 * produced from its attributes rendered
		 * via the first template string it finds in these locations:
		 *
		 * * It's own {{#crossLink "template"}}{{/crossLink}} configuration attribute
		 * * The static {{#crossLink "FlyweightTreeNode/TEMPLATE"}}{{/crossLink}} class property
		 *
		 * @method _getHTML
		 * @param index {Integer} index of this node within the array of siblings
		 * @param nSiblings {Integer} number of siblings including this node
		 * @param depth {Integer} number of levels to the root
		 * @return {String} markup generated by this node
		 * @protected
		 */
		_getHTML: function(index, nSiblings, depth) {
			// assumes that if you asked for the HTML it is because you are rendering it
			_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_getHTML", 427);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 429);
var self = this,
				node = this._node,
				attrs = this.getAttrs(),
				s = '', 
				templ = node.template,
				childCount = node.children && node.children.length,
				nodeClasses = [CNAME_NODE],
				superConstructor = this.constructor;
				
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 438);
while (!templ) {
				_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 439);
templ = superConstructor.TEMPLATE;
				_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 440);
superConstructor = superConstructor.superclass.constructor;
				
			}

			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 444);
node._rendered = true;
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 445);
if (childCount) {
				_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 446);
if (attrs.expanded) {
					_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 447);
node._childrenRendered = true;
					_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 448);
this.forSomeChildren( function (fwNode, index, array) {
						_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "(anonymous 7)", 448);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 449);
s += fwNode._getHTML(index, array.length, depth+1);
					});
					_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 451);
nodeClasses.push(CNAME_EXPANDED);
				} else {
					_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 453);
nodeClasses.push(CNAME_COLLAPSED);
				}
			} else {
				_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 456);
if (this._root.get('dynamicLoader') && !node.isLeaf) {
					_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 457);
nodeClasses.push(CNAME_COLLAPSED);
				} else {
					_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 459);
nodeClasses.push(CNAME_NOCHILDREN);
				}
			}
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 462);
if (index === 0) {
				_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 463);
nodeClasses.push(CNAME_FIRSTCHILD);
			} 
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 465);
if (index === nSiblings - 1) {
				_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 466);
nodeClasses.push(CNAME_LASTCHILD);
			}
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 468);
attrs.children = s;
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 469);
attrs.cname_node = nodeClasses.join(' ');
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 470);
attrs.cname_children = CNAME_CHILDREN;

			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 472);
return Lang.sub(templ, attrs);

		},
		/**
		 * Method to slide this instance on top of another node in the configuration object
		 * @method _slideTo
		 * @param node {Object} node in the underlying configuration tree to slide this object on top of.
		 * @private
		 */
		_slideTo: function (node) {
			_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_slideTo", 481);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 482);
this._node = node;
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 483);
this._stateProxy = node;
		},
		/**
		 * Executes the given function on each of the child nodes of this node.
		 * @method forSomeChildren
		 * @param fn {Function} Function to be executed on each node
		 *		@param fn.child {FlyweightTreeNode} Instance of a suitable subclass of FlyweightTreeNode, 
		 *		positioned on top of the child node
		 *		@param fn.index {Integer} Index of this child within the array of children
		 *		@param fn.array {Array} array containing itself and its siblings
		 * @param scope {object} The falue of this for the function.  Defaults to the parent.
		**/
		forSomeChildren: function(fn, scope) {
			_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "forSomeChildren", 495);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 496);
var root = this._root,
				children = this._node.children,
				child, ret;
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 499);
scope = scope || this;
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 500);
if (children && children.length) {
				_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 501);
YArray.some(children, function (node, index, array) {
					_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "(anonymous 8)", 501);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 502);
child = root._poolFetch(node);
					_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 503);
ret = fn.call(scope, child, index, array);
					_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 504);
root._poolReturn(child);
					_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 505);
return ret;
				});
			}
		},
		/**
		 * Getter for the expanded configuration attribute.
		 * It is meant to be overriden by the developer.
		 * The supplied version defaults to true if the expanded property 
		 * is not set in the underlying configuration tree.
		 * It can be overriden to default to false.
		 * @method _expandedGetter
		 * @return {Boolean} The expanded state of the node.
		 * @protected
		 */
		_expandedGetter: function () {
			_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_expandedGetter", 519);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 520);
return this._node.expanded !== false;
		},
		/**
		 * Setter for the expanded configuration attribute.
		 * It renders the child nodes if this branch has never been expanded.
		 * Then sets the className on the node to the static constants 
		 * CNAME_COLLAPSED or CNAME_EXPANDED from Y.FlyweightTreeManager
		 * @method _expandedSetter
		 * @param value {Boolean} new value for the expanded attribute
		 * @private
		 */
		_expandedSetter: function (value) {
			_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_expandedSetter", 531);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 532);
var self = this,
				node = self._node,
				root = self._root,
				el = Y.one('#' + node.id),
				dynLoader = root.get('dynamicLoader');
				
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 538);
node.expanded = value = !!value;
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 539);
if (dynLoader && !node.isLeaf && (!node.children  || !node.children.length)) {
				_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 540);
this._loadDynamic();
				_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 541);
return;
			}
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 543);
if (node.children && node.children.length) {
				_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 544);
if (value) {
					_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 545);
if (!node._childrenRendered) {
						_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 546);
self._renderChildren();
					}
					_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 548);
el.replaceClass(CNAME_COLLAPSED, CNAME_EXPANDED);
				} else {
					_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 550);
el.replaceClass(CNAME_EXPANDED, CNAME_COLLAPSED);
				}
			}
		},
		/**
		 * Triggers the dynamic loading of children for this node.
		 * @method _loadDynamic
		 * @private
		 */
		_loadDynamic: function () {
			_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_loadDynamic", 559);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 560);
var self = this,
				root = self._root;
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 562);
Y.one('#' + this.get('id')).replaceClass(CNAME_COLLAPSED, CNAME_LOADING);
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 563);
root.get('dynamicLoader').call(root, self, Y.bind(self._dynamicLoadReturn, self));
			
		},
		/**
		 * Callback for the dynamicLoader method.
		 * @method _dynamicLoadReturn
		 * @param response {Array} array of child nodes 
		 * @private
		 */
		_dynamicLoadReturn: function (response) {
			_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_dynamicLoadReturn", 572);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 573);
var self = this,
				node = self._node,
				root = self._root;

			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 577);
if (response) {

				_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 579);
node.children = response;
				_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 580);
root._initNodes(node);
				_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 581);
self._renderChildren();
			} else {
				_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 583);
node.isLeaf = true;
			}
			// isLeaf might have been set in the response, not just in the line above.
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 586);
Y.one('#' + node.id).replaceClass(CNAME_LOADING, (node.isLeaf?CNAME_NOCHILDREN:CNAME_EXPANDED));
		},
		/**
		 * Renders the children of this node.  
		 * It the children had been rendered, they will be replaced.
		 * @method _renderChildren
		 * @private
		 */
		_renderChildren: function () {
			_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_renderChildren", 594);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 595);
var s = '',
				node = this._node,
				depth = this.get('depth');
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 598);
node._childrenRendered = true;
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 599);
this.forSomeChildren(function (fwNode, index, array) {
				_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "(anonymous 9)", 599);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 600);
s += fwNode._getHTML(index, array.length, depth + 1);
			});
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 602);
Y.one('#' + node.id + ' .' + CNAME_CHILDREN).setContent(s);
		},
		/**
		 * Prevents this instance from being returned to the pool and reused.
		 * Remember to {{#crossLink "release"}}{{/crossLink}} this instance when no longer needed.
		 * @method hold
		 * @chainable
		 */
		hold: function () {
			_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "hold", 610);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 611);
return (this._node._held = this);
		},
		/**
		 * Allows this instance to be returned to the pool and reused.
		 * 
		 * __Important__: This instance should not be used after being released
		 * @method release
		 * @chainable
		 */
		release: function () {
			_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "release", 620);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 621);
this._node._held = null;
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 622);
this._root._poolReturn(this);
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 623);
return this;
		},
		/**
		 * Returns the parent node for this node or null if none exists.
		 * The copy is not on {{#crossLink "hold"}}{{/crossLink}}.  
		 * Remember to release the copy to the pool when done.
		 * @method getParent
		 * @return FlyweightTreeNode
		 */
		getParent: function() {
			_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "getParent", 632);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 633);
var node = this._node._parent;
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 634);
return (node?this._root._poolFetch(node):null);
		},
		/**
		 * Returns the next sibling node for this node or null if none exists.
		 * The copy is not on {{#crossLink "hold"}}{{/crossLink}}.  
		 * Remember to release the copy to the pool when done.
		 * @method getNextSibling
		 * @return FlyweightTreeNode
		 */
		getNextSibling: function() {
			_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "getNextSibling", 643);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 644);
var parent = this._node._parent,
				siblings = (parent && parent.children) || [],
				index = siblings.indexOf(this) + 1;
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 647);
if (index === 0 || index > siblings.length) {
				_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 648);
return null;
			}
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 650);
return this._root._poolFetch(siblings[index]);
		},
		/**
		 * Returns the previous sibling node for this node or null if none exists.
		 * The copy is not on {{#crossLink "hold"}}{{/crossLink}}.  
		 * Remember to release the copy to the pool when done.
		 * @method getPreviousSibling
		 * @return FlyweightTreeNode
		 */
		getPreviousSibling: function() {
			_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "getPreviousSibling", 659);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 660);
var parent = this._node._parent,
				siblings = (parent && parent.children) || [],
				index = siblings.indexOf(this) - 1;
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 663);
if (index < 0) {
				_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 664);
return null;
			}
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 666);
return this._root._poolFetch(siblings[index]);
		},
		
		/**
		 * Sugar method to toggle the expanded state of the node.
		 * @method toggle
		 * @chainable
		 */
		toggle: function() {
			_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "toggle", 674);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 675);
this.set('expanded', !this.get('expanded'));
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 676);
return this;
		},
		/**
		 * Returns true if this node is the root node
		 * @method isRoot
		 * @return {Boolean} true if root node
		 */
		isRoot: function() {
			_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "isRoot", 683);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 684);
return this._root._tree === this._node;
		},
		/**
		* Gets the stored value for the attribute, from either the
		* internal state object, or the state proxy if it exits
		*
		* @method _getStateVal
		* @private
		* @param {String} name The name of the attribute
		* @return {Any} The stored value of the attribute
		*/
		_getStateVal : function(name) {
			_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_getStateVal", 695);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 696);
var node = this._node;
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 697);
if (this._state.get(name, BYPASS_PROXY) || !node) {
				_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 698);
return this._state.get(name, VALUE);
			}
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 700);
if (node.hasOwnProperty(name)) {
				_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 701);
return node[name];
			}
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 703);
return this._state.get(name, VALUE);
		},

		/**
		* Sets the stored value for the attribute, in either the
		* internal state object, or the state proxy if it exits
		*
		* @method _setStateVal
		* @private
		* @param {String} name The name of the attribute
		* @param {Any} value The value of the attribute
		*/
		_setStateVal : function(name, value) {
			_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "_setStateVal", 715);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 716);
var node = this._node;
			_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 717);
if (this._state.get(name, BYPASS_PROXY) || this._state.get(name, 'initializing') || !node) {
				_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 718);
this._state.add(name, VALUE, value);
			} else {
				_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 720);
node[name] = value;
			}
		}
	},
	{
		/**
		 * Template string to be used to render this node.
		 * It should be overriden by the subclass.
		 *    
		 * It contains the HTML markup for this node plus placeholders,
		 * enclosed in curly braces, that have access to any of the 
		 * configuration attributes of this node plus the following
		 * additional placeholders:
		 * 
		 * * children: The markup for the children of this node will be placed here
		 * * cname_node: The className for the HTML element enclosing this node.
		 *   The template should always use this className to help it locate the DOM element for this node.
		 * * cname_children: The className for the HTML element enclosing the children of this node.
		 * The template should always use this className to help it locate the DOM element that contains the children of this node.
		 * 
		 * The template should also add the `id` attribute to the DOM Element representing this node. 
		 * @property TEMPLATE
		 * @type {String}
		 * @default '<div id="{id}" class="{cname_node}"><div class="content">{label}</div><div class="{cname_children}">{children}</div></div>'
		 * @static
		 */
		TEMPLATE: '<div id="{id}" class="{cname_node}"><div class="content">{label}</div><div class="{cname_children}">{children}</div></div>',
		/**
		 * CCS className constant to use as the class name for the DOM element representing the node.
		 * @property CNAME_NODE
		 * @type String
		 * @static
		 */
		CNAME_NODE: CNAME_NODE,
		/**
		 * CCS className constant to use as the class name for the DOM element that will containe the children of this node.
		 * @property CNAME_CHILDREN
		 * @type String
		 * @static
		 */
		CNAME_CHILDREN: CNAME_CHILDREN,
		/**
		 * CCS className constant added to the DOM element for this node when its state is not expanded.
		 * @property CNAME_COLLAPSED
		 * @type String
		 * @static
		 */
		CNAME_COLLAPSED: CNAME_COLLAPSED,
		/**
		 * CCS className constant added to the DOM element for this node when its state is expanded.
		 * @property CNAME_EXPANDED
		 * @type String
		 * @static
		 */
		CNAME_EXPANDED: CNAME_EXPANDED,
		/**
		 * CCS className constant added to the DOM element for this node when it has no children.
		 * @property CNAME_NOCHILDREN
		 * @type String
		 * @static
		 */
		CNAME_NOCHILDREN: CNAME_NOCHILDREN,
		/**
		 * CCS className constant added to the DOM element for this node when it is the first in the group.
		 * @property CNAME_FIRSTCHILD
		 * @type String
		 * @static
		 */
		CNAME_FIRSTCHILD: CNAME_FIRSTCHILD,
		/**
		 * CCS className constant added to the DOM element for this node when it is the last in the group.
		 * @property CNAME_LASTCHILD
		 * @type String
		 * @static
		 */
		CNAME_LASTCHILD: CNAME_LASTCHILD,
		/**
		 * CCS className constant added to the DOM element for this node when dynamically loading its children.
		 * @property CNAME_LOADING
		 * @type String
		 * @static
		 */
		CNAME_LOADING: CNAME_LOADING,
		ATTRS: {
			/**
			 * Reference to the FlyweightTreeManager this node belongs to
			 * @attribute root
			 * @type {FlyweightTreeManager}
			 * @readOnly
			 * 
			 */

			root: {
				_bypassProxy: true,
				readOnly: true,
				getter: function() {
					_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "getter", 815);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 816);
return this._root;
				}
			},

			/**
			 * Template to use on this particular instance.  
			 * The renderer will default to the static TEMPLATE property of this class 
			 * (the preferred way) or the nodeTemplate configuration attribute of the root.
			 * See the TEMPLATE static property.
			 * @attribute template
			 * @type {String}
			 * @default undefined
			 */
			template: {
				validator: Lang.isString
			},
			/**
			 * Label for this node. Nodes usually have some textual content, this is the place for it.
			 * @attribute label
			 * @type {String}
			 * @default ''
			 */
			label: {
				validator: Lang.isString,
				value: ''
			},
			/**
			 * Id to assign to the DOM element that contains this node.  
			 * If none was supplied, it will generate one
			 * @attribute id
			 * @type {Identifier}
			 * @default guid()
			 * @readOnly
			 */
			id: {
				readOnly: true
			},
			/**
			 * Returns the depth of this node from the root.
			 * This is calculated on-the-fly.
			 * @attribute depth
			 * @type Integer
			 * @readOnly
			 */
			depth: {
				_bypassProxy: true,
				readOnly: true,
				getter: function () {
					_yuitest_coverfunc("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", "getter", 863);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 864);
var count = 0, 
						node = this._node;
					_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 866);
while (node._parent) {
						_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 867);
count += 1;
						_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 868);
node = node._parent;
					}
					_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 870);
return count-1;
				}
			},
			/**
			 * Expanded state of this node.
			 * @attribute expanded
			 * @type Boolean
			 * @default true
			 */
			expanded: {
				_bypassProxy: true,
				getter: '_expandedGetter',
				setter: '_expandedSetter'
			}
		}
	}
);
_yuitest_coverline("/build/gallery-flyweight-tree/gallery-flyweight-tree.js", 887);
Y.FlyweightTreeNode = FWNode;



}, 'gallery-2012.10.03-20-02' ,{requires:['base-base', 'base-build', 'classnamemanager'], skinnable:false});
