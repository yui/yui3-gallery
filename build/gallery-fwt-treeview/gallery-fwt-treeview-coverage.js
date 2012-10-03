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
_yuitest_coverage["/build/gallery-fwt-treeview/gallery-fwt-treeview.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-fwt-treeview/gallery-fwt-treeview.js",
    code: []
};
_yuitest_coverage["/build/gallery-fwt-treeview/gallery-fwt-treeview.js"].code=["YUI.add('gallery-fwt-treeview', function(Y) {","","'use strict';","/*jslint white: true */","var Lang = Y.Lang,","	// DOT = '.',","	getCName = Y.ClassNameManager.getClassName,","	cName = function (name) {","		return getCName('fw-treeview', name);","	},","	CNAMES = {","		toggle: cName('toggle'),","		icon: cName('icon'),","		selection: cName('selection'),","		content: cName('content'),","		sel_prefix: cName('selected-state')","	},","	CBX = 'contentBox',","	NOT_SELECTED = 0,","	PARTIALLY_SELECTED = 1,","	FULLY_SELECTED = 2;","/** Creates a Treeview using the FlyweightTreeManager extension to handle its nodes."," * It creates the tree based on an object passed as the `tree` attribute in the constructor."," * @example"," *","	var tv = new Y.FWTreeView({tree: [","		{","			label:'label 0',","			children: [","				{","					label: 'label 0-0',","					children: [","						{label: 'label 0-0-0'},","						{label: 'label 0-0-1'}","					]","				},","				{label: 'label 0-1'}","			]","		},","		{label: 'label 1'}","","	]});","	tv.render('#container');",""," * @module gallery-fwt-treeview"," */","/**"," * @class FWTreeView"," * @extends Widget"," * @uses FlyweightTreeManager"," */","/**"," * @constructor"," * @param config {Object} Configuration attributes, amongst them:"," * @param config.tree {Array} Array of objects defining the first level of nodes."," * @param config.tree.label {String} Text of HTML markup to be shown in the node"," * @param [config.tree.expanded=true] {Boolean} Whether the children of this node should be visible."," * @param [config.tree.children] {Array} Further definitions for the children of this node"," * @param [config.tree.type=FWTreeNode] {FWTreeNode | String} Class used to create instances for this node."," * It can be a reference to an object or a name that can be resolved as `Y[name]`."," * @param [config.tree.id=Y.guid()] {String} Identifier to assign to the DOM element containing this node."," * @param [config.tree.template] {String} Template for this particular node. "," */","Y.FWTreeView = Y.Base.create(","	'fw-treeview',","	Y.Widget,","	[Y.FlyweightTreeManager],","	{","		/**","		 * Widget lifecycle method","		 * @method initializer","		 * @param config {object} configuration object of which ","		 * `tree` contains the tree configuration.","		 */","		initializer: function (config) {","			this._domEvents = ['click'];","			this._loadConfig(config.tree);","		},","		/**","		 * Widget lifecyle method","		 * I opted for not including this method in FlyweightTreeManager so that","		 * it can be used to extend Base, not just Widget","		 * @method renderUI","		 * @protected","		 */","		renderUI: function () {","			this.get(CBX).setContent(this._getHTML());","		},","		/**","		 * Overrides the default CONTENT_TEMPLATE to make it an unordered list instead of a div","		 * @property CONTENT_TEMPLATE","		 * @type String","		 */","		CONTENT_TEMPLATE: '<ul></ul>'","","	},","	{","		ATTRS: {","			/**","			 * Override for the `defaultType` value of FlyweightTreeManager","			 * so it creates FWTreeNode instances instead of the default.","			 * @attribute defaultType","			 * @type String","			 * @default 'FWTreeNode'","			 */","			defaultType: {","				value: 'FWTreeNode'","			},","			/**","			 * Enables toggling by clicking on the label item instead of just the toggle icon.","			 * @attribute toggleOnLabelClick","			 * @type Boolean","			 * @value false","			 */","			toggleOnLabelClick: {","				value:false,","				validator:Lang.isBoolean","			}","","","		}","","	}",");","/** This class must not be generated directly.  "," *  Instances of it will be provided by FWTreeView as required."," *  "," *  Subclasses might be defined based on it.  "," *  Usually, they will add further attributes and redefine the TEMPLATE to "," *  show those extra attributes."," *  "," *  @module gallery-fwt-treeview"," */","/**"," *    "," *  @class FWTreeNode"," *  @extends FlyweightTreeNode"," */","/**"," *  @constructor"," */"," Y.FWTreeNode = Y.Base.create(","	'fw-treenode',","	Y.FlyweightTreeNode,","	[],","	{","		initializer: function() {","			this.after('click', this._afterClick, this);","			this.after('selectedChange', this._afterSelectedChange, this);","		},","		/**","		 * Responds to the click event by toggling the node","		 * @method _afterClick","		 * @param ev {EventFacade}","		 * @private","		 */","		_afterClick: function (ev) {","			var target = ev.domEvent.target;","			if (target.hasClass(CNAMES.toggle)) {","				this.toggle();","			} else if (target.hasClass(CNAMES.selection)) {","				this.toggleSelection();","			} else if (target.hasClass(CNAMES.content) || target.hasClass(CNAMES.icon)) {","				if (this.get('root').get('toggleOnLabelClick')) {","					this.toggle();","				}","			}","		},","		/**","		 * Sugar method to toggle the selected state of a node.","		 * @method toggleSelection","		 */","		toggleSelection: function() {","			this.set('selected', (this.get('selected')?NOT_SELECTED:FULLY_SELECTED));","		},","		/**","		 * Changes the UI to reflect the selected state and propagates the selection up and/or down.","		 * @method _afterSelectedChange","		 * @param ev {EventFacade} out of which","		 * @param ev.src {String} if not undefined it can be `'propagateUp'` or `'propagateDown'` so that propagation goes in just one direction and doesn't bounce back.","		 * @private","		 */","		_afterSelectedChange: function (ev) {","			var selected = ev.newVal;","				","			if (!this.isRoot()) {","				Y.one('#' + this.get('id')).replaceClass('yui3-fw-treeview-selected-state-' + ev.prevVal,'yui3-fw-treeview-selected-state-' + selected);","				if (this.get('propagateUp') && ev.src !== 'propagatingDown') {","					this.getParent()._childSelectedChange().release();","				}","			}","			if (this.get('propagateDown') && ev.src !== 'propagatingUp') {","				this.forSomeChildren(function(node) {","					node.set('selected' , selected, 'propagatingDown');","				});","			}","		},","		/**","		 * Overrides the original in FlyweightTreeNode so as to propagate the selected state","		 * on dynamically loaded nodes.","		 * @method _dynamicLoadReturn","		 * @private","		 */","		_dynamicLoadReturn: function () {","			 Y.FWTreeNode.superclass._dynamicLoadReturn.apply(this, arguments);","			 if (this.get('propagateDown')) {","				var selected = this.get('selected');","				this.forSomeChildren(function(node) {","					node.set('selected' , selected, 'propagatingDown');","				});","			}","			 ","		},","		/**","		 * When propagating selection up, it is called by a child when changing its selected state","		 * so that the parent adjusts its own state accordingly.","		 * @method _childSelectedChange","		 * @private","		 */","		_childSelectedChange: function () {","			var count = 0, selCount = 0;","			this.forSomeChildren(function (node) {","				count +=2;","				selCount += node.get('selected');","			});","			this.set('selected', (selCount === 0?NOT_SELECTED:(selCount === count?FULLY_SELECTED:PARTIALLY_SELECTED)), {src:'propagatingUp'});","			return this;","		}","		","	},","	{","		/**","		 * Template to produce the markup for a node in the tree.","		 * @property TEMPLATE","		 * @type String","		 * @static","		 */","		TEMPLATE: Lang.sub('<li id=\"{id}\" class=\"{cname_node} {sel_prefix}-{selected}\"><div class=\"{toggle}\"></div><div class=\"{icon}\"></div><div class=\"{selection}\"></div><div class=\"{content}\">{label}</div><ul class=\"{cname_children}\">{children}</ul></li>', CNAMES),","		/**","		 * Constant to use with the `selected` attribute to indicate the node is not selected.","		 * @property NOT_SELECTED","		 * @type integer","		 * @value 0","		 * @static","		 * @final","		 */","		NOT_SELECTED:NOT_SELECTED,","		/**","		 * Constant to use with the `selected` attribute to indicate some ","		 * but not all of the children of this node are selected.","		 * This state should only be acquired by upward propagation from descendants.","		 * @property PARTIALLY_SELECTED","		 * @type integer","		 * @value 1","		 * @static","		 * @final","		 */","		PARTIALLY_SELECTED:PARTIALLY_SELECTED,","		/**","		 * Constant to use with the `selected` attribute to indicate the node is selected.","		 * @property FULLY_SELECTED","		 * @type integer","		 * @value 2","		 * @static","		 * @final","		 */","		FULLY_SELECTED:FULLY_SELECTED,","		ATTRS: {","			/**","			 * Selected/highlighted state of the node. ","			 * It can be","			 * ","			 * - Y.FWTreeNode.NOT_SELECTED (0) not selected","			 * - Y.FWTreeNode.PARTIALLY_SELECTED (1) partially selected: some children are selected, some not or partially selected.","			 * - Y.FWTreeNode.FULLY_SELECTED (2) fully selected.","			 * ","			 * The partially selected state can only be the result of selection propagating up from a child node.","			 * The attribute might return PARTIALLY_SELECTED but the developer should never set that value.","			 * @attribute selected","			 * @type Integer","			 * @value NOT_SELECTED","			 */","			selected: {","				value:NOT_SELECTED,","				validator:function (value) {","					return value === NOT_SELECTED || value === FULLY_SELECTED || value === PARTIALLY_SELECTED;","				}","			},","			/**","			 * Whether selection of one node should propagate to its parent.","			 * @attribute propagateUp","			 * @type Boolean","			 * @value true","			 */","			propagateUp: {","				value: true,","				validator: Lang.isBoolean","			},","			/**","			 * Whether selection of one node should propagate to its children.","			 * @attribute propagateDown","			 * @type Boolean","			 * @value true","			 */","			propagateDown: {","				value: true,","				validator: Lang.isBoolean","			}","		}","	}",");","","","","}, 'gallery-2012.10.03-20-02' ,{requires:['gallery-flyweight-tree', 'widget', 'base-build'], skinnable:true});"];
_yuitest_coverage["/build/gallery-fwt-treeview/gallery-fwt-treeview.js"].lines = {"1":0,"3":0,"5":0,"9":0,"64":0,"76":0,"77":0,"87":0,"142":0,"148":0,"149":0,"158":0,"159":0,"160":0,"161":0,"162":0,"163":0,"164":0,"165":0,"174":0,"184":0,"186":0,"187":0,"188":0,"189":0,"192":0,"193":0,"194":0,"205":0,"206":0,"207":0,"208":0,"209":0,"221":0,"222":0,"223":0,"224":0,"226":0,"227":0,"286":0};
_yuitest_coverage["/build/gallery-fwt-treeview/gallery-fwt-treeview.js"].functions = {"cName:8":0,"initializer:75":0,"renderUI:86":0,"initializer:147":0,"_afterClick:157":0,"toggleSelection:173":0,"(anonymous 2):193":0,"_afterSelectedChange:183":0,"(anonymous 3):208":0,"_dynamicLoadReturn:204":0,"(anonymous 4):222":0,"_childSelectedChange:220":0,"validator:285":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-fwt-treeview/gallery-fwt-treeview.js"].coveredLines = 40;
_yuitest_coverage["/build/gallery-fwt-treeview/gallery-fwt-treeview.js"].coveredFunctions = 14;
_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 1);
YUI.add('gallery-fwt-treeview', function(Y) {

_yuitest_coverfunc("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 3);
'use strict';
/*jslint white: true */
_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 5);
var Lang = Y.Lang,
	// DOT = '.',
	getCName = Y.ClassNameManager.getClassName,
	cName = function (name) {
		_yuitest_coverfunc("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", "cName", 8);
_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 9);
return getCName('fw-treeview', name);
	},
	CNAMES = {
		toggle: cName('toggle'),
		icon: cName('icon'),
		selection: cName('selection'),
		content: cName('content'),
		sel_prefix: cName('selected-state')
	},
	CBX = 'contentBox',
	NOT_SELECTED = 0,
	PARTIALLY_SELECTED = 1,
	FULLY_SELECTED = 2;
/** Creates a Treeview using the FlyweightTreeManager extension to handle its nodes.
 * It creates the tree based on an object passed as the `tree` attribute in the constructor.
 * @example
 *
	var tv = new Y.FWTreeView({tree: [
		{
			label:'label 0',
			children: [
				{
					label: 'label 0-0',
					children: [
						{label: 'label 0-0-0'},
						{label: 'label 0-0-1'}
					]
				},
				{label: 'label 0-1'}
			]
		},
		{label: 'label 1'}

	]});
	tv.render('#container');

 * @module gallery-fwt-treeview
 */
/**
 * @class FWTreeView
 * @extends Widget
 * @uses FlyweightTreeManager
 */
/**
 * @constructor
 * @param config {Object} Configuration attributes, amongst them:
 * @param config.tree {Array} Array of objects defining the first level of nodes.
 * @param config.tree.label {String} Text of HTML markup to be shown in the node
 * @param [config.tree.expanded=true] {Boolean} Whether the children of this node should be visible.
 * @param [config.tree.children] {Array} Further definitions for the children of this node
 * @param [config.tree.type=FWTreeNode] {FWTreeNode | String} Class used to create instances for this node.
 * It can be a reference to an object or a name that can be resolved as `Y[name]`.
 * @param [config.tree.id=Y.guid()] {String} Identifier to assign to the DOM element containing this node.
 * @param [config.tree.template] {String} Template for this particular node. 
 */
_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 64);
Y.FWTreeView = Y.Base.create(
	'fw-treeview',
	Y.Widget,
	[Y.FlyweightTreeManager],
	{
		/**
		 * Widget lifecycle method
		 * @method initializer
		 * @param config {object} configuration object of which 
		 * `tree` contains the tree configuration.
		 */
		initializer: function (config) {
			_yuitest_coverfunc("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", "initializer", 75);
_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 76);
this._domEvents = ['click'];
			_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 77);
this._loadConfig(config.tree);
		},
		/**
		 * Widget lifecyle method
		 * I opted for not including this method in FlyweightTreeManager so that
		 * it can be used to extend Base, not just Widget
		 * @method renderUI
		 * @protected
		 */
		renderUI: function () {
			_yuitest_coverfunc("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", "renderUI", 86);
_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 87);
this.get(CBX).setContent(this._getHTML());
		},
		/**
		 * Overrides the default CONTENT_TEMPLATE to make it an unordered list instead of a div
		 * @property CONTENT_TEMPLATE
		 * @type String
		 */
		CONTENT_TEMPLATE: '<ul></ul>'

	},
	{
		ATTRS: {
			/**
			 * Override for the `defaultType` value of FlyweightTreeManager
			 * so it creates FWTreeNode instances instead of the default.
			 * @attribute defaultType
			 * @type String
			 * @default 'FWTreeNode'
			 */
			defaultType: {
				value: 'FWTreeNode'
			},
			/**
			 * Enables toggling by clicking on the label item instead of just the toggle icon.
			 * @attribute toggleOnLabelClick
			 * @type Boolean
			 * @value false
			 */
			toggleOnLabelClick: {
				value:false,
				validator:Lang.isBoolean
			}


		}

	}
);
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
 _yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 142);
Y.FWTreeNode = Y.Base.create(
	'fw-treenode',
	Y.FlyweightTreeNode,
	[],
	{
		initializer: function() {
			_yuitest_coverfunc("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", "initializer", 147);
_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 148);
this.after('click', this._afterClick, this);
			_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 149);
this.after('selectedChange', this._afterSelectedChange, this);
		},
		/**
		 * Responds to the click event by toggling the node
		 * @method _afterClick
		 * @param ev {EventFacade}
		 * @private
		 */
		_afterClick: function (ev) {
			_yuitest_coverfunc("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", "_afterClick", 157);
_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 158);
var target = ev.domEvent.target;
			_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 159);
if (target.hasClass(CNAMES.toggle)) {
				_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 160);
this.toggle();
			} else {_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 161);
if (target.hasClass(CNAMES.selection)) {
				_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 162);
this.toggleSelection();
			} else {_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 163);
if (target.hasClass(CNAMES.content) || target.hasClass(CNAMES.icon)) {
				_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 164);
if (this.get('root').get('toggleOnLabelClick')) {
					_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 165);
this.toggle();
				}
			}}}
		},
		/**
		 * Sugar method to toggle the selected state of a node.
		 * @method toggleSelection
		 */
		toggleSelection: function() {
			_yuitest_coverfunc("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", "toggleSelection", 173);
_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 174);
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
			_yuitest_coverfunc("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", "_afterSelectedChange", 183);
_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 184);
var selected = ev.newVal;
				
			_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 186);
if (!this.isRoot()) {
				_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 187);
Y.one('#' + this.get('id')).replaceClass('yui3-fw-treeview-selected-state-' + ev.prevVal,'yui3-fw-treeview-selected-state-' + selected);
				_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 188);
if (this.get('propagateUp') && ev.src !== 'propagatingDown') {
					_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 189);
this.getParent()._childSelectedChange().release();
				}
			}
			_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 192);
if (this.get('propagateDown') && ev.src !== 'propagatingUp') {
				_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 193);
this.forSomeChildren(function(node) {
					_yuitest_coverfunc("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", "(anonymous 2)", 193);
_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 194);
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
			 _yuitest_coverfunc("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", "_dynamicLoadReturn", 204);
_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 205);
Y.FWTreeNode.superclass._dynamicLoadReturn.apply(this, arguments);
			 _yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 206);
if (this.get('propagateDown')) {
				_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 207);
var selected = this.get('selected');
				_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 208);
this.forSomeChildren(function(node) {
					_yuitest_coverfunc("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", "(anonymous 3)", 208);
_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 209);
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
			_yuitest_coverfunc("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", "_childSelectedChange", 220);
_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 221);
var count = 0, selCount = 0;
			_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 222);
this.forSomeChildren(function (node) {
				_yuitest_coverfunc("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", "(anonymous 4)", 222);
_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 223);
count +=2;
				_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 224);
selCount += node.get('selected');
			});
			_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 226);
this.set('selected', (selCount === 0?NOT_SELECTED:(selCount === count?FULLY_SELECTED:PARTIALLY_SELECTED)), {src:'propagatingUp'});
			_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 227);
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
					_yuitest_coverfunc("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", "validator", 285);
_yuitest_coverline("/build/gallery-fwt-treeview/gallery-fwt-treeview.js", 286);
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



}, 'gallery-2012.10.03-20-02' ,{requires:['gallery-flyweight-tree', 'widget', 'base-build'], skinnable:true});
