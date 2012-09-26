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
_yuitest_coverage["/build/gallery-scrollintoview/gallery-scrollintoview.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-scrollintoview/gallery-scrollintoview.js",
    code: []
};
_yuitest_coverage["/build/gallery-scrollintoview/gallery-scrollintoview.js"].code=["YUI.add('gallery-scrollintoview', function(Y) {","","\"use strict\";","","/**"," * @module gallery-scrollintoview"," */","","/**"," * <p>Only scrolls the browser if the object is not currently visible.</p>"," * "," * <p>This requires that all scrollable elements have position:relative."," * Otherwise, this algorithm will skip over them with unpredictable"," * results.</p>"," * "," * @main gallery-scrollintoview"," * @class Node~scrollIntoView"," */","","/**"," * @method scrollIntoView"," * @chainable"," */","Y.Node.prototype.scrollIntoView = function()","{","	var ancestor = Y.Node.getDOMNode(this.get('offsetParent'));","	if (!ancestor)","	{","		return this;","	}","","	var r =","	{","		top:    this.get('offsetTop'),","		bottom: this.get('offsetTop') + this.get('offsetHeight'),","		left:   this.get('offsetLeft'),","		right:  this.get('offsetLeft') + this.get('offsetWidth')","	};","","	r.move = function(","		/* int */	dx,","		/* int */	dy)","	{","		this.top    += dy;","		this.bottom += dy;","		this.left   += dx;","		this.right  += dx;","	};","","	while (1)","	{","		while (1)","		{","			var hit_top = (ancestor.offsetParent === null);","","			var a = Y.one(ancestor),","				b = (Y.Node.getDOMNode(a) === Y.config.doc.body),","				w = b ? Y.DOM.winWidth() : ancestor.clientWidth,","				h = b ? Y.DOM.winHeight() : ancestor.clientHeight;","			if (ancestor.scrollWidth - a.horizMarginBorderPadding() > w ||","				ancestor.scrollHeight - a.vertMarginBorderPadding() > h)","			{","				break;","			}","			else if (hit_top)","			{","				return this;","			}","","			r.move(ancestor.offsetLeft - ancestor.scrollLeft, ancestor.offsetTop - ancestor.scrollTop);","			ancestor = ancestor.offsetParent || ancestor.parentNode;","		}","","		var scrollX = (hit_top ? Y.config.doc.documentElement.scrollLeft || Y.config.doc.body.scrollLeft : ancestor.scrollLeft);","		var scrollY = (hit_top ? Y.config.doc.documentElement.scrollTop || Y.config.doc.body.scrollTop : ancestor.scrollTop);","","		var d =","		{","			top:    scrollY,","			bottom: scrollY + (hit_top ? Y.DOM.winHeight() : ancestor.clientHeight),","			left:   scrollX,","			right:  scrollX + (hit_top ? Y.DOM.winWidth() : ancestor.clientWidth)","		};","","		var dy = 0;","		if (a.getStyle('overflowY') == 'hidden')","		{","			// don't scroll","		}","		else if (r.top < d.top)","		{","			dy = r.top - d.top;","		}","		else if (r.bottom > d.bottom)","		{","			dy = Math.min(r.bottom - d.bottom, r.top - d.top);","		}","","		var dx = 0;","		if (a.getStyle('overflowX') == 'hidden')","		{","			// don't scroll","		}","		else if (r.left < d.left)","		{","			dx = r.left - d.left;","		}","		else if (r.right > d.right)","		{","			dx = Math.min(r.right - d.right, r.left - d.left);","		}","","		if (hit_top)","		{","			if (dx || dy)","			{","				window.scrollBy(dx, dy);","			}","			break;","		}","		else","		{","			ancestor.scrollLeft += dx;","			ancestor.scrollTop  += dy;","","			r.move(ancestor.offsetLeft - ancestor.scrollLeft, ancestor.offsetTop - ancestor.scrollTop);","","			ancestor = ancestor.offsetParent;","		}","	}","","	return this;","};","","","}, 'gallery-2012.09.26-20-36' ,{requires:['gallery-dimensions','dom-screen']});"];
_yuitest_coverage["/build/gallery-scrollintoview/gallery-scrollintoview.js"].lines = {"1":0,"3":0,"24":0,"26":0,"27":0,"29":0,"32":0,"40":0,"44":0,"45":0,"46":0,"47":0,"50":0,"52":0,"54":0,"56":0,"60":0,"63":0,"65":0,"67":0,"70":0,"71":0,"74":0,"75":0,"77":0,"85":0,"86":0,"90":0,"92":0,"94":0,"96":0,"99":0,"100":0,"104":0,"106":0,"108":0,"110":0,"113":0,"115":0,"117":0,"119":0,"123":0,"124":0,"126":0,"128":0,"132":0};
_yuitest_coverage["/build/gallery-scrollintoview/gallery-scrollintoview.js"].functions = {"move:40":0,"scrollIntoView:24":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-scrollintoview/gallery-scrollintoview.js"].coveredLines = 46;
_yuitest_coverage["/build/gallery-scrollintoview/gallery-scrollintoview.js"].coveredFunctions = 3;
_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 1);
YUI.add('gallery-scrollintoview', function(Y) {

_yuitest_coverfunc("/build/gallery-scrollintoview/gallery-scrollintoview.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 3);
"use strict";

/**
 * @module gallery-scrollintoview
 */

/**
 * <p>Only scrolls the browser if the object is not currently visible.</p>
 * 
 * <p>This requires that all scrollable elements have position:relative.
 * Otherwise, this algorithm will skip over them with unpredictable
 * results.</p>
 * 
 * @main gallery-scrollintoview
 * @class Node~scrollIntoView
 */

/**
 * @method scrollIntoView
 * @chainable
 */
_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 24);
Y.Node.prototype.scrollIntoView = function()
{
	_yuitest_coverfunc("/build/gallery-scrollintoview/gallery-scrollintoview.js", "scrollIntoView", 24);
_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 26);
var ancestor = Y.Node.getDOMNode(this.get('offsetParent'));
	_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 27);
if (!ancestor)
	{
		_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 29);
return this;
	}

	_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 32);
var r =
	{
		top:    this.get('offsetTop'),
		bottom: this.get('offsetTop') + this.get('offsetHeight'),
		left:   this.get('offsetLeft'),
		right:  this.get('offsetLeft') + this.get('offsetWidth')
	};

	_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 40);
r.move = function(
		/* int */	dx,
		/* int */	dy)
	{
		_yuitest_coverfunc("/build/gallery-scrollintoview/gallery-scrollintoview.js", "move", 40);
_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 44);
this.top    += dy;
		_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 45);
this.bottom += dy;
		_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 46);
this.left   += dx;
		_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 47);
this.right  += dx;
	};

	_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 50);
while (1)
	{
		_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 52);
while (1)
		{
			_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 54);
var hit_top = (ancestor.offsetParent === null);

			_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 56);
var a = Y.one(ancestor),
				b = (Y.Node.getDOMNode(a) === Y.config.doc.body),
				w = b ? Y.DOM.winWidth() : ancestor.clientWidth,
				h = b ? Y.DOM.winHeight() : ancestor.clientHeight;
			_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 60);
if (ancestor.scrollWidth - a.horizMarginBorderPadding() > w ||
				ancestor.scrollHeight - a.vertMarginBorderPadding() > h)
			{
				_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 63);
break;
			}
			else {_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 65);
if (hit_top)
			{
				_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 67);
return this;
			}}

			_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 70);
r.move(ancestor.offsetLeft - ancestor.scrollLeft, ancestor.offsetTop - ancestor.scrollTop);
			_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 71);
ancestor = ancestor.offsetParent || ancestor.parentNode;
		}

		_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 74);
var scrollX = (hit_top ? Y.config.doc.documentElement.scrollLeft || Y.config.doc.body.scrollLeft : ancestor.scrollLeft);
		_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 75);
var scrollY = (hit_top ? Y.config.doc.documentElement.scrollTop || Y.config.doc.body.scrollTop : ancestor.scrollTop);

		_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 77);
var d =
		{
			top:    scrollY,
			bottom: scrollY + (hit_top ? Y.DOM.winHeight() : ancestor.clientHeight),
			left:   scrollX,
			right:  scrollX + (hit_top ? Y.DOM.winWidth() : ancestor.clientWidth)
		};

		_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 85);
var dy = 0;
		_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 86);
if (a.getStyle('overflowY') == 'hidden')
		{
			// don't scroll
		}
		else {_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 90);
if (r.top < d.top)
		{
			_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 92);
dy = r.top - d.top;
		}
		else {_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 94);
if (r.bottom > d.bottom)
		{
			_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 96);
dy = Math.min(r.bottom - d.bottom, r.top - d.top);
		}}}

		_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 99);
var dx = 0;
		_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 100);
if (a.getStyle('overflowX') == 'hidden')
		{
			// don't scroll
		}
		else {_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 104);
if (r.left < d.left)
		{
			_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 106);
dx = r.left - d.left;
		}
		else {_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 108);
if (r.right > d.right)
		{
			_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 110);
dx = Math.min(r.right - d.right, r.left - d.left);
		}}}

		_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 113);
if (hit_top)
		{
			_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 115);
if (dx || dy)
			{
				_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 117);
window.scrollBy(dx, dy);
			}
			_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 119);
break;
		}
		else
		{
			_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 123);
ancestor.scrollLeft += dx;
			_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 124);
ancestor.scrollTop  += dy;

			_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 126);
r.move(ancestor.offsetLeft - ancestor.scrollLeft, ancestor.offsetTop - ancestor.scrollTop);

			_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 128);
ancestor = ancestor.offsetParent;
		}
	}

	_yuitest_coverline("/build/gallery-scrollintoview/gallery-scrollintoview.js", 132);
return this;
};


}, 'gallery-2012.09.26-20-36' ,{requires:['gallery-dimensions','dom-screen']});
