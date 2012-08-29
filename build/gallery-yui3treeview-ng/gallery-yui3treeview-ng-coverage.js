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
_yuitest_coverage["/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js",
    code: []
};
_yuitest_coverage["/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js"].code=["YUI.add('gallery-yui3treeview-ng', function(Y) {","","","	var getClassName = Y.ClassNameManager.getClassName,","		BOUNDING_BOX = \"boundingBox\",","		CONTENT_BOX = \"contentBox\",","		TREEVIEW = \"treeview\",","		TREENODE = \"treenode\",","		CHECKBOXTREEVIEW = \"checkboxtreeview\",","		CHECKBOXTREENODE = \"checkboxtreenode\",","		classNames = {","			tree : getClassName(TREENODE),","			content : getClassName(TREENODE, \"content\"),","			label : getClassName(TREENODE, \"label\"),","			labelContent : getClassName(TREENODE, \"label-content\"),","			toggle : getClassName(TREENODE, \"toggle-control\"),","			collapsed : getClassName(TREENODE, \"collapsed\"),","			leaf : getClassName(TREENODE, \"leaf\"),","			lastnode : getClassName(TREENODE, \"last\"),","			checkbox : getClassName(CHECKBOXTREENODE, \"checkbox\")","		},","		checkStates = { // Check states for checkbox tree","			unchecked: 10,","			halfchecked: 20,","			checked: 30","		},","		checkStatesClasses = {","			10 : getClassName(CHECKBOXTREENODE, \"checkbox-unchecked\"),","			20 : getClassName(CHECKBOXTREENODE, \"checkbox-halfchecked\"),","			30 : getClassName(CHECKBOXTREENODE, \"checkbox-checked\")","		},","		findChildren;","","/*"," * Used in HTML_PARSERs to find children of the current widget"," */","	findChildren = function (srcNode, selector) {","		var descendants = srcNode.all(selector),","			children = Array(),","			child;","			","			descendants.each(function(node) {","				child = {","					srcNode : node,","					boundingBox : node,","					contentBox : node.one(\"> ul\")","				};","				children.push(child);","			});","			return children;","	};","","/**"," * TreeView widget. Provides a tree style widget, with a hierachical representation of it's components."," * It extends WidgetParent and WidgetChild, please refer to it's documentation for more info.   "," * This widget represents the root cotainer for TreeNode objects that build the actual tree structure. "," * Therefore this widget will not usually have any visual representation. Its also responsible for handling node events."," * @class TreeView"," * @constructor"," * @uses WidgetParent"," * @extends Widget"," * @param {Object} config User configuration object."," */","	Y.TreeView = Y.Base.create(TREEVIEW, Y.Widget, [Y.WidgetParent], {","","		CONTENT_TEMPLATE :  \"<ul></ul>\",","","		initializer : function (config) {","			this.publish(\"nodeToggle\", {","				defaultFn: this._nodeToggleDefaultFn","			});","			this.publish(\"nodeCollapse\", {","				defaultFn: this._nodeCollapseDefaultFn","			});","			this.publish(\"nodeExpand\", {","				defaultFn: this._nodeExpandDefaultFn","			});","			this.publish(\"nodeClick\", {","				defaultFn: this._nodeClickDefaultFn","			});","		},","","		/**","			* Default event handler for \"nodeclick\" event","			* @method _nodeClickDefaultFn","			* @protected","			*/","		_nodeClickDefaultFn: function(e) {","		},","","		/**","			* Default event handler for \"toggleTreeState\" event","			* @method _nodeToggleDefaultFn","			* @protected","			*/","		_nodeToggleDefaultFn: function(e) {","			if (e.treenode.get(\"collapsed\")) {","				this.fire(\"nodeExpand\", {treenode: e.treenode});","			} else {","				this.fire(\"nodeCollapse\", {treenode: e.treenode});","			}","		},","","		/**","			* Default event handler for \"collapse\" event","			* @method _nodeCollapseDefaultFn","			* @protected","			*/","		_nodeCollapseDefaultFn: function(e) {","			e.treenode.collapse();","		},","","		/**","			* Default event handler for \"expand\" event","			* @method _expandStateDefaultFn","			* @protected","			*/","		_nodeExpandDefaultFn: function(e) {","			e.treenode.expand();","		},","","		/**","		 * Sets child event handlers","		 * @method _setChildEventHandlers","		 * @protected","		 */","		_setChildEventHandlers : function () {","			var parent;","			this.after(\"addChild\", function(e) {","				parent = e.child.get(\"parent\");","				if (e.child.get(\"isLast\") && parent.size() > 1) {","					parent.item(e.child.get(\"index\")-1)._unmarkLast();","				}","			});","			","			this.on(\"removeChild\", function(e) {","				parent = e.child.get(\"parent\");","				if ((parent.size() == 1) || e.child.get(\"index\") === 0) {","					return;","				}","				if (e.child.get(\"isLast\")) {","					parent.item(e.child.get(\"index\")-1)._markLast();","				}","			});","		},","		","		/**","			* Handles internal tree click events","			* @method _onClickEvents","			* @protected","			*/","		_onClickEvents : function (event) {","			var target = event.target,","				twidget = Y.Widget.getByNode(target),","				toggle = false;","			","			event.preventDefault();","			","			twidget = Y.Widget.getByNode(target);","			if (!twidget instanceof Y.TreeNode) {","				return;","			}","			if (twidget.get(\"isLeaf\")) {","				return;","			}","			","			Y.Array.each(target.get(\"className\").split(\" \"), function(className) {","				switch (className) {","					case classNames.toggle:","						toggle = true;","						break;","					case classNames.labelContent:","						if (this.get(\"toggleOnLabelClick\")) {","							toggle = true;","						}","						break;","				}","			}, this);","","			if (toggle) {","				this.fire(\"nodeToggle\", {treenode: twidget});","			}","		},","		","		/**","		 * Handles internal tree keyboard interaction","		 * @method _onKeyEvents","		 * @protected","		 */","		_onKeyEvents : function (event) {","			var target = event.target,","				twidget = Y.Widget.getByNode(target),","				keycode = event.keyCode,","				collapsed = twidget.get(\"collapsed\");","				","			if (twidget.get(\"isLeaf\")) {","				return;","			}","			","			if ( ((keycode == 39) && collapsed) || ((keycode == 37) && !collapsed) ) {","				this.fire(\"nodeToggle\", {treenode: twidget});","			}			   ","		},","							   ","        bindUI : function() {","            var boundingBox = this.get(BOUNDING_BOX);","			boundingBox.on(\"click\", this._onClickEvents, this);","			boundingBox.on(\"keypress\", this._onKeyEvents, this);","","			boundingBox.delegate(\"click\", Y.bind(function(e) {","				var twidget = Y.Widget.getByNode(e.target);","				if (twidget instanceof Y.TreeNode) {","					this.fire(\"nodeclick\", {treenode: twidget});","				}","			}, this), \".\"+classNames.label);","			","			this._setChildEventHandlers();","			","			boundingBox.plug(Y.Plugin.NodeFocusManager, {","				descendants: \".yui3-treenode-label\",","				keys: {","					next: \"down:40\",    // Down arrow","					previous: \"down:38\" // Up arrow ","				},","				circular: false","			});","		}","","	}, {","		","		NAME : TREEVIEW,","		ATTRS : {","			/**","			 * @attribute defaultChildType","			 * @type String","			 * @readOnly","			 * @default child type definition","			 */","			defaultChildType : {  ","				value: \"TreeNode\",","				readOnly: true","			},","			/**","			 * @attribute toggleOnLabelClick","			 * @type Boolean","			 * @whether to toogle tree state on label clicks with addition to toggle control clicks","			 */","			toggleOnLabelClick : {","				value: true,","				validator: Y.Lang.isBoolean","			},","			/**","			 * @attribute startCollapsed","			 * @type Boolean","			 * @wither to render tree nodes expanded or collapsed by default","			 */","			startCollapsed : {","				value: true,","				validator: Y.Lang.isBoolean","			},","			/**","			 * @attribute loadOnDemand","			 * @type boolean","			 *","			 * @description Whether children of this node can be loaded on demand","			 * (when this tree node is expanded, for example).","			 * Use with gallery-yui3treeview-ng-datasource.","			 */","			loadOnDemand : {","				value: false,","				validator: Y.Lang.isBoolean","			}","		},","		HTML_PARSER : {","			children : function (srcNode) {","				return findChildren(srcNode, \"> li\");","			}","		}","	});","","/**"," * TreeNode widget. Provides a tree style node widget."," * It extends WidgetParent and WidgetChild, please refer to it's documentation for more info.   "," * @class TreeNode"," * @constructor"," * @uses WidgetParent, WidgetChild"," * @extends Widget"," * @param {Object} config User configuration object."," */","	Y.TreeNode = Y.Base.create(TREENODE, Y.Widget, [Y.WidgetParent, Y.WidgetChild], {","","		/**","		 * Flag to determine if the tree is being rendered from markup or not","		 * @property _renderFromMarkup","		 * @protected","		 */","		_renderFromMarkup : false,","","		CONTENT_TEMPLATE :  \"<ul></ul>\",","		","		BOUNDING_TEMPLATE : \"<li></li>\",","								","		TREENODELABEL_TEMPLATE : \"<a class={labelClassName} role='treeitem' href='#'></a>\",","		TREENODELABELCONTENT_TEMPLATE : \"<span class={labelContentClassName}>{label}</span>\",","		","		TOGGLECONTROL_TEMPLATE : \"<span class={toggleClassName}></span>\",","","		bindUI : function() {","			// Both TreeVew and TreeNode share the same child event handling","			Y.TreeView.prototype._setChildEventHandlers.apply(this, arguments);","		},","		","		/**","			* Renders TreeNode","			* @method renderUI","			* @protected","			*/","		renderUI : function() {","			var boundingBox = this.get(BOUNDING_BOX),","                treeLabel,","				treeLabelHTML,","				labelContent,","				labelContentHTML,","				toggleControlHTML,","				label,","				isLeaf;","				","			toggleControlHTML = Y.substitute(this.TOGGLECONTROL_TEMPLATE,{toggleClassName: classNames.toggle});","			isLeaf = this.get(\"isLeaf\");","			","			if (this._renderFromMarkup) {","				treeLabel = boundingBox.one(\":first-child\");","				treeLabel.set(\"role\", \"treeitem\");","				treeLabel.addClass(classNames.label);","				labelContent = treeLabel.removeChild(treeLabel.one(\":first-child\"));","				labelContent.addClass(classNames.labelContent);","			} else {","				label = this.get(\"label\");","","				treeLabelHTML = Y.substitute(this.TREENODELABEL_TEMPLATE, {labelClassName: classNames.label});","				labelContentHTML = Y.substitute(this.TREENODELABELCONTENT_TEMPLATE, {labelContentClassName: classNames.labelContent, label: label});","				labelContent = labelContentHTML;","				","				treeLabel = Y.Node.create(treeLabelHTML);","				boundingBox.prepend(treeLabel);","			}","","			if (!isLeaf) {","				treeLabel.appendChild(toggleControlHTML).appendChild(labelContent);","			} else {","				treeLabel.append(labelContent);","			}","","			boundingBox.set(\"role\",\"presentation\");","","			if (!isLeaf) {","				if (this.get(\"root\").get(\"startCollapsed\")) {","					boundingBox.addClass(classNames.collapsed);   ","				} else {","					if (this.size() === 0) { // Nodes (not leafs) without children should start in collapsed mode","						boundingBox.addClass(classNames.collapsed);   ","					}","				}","			}","","			if (isLeaf) {","				boundingBox.addClass(classNames.leaf);","			}","			","			if (this.get(\"isLast\")) {","				this._markLast();","			}","		},","","		/**","		 * Marks this node as the last one in list","		 * @method _markLast","		 * @protected","		 */","		_markLast : function() {","			this.get(BOUNDING_BOX).addClass(classNames.lastnode);","		},","","		/**","		 * Unmarks this node as the last one in list","		 * @method _markLast","		 * @protected","		 */","		_unmarkLast : function() {","			this.get(BOUNDING_BOX).removeClass(classNames.lastnode);","		},","		","		/**","			* Collapse the tree","			* @method collapse","			*/","		collapse : function () {","			var boundingBox = this.get(BOUNDING_BOX);","			if (!boundingBox.hasClass(classNames.collapsed)) {","				boundingBox.toggleClass(classNames.collapsed);","			}","		},","","		/**","			* Expands the tree","			* @method expand","			*/","		expand : function () {","			var boundingBox = this.get(BOUNDING_BOX);","			if (boundingBox.hasClass(classNames.collapsed)) {","				boundingBox.toggleClass(classNames.collapsed);","			}","		},","","		/**","		 * Toggle current expaned/collapsed tree state","		 * @method toggleState","		 */","        toggleState : function () {","			this.get(BOUNDING_BOX).toggleClass(classNames.collapsed);","		},","","		/**","		 * Returns breadcrumbs path of labels from root of the tree to this node (inclusive)","		 * @method path","		 * @param cfg {Object} An object literal with the following properties:","		 *     <dl>","		 *     <dt><code>labelAttr</code></dt>","		 *     <dd>Attribute name to use for node representation. Can be any attribute of TreeNode</dd>","		 *     <dt><code>reverse</code></dt>","		 *     <dd>Return breadcrumbs from the node to root instead of root to the node</dd>","		 *     </dl>","		 * @return {Array} array of node labels","		 */","		path : function(cfg) {","			var bc = Array(),","				node = this;","			if (!cfg) {","				cfg = {};","			}","			if (!cfg.labelAttr) {","				cfg.labelAttr = \"label\";","			}","			while (node && (node instanceof Y.TreeNode) ) {","				bc.unshift(node.get(cfg.labelAttr));","				node = node.get(\"parent\");","			}","			if (cfg.reverse) {","				bc = bc.reverse();","			}","			return bc;","		},","","		/**","			* Returns toggle control node","			* @method _getToggleControlNode","			* @protected","			*/","		_getToggleControlNode : function() {","			return this.get(BOUNDING_BOX).one(\".\" + classNames.toggle);","		},","			","		/**","			* Returns label content node","			* @method _getLabelContentNode","			* @protected","			*/","		_getLabelContentNode : function() {","			return this.get(BOUNDING_BOX).one(\".\" + classNames.labelContent);","		}","","    }, { ","		NAME : TREENODE,","		ATTRS : {","			/**","				* @attribute defaultChildType","				* @type String","				* @readOnly","				* @description default child type definition","				*/","			defaultChildType : {  ","				value: \"TreeNode\",","				readOnly: true","			},","			/**","				* @attribute label","				* @type String","				*","				* @description TreeNode node label ","				*/","			label : {","				validator: Y.Lang.isString,","				value: \"\"","			},","			/**","				* @attribute loadOnDemand","				* @type boolean","				*","				* @description Whether children of this node can be loaded on demand","				* (when this tree node is expanded, for example).","				* Use with gallery-yui3treeview-ng-datasource.","				*/","			loadOnDemand : {","				value: false,","				validator: Y.Lang.isBoolean","			},","			/**","				* @attribute collapsed","				* @type Boolean","				* @readOnly","				*","				* @description Represents current treenode state - whether its collapsed or extended","				*/","			collapsed : {","				value: null,","				getter: function() {","					return this.get(BOUNDING_BOX).hasClass(classNames.collapsed);","				},","				readOnly: true","			},","			/**","				* @attribute clabel","				* @type String","				*","				* @description Canonical label for the node. ","				* You can set it to anything you like and use later with your external tools.","				*/","			clabel : {","				value: \"\",","				validator: Y.Lang.isString","			},","			/**","				* @attribute nodeId","				* @type String","				*","				* @description Signifies id of this node.","				* You can set it to anything you like and use later with your external tools.","				*/","			nodeId : {","				value: \"\",","				validator: Y.Lang.isString","			},","			/**","				* @attribute isLeaf","				* @type Boolean","				*","				* @description Signifies whether this node is a leaf node.","				* Nodes with loadOnDemand set to true are not considered leafs.","				*/","			isLeaf : {","				value: null,","				getter: function() {","					return (this.size() > 0 ? false : true) && (!this.get(\"loadOnDemand\"));","				},","				readOnly: true","			},","			/**","			 * @attribute isLast","			 * @type Boolean","			 *","			 * @description Signifies whether this node is the last child of its parent.","			 */","			isLast : {","				value: null,","				getter: function() {","					return (this.get(\"index\") + 1 == this.get(\"parent\").size());","				},","				readOnly: true","			}","		},","		HTML_PARSER: {","			children : function (srcNode) {","				return findChildren(srcNode, \"> ul > li\");","			},","			","			label : function(srcNode) {","				var labelContentNode = srcNode.one(\"> a > span\");","				if (labelContentNode !== null) {","					this._renderFromMarkup = true;","					return labelContentNode.getContent();","				}","			}","		}","	});","","/**"," * CheckBoxTreeView widget. Extrends TreeView widget to support relevant events and methods od checkbox tree."," * This widget represents the root cotainer for CheckBoxTreeNode objects that build the actual tree structure. "," * Therefore this widget will not usually have any visual representation. Its also responsible for handling node events."," * @class CheckBoxTreeView"," * @constructor"," * @extends TreeView"," * @param {Object} config User configuration object."," */","	Y.CheckBoxTreeView = Y.Base.create(CHECKBOXTREEVIEW, Y.TreeView, [], {","		","		initializer : function(config) {","			this.publish(\"check\", {","				defaultFn: this._checkDefaultFn","			});","		},","		","		/**","		 * Default event handler for \"check\" event","		 * @method _nodeClickDefaultFn","		 * @protected","		 */","		_checkDefaultFn: function(e) {","			e.treenode.toggleCheckedState();","		},","		","		bindUI: function() {","			var boundingBox = this.get(BOUNDING_BOX);","			Y.CheckBoxTreeView.superclass.bindUI.apply(this, arguments);","			","			boundingBox.on(\"click\", function(e) {","				var twidget = Y.Widget.getByNode(e.target),","					check = false;","				if (twidget instanceof Y.CheckBoxTreeNode) {","					Y.Array.each(e.target.get(\"className\").split(\" \"), function (className) {","						switch (className) {","							case classNames.checkbox:","								check = true;","								break;","							case classNames.labelContent:","								if (this.get(\"checkOnLabelClick\")) {","									check = true;","								}","								break;","						}","					}, this);","			","					if (check) {","						this.fire(\"check\", {treenode: twidget});","					}","				}","			}, this);","			","			boundingBox.on(\"keypress\", function(e) {","				var target = e.target,","					twidget = Y.Widget.getByNode(target),","					keycode = e.keyCode;","				","				if (!twidget instanceof Y.CheckBoxTreeNode) {","					return;","				}","				","				if (keycode == 32) {","					this.fire(\"check\", {treenode: twidget});","					e.preventDefault();","				} ","			}, this);","		},","","		/**","		 * Returns the list of nodes that are roots of checked subtrees","		 * @method getChecked","		 * @return {Array} array of tree nodes","		 */","		getChecked : function() {","			var checkedChildren = Array(),","				halfcheckedChildren = Array(),","				child,","				analyzeChild;","				","				this.each(function (child) {","					if (child.get(\"checked\") == checkStates.checked) {","						checkedChildren.push(child);","					} else if (child.get(\"checked\") == checkStates.halfchecked) {","						halfcheckedChildren.push(child);","					}","				});","				","				analyzeChild = function (child) {","					if (child.get(\"checked\") == checkStates.checked) {","						checkedChildren.push(child);","					} else if (child.get(\"checked\") == checkStates.halfchecked) {","						halfcheckedChildren.push(child);","					}","				};","				","				while (halfcheckedChildren.length > 0) {","					child = halfcheckedChildren.pop();","					child.each(analyzeChild);","				}","				return checkedChildren;   ","		},","		","		/**","		 * Returns list of pathes (breadcrumbs) of nodes that are roots of checked subtrees","		 * @method getCheckedPaths","		 * @param cfg {Object} An object literal with the following properties:","		 *     <dl>","		 *     <dt><code>labelAttr</code></dt>","		 *     <dd>Attribute name to use for node representation. Can be any attribute of TreeNode</dd>","		 *     <dt><code>reverse</code></dt>","		 *     <dd>Return breadcrumbs from the node to root instead of root to the node</dd>","		 *     </dl>","		 * @return {Array} array of node label arrays","		 */","		getCheckedPaths : function(cfg) {","			var nodes = this.getChecked(),","			nodeArray = Array();","			","			if (!cfg) {","				cfg = {};","			}","			if (!cfg.labelAttr) {","				cfg.labelAttr = \"label\";","			}","			","			Y.Array.each(nodes, function(node) {","				nodeArray.push(node.path(cfg));","			});","			return nodeArray;","		}","		","	}, {","		NAME : CHECKBOXTREEVIEW,","		ATTRS : {","			/**","			 * @attribute defaultChildType","			 * @type String","			 * @readOnly","			 * @default child type definition","			 */","			defaultChildType : {  ","				value: \"CheckBoxTreeNode\",","				readOnly: true","			},","			/**","			 * @attribute checkOnLabelClick","			 * @type Boolean","			 * @whether to change node checked state on label clicks with addition to checkbox control clicks","			 */","			checkOnLabelClick : {","				value: true,","				validator: Y.Lang.isBoolean","			}","		}","	});","	","/**"," * CheckBoxTreeNode widget. Provides a tree style node widget with checkbox"," * It extends Y.TreeNode, please refer to it's documentation for more info.   "," * @class CheckBoxTreeNode"," * @constructor"," * @extends Widget"," * @param {Object} config User configuration object."," */","	Y.CheckBoxTreeNode = Y.Base.create(CHECKBOXTREENODE, Y.TreeNode, [], {","		","		initializer : function() {","			this.publish(\"childCheckedSateChange\", {","				defaultFn: this._childCheckedSateChangeDefaultFn,","				bubbles: false","			});","		},","		","		/**","		* Default handler for childCheckedSateChange. Updates this parent state","		* to match current children states.","		* @method _childCheckedSateChangeDefaultFn","		* @protected","		*/","		_childCheckedSateChangeDefaultFn : function(e) {","			var checkedChildren = 0,","				halfCheckedChildren = 0,","				cstate;","			","			this.each(function(child) {","				cstate = child.get(\"checked\");","				if (cstate == checkStates.checked) {","					checkedChildren++;","				}","				if (cstate == checkStates.halfchecked) {","					halfCheckedChildren++;","				}","			});","				","			if (checkedChildren == this.size()) {","				this.set(\"checked\", checkStates.checked);","			} else if (checkedChildren > 0 || halfCheckedChildren > 0) {","				this.set(\"checked\", checkStates.halfchecked);","			} else {","				this.set(\"checked\", checkStates.unchecked);","			}","			","			if (!this.isRoot()) {","				this.get(\"parent\").fire(\"childCheckedSateChange\");","			}","		},","		","		bindUI : function() {","			Y.CheckBoxTreeNode.superclass.bindUI.apply(this, arguments);","			this.on(\"checkedChange\", this._onCheckedChange);","		},","		","		/**","		* Event handler that updates UI according to checked attribute change","		* @method _onCheckedChange","		* @protected","		*/","		_onCheckedChange: function(e) {","			e.stopPropagation();","			this._updateCheckedStateUI(e.prevVal, e.newVal);","		},","		","		/**","		* Synchronize CSS classes to conform to checked state","		* @method _updateCheckedStateUI","		* @protected","		*/","		_updateCheckedStateUI : function(oldState, newState) {","			var checkBox = this._getCheckBoxNode();","			checkBox.removeClass(checkStatesClasses[oldState]);","			checkBox.addClass(checkStatesClasses[newState]);","		},","		","		/**","		* Returns checkbox node","		* @method _getCheckBoxNode","		* @protected","		*/","		_getCheckBoxNode : function() {","			return this.get(BOUNDING_BOX).one(\".\" + classNames.checkbox);","		},","		","		CHECKBOX_TEMPLATE : \"<span class={checkboxClassName}></span>\",","		","		renderUI : function() {","			var parentNode,","			labelContentNode,","			checkboxNode;","			","			Y.CheckBoxTreeNode.superclass.renderUI.apply(this, arguments);","			","			checkboxNode = Y.Node.create(Y.substitute(this.CHECKBOX_TEMPLATE, {checkboxClassName: classNames.checkbox}));","			labelContentNode = this._getLabelContentNode();","			parentNode = labelContentNode.get(\"parentNode\");","			labelContentNode.remove();","			checkboxNode.append(labelContentNode);","			parentNode.append(checkboxNode);","			","			// update state","			this._getCheckBoxNode().addClass(checkStatesClasses[this.get(\"checked\")]);","			","			// reuse CSS","			this.get(CONTENT_BOX).addClass(classNames.content);","		},","		","		syncUI : function() {","			Y.CheckBoxTreeNode.superclass.syncUI.apply(this, arguments);","			this._syncChildren();","		},","		","		","		/**","		* Toggles checked / unchecked state of the node","		* @method toggleCheckedState","		*/","		toggleCheckedState : function() {","			if (this.get(\"checked\") == checkStates.checked) {","				this._uncheck();","			} else {","				this._check();","			}","			this.get(\"parent\").fire(\"childCheckedSateChange\");","		},","		","		/**","		 * Sets this node as checked and propagates to children","		 * @method _check","		 * @protected","		 */","		_check : function() {","			this.set(\"checked\", checkStates.checked);","			this.each(function(child) {","				child._check();","			});","		},","		","		/**","		 * Set this node as unchecked and propagates to children","		 * @method _uncheck","		 * @protected","		 */","		_uncheck : function() {","			this.set(\"checked\", checkStates.unchecked);","			this.each(function(child) {","				child._uncheck();","			});","		},","		","		/**","		 * Synchronizes children states to match the state of the current node","		 * @method _uncheck","		 * @protected","		 */","		_syncChildren : function() {","			if (this.get(\"checked\") == checkStates.unchecked) {","				this._uncheck();","			} else if (this.get(\"checked\") == checkStates.checked) {","				this._check();","			} else {","				this.each(function (child) {","					child._syncChildren();","				});","			}","		}","		","	}, {","		NAME : CHECKBOXTREENODE,","		ATTRS : {","			/**","			* @attribute defaultChildType","			* @type String","			* @readOnly","			* @description default child type definition","			*/","			defaultChildType : {  ","				value: \"CheckBoxTreeNode\",","				readOnly: true","			},","			/**","			* @attribute checked","			* @type {String|Number}","			* @description default child type definition. Accepts either <code>unchecked</code>, <code>halfchecked</code>, <code>checked</code>","			* or correspondingly 10, 20, 30.","			*/","			checked : {","				value : 10,","				setter : function(val) {","					var returnVal = Y.Attribute.INVALID_VALUE;","					if (checkStates[val] !== null) {","						returnVal = checkStates[val];","					} else if ([10, 20, 30].indexOf(val) >= 0) {","						returnVal = val;","					}","					return returnVal;","				}","			}","		}","	});","","","}, 'gallery-2012.08.29-20-10' ,{skinnable:true, requires:['substitute', 'widget', 'widget-parent', 'widget-child', 'node-focusmanager', 'array-extras']});"];
_yuitest_coverage["/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js"].lines = {"1":0,"4":0,"37":0,"38":0,"42":0,"43":0,"48":0,"50":0,"64":0,"69":0,"72":0,"75":0,"78":0,"97":0,"98":0,"100":0,"110":0,"119":0,"128":0,"129":0,"130":0,"131":0,"132":0,"136":0,"137":0,"138":0,"139":0,"141":0,"142":0,"153":0,"157":0,"159":0,"160":0,"161":0,"163":0,"164":0,"167":0,"168":0,"170":0,"171":0,"173":0,"174":0,"176":0,"180":0,"181":0,"191":0,"196":0,"197":0,"200":0,"201":0,"206":0,"207":0,"208":0,"210":0,"211":0,"212":0,"213":0,"217":0,"219":0,"276":0,"290":0,"310":0,"319":0,"328":0,"329":0,"331":0,"332":0,"333":0,"334":0,"335":0,"336":0,"338":0,"340":0,"341":0,"342":0,"344":0,"345":0,"348":0,"349":0,"351":0,"354":0,"356":0,"357":0,"358":0,"360":0,"361":0,"366":0,"367":0,"370":0,"371":0,"381":0,"390":0,"398":0,"399":0,"400":0,"409":0,"410":0,"411":0,"420":0,"436":0,"438":0,"439":0,"441":0,"442":0,"444":0,"445":0,"446":0,"448":0,"449":0,"451":0,"460":0,"469":0,"517":0,"553":0,"566":0,"573":0,"577":0,"578":0,"579":0,"580":0,"595":0,"598":0,"609":0,"613":0,"614":0,"616":0,"617":0,"619":0,"620":0,"621":0,"623":0,"624":0,"626":0,"627":0,"629":0,"633":0,"634":0,"639":0,"640":0,"644":0,"645":0,"648":0,"649":0,"650":0,"661":0,"666":0,"667":0,"668":0,"669":0,"670":0,"674":0,"675":0,"676":0,"677":0,"678":0,"682":0,"683":0,"684":0,"686":0,"702":0,"705":0,"706":0,"708":0,"709":0,"712":0,"713":0,"715":0,"751":0,"754":0,"767":0,"771":0,"772":0,"773":0,"774":0,"776":0,"777":0,"781":0,"782":0,"783":0,"784":0,"786":0,"789":0,"790":0,"795":0,"796":0,"805":0,"806":0,"815":0,"816":0,"817":0,"826":0,"832":0,"836":0,"838":0,"839":0,"840":0,"841":0,"842":0,"843":0,"846":0,"849":0,"853":0,"854":0,"863":0,"864":0,"866":0,"868":0,"877":0,"878":0,"879":0,"889":0,"890":0,"891":0,"901":0,"902":0,"903":0,"904":0,"906":0,"907":0,"934":0,"935":0,"936":0,"937":0,"938":0,"940":0};
_yuitest_coverage["/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js"].functions = {"(anonymous 2):42":0,"findChildren:37":0,"initializer:68":0,"_nodeToggleDefaultFn:96":0,"_nodeCollapseDefaultFn:109":0,"_nodeExpandDefaultFn:118":0,"(anonymous 3):129":0,"(anonymous 4):136":0,"_setChildEventHandlers:127":0,"(anonymous 5):167":0,"_onClickEvents:152":0,"_onKeyEvents:190":0,"(anonymous 6):210":0,"bindUI:205":0,"children:275":0,"bindUI:308":0,"renderUI:318":0,"_markLast:380":0,"_unmarkLast:389":0,"collapse:397":0,"expand:408":0,"toggleState:419":0,"path:435":0,"_getToggleControlNode:459":0,"_getLabelContentNode:468":0,"getter:516":0,"getter:552":0,"getter:565":0,"children:572":0,"label:576":0,"initializer:597":0,"_checkDefaultFn:608":0,"(anonymous 8):620":0,"(anonymous 7):616":0,"(anonymous 9):639":0,"bindUI:612":0,"(anonymous 10):666":0,"analyzeChild:674":0,"getChecked:660":0,"(anonymous 11):712":0,"getCheckedPaths:701":0,"initializer:753":0,"(anonymous 12):771":0,"_childCheckedSateChangeDefaultFn:766":0,"bindUI:794":0,"_onCheckedChange:804":0,"_updateCheckedStateUI:814":0,"_getCheckBoxNode:825":0,"renderUI:831":0,"syncUI:852":0,"toggleCheckedState:862":0,"(anonymous 13):878":0,"_check:876":0,"(anonymous 14):890":0,"_uncheck:888":0,"(anonymous 15):906":0,"_syncChildren:900":0,"setter:933":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js"].coveredLines = 225;
_yuitest_coverage["/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js"].coveredFunctions = 59;
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 1);
YUI.add('gallery-yui3treeview-ng', function(Y) {


	_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 4);
var getClassName = Y.ClassNameManager.getClassName,
		BOUNDING_BOX = "boundingBox",
		CONTENT_BOX = "contentBox",
		TREEVIEW = "treeview",
		TREENODE = "treenode",
		CHECKBOXTREEVIEW = "checkboxtreeview",
		CHECKBOXTREENODE = "checkboxtreenode",
		classNames = {
			tree : getClassName(TREENODE),
			content : getClassName(TREENODE, "content"),
			label : getClassName(TREENODE, "label"),
			labelContent : getClassName(TREENODE, "label-content"),
			toggle : getClassName(TREENODE, "toggle-control"),
			collapsed : getClassName(TREENODE, "collapsed"),
			leaf : getClassName(TREENODE, "leaf"),
			lastnode : getClassName(TREENODE, "last"),
			checkbox : getClassName(CHECKBOXTREENODE, "checkbox")
		},
		checkStates = { // Check states for checkbox tree
			unchecked: 10,
			halfchecked: 20,
			checked: 30
		},
		checkStatesClasses = {
			10 : getClassName(CHECKBOXTREENODE, "checkbox-unchecked"),
			20 : getClassName(CHECKBOXTREENODE, "checkbox-halfchecked"),
			30 : getClassName(CHECKBOXTREENODE, "checkbox-checked")
		},
		findChildren;

/*
 * Used in HTML_PARSERs to find children of the current widget
 */
	_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 37);
findChildren = function (srcNode, selector) {
		_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "findChildren", 37);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 38);
var descendants = srcNode.all(selector),
			children = Array(),
			child;
			
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 42);
descendants.each(function(node) {
				_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "(anonymous 2)", 42);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 43);
child = {
					srcNode : node,
					boundingBox : node,
					contentBox : node.one("> ul")
				};
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 48);
children.push(child);
			});
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 50);
return children;
	};

/**
 * TreeView widget. Provides a tree style widget, with a hierachical representation of it's components.
 * It extends WidgetParent and WidgetChild, please refer to it's documentation for more info.   
 * This widget represents the root cotainer for TreeNode objects that build the actual tree structure. 
 * Therefore this widget will not usually have any visual representation. Its also responsible for handling node events.
 * @class TreeView
 * @constructor
 * @uses WidgetParent
 * @extends Widget
 * @param {Object} config User configuration object.
 */
	_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 64);
Y.TreeView = Y.Base.create(TREEVIEW, Y.Widget, [Y.WidgetParent], {

		CONTENT_TEMPLATE :  "<ul></ul>",

		initializer : function (config) {
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "initializer", 68);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 69);
this.publish("nodeToggle", {
				defaultFn: this._nodeToggleDefaultFn
			});
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 72);
this.publish("nodeCollapse", {
				defaultFn: this._nodeCollapseDefaultFn
			});
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 75);
this.publish("nodeExpand", {
				defaultFn: this._nodeExpandDefaultFn
			});
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 78);
this.publish("nodeClick", {
				defaultFn: this._nodeClickDefaultFn
			});
		},

		/**
			* Default event handler for "nodeclick" event
			* @method _nodeClickDefaultFn
			* @protected
			*/
		_nodeClickDefaultFn: function(e) {
		},

		/**
			* Default event handler for "toggleTreeState" event
			* @method _nodeToggleDefaultFn
			* @protected
			*/
		_nodeToggleDefaultFn: function(e) {
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "_nodeToggleDefaultFn", 96);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 97);
if (e.treenode.get("collapsed")) {
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 98);
this.fire("nodeExpand", {treenode: e.treenode});
			} else {
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 100);
this.fire("nodeCollapse", {treenode: e.treenode});
			}
		},

		/**
			* Default event handler for "collapse" event
			* @method _nodeCollapseDefaultFn
			* @protected
			*/
		_nodeCollapseDefaultFn: function(e) {
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "_nodeCollapseDefaultFn", 109);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 110);
e.treenode.collapse();
		},

		/**
			* Default event handler for "expand" event
			* @method _expandStateDefaultFn
			* @protected
			*/
		_nodeExpandDefaultFn: function(e) {
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "_nodeExpandDefaultFn", 118);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 119);
e.treenode.expand();
		},

		/**
		 * Sets child event handlers
		 * @method _setChildEventHandlers
		 * @protected
		 */
		_setChildEventHandlers : function () {
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "_setChildEventHandlers", 127);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 128);
var parent;
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 129);
this.after("addChild", function(e) {
				_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "(anonymous 3)", 129);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 130);
parent = e.child.get("parent");
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 131);
if (e.child.get("isLast") && parent.size() > 1) {
					_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 132);
parent.item(e.child.get("index")-1)._unmarkLast();
				}
			});
			
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 136);
this.on("removeChild", function(e) {
				_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "(anonymous 4)", 136);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 137);
parent = e.child.get("parent");
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 138);
if ((parent.size() == 1) || e.child.get("index") === 0) {
					_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 139);
return;
				}
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 141);
if (e.child.get("isLast")) {
					_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 142);
parent.item(e.child.get("index")-1)._markLast();
				}
			});
		},
		
		/**
			* Handles internal tree click events
			* @method _onClickEvents
			* @protected
			*/
		_onClickEvents : function (event) {
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "_onClickEvents", 152);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 153);
var target = event.target,
				twidget = Y.Widget.getByNode(target),
				toggle = false;
			
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 157);
event.preventDefault();
			
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 159);
twidget = Y.Widget.getByNode(target);
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 160);
if (!twidget instanceof Y.TreeNode) {
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 161);
return;
			}
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 163);
if (twidget.get("isLeaf")) {
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 164);
return;
			}
			
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 167);
Y.Array.each(target.get("className").split(" "), function(className) {
				_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "(anonymous 5)", 167);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 168);
switch (className) {
					case classNames.toggle:
						_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 170);
toggle = true;
						_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 171);
break;
					case classNames.labelContent:
						_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 173);
if (this.get("toggleOnLabelClick")) {
							_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 174);
toggle = true;
						}
						_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 176);
break;
				}
			}, this);

			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 180);
if (toggle) {
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 181);
this.fire("nodeToggle", {treenode: twidget});
			}
		},
		
		/**
		 * Handles internal tree keyboard interaction
		 * @method _onKeyEvents
		 * @protected
		 */
		_onKeyEvents : function (event) {
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "_onKeyEvents", 190);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 191);
var target = event.target,
				twidget = Y.Widget.getByNode(target),
				keycode = event.keyCode,
				collapsed = twidget.get("collapsed");
				
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 196);
if (twidget.get("isLeaf")) {
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 197);
return;
			}
			
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 200);
if ( ((keycode == 39) && collapsed) || ((keycode == 37) && !collapsed) ) {
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 201);
this.fire("nodeToggle", {treenode: twidget});
			}			   
		},
							   
        bindUI : function() {
            _yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "bindUI", 205);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 206);
var boundingBox = this.get(BOUNDING_BOX);
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 207);
boundingBox.on("click", this._onClickEvents, this);
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 208);
boundingBox.on("keypress", this._onKeyEvents, this);

			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 210);
boundingBox.delegate("click", Y.bind(function(e) {
				_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "(anonymous 6)", 210);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 211);
var twidget = Y.Widget.getByNode(e.target);
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 212);
if (twidget instanceof Y.TreeNode) {
					_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 213);
this.fire("nodeclick", {treenode: twidget});
				}
			}, this), "."+classNames.label);
			
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 217);
this._setChildEventHandlers();
			
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 219);
boundingBox.plug(Y.Plugin.NodeFocusManager, {
				descendants: ".yui3-treenode-label",
				keys: {
					next: "down:40",    // Down arrow
					previous: "down:38" // Up arrow 
				},
				circular: false
			});
		}

	}, {
		
		NAME : TREEVIEW,
		ATTRS : {
			/**
			 * @attribute defaultChildType
			 * @type String
			 * @readOnly
			 * @default child type definition
			 */
			defaultChildType : {  
				value: "TreeNode",
				readOnly: true
			},
			/**
			 * @attribute toggleOnLabelClick
			 * @type Boolean
			 * @whether to toogle tree state on label clicks with addition to toggle control clicks
			 */
			toggleOnLabelClick : {
				value: true,
				validator: Y.Lang.isBoolean
			},
			/**
			 * @attribute startCollapsed
			 * @type Boolean
			 * @wither to render tree nodes expanded or collapsed by default
			 */
			startCollapsed : {
				value: true,
				validator: Y.Lang.isBoolean
			},
			/**
			 * @attribute loadOnDemand
			 * @type boolean
			 *
			 * @description Whether children of this node can be loaded on demand
			 * (when this tree node is expanded, for example).
			 * Use with gallery-yui3treeview-ng-datasource.
			 */
			loadOnDemand : {
				value: false,
				validator: Y.Lang.isBoolean
			}
		},
		HTML_PARSER : {
			children : function (srcNode) {
				_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "children", 275);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 276);
return findChildren(srcNode, "> li");
			}
		}
	});

/**
 * TreeNode widget. Provides a tree style node widget.
 * It extends WidgetParent and WidgetChild, please refer to it's documentation for more info.   
 * @class TreeNode
 * @constructor
 * @uses WidgetParent, WidgetChild
 * @extends Widget
 * @param {Object} config User configuration object.
 */
	_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 290);
Y.TreeNode = Y.Base.create(TREENODE, Y.Widget, [Y.WidgetParent, Y.WidgetChild], {

		/**
		 * Flag to determine if the tree is being rendered from markup or not
		 * @property _renderFromMarkup
		 * @protected
		 */
		_renderFromMarkup : false,

		CONTENT_TEMPLATE :  "<ul></ul>",
		
		BOUNDING_TEMPLATE : "<li></li>",
								
		TREENODELABEL_TEMPLATE : "<a class={labelClassName} role='treeitem' href='#'></a>",
		TREENODELABELCONTENT_TEMPLATE : "<span class={labelContentClassName}>{label}</span>",
		
		TOGGLECONTROL_TEMPLATE : "<span class={toggleClassName}></span>",

		bindUI : function() {
			// Both TreeVew and TreeNode share the same child event handling
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "bindUI", 308);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 310);
Y.TreeView.prototype._setChildEventHandlers.apply(this, arguments);
		},
		
		/**
			* Renders TreeNode
			* @method renderUI
			* @protected
			*/
		renderUI : function() {
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "renderUI", 318);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 319);
var boundingBox = this.get(BOUNDING_BOX),
                treeLabel,
				treeLabelHTML,
				labelContent,
				labelContentHTML,
				toggleControlHTML,
				label,
				isLeaf;
				
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 328);
toggleControlHTML = Y.substitute(this.TOGGLECONTROL_TEMPLATE,{toggleClassName: classNames.toggle});
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 329);
isLeaf = this.get("isLeaf");
			
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 331);
if (this._renderFromMarkup) {
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 332);
treeLabel = boundingBox.one(":first-child");
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 333);
treeLabel.set("role", "treeitem");
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 334);
treeLabel.addClass(classNames.label);
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 335);
labelContent = treeLabel.removeChild(treeLabel.one(":first-child"));
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 336);
labelContent.addClass(classNames.labelContent);
			} else {
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 338);
label = this.get("label");

				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 340);
treeLabelHTML = Y.substitute(this.TREENODELABEL_TEMPLATE, {labelClassName: classNames.label});
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 341);
labelContentHTML = Y.substitute(this.TREENODELABELCONTENT_TEMPLATE, {labelContentClassName: classNames.labelContent, label: label});
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 342);
labelContent = labelContentHTML;
				
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 344);
treeLabel = Y.Node.create(treeLabelHTML);
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 345);
boundingBox.prepend(treeLabel);
			}

			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 348);
if (!isLeaf) {
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 349);
treeLabel.appendChild(toggleControlHTML).appendChild(labelContent);
			} else {
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 351);
treeLabel.append(labelContent);
			}

			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 354);
boundingBox.set("role","presentation");

			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 356);
if (!isLeaf) {
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 357);
if (this.get("root").get("startCollapsed")) {
					_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 358);
boundingBox.addClass(classNames.collapsed);   
				} else {
					_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 360);
if (this.size() === 0) { // Nodes (not leafs) without children should start in collapsed mode
						_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 361);
boundingBox.addClass(classNames.collapsed);   
					}
				}
			}

			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 366);
if (isLeaf) {
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 367);
boundingBox.addClass(classNames.leaf);
			}
			
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 370);
if (this.get("isLast")) {
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 371);
this._markLast();
			}
		},

		/**
		 * Marks this node as the last one in list
		 * @method _markLast
		 * @protected
		 */
		_markLast : function() {
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "_markLast", 380);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 381);
this.get(BOUNDING_BOX).addClass(classNames.lastnode);
		},

		/**
		 * Unmarks this node as the last one in list
		 * @method _markLast
		 * @protected
		 */
		_unmarkLast : function() {
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "_unmarkLast", 389);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 390);
this.get(BOUNDING_BOX).removeClass(classNames.lastnode);
		},
		
		/**
			* Collapse the tree
			* @method collapse
			*/
		collapse : function () {
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "collapse", 397);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 398);
var boundingBox = this.get(BOUNDING_BOX);
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 399);
if (!boundingBox.hasClass(classNames.collapsed)) {
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 400);
boundingBox.toggleClass(classNames.collapsed);
			}
		},

		/**
			* Expands the tree
			* @method expand
			*/
		expand : function () {
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "expand", 408);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 409);
var boundingBox = this.get(BOUNDING_BOX);
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 410);
if (boundingBox.hasClass(classNames.collapsed)) {
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 411);
boundingBox.toggleClass(classNames.collapsed);
			}
		},

		/**
		 * Toggle current expaned/collapsed tree state
		 * @method toggleState
		 */
        toggleState : function () {
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "toggleState", 419);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 420);
this.get(BOUNDING_BOX).toggleClass(classNames.collapsed);
		},

		/**
		 * Returns breadcrumbs path of labels from root of the tree to this node (inclusive)
		 * @method path
		 * @param cfg {Object} An object literal with the following properties:
		 *     <dl>
		 *     <dt><code>labelAttr</code></dt>
		 *     <dd>Attribute name to use for node representation. Can be any attribute of TreeNode</dd>
		 *     <dt><code>reverse</code></dt>
		 *     <dd>Return breadcrumbs from the node to root instead of root to the node</dd>
		 *     </dl>
		 * @return {Array} array of node labels
		 */
		path : function(cfg) {
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "path", 435);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 436);
var bc = Array(),
				node = this;
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 438);
if (!cfg) {
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 439);
cfg = {};
			}
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 441);
if (!cfg.labelAttr) {
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 442);
cfg.labelAttr = "label";
			}
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 444);
while (node && (node instanceof Y.TreeNode) ) {
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 445);
bc.unshift(node.get(cfg.labelAttr));
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 446);
node = node.get("parent");
			}
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 448);
if (cfg.reverse) {
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 449);
bc = bc.reverse();
			}
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 451);
return bc;
		},

		/**
			* Returns toggle control node
			* @method _getToggleControlNode
			* @protected
			*/
		_getToggleControlNode : function() {
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "_getToggleControlNode", 459);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 460);
return this.get(BOUNDING_BOX).one("." + classNames.toggle);
		},
			
		/**
			* Returns label content node
			* @method _getLabelContentNode
			* @protected
			*/
		_getLabelContentNode : function() {
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "_getLabelContentNode", 468);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 469);
return this.get(BOUNDING_BOX).one("." + classNames.labelContent);
		}

    }, { 
		NAME : TREENODE,
		ATTRS : {
			/**
				* @attribute defaultChildType
				* @type String
				* @readOnly
				* @description default child type definition
				*/
			defaultChildType : {  
				value: "TreeNode",
				readOnly: true
			},
			/**
				* @attribute label
				* @type String
				*
				* @description TreeNode node label 
				*/
			label : {
				validator: Y.Lang.isString,
				value: ""
			},
			/**
				* @attribute loadOnDemand
				* @type boolean
				*
				* @description Whether children of this node can be loaded on demand
				* (when this tree node is expanded, for example).
				* Use with gallery-yui3treeview-ng-datasource.
				*/
			loadOnDemand : {
				value: false,
				validator: Y.Lang.isBoolean
			},
			/**
				* @attribute collapsed
				* @type Boolean
				* @readOnly
				*
				* @description Represents current treenode state - whether its collapsed or extended
				*/
			collapsed : {
				value: null,
				getter: function() {
					_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "getter", 516);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 517);
return this.get(BOUNDING_BOX).hasClass(classNames.collapsed);
				},
				readOnly: true
			},
			/**
				* @attribute clabel
				* @type String
				*
				* @description Canonical label for the node. 
				* You can set it to anything you like and use later with your external tools.
				*/
			clabel : {
				value: "",
				validator: Y.Lang.isString
			},
			/**
				* @attribute nodeId
				* @type String
				*
				* @description Signifies id of this node.
				* You can set it to anything you like and use later with your external tools.
				*/
			nodeId : {
				value: "",
				validator: Y.Lang.isString
			},
			/**
				* @attribute isLeaf
				* @type Boolean
				*
				* @description Signifies whether this node is a leaf node.
				* Nodes with loadOnDemand set to true are not considered leafs.
				*/
			isLeaf : {
				value: null,
				getter: function() {
					_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "getter", 552);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 553);
return (this.size() > 0 ? false : true) && (!this.get("loadOnDemand"));
				},
				readOnly: true
			},
			/**
			 * @attribute isLast
			 * @type Boolean
			 *
			 * @description Signifies whether this node is the last child of its parent.
			 */
			isLast : {
				value: null,
				getter: function() {
					_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "getter", 565);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 566);
return (this.get("index") + 1 == this.get("parent").size());
				},
				readOnly: true
			}
		},
		HTML_PARSER: {
			children : function (srcNode) {
				_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "children", 572);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 573);
return findChildren(srcNode, "> ul > li");
			},
			
			label : function(srcNode) {
				_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "label", 576);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 577);
var labelContentNode = srcNode.one("> a > span");
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 578);
if (labelContentNode !== null) {
					_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 579);
this._renderFromMarkup = true;
					_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 580);
return labelContentNode.getContent();
				}
			}
		}
	});

/**
 * CheckBoxTreeView widget. Extrends TreeView widget to support relevant events and methods od checkbox tree.
 * This widget represents the root cotainer for CheckBoxTreeNode objects that build the actual tree structure. 
 * Therefore this widget will not usually have any visual representation. Its also responsible for handling node events.
 * @class CheckBoxTreeView
 * @constructor
 * @extends TreeView
 * @param {Object} config User configuration object.
 */
	_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 595);
Y.CheckBoxTreeView = Y.Base.create(CHECKBOXTREEVIEW, Y.TreeView, [], {
		
		initializer : function(config) {
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "initializer", 597);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 598);
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
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "_checkDefaultFn", 608);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 609);
e.treenode.toggleCheckedState();
		},
		
		bindUI: function() {
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "bindUI", 612);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 613);
var boundingBox = this.get(BOUNDING_BOX);
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 614);
Y.CheckBoxTreeView.superclass.bindUI.apply(this, arguments);
			
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 616);
boundingBox.on("click", function(e) {
				_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "(anonymous 7)", 616);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 617);
var twidget = Y.Widget.getByNode(e.target),
					check = false;
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 619);
if (twidget instanceof Y.CheckBoxTreeNode) {
					_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 620);
Y.Array.each(e.target.get("className").split(" "), function (className) {
						_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "(anonymous 8)", 620);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 621);
switch (className) {
							case classNames.checkbox:
								_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 623);
check = true;
								_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 624);
break;
							case classNames.labelContent:
								_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 626);
if (this.get("checkOnLabelClick")) {
									_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 627);
check = true;
								}
								_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 629);
break;
						}
					}, this);
			
					_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 633);
if (check) {
						_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 634);
this.fire("check", {treenode: twidget});
					}
				}
			}, this);
			
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 639);
boundingBox.on("keypress", function(e) {
				_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "(anonymous 9)", 639);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 640);
var target = e.target,
					twidget = Y.Widget.getByNode(target),
					keycode = e.keyCode;
				
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 644);
if (!twidget instanceof Y.CheckBoxTreeNode) {
					_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 645);
return;
				}
				
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 648);
if (keycode == 32) {
					_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 649);
this.fire("check", {treenode: twidget});
					_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 650);
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
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "getChecked", 660);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 661);
var checkedChildren = Array(),
				halfcheckedChildren = Array(),
				child,
				analyzeChild;
				
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 666);
this.each(function (child) {
					_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "(anonymous 10)", 666);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 667);
if (child.get("checked") == checkStates.checked) {
						_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 668);
checkedChildren.push(child);
					} else {_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 669);
if (child.get("checked") == checkStates.halfchecked) {
						_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 670);
halfcheckedChildren.push(child);
					}}
				});
				
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 674);
analyzeChild = function (child) {
					_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "analyzeChild", 674);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 675);
if (child.get("checked") == checkStates.checked) {
						_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 676);
checkedChildren.push(child);
					} else {_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 677);
if (child.get("checked") == checkStates.halfchecked) {
						_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 678);
halfcheckedChildren.push(child);
					}}
				};
				
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 682);
while (halfcheckedChildren.length > 0) {
					_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 683);
child = halfcheckedChildren.pop();
					_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 684);
child.each(analyzeChild);
				}
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 686);
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
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "getCheckedPaths", 701);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 702);
var nodes = this.getChecked(),
			nodeArray = Array();
			
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 705);
if (!cfg) {
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 706);
cfg = {};
			}
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 708);
if (!cfg.labelAttr) {
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 709);
cfg.labelAttr = "label";
			}
			
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 712);
Y.Array.each(nodes, function(node) {
				_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "(anonymous 11)", 712);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 713);
nodeArray.push(node.path(cfg));
			});
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 715);
return nodeArray;
		}
		
	}, {
		NAME : CHECKBOXTREEVIEW,
		ATTRS : {
			/**
			 * @attribute defaultChildType
			 * @type String
			 * @readOnly
			 * @default child type definition
			 */
			defaultChildType : {  
				value: "CheckBoxTreeNode",
				readOnly: true
			},
			/**
			 * @attribute checkOnLabelClick
			 * @type Boolean
			 * @whether to change node checked state on label clicks with addition to checkbox control clicks
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
 * @extends Widget
 * @param {Object} config User configuration object.
 */
	_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 751);
Y.CheckBoxTreeNode = Y.Base.create(CHECKBOXTREENODE, Y.TreeNode, [], {
		
		initializer : function() {
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "initializer", 753);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 754);
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
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "_childCheckedSateChangeDefaultFn", 766);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 767);
var checkedChildren = 0,
				halfCheckedChildren = 0,
				cstate;
			
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 771);
this.each(function(child) {
				_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "(anonymous 12)", 771);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 772);
cstate = child.get("checked");
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 773);
if (cstate == checkStates.checked) {
					_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 774);
checkedChildren++;
				}
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 776);
if (cstate == checkStates.halfchecked) {
					_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 777);
halfCheckedChildren++;
				}
			});
				
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 781);
if (checkedChildren == this.size()) {
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 782);
this.set("checked", checkStates.checked);
			} else {_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 783);
if (checkedChildren > 0 || halfCheckedChildren > 0) {
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 784);
this.set("checked", checkStates.halfchecked);
			} else {
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 786);
this.set("checked", checkStates.unchecked);
			}}
			
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 789);
if (!this.isRoot()) {
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 790);
this.get("parent").fire("childCheckedSateChange");
			}
		},
		
		bindUI : function() {
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "bindUI", 794);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 795);
Y.CheckBoxTreeNode.superclass.bindUI.apply(this, arguments);
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 796);
this.on("checkedChange", this._onCheckedChange);
		},
		
		/**
		* Event handler that updates UI according to checked attribute change
		* @method _onCheckedChange
		* @protected
		*/
		_onCheckedChange: function(e) {
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "_onCheckedChange", 804);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 805);
e.stopPropagation();
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 806);
this._updateCheckedStateUI(e.prevVal, e.newVal);
		},
		
		/**
		* Synchronize CSS classes to conform to checked state
		* @method _updateCheckedStateUI
		* @protected
		*/
		_updateCheckedStateUI : function(oldState, newState) {
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "_updateCheckedStateUI", 814);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 815);
var checkBox = this._getCheckBoxNode();
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 816);
checkBox.removeClass(checkStatesClasses[oldState]);
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 817);
checkBox.addClass(checkStatesClasses[newState]);
		},
		
		/**
		* Returns checkbox node
		* @method _getCheckBoxNode
		* @protected
		*/
		_getCheckBoxNode : function() {
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "_getCheckBoxNode", 825);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 826);
return this.get(BOUNDING_BOX).one("." + classNames.checkbox);
		},
		
		CHECKBOX_TEMPLATE : "<span class={checkboxClassName}></span>",
		
		renderUI : function() {
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "renderUI", 831);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 832);
var parentNode,
			labelContentNode,
			checkboxNode;
			
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 836);
Y.CheckBoxTreeNode.superclass.renderUI.apply(this, arguments);
			
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 838);
checkboxNode = Y.Node.create(Y.substitute(this.CHECKBOX_TEMPLATE, {checkboxClassName: classNames.checkbox}));
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 839);
labelContentNode = this._getLabelContentNode();
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 840);
parentNode = labelContentNode.get("parentNode");
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 841);
labelContentNode.remove();
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 842);
checkboxNode.append(labelContentNode);
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 843);
parentNode.append(checkboxNode);
			
			// update state
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 846);
this._getCheckBoxNode().addClass(checkStatesClasses[this.get("checked")]);
			
			// reuse CSS
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 849);
this.get(CONTENT_BOX).addClass(classNames.content);
		},
		
		syncUI : function() {
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "syncUI", 852);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 853);
Y.CheckBoxTreeNode.superclass.syncUI.apply(this, arguments);
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 854);
this._syncChildren();
		},
		
		
		/**
		* Toggles checked / unchecked state of the node
		* @method toggleCheckedState
		*/
		toggleCheckedState : function() {
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "toggleCheckedState", 862);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 863);
if (this.get("checked") == checkStates.checked) {
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 864);
this._uncheck();
			} else {
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 866);
this._check();
			}
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 868);
this.get("parent").fire("childCheckedSateChange");
		},
		
		/**
		 * Sets this node as checked and propagates to children
		 * @method _check
		 * @protected
		 */
		_check : function() {
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "_check", 876);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 877);
this.set("checked", checkStates.checked);
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 878);
this.each(function(child) {
				_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "(anonymous 13)", 878);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 879);
child._check();
			});
		},
		
		/**
		 * Set this node as unchecked and propagates to children
		 * @method _uncheck
		 * @protected
		 */
		_uncheck : function() {
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "_uncheck", 888);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 889);
this.set("checked", checkStates.unchecked);
			_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 890);
this.each(function(child) {
				_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "(anonymous 14)", 890);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 891);
child._uncheck();
			});
		},
		
		/**
		 * Synchronizes children states to match the state of the current node
		 * @method _uncheck
		 * @protected
		 */
		_syncChildren : function() {
			_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "_syncChildren", 900);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 901);
if (this.get("checked") == checkStates.unchecked) {
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 902);
this._uncheck();
			} else {_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 903);
if (this.get("checked") == checkStates.checked) {
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 904);
this._check();
			} else {
				_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 906);
this.each(function (child) {
					_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "(anonymous 15)", 906);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 907);
child._syncChildren();
				});
			}}
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
			* @description default child type definition. Accepts either <code>unchecked</code>, <code>halfchecked</code>, <code>checked</code>
			* or correspondingly 10, 20, 30.
			*/
			checked : {
				value : 10,
				setter : function(val) {
					_yuitest_coverfunc("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", "setter", 933);
_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 934);
var returnVal = Y.Attribute.INVALID_VALUE;
					_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 935);
if (checkStates[val] !== null) {
						_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 936);
returnVal = checkStates[val];
					} else {_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 937);
if ([10, 20, 30].indexOf(val) >= 0) {
						_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 938);
returnVal = val;
					}}
					_yuitest_coverline("/build/gallery-yui3treeview-ng/gallery-yui3treeview-ng.js", 940);
return returnVal;
				}
			}
		}
	});


}, 'gallery-2012.08.29-20-10' ,{skinnable:true, requires:['substitute', 'widget', 'widget-parent', 'widget-child', 'node-focusmanager', 'array-extras']});
