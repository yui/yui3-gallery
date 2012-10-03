/**
* @module gallery-flyweight-tree
*
*/

/**
 * Extension to handle its child nodes by using the flyweight pattern.
 * @class FlyweightTreeManager
 * @constructor
 */
FWMgr = function () {
	this._pool = {};
	this._initialValues = {};
};

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
		var self = this;
		self._tree = {
			children: Y.clone(tree)
		};
		self._initNodes(this._tree);
		if (self._domEvents) {
			Y.Array.each(self._domEvents, function (event) {
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
		var self = this;
		Y.Array.each(parent.children, function (child) {
			child._parent = parent;
			child.id = child.id || Y.guid();
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
		var node = this._poolFetchFromEvent(ev);
		if (node) {
			node.fire(ev.type.split(':')[1], {domEvent:ev.domEvent});
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
		var type = node.type || DEFAULT_POOL;
		if (!Lang.isString(type)) {
			if (Lang.isObject(type)) {
				type = type.NAME;
			} else {
				throw "Node contains unknown type";
			}
		}
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
		var pool,
			fwNode = node._held,
			type = this._getTypeString(node);
			
		if (fwNode) {
			return fwNode;
		}
		pool = this._pool[type];
		if (pool === undefined) {
			pool = this._pool[type] = [];
		}
		if (pool.length) {
			fwNode = pool.pop();
			fwNode._slideTo(node);
			return fwNode;
		}
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
		if (fwNode._node._held) {
			return;
		}
		var pool,
			type = this._getTypeString(fwNode._node);
		pool = this._pool[type];
		if (pool) {
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
		var newNode,
			Type = node.type || this.get('defaultType');
		if (Lang.isString(Type)) {
			Type = Y[Type];
		}
		if (Type) {
			newNode = new Type();
			if (newNode instanceof Y.FlyweightTreeNode) {
				// I need to do this otherwise Attribute will initialize 
				// the real node with default values when activating a lazyAdd attribute.
				newNode._slideTo({});
				Y.Array.each(Y.Object.keys(newNode._state.data), newNode._addLazyAttr, newNode);
				// newNode.getAttrs();
				// That's it (see above)
				newNode._root =  this;
				newNode._slideTo(node);
				return newNode;
			}
		}
		return null;
	},
	/**
	 * Returns an instance of Flyweight node positioned over the root
	 * @method getRoot
	 * @return {FlyweightTreeNode} 
	 */
	getRoot: function () {
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
		var s = '',
			root = this.getRoot();
		root.forSomeChildren( function (fwNode, index, array) {
			s += fwNode._getHTML(index, array.length, 0);
		});
		this._poolReturn(root);
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
		var id = el.ancestor(DOT + FWNode.CNAME_NODE, true).get('id'),
			found = null,
			scan = function (node) {
				if (node.id === id) {
					found = node;
					return true;
				}
				if (node.children) {
					return Y.Array.some(node.children, scan);
				}
				return false;
			};
		if (scan(this._tree)) {
			return found;
		}
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
		var found = this._findNodeByElement(ev.domEvent.target);
		if (found) {
			return this._poolFetch(found);
		}
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
		scope = scope || this;
		var loop = function(cfgNode, depth) {
			return Y.Array.some(cfgNode.children || [], function(childNode, index) {
				fn.call(scope, childNode,depth, index);
				return loop(childNode,depth + 1);
			});
		};
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
		scope = scope || this;
		
		var forOneLevel = function (node, depth) {
			node.forSomeChildren(function (node, index, array) {
				if (fn.call(scope,node, depth, index, array) === true) {
					return true;
				}
				return forOneLevel(node, depth+1);
			});
		};
		return forOneLevel(this.getRoot(), 1);
	}
};

Y.FlyweightTreeManager = FWMgr;
