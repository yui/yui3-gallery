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
_yuitest_coverage["/build/gallery-busy/gallery-busy.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-busy/gallery-busy.js",
    code: []
};
_yuitest_coverage["/build/gallery-busy/gallery-busy.js"].code=["YUI.add('gallery-busy', function(Y) {","","\"use strict\";","","/**"," * @module gallery-busy"," */","","/**"," * A module that captures busy requests within a container"," * Hiding the busy container can be achieved by firing a Global event: busy:hide"," * Based on gallery-busyoverlay"," * "," * @main gallery-busy"," * @class Busy"," * @constructor"," * @param config {Object} configuration"," */","function Busy(config)","{","	Busy.superclass.constructor.apply(this, arguments);","}","","Busy.NAME = \"Busy\";","Busy.NS   = \"busy\";","","Busy.ATTRS =","{","	/**","	 * The container that should be listened to for create busy overlay events","	 * @attribute container","	 * @type node|selector","	 * @default null","	*/","	container:{","		value:null,","		setter:Y.one","	},","	/**","	 * The selector within the container that activates the busy overlay","	 * @attribute selector","	 * @type string","	 * @default null","	*/","	selector:{","		value:null,","		validator: Y.Lang.isString","	},","	/**","	 * When defined, the busy overlay with take the globalNode as default target","	 * You can still define a custom node in the data-busy attribute of the selector","	 * @attribute globalNode","	 * @type node|selector","	 * @default null","	*/","	globalNode:{","		value:null,","		setter: Y.Node","	},","	/**","	 * CSS class to apply to the overlay.","	 *","	 * @attribute css","	 * @type {String}","	 * @default \"yui3-component-busy\"","	 */","	css:","	{","		value:     'yui3-gallery-busy',","		validator: Y.Lang.isString","	}","};","","Y.extend(Busy, Y.Base,","{","	initializer: function(config)","	{","		this.o = Y.Node.create('<div style=\"position:absolute;display:none;visibility:hidden;\"></div>');","		this.o.set('className', this.get('css'));","		Y.one('body').prepend(this.o);","","		Y.delegate('click',function(e){","			if(this.isVisible())","				this.hide();","			","			var target = e.currentTarget.getData('busy');","			","			this.setVisible(target && !Y.Lang.isObject(target)? Y.one(target) : null,true);","			","		}, config.container, config.selector, this);","		","		Y.Global.on('msa-busy:show', function(e){","			this.show(e && e.node);","		}, this);","		","		Y.Global.on('msa-busy:hide',this.hide, this);","		","		this.on('cssChange', function(e){","			this.o.set('className', e.newVal);","		});","	},","","	destructor: function()","	{","		this.o.remove(true);","		this.set('globalNode',null);","	},","","	/**","	 * @method isVisible","	 * @return {Boolean} true if the overlay is visible","	 */","	isVisible: function()","	{","		return (this.o.getStyle('visibility') != 'hidden');","	},","","	/**","	 * Show the overlay.","	 * ","	 * @method show","	 */","	show: function(node)","	{","		this.setVisible(node,true);","	},","","	/**","	 * Hide the overlay.","	 * ","	 * @method hide","	 */","	hide: function()","	{","		this.setVisible(null,false);","	},","","	/**","	 * Set the visibility of the overlay.","	 * ","	 * @method setVisible","	 * @param visible {Boolean}","	 */","	setVisible: function(node,visible)","	{","	","		var node = node || this.get('globalNode');","		this.target_region = null;","","		this.o.setStyle('display', (visible ? '' : 'none'));","		","		if(node && visible)","			this.resizeOverlay(node);","			","		this.o.setStyle('visibility', (visible ? '' : 'hidden'));","","		if (node && visible){","			if (!this.timer)","			{","				this.timer = Y.later(500, this, this.resizeOverlay, node, true);","			}","","			Y.one('body').addClass('yui3-busyoverlay-browser-hacks');","		}else{","			if (this.timer)","			{","				this.timer.cancel();","				this.timer = null;","			}","","			Y.one('body').removeClass('yui3-busyoverlay-browser-hacks');","		}","	},","	resizeOverlay: function (node){","		var r = node.get('region');","		if (r &&","			(!this.target_region                    ||","			 r.top    !== this.target_region.top    ||","			 r.bottom !== this.target_region.bottom ||","			 r.left   !== this.target_region.left   ||","			 r.right  !== this.target_region.right))","		{","			this.target_region = r;","","			this.o.setXY([r.left, r.top]);","			this.o.setStyle('width',  r.width  + 'px');","			this.o.setStyle('height', r.height + 'px');","		}","	}","});","","Y.namespace(\"MSA\");","Y.MSA.Busy = Busy;","","","}, 'gallery-2012.11.07-21-32' ,{requires:['base','node-base','node-style','event-tap','event-delegate','node-screen'], skinnable:true});"];
_yuitest_coverage["/build/gallery-busy/gallery-busy.js"].lines = {"1":0,"3":0,"19":0,"21":0,"24":0,"25":0,"27":0,"74":0,"78":0,"79":0,"80":0,"82":0,"83":0,"84":0,"86":0,"88":0,"92":0,"93":0,"96":0,"98":0,"99":0,"105":0,"106":0,"115":0,"125":0,"135":0,"147":0,"148":0,"150":0,"152":0,"153":0,"155":0,"157":0,"158":0,"160":0,"163":0,"165":0,"167":0,"168":0,"171":0,"175":0,"176":0,"183":0,"185":0,"186":0,"187":0,"192":0,"193":0};
_yuitest_coverage["/build/gallery-busy/gallery-busy.js"].functions = {"Busy:19":0,"(anonymous 2):82":0,"(anonymous 3):92":0,"(anonymous 4):98":0,"initializer:76":0,"destructor:103":0,"isVisible:113":0,"show:123":0,"hide:133":0,"setVisible:144":0,"resizeOverlay:174":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-busy/gallery-busy.js"].coveredLines = 48;
_yuitest_coverage["/build/gallery-busy/gallery-busy.js"].coveredFunctions = 12;
_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 1);
YUI.add('gallery-busy', function(Y) {

_yuitest_coverfunc("/build/gallery-busy/gallery-busy.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 3);
"use strict";

/**
 * @module gallery-busy
 */

/**
 * A module that captures busy requests within a container
 * Hiding the busy container can be achieved by firing a Global event: busy:hide
 * Based on gallery-busyoverlay
 * 
 * @main gallery-busy
 * @class Busy
 * @constructor
 * @param config {Object} configuration
 */
_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 19);
function Busy(config)
{
	_yuitest_coverfunc("/build/gallery-busy/gallery-busy.js", "Busy", 19);
_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 21);
Busy.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 24);
Busy.NAME = "Busy";
_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 25);
Busy.NS   = "busy";

_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 27);
Busy.ATTRS =
{
	/**
	 * The container that should be listened to for create busy overlay events
	 * @attribute container
	 * @type node|selector
	 * @default null
	*/
	container:{
		value:null,
		setter:Y.one
	},
	/**
	 * The selector within the container that activates the busy overlay
	 * @attribute selector
	 * @type string
	 * @default null
	*/
	selector:{
		value:null,
		validator: Y.Lang.isString
	},
	/**
	 * When defined, the busy overlay with take the globalNode as default target
	 * You can still define a custom node in the data-busy attribute of the selector
	 * @attribute globalNode
	 * @type node|selector
	 * @default null
	*/
	globalNode:{
		value:null,
		setter: Y.Node
	},
	/**
	 * CSS class to apply to the overlay.
	 *
	 * @attribute css
	 * @type {String}
	 * @default "yui3-component-busy"
	 */
	css:
	{
		value:     'yui3-gallery-busy',
		validator: Y.Lang.isString
	}
};

_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 74);
Y.extend(Busy, Y.Base,
{
	initializer: function(config)
	{
		_yuitest_coverfunc("/build/gallery-busy/gallery-busy.js", "initializer", 76);
_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 78);
this.o = Y.Node.create('<div style="position:absolute;display:none;visibility:hidden;"></div>');
		_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 79);
this.o.set('className', this.get('css'));
		_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 80);
Y.one('body').prepend(this.o);

		_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 82);
Y.delegate('click',function(e){
			_yuitest_coverfunc("/build/gallery-busy/gallery-busy.js", "(anonymous 2)", 82);
_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 83);
if(this.isVisible())
				{_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 84);
this.hide();}
			
			_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 86);
var target = e.currentTarget.getData('busy');
			
			_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 88);
this.setVisible(target && !Y.Lang.isObject(target)? Y.one(target) : null,true);
			
		}, config.container, config.selector, this);
		
		_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 92);
Y.Global.on('msa-busy:show', function(e){
			_yuitest_coverfunc("/build/gallery-busy/gallery-busy.js", "(anonymous 3)", 92);
_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 93);
this.show(e && e.node);
		}, this);
		
		_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 96);
Y.Global.on('msa-busy:hide',this.hide, this);
		
		_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 98);
this.on('cssChange', function(e){
			_yuitest_coverfunc("/build/gallery-busy/gallery-busy.js", "(anonymous 4)", 98);
_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 99);
this.o.set('className', e.newVal);
		});
	},

	destructor: function()
	{
		_yuitest_coverfunc("/build/gallery-busy/gallery-busy.js", "destructor", 103);
_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 105);
this.o.remove(true);
		_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 106);
this.set('globalNode',null);
	},

	/**
	 * @method isVisible
	 * @return {Boolean} true if the overlay is visible
	 */
	isVisible: function()
	{
		_yuitest_coverfunc("/build/gallery-busy/gallery-busy.js", "isVisible", 113);
_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 115);
return (this.o.getStyle('visibility') != 'hidden');
	},

	/**
	 * Show the overlay.
	 * 
	 * @method show
	 */
	show: function(node)
	{
		_yuitest_coverfunc("/build/gallery-busy/gallery-busy.js", "show", 123);
_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 125);
this.setVisible(node,true);
	},

	/**
	 * Hide the overlay.
	 * 
	 * @method hide
	 */
	hide: function()
	{
		_yuitest_coverfunc("/build/gallery-busy/gallery-busy.js", "hide", 133);
_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 135);
this.setVisible(null,false);
	},

	/**
	 * Set the visibility of the overlay.
	 * 
	 * @method setVisible
	 * @param visible {Boolean}
	 */
	setVisible: function(node,visible)
	{
	
		_yuitest_coverfunc("/build/gallery-busy/gallery-busy.js", "setVisible", 144);
_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 147);
var node = node || this.get('globalNode');
		_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 148);
this.target_region = null;

		_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 150);
this.o.setStyle('display', (visible ? '' : 'none'));
		
		_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 152);
if(node && visible)
			{_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 153);
this.resizeOverlay(node);}
			
		_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 155);
this.o.setStyle('visibility', (visible ? '' : 'hidden'));

		_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 157);
if (node && visible){
			_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 158);
if (!this.timer)
			{
				_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 160);
this.timer = Y.later(500, this, this.resizeOverlay, node, true);
			}

			_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 163);
Y.one('body').addClass('yui3-busyoverlay-browser-hacks');
		}else{
			_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 165);
if (this.timer)
			{
				_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 167);
this.timer.cancel();
				_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 168);
this.timer = null;
			}

			_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 171);
Y.one('body').removeClass('yui3-busyoverlay-browser-hacks');
		}
	},
	resizeOverlay: function (node){
		_yuitest_coverfunc("/build/gallery-busy/gallery-busy.js", "resizeOverlay", 174);
_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 175);
var r = node.get('region');
		_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 176);
if (r &&
			(!this.target_region                    ||
			 r.top    !== this.target_region.top    ||
			 r.bottom !== this.target_region.bottom ||
			 r.left   !== this.target_region.left   ||
			 r.right  !== this.target_region.right))
		{
			_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 183);
this.target_region = r;

			_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 185);
this.o.setXY([r.left, r.top]);
			_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 186);
this.o.setStyle('width',  r.width  + 'px');
			_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 187);
this.o.setStyle('height', r.height + 'px');
		}
	}
});

_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 192);
Y.namespace("MSA");
_yuitest_coverline("/build/gallery-busy/gallery-busy.js", 193);
Y.MSA.Busy = Busy;


}, 'gallery-2012.11.07-21-32' ,{requires:['base','node-base','node-style','event-tap','event-delegate','node-screen'], skinnable:true});
