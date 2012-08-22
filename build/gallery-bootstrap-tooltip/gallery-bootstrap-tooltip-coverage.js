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
_yuitest_coverage["/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js",
    code: []
};
_yuitest_coverage["/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js"].code=["YUI.add('gallery-bootstrap-tooltip', function(Y) {","","/**","","This is a drop-in for the Twitter Bootstrap tooltips, so you don't have to","schlep in jQuery.","","@module gallery-bootstrap-tooltip","**/","","/**","This is a drop-in for the Twitter Bootstrap tooltips, so you don't have to","schlep in jQuery.","","See http://twitter.github.com/bootstrap/javascript.html#tooltips for more","information.","","You will need to include the Bootstrap CSS. This is only the JavaScript.","","There are selectors you can use to narrow down and implement several tooltips","at once. The most sensible example is to match any link with a `rel=\"tooltip\"`","attribute.","","    YUI().use('gallery-bootstrap-tooltip', function(Y) {","        var tooltipManager = new Y.Bootstrap.Tooltip({ selector : '*[rel=tooltip]' });","    });","","@class Bootstrap.Tooltip","@constructor","@extends Widget","@uses WidgetPosition","@uses WidgetStack","@uses WidgetPositionAlign","@uses WidgetPositionConstrain","**/","","var NS = Y.namespace('Bootstrap');","","NS.Tooltip = Y.Base.create(\"bootstrapTooltip\", Y.Widget, [ Y.WidgetPosition, Y.WidgetStack, Y.WidgetPositionAlign, Y.WidgetPositionConstrain], {","    eventIn  : 'mouseover',","    eventOut : 'mouseout',","    tooltip  : null,","    template : '<div><div class=\"tooltip-arrow\"></div><div class=\"tooltip-inner\"></div></div>',","","    BOUNDING_TEMPLATE : '<div class=\"tooltip\"><div class=\"tooltip-arrow\"></div><div class=\"tooltip-inner\"></div></div>',","","    initializer : function() {","        var selector = this.get('selector'),","            trigger  = this.get('trigger'),","            eventIn  = trigger === 'hover' ? this.eventIn : 'focus',","            eventOut = trigger === 'hover' ? this.eventOut : 'blur';","","        this._cssPrefix = 'tooltip';","","        if ( selector ) {","            Y.delegate(eventIn,  this._showFn, document.body, selector, this);","            Y.delegate(eventOut, this._hideFn, document.body, selector, this);","        }","","        this.after('titleChange', this.setContent, this);","","        this.set('visible', false);","        this.render();","    },","","    _showFn : function(e) {","        var target = e.target,","            delay  = this.get('delay'),","            title  = target.getAttribute('title'),","            box    = this.get('boundingBox');","","        if ( !title ) {","            title = target.getAttribute('data-original-title');","        } else {","            target.removeAttribute('title');","            target.setAttribute('data-original-title', title);","        }","        this.set('title', title);","        this._hoverState  = 'in';","        this._showTimeout = Y.later( delay, this, this._show, { target: target } );","    },","","    _show : function(data) {","        var box     = this.get('boundingBox'),","            animate = this.get('animation'),","            place   = this.get('placement'),","            target  = data.target;","","        if ( this._hoverState === 'in' ) {","            box.show();","","            if ( target ) {","                this.set('align', { node : target, points: this._getAlignment(place) });","            }","            if ( animate ) {","                box.transition({","                    duration : 0,","                    opacity  : 1","                }, function() {","                    box.addClass('fade');","                });","            }","            box.addClass('in');","            box.addClass( place );","        }","    },","","    _hideFn : function() {","        var delay  = this.get('delay');","","        this._hoverState  = 'out';","        this._showTimeout = Y.later( delay, this, this._hide );","    },","","    _hide : function() {","        var box = this.get('boundingBox'),","            animate = this.get('animation');","","        if ( this._hoverState === 'out' ) {","            if ( box.hasClass('fade') ) {","                box.transition({","                    duration : 1,","                    opacity  : 0","                }, function() {","                    box.removeClass('fade');","                    box.removeClass('in');","                    box.hide();","                });","            } else {","                box.removeClass('fade');","                box.removeClass('in');","            }","        }","    },","","    _getAlignment : function(placement) {","        if ( placement === 'bottom' ) {","            return [ Y.WidgetPositionAlign.TC, Y.WidgetPositionAlign.BC ];","        }","        else if ( placement === 'left' ) {","            return [ Y.WidgetPositionAlign.RC, Y.WidgetPositionAlign.LC ];","        }","        else if ( placement === 'right' ) {","            return [ Y.WidgetPositionAlign.LC, Y.WidgetPositionAlign.RC ];","        }","        else {","            return [ Y.WidgetPositionAlign.BC, Y.WidgetPositionAlign.TC ];","        }","    },","","    _defaultCB : function() {","        return this.get('boundingBox').one('.tooltip-inner');","    },","","    setContent : function(e) {","        var title = this.get('title'),","            box   = this.get('contentBox');","","        box.setContent(title);","        Y.Array.each( 'fade in top bottom left right'.split(' '), function(c) {","            box.removeClass(c);","        });","    }","}, {","    ATTRS: {","        /**","        Whether or not to animate the display of the tooltip","","        @attribute animation","        @default true","        @type boolean","        **/","        animation : { value : true },","        /**","        Where to place the tooltip. Valid values are top, bottom, left or right.","","        @attribute placement","        @default top","        @type String","        **/","        placement : { value : 'top' },","        /**","        Selector to listen to. Defaults to false, and attaches no","        delegation events. Set to a valid selector and any event will","        fire it.","","        @attribute selector","        @default false","        @type String | boolean","        **/","        selector  : { value : false },","        /**","        What event to listen for. This must be an event that","        bubbles. Hover or click will work as expected.","","        @attribute trigger","        @default hover","        @type String","        **/","        trigger   : { value : 'hover' },","        /**","        The content of the tooltip to display. This is updated each time the","        event is triggered. Set by the <code>setContent</code> method.","","        @attribute title","        @default ''","        @type String","        **/","        title     : { value : '' },","        /**","        Delay in hiding and showing the tooltip.","","        @attribute delay","        @default 0","        @type Number","        **/","        delay     : { value : 0 },","        /**","        Attribute to show if the tooltip is visible or not.","","        @attribute visible","        @default false","        @type boolean","        **/","        visible   : { value : false }","    }","});","","","","}, 'gallery-2012.08.22-20-00' ,{requires:['anim','transition','widget','base','widget-position-align','widget-stack','widget-position','widget-position-constrain']});"];
_yuitest_coverage["/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js"].lines = {"1":0,"37":0,"39":0,"48":0,"53":0,"55":0,"56":0,"57":0,"60":0,"62":0,"63":0,"67":0,"72":0,"73":0,"75":0,"76":0,"78":0,"79":0,"80":0,"84":0,"89":0,"90":0,"92":0,"93":0,"95":0,"96":0,"100":0,"103":0,"104":0,"109":0,"111":0,"112":0,"116":0,"119":0,"120":0,"121":0,"125":0,"126":0,"127":0,"130":0,"131":0,"137":0,"138":0,"140":0,"141":0,"143":0,"144":0,"147":0,"152":0,"156":0,"159":0,"160":0,"161":0};
_yuitest_coverage["/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js"].functions = {"initializer:47":0,"_showFn:66":0,"(anonymous 2):99":0,"_show:83":0,"_hideFn:108":0,"(anonymous 3):124":0,"_hide:115":0,"_getAlignment:136":0,"_defaultCB:151":0,"(anonymous 4):160":0,"setContent:155":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js"].coveredLines = 53;
_yuitest_coverage["/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js"].coveredFunctions = 12;
_yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 1);
YUI.add('gallery-bootstrap-tooltip', function(Y) {

/**

This is a drop-in for the Twitter Bootstrap tooltips, so you don't have to
schlep in jQuery.

@module gallery-bootstrap-tooltip
**/

/**
This is a drop-in for the Twitter Bootstrap tooltips, so you don't have to
schlep in jQuery.

See http://twitter.github.com/bootstrap/javascript.html#tooltips for more
information.

You will need to include the Bootstrap CSS. This is only the JavaScript.

There are selectors you can use to narrow down and implement several tooltips
at once. The most sensible example is to match any link with a `rel="tooltip"`
attribute.

    YUI().use('gallery-bootstrap-tooltip', function(Y) {
        var tooltipManager = new Y.Bootstrap.Tooltip({ selector : '*[rel=tooltip]' });
    });

@class Bootstrap.Tooltip
@constructor
@extends Widget
@uses WidgetPosition
@uses WidgetStack
@uses WidgetPositionAlign
@uses WidgetPositionConstrain
**/

_yuitest_coverfunc("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 37);
var NS = Y.namespace('Bootstrap');

_yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 39);
NS.Tooltip = Y.Base.create("bootstrapTooltip", Y.Widget, [ Y.WidgetPosition, Y.WidgetStack, Y.WidgetPositionAlign, Y.WidgetPositionConstrain], {
    eventIn  : 'mouseover',
    eventOut : 'mouseout',
    tooltip  : null,
    template : '<div><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',

    BOUNDING_TEMPLATE : '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',

    initializer : function() {
        _yuitest_coverfunc("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", "initializer", 47);
_yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 48);
var selector = this.get('selector'),
            trigger  = this.get('trigger'),
            eventIn  = trigger === 'hover' ? this.eventIn : 'focus',
            eventOut = trigger === 'hover' ? this.eventOut : 'blur';

        _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 53);
this._cssPrefix = 'tooltip';

        _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 55);
if ( selector ) {
            _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 56);
Y.delegate(eventIn,  this._showFn, document.body, selector, this);
            _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 57);
Y.delegate(eventOut, this._hideFn, document.body, selector, this);
        }

        _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 60);
this.after('titleChange', this.setContent, this);

        _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 62);
this.set('visible', false);
        _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 63);
this.render();
    },

    _showFn : function(e) {
        _yuitest_coverfunc("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", "_showFn", 66);
_yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 67);
var target = e.target,
            delay  = this.get('delay'),
            title  = target.getAttribute('title'),
            box    = this.get('boundingBox');

        _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 72);
if ( !title ) {
            _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 73);
title = target.getAttribute('data-original-title');
        } else {
            _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 75);
target.removeAttribute('title');
            _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 76);
target.setAttribute('data-original-title', title);
        }
        _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 78);
this.set('title', title);
        _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 79);
this._hoverState  = 'in';
        _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 80);
this._showTimeout = Y.later( delay, this, this._show, { target: target } );
    },

    _show : function(data) {
        _yuitest_coverfunc("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", "_show", 83);
_yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 84);
var box     = this.get('boundingBox'),
            animate = this.get('animation'),
            place   = this.get('placement'),
            target  = data.target;

        _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 89);
if ( this._hoverState === 'in' ) {
            _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 90);
box.show();

            _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 92);
if ( target ) {
                _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 93);
this.set('align', { node : target, points: this._getAlignment(place) });
            }
            _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 95);
if ( animate ) {
                _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 96);
box.transition({
                    duration : 0,
                    opacity  : 1
                }, function() {
                    _yuitest_coverfunc("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", "(anonymous 2)", 99);
_yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 100);
box.addClass('fade');
                });
            }
            _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 103);
box.addClass('in');
            _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 104);
box.addClass( place );
        }
    },

    _hideFn : function() {
        _yuitest_coverfunc("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", "_hideFn", 108);
_yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 109);
var delay  = this.get('delay');

        _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 111);
this._hoverState  = 'out';
        _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 112);
this._showTimeout = Y.later( delay, this, this._hide );
    },

    _hide : function() {
        _yuitest_coverfunc("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", "_hide", 115);
_yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 116);
var box = this.get('boundingBox'),
            animate = this.get('animation');

        _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 119);
if ( this._hoverState === 'out' ) {
            _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 120);
if ( box.hasClass('fade') ) {
                _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 121);
box.transition({
                    duration : 1,
                    opacity  : 0
                }, function() {
                    _yuitest_coverfunc("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", "(anonymous 3)", 124);
_yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 125);
box.removeClass('fade');
                    _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 126);
box.removeClass('in');
                    _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 127);
box.hide();
                });
            } else {
                _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 130);
box.removeClass('fade');
                _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 131);
box.removeClass('in');
            }
        }
    },

    _getAlignment : function(placement) {
        _yuitest_coverfunc("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", "_getAlignment", 136);
_yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 137);
if ( placement === 'bottom' ) {
            _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 138);
return [ Y.WidgetPositionAlign.TC, Y.WidgetPositionAlign.BC ];
        }
        else {_yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 140);
if ( placement === 'left' ) {
            _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 141);
return [ Y.WidgetPositionAlign.RC, Y.WidgetPositionAlign.LC ];
        }
        else {_yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 143);
if ( placement === 'right' ) {
            _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 144);
return [ Y.WidgetPositionAlign.LC, Y.WidgetPositionAlign.RC ];
        }
        else {
            _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 147);
return [ Y.WidgetPositionAlign.BC, Y.WidgetPositionAlign.TC ];
        }}}
    },

    _defaultCB : function() {
        _yuitest_coverfunc("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", "_defaultCB", 151);
_yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 152);
return this.get('boundingBox').one('.tooltip-inner');
    },

    setContent : function(e) {
        _yuitest_coverfunc("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", "setContent", 155);
_yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 156);
var title = this.get('title'),
            box   = this.get('contentBox');

        _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 159);
box.setContent(title);
        _yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 160);
Y.Array.each( 'fade in top bottom left right'.split(' '), function(c) {
            _yuitest_coverfunc("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", "(anonymous 4)", 160);
_yuitest_coverline("/build/gallery-bootstrap-tooltip/gallery-bootstrap-tooltip.js", 161);
box.removeClass(c);
        });
    }
}, {
    ATTRS: {
        /**
        Whether or not to animate the display of the tooltip

        @attribute animation
        @default true
        @type boolean
        **/
        animation : { value : true },
        /**
        Where to place the tooltip. Valid values are top, bottom, left or right.

        @attribute placement
        @default top
        @type String
        **/
        placement : { value : 'top' },
        /**
        Selector to listen to. Defaults to false, and attaches no
        delegation events. Set to a valid selector and any event will
        fire it.

        @attribute selector
        @default false
        @type String | boolean
        **/
        selector  : { value : false },
        /**
        What event to listen for. This must be an event that
        bubbles. Hover or click will work as expected.

        @attribute trigger
        @default hover
        @type String
        **/
        trigger   : { value : 'hover' },
        /**
        The content of the tooltip to display. This is updated each time the
        event is triggered. Set by the <code>setContent</code> method.

        @attribute title
        @default ''
        @type String
        **/
        title     : { value : '' },
        /**
        Delay in hiding and showing the tooltip.

        @attribute delay
        @default 0
        @type Number
        **/
        delay     : { value : 0 },
        /**
        Attribute to show if the tooltip is visible or not.

        @attribute visible
        @default false
        @type boolean
        **/
        visible   : { value : false }
    }
});



}, 'gallery-2012.08.22-20-00' ,{requires:['anim','transition','widget','base','widget-position-align','widget-stack','widget-position','widget-position-constrain']});
