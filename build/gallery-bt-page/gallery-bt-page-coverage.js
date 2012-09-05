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
_yuitest_coverage["/build/gallery-bt-page/gallery-bt-page.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-bt-page/gallery-bt-page.js",
    code: []
};
_yuitest_coverage["/build/gallery-bt-page/gallery-bt-page.js"].code=["YUI.add('gallery-bt-page', function(Y) {","","/**"," *"," * Provides Page widget which changes width and height with viewport."," *"," * @module gallery-bt-page"," */","","var current,","    instances = [];","","/**"," * A basic Page Widget, which will automatically adapt the browser width"," * and height. Only one page will show in the same time. Use active"," * function can hide current page and show the other page. It also has"," * header and footer fixed support."," *"," * @class Page"," * @constructor"," * @namespace Bottle"," * @extends PushPop"," * @uses WidgetParent"," * @uses WidgetPosition"," * @uses WidgetStack"," * @uses PushPop"," * @param [config] {Object} Object literal with initial attribute values"," */","Y.Bottle.Page = Y.Base.create('btpage', Y.Widget, [Y.WidgetParent, Y.WidgetPosition, Y.WidgetStack, Y.Bottle.PushPop], {","    initializer: function () {","        instances.push(current = this);","    },","","    /**","     * Resize the page to adapt the browser width and height.","     *","     * @method resize","     */","    resize: function () {","        var b_width = Y.Bottle.Device.getBrowserWidth(),","            b_height = Y.Bottle.Device.getBrowserHeight();","","        //reduce syncUI times","        if ((this.get('width') === b_width) && (this.get('height') === b_height)) {","            return;","        }","","        this.setAttrs({","            'width': b_width,","            'height': b_height","        });","    }","}, {","    /**","     * Get all instances of Page","     *","     * @method getInstances","     * @static","     * @return {Array} all instances of Page","     */","    getInstances: function () {","        return instances;","    },","","    /**","     * Get current visible Page","     *","     * @method getCurrent","     * @static","     * @return {Object | undefined} current visible Page. If no any visible Page, return undefined.","     */","    getCurrent: function () {","        return current;","    }","});","","","}, '@VERSION@' ,{requires:['widget-position', 'widget-stack', 'gallery-bt-pushpop']});"];
_yuitest_coverage["/build/gallery-bt-page/gallery-bt-page.js"].lines = {"1":0,"10":0,"29":0,"31":0,"40":0,"44":0,"45":0,"48":0,"62":0,"73":0};
_yuitest_coverage["/build/gallery-bt-page/gallery-bt-page.js"].functions = {"initializer:30":0,"resize:39":0,"getInstances:61":0,"getCurrent:72":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bt-page/gallery-bt-page.js"].coveredLines = 10;
_yuitest_coverage["/build/gallery-bt-page/gallery-bt-page.js"].coveredFunctions = 5;
_yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 1);
YUI.add('gallery-bt-page', function(Y) {

/**
 *
 * Provides Page widget which changes width and height with viewport.
 *
 * @module gallery-bt-page
 */

_yuitest_coverfunc("/build/gallery-bt-page/gallery-bt-page.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 10);
var current,
    instances = [];

/**
 * A basic Page Widget, which will automatically adapt the browser width
 * and height. Only one page will show in the same time. Use active
 * function can hide current page and show the other page. It also has
 * header and footer fixed support.
 *
 * @class Page
 * @constructor
 * @namespace Bottle
 * @extends PushPop
 * @uses WidgetParent
 * @uses WidgetPosition
 * @uses WidgetStack
 * @uses PushPop
 * @param [config] {Object} Object literal with initial attribute values
 */
_yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 29);
Y.Bottle.Page = Y.Base.create('btpage', Y.Widget, [Y.WidgetParent, Y.WidgetPosition, Y.WidgetStack, Y.Bottle.PushPop], {
    initializer: function () {
        _yuitest_coverfunc("/build/gallery-bt-page/gallery-bt-page.js", "initializer", 30);
_yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 31);
instances.push(current = this);
    },

    /**
     * Resize the page to adapt the browser width and height.
     *
     * @method resize
     */
    resize: function () {
        _yuitest_coverfunc("/build/gallery-bt-page/gallery-bt-page.js", "resize", 39);
_yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 40);
var b_width = Y.Bottle.Device.getBrowserWidth(),
            b_height = Y.Bottle.Device.getBrowserHeight();

        //reduce syncUI times
        _yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 44);
if ((this.get('width') === b_width) && (this.get('height') === b_height)) {
            _yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 45);
return;
        }

        _yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 48);
this.setAttrs({
            'width': b_width,
            'height': b_height
        });
    }
}, {
    /**
     * Get all instances of Page
     *
     * @method getInstances
     * @static
     * @return {Array} all instances of Page
     */
    getInstances: function () {
        _yuitest_coverfunc("/build/gallery-bt-page/gallery-bt-page.js", "getInstances", 61);
_yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 62);
return instances;
    },

    /**
     * Get current visible Page
     *
     * @method getCurrent
     * @static
     * @return {Object | undefined} current visible Page. If no any visible Page, return undefined.
     */
    getCurrent: function () {
        _yuitest_coverfunc("/build/gallery-bt-page/gallery-bt-page.js", "getCurrent", 72);
_yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 73);
return current;
    }
});


}, '@VERSION@' ,{requires:['widget-position', 'widget-stack', 'gallery-bt-pushpop']});
