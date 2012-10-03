/** This class must not be generated directly.  
 *  Instances of it will be provided by FWTreeView as required.
 *  
 *  Subclasses might be defined based on it.  
 *  Usually, they will add further attributes and redefine the TEMPLATE to 
 *  show those extra attributes.
 *  
 *  @module gallery-fwt-treeview
 */
/**
 *    
 *  @class FWTreeNode
 *  @extends FlyweightTreeNode
 */
/**
 *  @constructor
 */
 Y.FWTreeNode = Y.Base.create(
	'fw-treenode',
	Y.FlyweightTreeNode,
	[],
	{
		initializer: function() {
			this.after('click', this._afterClick, this);
			this.after('selectedChange', this._afterSelectedChange, this);
		},
		/**
		 * Responds to the click event by toggling the node
		 * @method _afterClick
		 * @param ev {EventFacade}
		 * @private
		 */
		_afterClick: function (ev) {
			var target = ev.domEvent.target;
			if (target.hasClass(CNAMES.toggle)) {
				this.toggle();
			} else if (target.hasClass(CNAMES.selection)) {
				this.toggleSelection();
			} else if (target.hasClass(CNAMES.content) || target.hasClass(CNAMES.icon)) {
				if (this.get('root').get('toggleOnLabelClick')) {
					this.toggle();
				}
			}
		},
		/**
		 * Sugar method to toggle the selected state of a node.
		 * @method toggleSelection
		 */
		toggleSelection: function() {
			this.set('selected', (this.get('selected')?NOT_SELECTED:FULLY_SELECTED));
		},
		/**
		 * Changes the UI to reflect the selected state and propagates the selection up and/or down.
		 * @method _afterSelectedChange
		 * @param ev {EventFacade} out of which
		 * @param ev.src {String} if not undefined it can be `'propagateUp'` or `'propagateDown'` so that propagation goes in just one direction and doesn't bounce back.
		 * @private
		 */
		_afterSelectedChange: function (ev) {
			var selected = ev.newVal;
				
			if (!this.isRoot()) {
				Y.one('#' + this.get('id')).replaceClass('yui3-fw-treeview-selected-state-' + ev.prevVal,'yui3-fw-treeview-selected-state-' + selected);
				if (this.get('propagateUp') && ev.src !== 'propagatingDown') {
					this.getParent()._childSelectedChange().release();
				}
			}
			if (this.get('propagateDown') && ev.src !== 'propagatingUp') {
				this.forSomeChildren(function(node) {
					node.set('selected' , selected, 'propagatingDown');
				});
			}
		},
		/**
		 * Overrides the original in FlyweightTreeNode so as to propagate the selected state
		 * on dynamically loaded nodes.
		 * @method _dynamicLoadReturn
		 * @private
		 */
		_dynamicLoadReturn: function () {
			 Y.FWTreeNode.superclass._dynamicLoadReturn.apply(this, arguments);
			 if (this.get('propagateDown')) {
				var selected = this.get('selected');
				this.forSomeChildren(function(node) {
					node.set('selected' , selected, 'propagatingDown');
				});
			}
			 
		},
		/**
		 * When propagating selection up, it is called by a child when changing its selected state
		 * so that the parent adjusts its own state accordingly.
		 * @method _childSelectedChange
		 * @private
		 */
		_childSelectedChange: function () {
			var count = 0, selCount = 0;
			this.forSomeChildren(function (node) {
				count +=2;
				selCount += node.get('selected');
			});
			this.set('selected', (selCount === 0?NOT_SELECTED:(selCount === count?FULLY_SELECTED:PARTIALLY_SELECTED)), {src:'propagatingUp'});
			return this;
		}
		
	},
	{
		/**
		 * Template to produce the markup for a node in the tree.
		 * @property TEMPLATE
		 * @type String
		 * @static
		 */
		TEMPLATE: Lang.sub('<li id="{id}" class="{cname_node} {sel_prefix}-{selected}"><div class="{toggle}"></div><div class="{icon}"></div><div class="{selection}"></div><div class="{content}">{label}</div><ul class="{cname_children}">{children}</ul></li>', CNAMES),
		/**
		 * Constant to use with the `selected` attribute to indicate the node is not selected.
		 * @property NOT_SELECTED
		 * @type integer
		 * @value 0
		 * @static
		 * @final
		 */
		NOT_SELECTED:NOT_SELECTED,
		/**
		 * Constant to use with the `selected` attribute to indicate some 
		 * but not all of the children of this node are selected.
		 * This state should only be acquired by upward propagation from descendants.
		 * @property PARTIALLY_SELECTED
		 * @type integer
		 * @value 1
		 * @static
		 * @final
		 */
		PARTIALLY_SELECTED:PARTIALLY_SELECTED,
		/**
		 * Constant to use with the `selected` attribute to indicate the node is selected.
		 * @property FULLY_SELECTED
		 * @type integer
		 * @value 2
		 * @static
		 * @final
		 */
		FULLY_SELECTED:FULLY_SELECTED,
		ATTRS: {
			/**
			 * Selected/highlighted state of the node. 
			 * It can be
			 * 
			 * - Y.FWTreeNode.NOT_SELECTED (0) not selected
			 * - Y.FWTreeNode.PARTIALLY_SELECTED (1) partially selected: some children are selected, some not or partially selected.
			 * - Y.FWTreeNode.FULLY_SELECTED (2) fully selected.
			 * 
			 * The partially selected state can only be the result of selection propagating up from a child node.
			 * The attribute might return PARTIALLY_SELECTED but the developer should never set that value.
			 * @attribute selected
			 * @type Integer
			 * @value NOT_SELECTED
			 */
			selected: {
				value:NOT_SELECTED,
				validator:function (value) {
					return value === NOT_SELECTED || value === FULLY_SELECTED || value === PARTIALLY_SELECTED;
				}
			},
			/**
			 * Whether selection of one node should propagate to its parent.
			 * @attribute propagateUp
			 * @type Boolean
			 * @value true
			 */
			propagateUp: {
				value: true,
				validator: Lang.isBoolean
			},
			/**
			 * Whether selection of one node should propagate to its children.
			 * @attribute propagateDown
			 * @type Boolean
			 * @value true
			 */
			propagateDown: {
				value: true,
				validator: Lang.isBoolean
			}
		}
	}
);

