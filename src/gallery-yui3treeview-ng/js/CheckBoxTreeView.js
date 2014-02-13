
/**
 * CheckBoxTreeView widget. Extrends TreeView widget to support relevant events and methods od checkbox tree.
 * This widget represents the root cotainer for CheckBoxTreeNode objects that build the actual tree structure. 
 * Therefore this widget will not usually have any visual representation. Its also responsible for handling node events.
 * @class CheckBoxTreeView
 * @constructor
 * @extends TreeView
 * @param {Object} config User configuration object.
 */
	Y.CheckBoxTreeView = Y.Base.create(CHECKBOXTREEVIEW, Y.TreeView, [], {
		
		initializer : function(config) {
			/**
			 * Fires when node checkbox state is changed
			 * @event check
			 * @param {TreeNode} treenode tree node that is checked
			 */
			this.publish("check", {
				defaultFn: this._checkDefaultFn
			});
		},
		
		/**
		 * Default event handler for "check" event
		 * @method _nodeClickDefaultFn
		 * @protected
		 */
		_checkDefaultFn: function(e) {
			e.treenode.toggleCheckedState();
		},
		
		bindUI: function() {
			var boundingBox = this.get(BOUNDING_BOX);
			Y.CheckBoxTreeView.superclass.bindUI.apply(this, arguments);
			
			boundingBox.on("click", function(e) {
				var twidget = Y.Widget.getByNode(e.target),
					check = false;
				if (twidget instanceof Y.CheckBoxTreeNode) {
					Y.Array.each(e.target.get("className").split(" "), function (className) {
						switch (className) {
							case classNames.checkbox:
								check = true;
								break;
							case classNames.labelContent:
								if (this.get("checkOnLabelClick")) {
									check = true;
								}
								break;
						}
					}, this);
			
					if (check) {
						this.fire("check", {treenode: twidget});
					}
				}
			}, this);
			
			boundingBox.on("keypress", function(e) {
				var target = e.target,
					twidget = Y.Widget.getByNode(target),
					keycode = e.keyCode;
				
				if (!twidget instanceof Y.CheckBoxTreeNode) {
					return;
				}
				
				if (keycode == 32) {
					this.fire("check", {treenode: twidget});
					e.preventDefault();
				} 
			}, this);
		},

		/**
		 * Returns the list of nodes that are roots of checked subtrees
		 * @method getChecked
		 * @return {Array} array of tree nodes
		 */
		getChecked : function() {
			var checkedChildren = Array(),
				halfcheckedChildren = Array(),
				child,
				analyzeChild;
				
				this.each(function (child) {
					if (child.get("checked") == checkStates.checked) {
						checkedChildren.push(child);
					} else if (child.get("checked") == checkStates.halfchecked) {
						halfcheckedChildren.push(child);
					}
				});
				
				analyzeChild = function (child) {
					if (child.get("checked") == checkStates.checked) {
						checkedChildren.push(child);
					} else if (child.get("checked") == checkStates.halfchecked) {
						halfcheckedChildren.push(child);
					}
				};
				
				while (halfcheckedChildren.length > 0) {
					child = halfcheckedChildren.pop();
					child.each(analyzeChild);
				}
				return checkedChildren;   
		},
		
		/**
		 * Returns list of pathes (breadcrumbs) of nodes that are roots of checked subtrees
		 * @method getCheckedPaths
		 * @param cfg {Object} An object literal with the following properties:
		 *     <dl>
		 *     <dt><code>labelAttr</code></dt>
		 *     <dd>Attribute name to use for node representation. Can be any attribute of TreeNode</dd>
		 *     <dt><code>reverse</code></dt>
		 *     <dd>Return breadcrumbs from the node to root instead of root to the node</dd>
		 *     </dl>
		 * @return {Array} array of node label arrays
		 */
		getCheckedPaths : function(cfg) {
			var nodes = this.getChecked(),
			nodeArray = Array();
			
			if (!cfg) {
				cfg = {};
			}
			if (!cfg.labelAttr) {
				cfg.labelAttr = "label";
			}
			
			Y.Array.each(nodes, function(node) {
				nodeArray.push(node.path(cfg));
			});
			return nodeArray;
		}
		
	}, {
		NAME : CHECKBOXTREEVIEW,
		ATTRS : {
			/**
			 * @attribute defaultChildType
			 * @type String
			 * @readOnly
			 * @description default child type definition
			 */
			defaultChildType : {  
				value: "CheckBoxTreeNode",
				readOnly: true
			},
			/**
			 * @attribute checkOnLabelClick
			 * @type Boolean
			 * @description Whether to change node checked state on label clicks with addition to checkbox control clicks
			 */
			checkOnLabelClick : {
				value: true,
				validator: Y.Lang.isBoolean
			}
		}
	});
	
/**
 * CheckBoxTreeNode widget. Provides a tree style node widget with checkbox
 * It extends Y.TreeNode, please refer to it's documentation for more info.   
 * @class CheckBoxTreeNode
 * @constructor
 * @extends TreeNode
 * @param {Object} config User configuration object.
 */
	Y.CheckBoxTreeNode = Y.Base.create(CHECKBOXTREENODE, Y.TreeNode, [], {
		
		initializer : function() {
			this.publish("childCheckedSateChange", {
				defaultFn: this._childCheckedSateChangeDefaultFn,
				bubbles: false
			});
		},
		
		/**
		* Default handler for childCheckedSateChange. Updates this parent state
		* to match current children states.
		* @method _childCheckedSateChangeDefaultFn
		* @protected
		*/
		_childCheckedSateChangeDefaultFn : function(e) {
			var checkedChildren = 0,
				halfCheckedChildren = 0,
				cstate;
			
			this.each(function(child) {
				cstate = child.get("checked");
				if (cstate == checkStates.checked) {
					checkedChildren++;
				}
				if (cstate == checkStates.halfchecked) {
					halfCheckedChildren++;
				}
			});
				
			if (checkedChildren == this.size()) {
				this.set("checked", checkStates.checked);
			} else if (checkedChildren > 0 || halfCheckedChildren > 0) {
				this.set("checked", checkStates.halfchecked);
			} else {
				this.set("checked", checkStates.unchecked);
			}
			
			if (!this.isRoot()) {
				this.get("parent").fire("childCheckedSateChange");
			}
		},
		
		bindUI : function() {
			Y.CheckBoxTreeNode.superclass.bindUI.apply(this, arguments);
			this.on("checkedChange", this._onCheckedChange);
		},
		
		/**
		* Event handler that updates UI according to checked attribute change
		* @method _onCheckedChange
		* @protected
		*/
		_onCheckedChange: function(e) {
			e.stopPropagation();
			this._updateCheckedStateUI(e.prevVal, e.newVal);
		},
		
		/**
		* Synchronize CSS classes to conform to checked state
		* @method _updateCheckedStateUI
		* @protected
		*/
		_updateCheckedStateUI : function(oldState, newState) {
			var checkBox = this._getCheckBoxNode();
			checkBox.removeClass(checkStatesClasses[oldState]);
			checkBox.addClass(checkStatesClasses[newState]);
		},
		
		/**
		* Returns checkbox node
		* @method _getCheckBoxNode
		* @protected
		*/
		_getCheckBoxNode : function() {
			return this.get(BOUNDING_BOX).one("." + classNames.checkbox);
		},
		
		CHECKBOX_TEMPLATE : "<span class={checkboxClassName}></span>",
		
		renderUI : function() {
			var parentNode,
			labelContentNode,
			checkboxNode;
			
			Y.CheckBoxTreeNode.superclass.renderUI.apply(this, arguments);
			
			checkboxNode = Y.Node.create(Y.substitute(this.CHECKBOX_TEMPLATE, {checkboxClassName: classNames.checkbox}));
			labelContentNode = this._getLabelContentNode();
			parentNode = labelContentNode.get("parentNode");
			labelContentNode.remove();
			checkboxNode.append(labelContentNode);
			parentNode.append(checkboxNode);
			
			// update state
			this._getCheckBoxNode().addClass(checkStatesClasses[this.get("checked")]);
			
			// reuse CSS
			this.get(CONTENT_BOX).addClass(classNames.content);
		},
		
		syncUI : function() {
			Y.CheckBoxTreeNode.superclass.syncUI.apply(this, arguments);
			this._syncChildren();
		},
		
		
		/**
		* Toggles checked / unchecked state of the node
		* @method toggleCheckedState
		*/
		toggleCheckedState : function() {
			if (this.get("checked") == checkStates.checked) {
				this._uncheck();
			} else {
				this._check();
			}
			this.get("parent").fire("childCheckedSateChange");
		},
		
		/**
		 * Sets this node as checked and propagates to children
		 * @method _check
		 * @protected
		 */
		_check : function() {
			this.set("checked", checkStates.checked);
			this.each(function(child) {
				child._check();
			});
		},
		
		/**
		 * Set this node as unchecked and propagates to children
		 * @method _uncheck
		 * @protected
		 */
		_uncheck : function() {
			this.set("checked", checkStates.unchecked);
			this.each(function(child) {
				child._uncheck();
			});
		},
		
		/**
		 * Synchronizes children states to match the state of the current node
		 * @method _uncheck
		 * @protected
		 */
		_syncChildren : function() {
			if (this.get("checked") == checkStates.unchecked) {
				this._uncheck();
			} else if (this.get("checked") == checkStates.checked) {
				this._check();
			} else {
				this.each(function (child) {
					child._syncChildren();
				});
			}
		}
		
	}, {
		NAME : CHECKBOXTREENODE,
		ATTRS : {
			/**
			* @attribute defaultChildType
			* @type String
			* @readOnly
			* @description default child type definition
			*/
			defaultChildType : {  
				value: "CheckBoxTreeNode",
				readOnly: true
			},
			/**
			* @attribute checked
			* @type {String|Number}
			* @description Signifies current "checked" state. Accepts either <code>unchecked</code>, <code>halfchecked</code>, <code>checked</code>.
			* or correspondingly 10, 20, 30. Getter returns only numeric value.
			*/
			checked : {
				value : 10,
				setter : function(val) {
					var returnVal = Y.Attribute.INVALID_VALUE;
					if (checkStates[val] !== null) {
						returnVal = checkStates[val];
					} else if ([10, 20, 30].indexOf(val) >= 0) {
						returnVal = val;
					}
					return returnVal;
				}
			}
		}
	});
