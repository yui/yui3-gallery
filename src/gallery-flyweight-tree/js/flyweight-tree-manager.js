/**
 * Widget to handle its child nodes by using the flyweight pattern.
 *
 * The information for the tree is stored internally in a plain object without methods,
 * events or attributes.
 * This manager will position FlyweightTreeNode instances (or subclasses of it)
 * over these iNodes from a small pool of them, in order to save memory.
 *
 * The nodes on this configuration tree are referred to in this documentation as `iNodes`
 * for 'internal nodes', to tell them apart from the pooled FlyweightTreeNode instances
 * that will be used to manipulate them.  The FlyweightTreeNode instances will usually
 * be declared as `fwNodes` when confusion might arise.
 * If a variable or argument is not explicitly named `iNode` or a related name it is
 * FlyweightTreeNode instance.
 *
 * The developer should not be concerned about the iNodes,
 * except in the initial configuration tree.
 * If the developer finds anything that needs to be done through iNodes,
 * it is a bug and should be reported (thanks).
 * iNodes should be private.
 *
 * @class FlyweightTreeManager
 * @extends Widget
 * @constructor
 */

FWMgr = Y.Base.create(
    NAME,
    Y.Widget,
    [],
    {
        /**
         * Clone of the configuration tree.
         * The FlyweightTreeNode instances will use the iNodes (internal nodes) in this tree as the storage for their state.
         * @property _tree
         * @type Object
         * @private
         */
        _tree: null,
        /**
         * Pool of FlyweightTreeNode instances to use and reuse by the manager.
         * It contains a hash of arrays indexed by the iNode (internal node) type.
         * Each array contains a series of FlyweightTreeNode subclasses of the corresponding type.
         * @property _pool
         * @type {Object}
         * @private
         */
        _pool: null,
        /**
         * List of dom events to be listened for at the outer container and fired again
         * at the FlyweightTreeNode level once positioned over the source iNode.
         *
         * Since the node instances are not actually there, they can't listen to the events themselves
         * so the events listed here will serve to wake up those instances and get the event
         * as if they had been there all along.
         * @property _domEvents
         * @type Array of strings
         * @protected
         * @default null
         */
        _domEvents: null,
        /**
         * Reference to the element that has the focus or should have the focus
         * when this widget is active (ie, tabbed into).
         * Mostly used for WAI-ARIA support.
         * @property _focusedINode
         * @type FlyweightTreeNode
         * @private
         * @default null
         */
        _focusedINode: null,

        /**
         * Event handles of events subscribed to, to detach them on destroy
         * @property _eventHandles
         * @type Array of EventHandles
         * @private
         */
        _eventHandles: null,

        /**
         * Part of the Widget lifecycle.
         * @method initializer
         * @protected
         */
        initializer:function () {
            this._pool = {};
            this._eventHandles = [];
        },
        /**
         * Part of the lifecycle.  Destroys the pools.
         * @method destructor
         * @protected
         */
        destructor: function () {
            var pool = this._pool;
            Y.Object.each(pool, function (value, key) {
                YArray.each(value, function (fwNode) {
                    fwNode.destroy();
                });
                delete pool[key];
            });
            this._pool = null;
            YArray.each(this._eventHandles, function (evHandle) {
                evHandle.detach();
            });
            this._eventHandles = null;

        },
        /**
         * Method to load the configuration tree.
         * The nodes in this tree are copied into iNodes (internal nodes) for internal use.
         *
         * The initializer does not load the tree automatically so as to allow the subclass
         * of this manager
         * to process the tree definition anyway it wants, adding defaults and such
         * and to name the tree whatever is suitable.
         * For TreeView, the configuration property is named `tree`, for a form, it is named `form`.
         * It also sets initial values for some default properties such as `parent` references and `id` for all iNodes.
         * @method _loadConfig
         * @param tree {Array} Configuration for the first level of nodes.
         * Contains objects with the following attributes:
         * @param tree.label {String} Text or HTML markup to be shown in the node
         * @param [tree.expanded=true] {Boolean} Whether the children of this node should be visible.
         * @param [tree.children] {Array} Further definitions for the children of this node
         * @param [tree.type=FWTreeNode] {FWTreeNode | String} Class used to create instances for this iNode.
         * It can be a reference to an object or a name that can be resolved as `Y[name]`.
         * @param [tree.id=Y.guid()] {String} Identifier to assign to the DOM element containing the UI for this node.
         * @param [tree.template] {String} Template for this particular node.
         * @protected
         */
        _loadConfig: function (tree) {
            this._tree = {
                children: Y.clone(tree)
            };
            this._initNodes(this._tree);

        },
        /** Initializes the iNodes configuration with default values and management info.
         * @method _initNodes
         * @param parentINode {Object} Parent of the iNodes to be set
         * @protected
         */
        _initNodes: function (parentINode) {
            var self = this;
            YArray.each(parentINode.children, function (iNode, i) {
                if (Lang.isString(iNode)) {
                    iNode = {label: iNode};
                    parentINode.children[i] = iNode;
                }
                if (!self._focusedINode) {
                    self._focusedINode = iNode;
                }
                iNode._parent = parentINode;
                iNode.id = iNode.id || Y.guid();

                self._initNodes(iNode);
            });
        },
        /**
         * Widget lifecyle method.
         *
         * Gets the HTML markup for the visible nodes and inserts it into the contentbox.
         * @method renderUI
         * @protected
         */
        renderUI: function () {
            var root = this.getRoot();
            root._renderChildren(this.get(CBX));
            root.release();
        },
        /**
         * Initializes the events for its internal use and those requested in
         * the {{#crossLink "_domEvents"}}{{/crossLink}} array.
         * @method bindUI
         * @protected
         */
        bindUI: function() {
            var self = this;

            self._eventHandles.push(self.after('focus', self._afterFocus));
            if (self._domEvents) {
                YArray.each(self._domEvents, function (event) {
                    self._eventHandles.push(self.after(event, self._afterDomEvent, self));
                });
            }
        },
        /**
         * Overrides the native `fire` method so that for DOM events,
         * it will fetch from the pool the fwNode that should have received
         * the event and add it to the event facade as property `node`.
         *
         * @method fire
         * @param type {String|Object} The type of the event, or an object that contains
         * a 'type' property.
         * @param arguments {Object*} an arbitrary set of parameters to pass to
         * the handler. If the first of these is an object literal and the event is
         * configured to emit an event facade, the event facade will replace that
         * parameter after the properties the object literal contains are copied to
         * the event facade.
         * @return {Boolean} false if the event was halted.
         */
        fire: function (type, ev) {
            var ret, self = this;
            if (ev && ev.domEvent) {
                ev.node = self._poolFetchFromEvent(ev);
                ret = FWMgr.superclass.fire.call(self, type, ev);
                if (ev.node) {
                    self._poolReturn(ev.node);
                }
                return ret;
            }
            return FWMgr.superclass.fire.apply(self, arguments);
        },
        /**
         * Expands all the nodes of the tree.
         *
         * It will only expand existing nodes.  If there is a {{#crossLink "dynamicLoader:attribute"}}{{/crossLink}} configured
         * it will not expand those since that might lead to extreme situations.
         * @method expandAll
         * @chainable
         */
        expandAll: function () {
            this.forSomeNodes(function(node) {
                node.set(EXPANDED, true);
            });
        },
        /**
         * Collapses all the nodes of the tree.
         *
         * @method collapseAll
         * @chainable
         */
        collapseAll: function () {
            this.forSomeNodes(function(node) {
                node.set(EXPANDED, false);
            });
        },
        /**
         * Finds a node by attribute value or by condition.
         * If the first argument is a string, it must be the name of an attribute
         * and the second argument the value sought.
         * If the first argument is a function, it should return true on finding
         * the node sought. The function will receive a node reference.
         * It returns the node sought or null.
         * The node is on hold and it must be released once used.
         * @method getNodeBy
         * @param attr {String or Function} Either an attribute name or a matching function
         * @param value {Any} if the first argument is a string, the second is the value to match
         * @return {FWNode or null} The node found or null
         */
        getNodeBy: function (attr, value) {
            var fn, found = null;
            switch (Lang.type(attr)) {
                case 'function':
                    fn = attr;
                    break;
                case 'string':
                    fn = function (node) {
                        return node.get(attr) === value;
                    };
                    break;
                default:
                    return null;
            }
            this.forSomeNodes(function (node) {
                if (fn(node)) {
                    found = node;
                    found.hold();
                    return true;
                }
                return false;
            });
            return found;
        },

        /** Generic event listener for DOM events listed in the {{#crossLink "_domEvents"}}{{/crossLink}} array.
         *  It will locate the iNode represented by the UI elements that received the event,
         *  slide a suitable instance on it and fire the same event on that node.
         *  @method _afterEvent
         *  @param ev {EventFacade} Event facade as produced by the event
         *  @private
         */
        _afterDomEvent: function(ev) {
            var fwNode =  ev.node;
            if (fwNode) {
                fwNode.fire(ev.type.split(':')[1], {domEvent:ev.domEvent});
            }
        },
        /**
         * Returns a string identifying the type of the object to handle the iNode
         * or null if type was not a FlyweightNode instance.
         * @method _getTypeString
         * @param iNode {Object} Internal node in the tree configuration
         * @return {String} type of iNode.
         * @private
         */
        _getTypeString: function (iNode) {
            var type = iNode.type;
            if (!type) {
                return DEFAULT_POOL;
            }
            if (typeof type === 'string') {
                if (!Y[type]) {
                    throw new TypeError('Missing node class: Y.' + type );
                }
                type = Y[type];
            }
            type = type.NAME;
            if (!type) {
                throw new TypeError("Node contains unknown type");
            }
            return type;
        },
        /**
         * Pulls from the pool an instance of the type declared in the given iNode
         * and slides it over that iNode.
         * If there are no instances of the given type in the pool, a new one will be created via {{#crossLink "_createNode"}}{{/crossLink}}
         * If an instance is held (see: {{#crossLink "FlyweightTreeNode/hold"}}{{/crossLink}}), it will be returned instead.
         * @method _poolFetch
         * @param iNode {Object} reference to a iNode within the configuration tree
         * @return {FlyweightTreeNode} Usually a subclass of FlyweightTreeNode positioned over the given iNode
         * @protected
         */
        _poolFetch: function(iNode) {

            var pool,
                fwNode = iNode._nodeInstance,
                type = this._getTypeString(iNode);

            if (!fwNode) {
                pool = this._pool[type];
                if (pool === undefined) {
                    pool = this._pool[type] = [];
                }
                if (pool.length) {
                    fwNode = pool.pop();
                    fwNode._slideTo(iNode);
                } else {
                    fwNode = this._createNode(iNode);
                }
            }
            iNode._refCount = (iNode._refCount || 0) + 1;
            return fwNode;
        },
        /**
         * Returns the FlyweightTreeNode instance to the pool.
         * Instances held (see: {{#crossLink "FlyweightTreeNode/hold"}}{{/crossLink}}) are never returned.
         * @method _poolReturn
         * @param fwNode {FlyweightTreeNode} Instance to return.
         * @protected
         */
        _poolReturn: function (fwNode) {
            var pool,
                iNode = fwNode._iNode,
                type = this._getTypeString(iNode);

            iNode._refCount -= 1 ;
            if (iNode._refCount) {
                return;
            }
            fwNode._iNode = null;
            iNode._nodeInstance = null;
            pool = this._pool[type];
            if (pool) {
                pool.push(fwNode);
            }
        },
        /**
         * Returns a new instance of the type given in iNode or the
         * {{#crossLink "defaultType"}}{{/crossLink}} if none specified
         * and slides it on top of the iNode provided.
         * @method _createNode
         * @param iNode {Object} reference to a iNode within the configuration tree
         * @return {FlyweightTreeNode} Instance of the corresponding subclass of FlyweightTreeNode
         * @protected
         */
        _createNode: function (iNode) {
            var newNode,
                Type = iNode.type || this.get('defaultType');
            if (Lang.isString(Type)) {
                Type = Y[Type];
            }
            if (Type) {
                newNode = new Type({root:this});
                if (newNode instanceof Y.FlyweightTreeNode) {
                    // I need to do this otherwise Attribute will initialize
                    // the real iNode with default values when activating a lazyAdd attribute.
                    newNode._slideTo({});
                    YArray.each(Y.Object.keys(newNode._state.data), function (attr) {
                        newNode._addLazyAttr(attr);
                    });
                    // newNode.getAttrs();
                    // That's it (see above)
                    newNode._root =  this;
                    newNode._slideTo(iNode);
                    return newNode;
                }
            }
            return null;
        },
        /**
         * Returns an instance of Flyweight node positioned over the root.
         * The reference is placed on hold and should be released once used.
         * @method getRoot
         * @return {FlyweightTreeNode}
         */
        getRoot: function () {
            return this._poolFetch(this._tree).hold();
        },
        /**
         * Locates a iNode in the tree by the element that represents it.
         * @method _findINodeByElement
         * @param el {Node} Any element belonging to the tree
         * @return {Object} iNode that produced the markup for that element or null if not found
         * @protected
         */
        _findINodeByElement: function(el) {
            var id,
                found = null,
                scan = function (iNode) {
                    if (iNode.id === id) {
                        found = iNode;
                        return true;
                    }
                    if (iNode.children) {
                        return YArray.some(iNode.children, scan);
                    }
                    return false;
                };
            el = el.ancestor(DOT + FWNode.CNAMES.CNAME_NODE, true);
            if (el) {
                id = el.get('id');

                if (scan(this._tree)) {
                    return found;
                }
            }
            return null;
        },
        /**
         * Returns a FlyweightTreeNode instance from the pool, positioned over the iNode whose markup generated some event.
         * @method _poolFetchFromEvent
         * @param ev {EventFacade}
         * @return {FlyweightTreeNode} The FlyweightTreeNode instance or null if not found.
         * @private
         */
        _poolFetchFromEvent: function (ev) {
            var found = this._findINodeByElement(ev.domEvent.target);
            if (found) {
                return this._poolFetch(found);
            }
            return null;
        },
        /**
         * Traverses the whole configuration tree, calling a given function for each iNode.
         * If the function returns true, the traversing will terminate.
         * @method _forSomeINode
         * @param fn {Function} Function to call on each configuration iNode
         *        @param fn.iNode {Object} iNode in the configuration tree
         *        @param fn.depth {Integer} depth of this iNode within the tree
         *        @param fn.index {Integer} index of this iNode within the array of its siblings
         * @param scope {Object} scope to run the function in, defaults to `this`.
         * @return true if any of the function calls returned true (the traversal was terminated earlier)
         * @protected
         */
        _forSomeINode: function(fn, scope) {
            scope = scope || this;
            var loop = function(iNode, depth) {
                return YArray.some(iNode.children || [], function(childINode, index) {
                    if (fn.call(scope, childINode,depth, index)) {
                        return true;
                    }
                    return loop(childINode,depth + 1);
                });
            };
            return loop(this._tree, 0);
        },
        /**
         * Executes the given function over all the nodes in the tree or until the function returns true.
         * If dynamic loading is enabled, it will not run over nodes not yet loaded.
         * @method forSomeNodes
         * @param fn {function} function to execute on each node.  It will receive:
         *    @param fn.node {FlyweightTreeNode} node being visited.
         *    @param fn.depth {Integer} depth from the root. The root node is level zero and it is not traversed.
         *    @param fn.index {Integer} position of this node within its branch
         * @param scope {Object} Scope to run the function in.  Defaults to the FlyweightTreeManager instance.
         * @return {Boolean} true if any function calls returned true (the traversal was interrupted)
         */
        forSomeNodes: function (fn, scope) {
            scope = scope || this;

            var root = this.getRoot(),
                forOneLevel = function (fwNode, depth) {
                    fwNode.forSomeChildren(function (fwNode, index, array) {
                        if (fn.call(scope, fwNode, depth, index, array) === true) {
                            return true;
                        }
                        return forOneLevel(fwNode, depth + 1);
                    });
                },
                ret = forOneLevel(root, 0);
            root.release();
            return ret;
        },
        /**
         * Getter for the {{#crossLink "focusedNode:attribute"}}{{/crossLink}} attribute
         * @method _focusedNodeGetter
         * @return {FlyweightNode} Node that would have the focus if the widget is focused
         * @private
         */
        _focusedNodeGetter: function () {
            return this._poolFetch(this._focusedINode).hold();
        },
        /**
         * Setter for the {{#crossLink "focusedNode:attribute"}}{{/crossLink}} attribute
         * @method _focusedNodeSetter
         * @param value {FlyweightNode} Node to receive the focus.
         * @return {Object} iNode matching the focused node.
         * @private
         */
        _focusedNodeSetter: function (value) {
            if (!value || value instanceof Y.FlyweightTreeNode) {
                var newINode = (value?value._iNode:this._tree.children[0]);
                this._focusOnINode(newINode);
                return newINode;
            } else {
                return Y.Attribute.INVALID_VALUE;
            }
        },
        /**
         * Sets the focus on the given iNode
         * @method _focusOnINode
         * @param iNode {Object} iNode to receive the focus
         * @private
         */
        _focusOnINode: function (iNode) {
            var prevINode = this._focusedINode,
                el,
                self = this,
                expand = function (iNode) {
                    iNode = iNode._parent;
                    if (iNode && iNode._parent) {
                        expand(iNode);
                        self._poolReturn(self._poolFetch(iNode).set(EXPANDED, true));
                    }
                };

            if (iNode && iNode !== prevINode) {

                el = Y.one(HASH + prevINode.id + ' .' + FWNode.CNAMES.CNAME_CONTENT);
                el.blur();
                el.set(TABINDEX, -1);

                expand(iNode);

                el = Y.one(HASH + iNode.id + ' .' + FWNode.CNAMES.CNAME_CONTENT);
                el.focus();
                el.set(TABINDEX,0);

                self._focusedINode = iNode;

            }

        },
        /**
         * Setter for the {{#crossLink "dynamicLoader:attribute"}}{{/crossLink}} attribute.
         * It changes the expanded attribute to false on childless iNodes not marked with `isLeaf
         * since they can now be expanded.
         * @method
         * @param value {Function | null } Function to handle the loading of nodes on demand
         * @return {Function | null | INVALID_VALUE} function set or rejection
         * @private
         */
        _dynamicLoaderSetter: function (value) {
            if (!Lang.isFunction(value) &&  value !== null) {
                return Y.Attribute.INVALID_VALUE;
            }
            return value;
        }
    },
    {
        ATTRS: {
            /**
             * Default object type of the nodes if no explicit type is given in the configuration tree.
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
             *
             * This attribute should be set before the tree is rendered as childless nodes
             * render differently when there is a dynamic loader than when there isn't.
             * (childless nodes can be expanded when a dynamic loader is present and the UI should reflect that).
             * @attribute dynamicLoader
             * @type {Function or null}
             * @default null
             */
            dynamicLoader: {
                value: null,
                setter: '_dynamicLoaderSetter'
            },
            /**
             * Points to the node that currently has the focus.
             * If read, the node returned is placed on hold.
             * Please make sure to release the node instance to the pool when done.
             * @attribute focusedNode
             * @type FlyweightTreeNode
             * @default First node in the tree
             */
            focusedNode: {
                getter: '_focusedNodeGetter',
                setter: '_focusedNodeSetter'
                // There is no need for validator since the setter already takes care of validation.
            }

        }
    });


Y.FlyweightTreeManager = FWMgr;
