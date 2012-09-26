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
_yuitest_coverage["/build/gallery-zui-scrollhelper/gallery-zui-scrollhelper.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-zui-scrollhelper/gallery-zui-scrollhelper.js",
    code: []
};
_yuitest_coverage["/build/gallery-zui-scrollhelper/gallery-zui-scrollhelper.js"].code=["YUI.add('gallery-zui-scrollhelper', function(Y) {","","/**"," * ZUI ScrollHelper help you to handle desktop img/a dragging problem in scrollView."," * Just plug Y.zui.ScrollHelper into a scrollView. If user dragging with Desktop"," * browsers, the scrollView still work well even when user start dragging on an A"," ( or IMG."," *"," * @module gallery-zui-scrollhelper"," */ ","var dragging = 0,","    dragStart = false,","    onlyX = false,","/**"," * ScrollHelperPlugin is a ScrollView plugin that help to handle A/IMG dragging bug."," *"," * @class ScrollHelperPlugin"," * @namespace zui "," * @extends Plugin.Base"," * @constructor"," */","    ScrollHelperPlugin = function () {","        ScrollHelperPlugin.superclass.constructor.apply(this, arguments);","    };","","ScrollHelperPlugin.NAME = 'pluginScrollHelper';","ScrollHelperPlugin.NS = 'zsh';","ScrollHelperPlugin.ATTRS = {","    /**","     * Default css selector to help disable browser native dragging","     *","     * @attribute noDragSelector","     * @default 'a, img'","     * @type String","     */","    noDragSelector: {","        value: 'a, img',","        validator: Y.Lang.isString,","        writeOnce: 'initOnly'","    },","","    /**","     * Default css selector to help disable click when scrollView was scrolled","     *","     * @attribute noClickSelector","     * @default 'a'","     * @type Boolean","     */","    noClickSelector: {","        value: 'a',","        validator: Y.Lang.isString,","        writeOnce: 'initOnly'","    }","};","","Y.namespace('zui').ScrollHelper = Y.extend(ScrollHelperPlugin, Y.Plugin.Base, {","    initializer: function () {","        var host = this.get('host'),","            cnt = host.get('contentBox');","","        this._handles.push(new Y.EventHandle([","            cnt.delegate('click', this.handleClick, this.get('noClickSelector'), host),","            cnt.delegate('mousedown', this.handleMouseDown, this.get('noDragSelector'), this)","        ]));","    },","    ","    /**","     * internal click event handler","     *","     * @method handleClick","     * @protected","     */","    handleClick: function (E) {","        if (Math.abs(this.lastScrolledAmt) > 2) {","            E.preventDefault();","        }","    },","","    /**","     * internal mousedown event handler","     *","     * @method handleMouseDown","     * @protected","     */","    handleMouseDown: function (E) {","        E.preventDefault();","    },","","    /**","     * sync scrollView scroll position and height","     *","     * @method syncScroll","     */","    syncScroll: function () {","        var sc = this.get('host');","","        sc._uiDimensionsChange();","        if (sc._maxScrollY) {","            sc.scrollTo(null, Math.min(sc.get('scrollY'), sc._maxScrollY));","        }","    }","});","","","}, 'gallery-2012.09.26-20-36' ,{requires:['scrollview'], skinnable:false});"];
_yuitest_coverage["/build/gallery-zui-scrollhelper/gallery-zui-scrollhelper.js"].lines = {"1":0,"11":0,"23":0,"26":0,"27":0,"28":0,"56":0,"58":0,"61":0,"74":0,"75":0,"86":0,"95":0,"97":0,"98":0,"99":0};
_yuitest_coverage["/build/gallery-zui-scrollhelper/gallery-zui-scrollhelper.js"].functions = {"ScrollHelperPlugin:22":0,"initializer:57":0,"handleClick:73":0,"handleMouseDown:85":0,"syncScroll:94":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-zui-scrollhelper/gallery-zui-scrollhelper.js"].coveredLines = 16;
_yuitest_coverage["/build/gallery-zui-scrollhelper/gallery-zui-scrollhelper.js"].coveredFunctions = 6;
_yuitest_coverline("/build/gallery-zui-scrollhelper/gallery-zui-scrollhelper.js", 1);
YUI.add('gallery-zui-scrollhelper', function(Y) {

/**
 * ZUI ScrollHelper help you to handle desktop img/a dragging problem in scrollView.
 * Just plug Y.zui.ScrollHelper into a scrollView. If user dragging with Desktop
 * browsers, the scrollView still work well even when user start dragging on an A
 ( or IMG.
 *
 * @module gallery-zui-scrollhelper
 */ 
_yuitest_coverfunc("/build/gallery-zui-scrollhelper/gallery-zui-scrollhelper.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-zui-scrollhelper/gallery-zui-scrollhelper.js", 11);
var dragging = 0,
    dragStart = false,
    onlyX = false,
/**
 * ScrollHelperPlugin is a ScrollView plugin that help to handle A/IMG dragging bug.
 *
 * @class ScrollHelperPlugin
 * @namespace zui 
 * @extends Plugin.Base
 * @constructor
 */
    ScrollHelperPlugin = function () {
        _yuitest_coverfunc("/build/gallery-zui-scrollhelper/gallery-zui-scrollhelper.js", "ScrollHelperPlugin", 22);
_yuitest_coverline("/build/gallery-zui-scrollhelper/gallery-zui-scrollhelper.js", 23);
ScrollHelperPlugin.superclass.constructor.apply(this, arguments);
    };

_yuitest_coverline("/build/gallery-zui-scrollhelper/gallery-zui-scrollhelper.js", 26);
ScrollHelperPlugin.NAME = 'pluginScrollHelper';
_yuitest_coverline("/build/gallery-zui-scrollhelper/gallery-zui-scrollhelper.js", 27);
ScrollHelperPlugin.NS = 'zsh';
_yuitest_coverline("/build/gallery-zui-scrollhelper/gallery-zui-scrollhelper.js", 28);
ScrollHelperPlugin.ATTRS = {
    /**
     * Default css selector to help disable browser native dragging
     *
     * @attribute noDragSelector
     * @default 'a, img'
     * @type String
     */
    noDragSelector: {
        value: 'a, img',
        validator: Y.Lang.isString,
        writeOnce: 'initOnly'
    },

    /**
     * Default css selector to help disable click when scrollView was scrolled
     *
     * @attribute noClickSelector
     * @default 'a'
     * @type Boolean
     */
    noClickSelector: {
        value: 'a',
        validator: Y.Lang.isString,
        writeOnce: 'initOnly'
    }
};

_yuitest_coverline("/build/gallery-zui-scrollhelper/gallery-zui-scrollhelper.js", 56);
Y.namespace('zui').ScrollHelper = Y.extend(ScrollHelperPlugin, Y.Plugin.Base, {
    initializer: function () {
        _yuitest_coverfunc("/build/gallery-zui-scrollhelper/gallery-zui-scrollhelper.js", "initializer", 57);
_yuitest_coverline("/build/gallery-zui-scrollhelper/gallery-zui-scrollhelper.js", 58);
var host = this.get('host'),
            cnt = host.get('contentBox');

        _yuitest_coverline("/build/gallery-zui-scrollhelper/gallery-zui-scrollhelper.js", 61);
this._handles.push(new Y.EventHandle([
            cnt.delegate('click', this.handleClick, this.get('noClickSelector'), host),
            cnt.delegate('mousedown', this.handleMouseDown, this.get('noDragSelector'), this)
        ]));
    },
    
    /**
     * internal click event handler
     *
     * @method handleClick
     * @protected
     */
    handleClick: function (E) {
        _yuitest_coverfunc("/build/gallery-zui-scrollhelper/gallery-zui-scrollhelper.js", "handleClick", 73);
_yuitest_coverline("/build/gallery-zui-scrollhelper/gallery-zui-scrollhelper.js", 74);
if (Math.abs(this.lastScrolledAmt) > 2) {
            _yuitest_coverline("/build/gallery-zui-scrollhelper/gallery-zui-scrollhelper.js", 75);
E.preventDefault();
        }
    },

    /**
     * internal mousedown event handler
     *
     * @method handleMouseDown
     * @protected
     */
    handleMouseDown: function (E) {
        _yuitest_coverfunc("/build/gallery-zui-scrollhelper/gallery-zui-scrollhelper.js", "handleMouseDown", 85);
_yuitest_coverline("/build/gallery-zui-scrollhelper/gallery-zui-scrollhelper.js", 86);
E.preventDefault();
    },

    /**
     * sync scrollView scroll position and height
     *
     * @method syncScroll
     */
    syncScroll: function () {
        _yuitest_coverfunc("/build/gallery-zui-scrollhelper/gallery-zui-scrollhelper.js", "syncScroll", 94);
_yuitest_coverline("/build/gallery-zui-scrollhelper/gallery-zui-scrollhelper.js", 95);
var sc = this.get('host');

        _yuitest_coverline("/build/gallery-zui-scrollhelper/gallery-zui-scrollhelper.js", 97);
sc._uiDimensionsChange();
        _yuitest_coverline("/build/gallery-zui-scrollhelper/gallery-zui-scrollhelper.js", 98);
if (sc._maxScrollY) {
            _yuitest_coverline("/build/gallery-zui-scrollhelper/gallery-zui-scrollhelper.js", 99);
sc.scrollTo(null, Math.min(sc.get('scrollY'), sc._maxScrollY));
        }
    }
});


}, 'gallery-2012.09.26-20-36' ,{requires:['scrollview'], skinnable:false});
