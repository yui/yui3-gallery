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
_yuitest_coverage["/build/gallery-bootstrap-popover/gallery-bootstrap-popover.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-bootstrap-popover/gallery-bootstrap-popover.js",
    code: []
};
_yuitest_coverage["/build/gallery-bootstrap-popover/gallery-bootstrap-popover.js"].code=["YUI.add('gallery-bootstrap-popover', function(Y) {","","/**","","Add small overlays of content, like those on the iPad, to any element for housing secondary information.","","@module gallery-bootstrap-popover","**/","","/**","","Add small overlays of content, like those on the iPad, to any element for housing secondary information.","","This is a drop-in replacement for the Twitter Bootstrap popovers.","","See http://jshirley.github.com/bootstrap/javascript.html#popovers for more","information.","","You will need to include the Bootstrap CSS. This is only the JavaScript.","","There are selectors you can use to narrow down and implement several tooltips","at once. The most sensible example is to match any link with a `rel=\"popover\"`","attribute.","","    YUI().use('gallery-bootstrap-popover', function(Y) {","        var popovers = new Y.Bootstrap.Popover({ selector : '*[rel=popover]' });","","        // Additionally, you can plug into a node.","        Y.one('.popover').plug( Y.Bootstrap.PopoverPlugin );","    });","","@class Bootstrap.Popover","@constructor","@extends Bootstrap.Tooltip","**/","","var NS   = Y.namespace('Bootstrap'),","    Lang = Y.Lang,","    sub  = Y.Lang.sub,","    PositionAlign = Y.WidgetPositionAlign,","    OFFSET_WIDTH = 'offsetWidth',","    OFFSET_HEIGHT = 'offsetHeight';","","NS.Popover = Y.Base.create(\"bootstrapPopover\", Y.Bootstrap.Tooltip, [ ], {","    prefix   : 'popover',","    template : '<h3 class=\"popover-title\">{title}</h3><div class=\"popover-content\">{body}</div>',","","    INNER_SELECTOR : '.popover-inner',","    BOUNDING_TEMPLATE : '<div class=\"popover\"><div class=\"arrow\"></div><div class=\"popover-inner\"></div></div>',","","    setContent : function(e) {","        var title = this.get('title'),","            body  = this.get('body'),","            box   = this.get('contentBox');","","        // YUI adds a popover-content to the contentBox element automatically","        box.removeClass('popover-content');","","        box.setHTML( sub( this.template, { title : title, body : body }) );","        Y.Array.each( 'fade in top bottom left right'.split(' '), function(c) {","            box.removeClass(c);","        });","    }","});","","","","}, 'gallery-2012.08.22-20-00' ,{requires:['gallery-bootstrap-tooltip']});"];
_yuitest_coverage["/build/gallery-bootstrap-popover/gallery-bootstrap-popover.js"].lines = {"1":0,"37":0,"44":0,"52":0,"57":0,"59":0,"60":0,"61":0};
_yuitest_coverage["/build/gallery-bootstrap-popover/gallery-bootstrap-popover.js"].functions = {"(anonymous 2):60":0,"setContent:51":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bootstrap-popover/gallery-bootstrap-popover.js"].coveredLines = 8;
_yuitest_coverage["/build/gallery-bootstrap-popover/gallery-bootstrap-popover.js"].coveredFunctions = 3;
_yuitest_coverline("/build/gallery-bootstrap-popover/gallery-bootstrap-popover.js", 1);
YUI.add('gallery-bootstrap-popover', function(Y) {

/**

Add small overlays of content, like those on the iPad, to any element for housing secondary information.

@module gallery-bootstrap-popover
**/

/**

Add small overlays of content, like those on the iPad, to any element for housing secondary information.

This is a drop-in replacement for the Twitter Bootstrap popovers.

See http://jshirley.github.com/bootstrap/javascript.html#popovers for more
information.

You will need to include the Bootstrap CSS. This is only the JavaScript.

There are selectors you can use to narrow down and implement several tooltips
at once. The most sensible example is to match any link with a `rel="popover"`
attribute.

    YUI().use('gallery-bootstrap-popover', function(Y) {
        var popovers = new Y.Bootstrap.Popover({ selector : '*[rel=popover]' });

        // Additionally, you can plug into a node.
        Y.one('.popover').plug( Y.Bootstrap.PopoverPlugin );
    });

@class Bootstrap.Popover
@constructor
@extends Bootstrap.Tooltip
**/

_yuitest_coverfunc("/build/gallery-bootstrap-popover/gallery-bootstrap-popover.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-bootstrap-popover/gallery-bootstrap-popover.js", 37);
var NS   = Y.namespace('Bootstrap'),
    Lang = Y.Lang,
    sub  = Y.Lang.sub,
    PositionAlign = Y.WidgetPositionAlign,
    OFFSET_WIDTH = 'offsetWidth',
    OFFSET_HEIGHT = 'offsetHeight';

_yuitest_coverline("/build/gallery-bootstrap-popover/gallery-bootstrap-popover.js", 44);
NS.Popover = Y.Base.create("bootstrapPopover", Y.Bootstrap.Tooltip, [ ], {
    prefix   : 'popover',
    template : '<h3 class="popover-title">{title}</h3><div class="popover-content">{body}</div>',

    INNER_SELECTOR : '.popover-inner',
    BOUNDING_TEMPLATE : '<div class="popover"><div class="arrow"></div><div class="popover-inner"></div></div>',

    setContent : function(e) {
        _yuitest_coverfunc("/build/gallery-bootstrap-popover/gallery-bootstrap-popover.js", "setContent", 51);
_yuitest_coverline("/build/gallery-bootstrap-popover/gallery-bootstrap-popover.js", 52);
var title = this.get('title'),
            body  = this.get('body'),
            box   = this.get('contentBox');

        // YUI adds a popover-content to the contentBox element automatically
        _yuitest_coverline("/build/gallery-bootstrap-popover/gallery-bootstrap-popover.js", 57);
box.removeClass('popover-content');

        _yuitest_coverline("/build/gallery-bootstrap-popover/gallery-bootstrap-popover.js", 59);
box.setHTML( sub( this.template, { title : title, body : body }) );
        _yuitest_coverline("/build/gallery-bootstrap-popover/gallery-bootstrap-popover.js", 60);
Y.Array.each( 'fade in top bottom left right'.split(' '), function(c) {
            _yuitest_coverfunc("/build/gallery-bootstrap-popover/gallery-bootstrap-popover.js", "(anonymous 2)", 60);
_yuitest_coverline("/build/gallery-bootstrap-popover/gallery-bootstrap-popover.js", 61);
box.removeClass(c);
        });
    }
});



}, 'gallery-2012.08.22-20-00' ,{requires:['gallery-bootstrap-tooltip']});
