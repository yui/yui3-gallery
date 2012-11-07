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
_yuitest_coverage["/build/gallery-slidecheckbox/gallery-slidecheckbox.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-slidecheckbox/gallery-slidecheckbox.js",
    code: []
};
_yuitest_coverage["/build/gallery-slidecheckbox/gallery-slidecheckbox.js"].code=["YUI.add('gallery-slidecheckbox', function(Y) {","","	var SLIDECHECKBOX='SlideCheckbox',","	CBX = 'contentBox',","	WRAPPER = 'wrapper',","	SLIDER = 'slider',","	SLIDERWRAP = 'sliderwrap',","	LABELON = 'labelOn',","	LABELOFF = 'labelOff',","	HANDLE = 'handle';","	","	Y[SLIDECHECKBOX] = Y.Base.create(","	SLIDECHECKBOX,","	Y.Widget,","	[Y.MakeNode],","		{","			anim : null,","			currentX : null,","			lastX : null,","			renderUI : function() {","				this.src = this.get('srcNode').addClass(this.getClassName('hidden'));","				this.get(CBX).append(this._makeNode()).append(this.src);","				","				this._locateNodes();","","				var leftX = this._labelOnNode.one('div').get('offsetWidth'),","				rightX = this._labelOffNode.one('div').get('offsetWidth'), ","				width = this._labelOnNode.get('offsetWidth'),","				skin = this.getSkinName(),","				ios5 = skin? skin.indexOf('ios5') > -1 : null;","","				if(leftX > rightX){","					this._labelOffNode.one('div').setStyle('width',leftX);","				}else{","					this._labelOnNode.one('div').setStyle('width',rightX);","					width = this._labelOnNode.get('offsetWidth');","				}","				","				this.left = -this._labelOnNode.get('offsetWidth') + 3;","","				var wrapperWidth = 2 * width;","				","				if(ios5){","					this._slideWrapWidth = 2 * width + 28;","					this.left = this.left + 11;","					wrapperWidth = width + 14;","				}else{","					this._slideWrapWidth = 3 * width + 10;","					this._handleNode.setStyle('width',width - 3);","				}","				this._sliderwrapNode.setStyle('width',this._slideWrapWidth);","				this._wrapperNode.setStyle('width',wrapperWidth);","			},","			bindUI : function(){","				this.disabled = this.src.get('disabled') || this.src.get('readonly');","				","				var dd = new Y.DD.Drag({","					node: this._sliderwrapNode,","					activeHandle : this._handleNode,","					lock: this.disabled","				}),","				cb = this.get(CBX);","				","				this._addDragConstraint(dd);","				","				dd.on('drag:drag',function(e){","					var xy = this._wrapperNode.getXY();","					","					//If the node is repositioned we need to reapply the constraint","					if(xy[1] !== dd.actXY[1]){","						dd.unplug();","						this._addDragConstraint(dd);","						e.halt(true);","					}","					","					if(dd.actXY[0] % 2 === 0){","						this.lastX = this.currentX;","					}","					this.currentX = dd.actXY[0];","					","				}, this);","				","				dd.on('drag:end',this.move, this);","				","				cb.on('focus',function(){","					cb.on('key',this.goLeft,'down:37',this);","					cb.on('key',this.goRight,'down:39',this);","					cb.on('key',function(e){","						e.preventDefault();","						this.move();","					},'down:32',this);","				},this);","				cb.on('blur',function(){","					cb.detach('key');","					cb.blur();","				},this);","			},syncUI : function(){","				this._sliderwrapNode.setStyle('left',","					this.src.get('checked')?  0 : this.left","				);","			},destructor : function(){","				this.anim && this.anim.stop().destroy();","				this.src=null;","			},","			goLeft : function(){","				this.to = this.left;","				this._execute();","			},","			goRight : function(){","				this.to = 0;","				this._execute();","			},","			move : function(){","				this.from = this._replacePx(this._sliderwrapNode.getComputedStyle('left'));","				","				if(this.lastX !== null){","					if(this.currentX < this.lastX || this.from === this.left){","						this.goLeft();","					}else{","						this.goRight();","					}","				}","				","				if(this.from > this.left){","					this.goLeft();","				}else{","					this.goRight();","				}","			},","			_addDragConstraint : function(dd){","				var xy = this._wrapperNode.getXY();","				dd.plug(Y.Plugin.DDConstrained, {","					constrain:{","						top:xy[1],","						bottom:xy[1] + this._wrapperNode.get('offsetHeight'),","						right:xy[0] + this._slideWrapWidth,","						left:xy[0] + this.left","					}","				});","			},","			_defaultCB : function(el) {","				return null;","			},","			_onClick : function(e){","				e.preventDefault();","				this.move();","			},","			_execute : function(){","				this.focus();","				if(this.disabled){","					return;","				}","				this.src.set('checked',!this.src.get('checked'));","				if(this.anim === null){","					this.anim = new Y.Anim({","						node: this._sliderwrapNode,","						from: {left:this.from},","						duration: this.get('duration'),","						to: {left:this.to},","						easing: 'easeIn'","					});","				}","				this.lastX = null;","				this.anim.set('from',{left:(this.from? this.from : this.baseX)});","				this.anim.set('to',{left:this.to});","				this.anim.run();","","			},","			_replacePx : function(el){","				return parseInt(el.replace('px',''));","			}","		},","		{","			ATTRS:{","				duration: {value:0.2},","				strings : {","					value:{","						labelOn: 'ON',","						labelOff: 'OFF'","					}","				}","			},","			_CLASS_NAMES: [WRAPPER,SLIDER,SLIDERWRAP,LABELON,LABELOFF,HANDLE],","			_TEMPLATE: [","				'<div class=\"{c wrapper}\"><span class=\"edge lt\">&nbsp;</span><span class=\"edge rt\">&nbsp;</span>',","				'<div class=\"{c slider}\"><div class=\"{c sliderwrap}\">',","				'<div class=\"{c labelOn}\"><label><div>{s labelOn}</div></label></div>',","				'<div class=\"{c handle}\"><span class=\"edge lt\">&nbsp;</span><span class=\"edge rt\">&nbsp;</span></div>',","				'<div class=\"{c labelOff}\"><label><div>{s labelOff}</div></label></div>',","				'</div></div></div>'","			].join('\\n'),","			_EVENTS:{","				slider: [","					{type: 'click',fn:'_onClick'}","				]","			},","			HTML_PARSER: {","				value: function (srcNode) {","					return srcNode.getAttribute('checked'); ","				}","			}","		}","	);","","","}, 'gallery-2012.11.07-21-32' ,{skinnable:true, requires:['node-base', 'anim-base', 'anim-easing', 'base-build', 'event-key', 'event-move', 'widget', 'node-style', 'gallery-makenode', 'dd-drag', 'dd-constrain']});"];
_yuitest_coverage["/build/gallery-slidecheckbox/gallery-slidecheckbox.js"].lines = {"1":0,"3":0,"12":0,"21":0,"22":0,"24":0,"26":0,"32":0,"33":0,"35":0,"36":0,"39":0,"41":0,"43":0,"44":0,"45":0,"46":0,"48":0,"49":0,"51":0,"52":0,"55":0,"57":0,"64":0,"66":0,"67":0,"70":0,"71":0,"72":0,"73":0,"76":0,"77":0,"79":0,"83":0,"85":0,"86":0,"87":0,"88":0,"89":0,"90":0,"93":0,"94":0,"95":0,"98":0,"102":0,"103":0,"106":0,"107":0,"110":0,"111":0,"114":0,"116":0,"117":0,"118":0,"120":0,"124":0,"125":0,"127":0,"131":0,"132":0,"142":0,"145":0,"146":0,"149":0,"150":0,"151":0,"153":0,"154":0,"155":0,"163":0,"164":0,"165":0,"166":0,"170":0,"199":0};
_yuitest_coverage["/build/gallery-slidecheckbox/gallery-slidecheckbox.js"].functions = {"renderUI:20":0,"(anonymous 2):66":0,"(anonymous 4):88":0,"(anonymous 3):85":0,"(anonymous 5):93":0,"bindUI:54":0,"syncUI:97":0,"destructor:101":0,"goLeft:105":0,"goRight:109":0,"move:113":0,"_addDragConstraint:130":0,"_defaultCB:141":0,"_onClick:144":0,"_execute:148":0,"_replacePx:169":0,"value:198":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-slidecheckbox/gallery-slidecheckbox.js"].coveredLines = 75;
_yuitest_coverage["/build/gallery-slidecheckbox/gallery-slidecheckbox.js"].coveredFunctions = 18;
_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 1);
YUI.add('gallery-slidecheckbox', function(Y) {

	_yuitest_coverfunc("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 3);
var SLIDECHECKBOX='SlideCheckbox',
	CBX = 'contentBox',
	WRAPPER = 'wrapper',
	SLIDER = 'slider',
	SLIDERWRAP = 'sliderwrap',
	LABELON = 'labelOn',
	LABELOFF = 'labelOff',
	HANDLE = 'handle';
	
	_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 12);
Y[SLIDECHECKBOX] = Y.Base.create(
	SLIDECHECKBOX,
	Y.Widget,
	[Y.MakeNode],
		{
			anim : null,
			currentX : null,
			lastX : null,
			renderUI : function() {
				_yuitest_coverfunc("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", "renderUI", 20);
_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 21);
this.src = this.get('srcNode').addClass(this.getClassName('hidden'));
				_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 22);
this.get(CBX).append(this._makeNode()).append(this.src);
				
				_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 24);
this._locateNodes();

				_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 26);
var leftX = this._labelOnNode.one('div').get('offsetWidth'),
				rightX = this._labelOffNode.one('div').get('offsetWidth'), 
				width = this._labelOnNode.get('offsetWidth'),
				skin = this.getSkinName(),
				ios5 = skin? skin.indexOf('ios5') > -1 : null;

				_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 32);
if(leftX > rightX){
					_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 33);
this._labelOffNode.one('div').setStyle('width',leftX);
				}else{
					_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 35);
this._labelOnNode.one('div').setStyle('width',rightX);
					_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 36);
width = this._labelOnNode.get('offsetWidth');
				}
				
				_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 39);
this.left = -this._labelOnNode.get('offsetWidth') + 3;

				_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 41);
var wrapperWidth = 2 * width;
				
				_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 43);
if(ios5){
					_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 44);
this._slideWrapWidth = 2 * width + 28;
					_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 45);
this.left = this.left + 11;
					_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 46);
wrapperWidth = width + 14;
				}else{
					_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 48);
this._slideWrapWidth = 3 * width + 10;
					_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 49);
this._handleNode.setStyle('width',width - 3);
				}
				_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 51);
this._sliderwrapNode.setStyle('width',this._slideWrapWidth);
				_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 52);
this._wrapperNode.setStyle('width',wrapperWidth);
			},
			bindUI : function(){
				_yuitest_coverfunc("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", "bindUI", 54);
_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 55);
this.disabled = this.src.get('disabled') || this.src.get('readonly');
				
				_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 57);
var dd = new Y.DD.Drag({
					node: this._sliderwrapNode,
					activeHandle : this._handleNode,
					lock: this.disabled
				}),
				cb = this.get(CBX);
				
				_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 64);
this._addDragConstraint(dd);
				
				_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 66);
dd.on('drag:drag',function(e){
					_yuitest_coverfunc("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", "(anonymous 2)", 66);
_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 67);
var xy = this._wrapperNode.getXY();
					
					//If the node is repositioned we need to reapply the constraint
					_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 70);
if(xy[1] !== dd.actXY[1]){
						_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 71);
dd.unplug();
						_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 72);
this._addDragConstraint(dd);
						_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 73);
e.halt(true);
					}
					
					_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 76);
if(dd.actXY[0] % 2 === 0){
						_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 77);
this.lastX = this.currentX;
					}
					_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 79);
this.currentX = dd.actXY[0];
					
				}, this);
				
				_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 83);
dd.on('drag:end',this.move, this);
				
				_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 85);
cb.on('focus',function(){
					_yuitest_coverfunc("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", "(anonymous 3)", 85);
_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 86);
cb.on('key',this.goLeft,'down:37',this);
					_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 87);
cb.on('key',this.goRight,'down:39',this);
					_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 88);
cb.on('key',function(e){
						_yuitest_coverfunc("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", "(anonymous 4)", 88);
_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 89);
e.preventDefault();
						_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 90);
this.move();
					},'down:32',this);
				},this);
				_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 93);
cb.on('blur',function(){
					_yuitest_coverfunc("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", "(anonymous 5)", 93);
_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 94);
cb.detach('key');
					_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 95);
cb.blur();
				},this);
			},syncUI : function(){
				_yuitest_coverfunc("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", "syncUI", 97);
_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 98);
this._sliderwrapNode.setStyle('left',
					this.src.get('checked')?  0 : this.left
				);
			},destructor : function(){
				_yuitest_coverfunc("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", "destructor", 101);
_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 102);
this.anim && this.anim.stop().destroy();
				_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 103);
this.src=null;
			},
			goLeft : function(){
				_yuitest_coverfunc("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", "goLeft", 105);
_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 106);
this.to = this.left;
				_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 107);
this._execute();
			},
			goRight : function(){
				_yuitest_coverfunc("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", "goRight", 109);
_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 110);
this.to = 0;
				_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 111);
this._execute();
			},
			move : function(){
				_yuitest_coverfunc("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", "move", 113);
_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 114);
this.from = this._replacePx(this._sliderwrapNode.getComputedStyle('left'));
				
				_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 116);
if(this.lastX !== null){
					_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 117);
if(this.currentX < this.lastX || this.from === this.left){
						_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 118);
this.goLeft();
					}else{
						_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 120);
this.goRight();
					}
				}
				
				_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 124);
if(this.from > this.left){
					_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 125);
this.goLeft();
				}else{
					_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 127);
this.goRight();
				}
			},
			_addDragConstraint : function(dd){
				_yuitest_coverfunc("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", "_addDragConstraint", 130);
_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 131);
var xy = this._wrapperNode.getXY();
				_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 132);
dd.plug(Y.Plugin.DDConstrained, {
					constrain:{
						top:xy[1],
						bottom:xy[1] + this._wrapperNode.get('offsetHeight'),
						right:xy[0] + this._slideWrapWidth,
						left:xy[0] + this.left
					}
				});
			},
			_defaultCB : function(el) {
				_yuitest_coverfunc("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", "_defaultCB", 141);
_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 142);
return null;
			},
			_onClick : function(e){
				_yuitest_coverfunc("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", "_onClick", 144);
_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 145);
e.preventDefault();
				_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 146);
this.move();
			},
			_execute : function(){
				_yuitest_coverfunc("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", "_execute", 148);
_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 149);
this.focus();
				_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 150);
if(this.disabled){
					_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 151);
return;
				}
				_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 153);
this.src.set('checked',!this.src.get('checked'));
				_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 154);
if(this.anim === null){
					_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 155);
this.anim = new Y.Anim({
						node: this._sliderwrapNode,
						from: {left:this.from},
						duration: this.get('duration'),
						to: {left:this.to},
						easing: 'easeIn'
					});
				}
				_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 163);
this.lastX = null;
				_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 164);
this.anim.set('from',{left:(this.from? this.from : this.baseX)});
				_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 165);
this.anim.set('to',{left:this.to});
				_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 166);
this.anim.run();

			},
			_replacePx : function(el){
				_yuitest_coverfunc("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", "_replacePx", 169);
_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 170);
return parseInt(el.replace('px',''));
			}
		},
		{
			ATTRS:{
				duration: {value:0.2},
				strings : {
					value:{
						labelOn: 'ON',
						labelOff: 'OFF'
					}
				}
			},
			_CLASS_NAMES: [WRAPPER,SLIDER,SLIDERWRAP,LABELON,LABELOFF,HANDLE],
			_TEMPLATE: [
				'<div class="{c wrapper}"><span class="edge lt">&nbsp;</span><span class="edge rt">&nbsp;</span>',
				'<div class="{c slider}"><div class="{c sliderwrap}">',
				'<div class="{c labelOn}"><label><div>{s labelOn}</div></label></div>',
				'<div class="{c handle}"><span class="edge lt">&nbsp;</span><span class="edge rt">&nbsp;</span></div>',
				'<div class="{c labelOff}"><label><div>{s labelOff}</div></label></div>',
				'</div></div></div>'
			].join('\n'),
			_EVENTS:{
				slider: [
					{type: 'click',fn:'_onClick'}
				]
			},
			HTML_PARSER: {
				value: function (srcNode) {
					_yuitest_coverfunc("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", "value", 198);
_yuitest_coverline("/build/gallery-slidecheckbox/gallery-slidecheckbox.js", 199);
return srcNode.getAttribute('checked'); 
				}
			}
		}
	);


}, 'gallery-2012.11.07-21-32' ,{skinnable:true, requires:['node-base', 'anim-base', 'anim-easing', 'base-build', 'event-key', 'event-move', 'widget', 'node-style', 'gallery-makenode', 'dd-drag', 'dd-constrain']});
