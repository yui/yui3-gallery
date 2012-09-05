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
_yuitest_coverage["/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js",
    code: []
};
_yuitest_coverage["/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js"].code=["YUI.add('gallery-bt-syncscroll', function(Y) {","","/**"," * Provide SyncScroll widget extension to sync status with parent scrollView"," *"," * @module gallery-bt-syncscroll"," * @static"," */","","/**"," * SyncScroll is a Widget extension which can help you to handle size sync with parent scrollView"," *"," * @class SyncScroll"," * @namespace Bottle"," * @constructor"," * @param [config] {Object} Object literal with initial attribute values"," */","var  WIDTH_CHANGE = 'widthChange',","","SyncScroll = function (config) {","    Y.on('btReady', this._bssInitParentScroll, this);","};","","/**"," * Static property used to define the default attribute configuration."," *"," * @property ATTRS"," * @type Object"," * @static"," * @protected"," */","SyncScroll.ATTRS = {","    /**","     * Default callback method when parent scroll width changed","     *","     * @attribute syncScrollMethod","     * @type Function","    */","    syncScrollMethod: {","        writeOnce: true,","        validator: Y.Lang.isFunction","    },","","    /**","     * Auto set width when screen size changed","     *","     * @attribute autoWidth","     * @writeOnce","     * @type Boolean","     */","    autoWidth: {","        validator: Y.Lang.isBoolean,","        lazyAdd: false,","        writeOnce: true","    }","};","","/**"," * Static property used to define the default HTML parsing rules"," *"," * @property HTML_PARSER"," * @static"," * @protected"," * @type Object"," */","SyncScroll.HTML_PARSER = {","    autoWidth: function (srcNode) {","        return (srcNode.getData('auto-width') === 'true');","    }","};","","SyncScroll.prototype = {","    destructor: function () {","        if (this._bssResizeHandle) {","            this._bssResizeHandle.detach();","            delete this._bssResizeHandle;","        }","        if (this._bssHandle) {","            this._bssHandle.detach();","            delete this._bssHandle;","        }","        delete this._bssParentScroll;","    },","","    /**","     * Do initialize for parent scrollView checking","     *","     * @method _bssInitParentScroll","     * @private","     */","    _bssInitParentScroll: function () {","        var V = this.get('syncScrollMethod'),","            that = this;","        this._bssParentScroll = Y.Widget.getByNode(this.get('boundingBox').ancestor('.yui3-scrollview'));","","        if (V) {","            // sync width with parent scrollView","            if (this._bssParentScroll) {","                this._bssHandle = this._bssParentScroll.after(WIDTH_CHANGE, V, this);","            }","","            // sync width with window","            if (this.get('autoWidth')) {","                window.addEventListener((Y.UA.mobile == 'Apple') ? 'orientationchange' : 'resize', function () {","                    V.apply(that);","                }, false);","            }","        }","        this.syncScroll();","    },","","    /**","     * sync parent scrollView. If none, do nothing.","     *","     * @method syncScroll","     */","    syncScroll: function () {","        var ps = this._bssParentScroll;","","        if (ps) {","            ps._uiDimensionsChange();","            this.fixScrollPosition();","        }","    },","","    /**","     * fix parent scrollView scroll position. If none, do nothing.","     *","     * @method fixScrollPosition","     */","    fixScrollPosition: function () {","        var ps = this._bssParentScroll;","","        if (ps && ps._maxScrollY) {","            ps.scrollTo(ps.get('scrollX'), Math.min(ps.get('scrollY'), ps._maxScrollY));","        }","    }","};","","Y.namespace('Bottle').SyncScroll = SyncScroll;","","","}, '@VERSION@' ,{requires:['base-build', 'widget']});"];
_yuitest_coverage["/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js"].lines = {"1":0,"18":0,"21":0,"32":0,"66":0,"68":0,"72":0,"74":0,"75":0,"76":0,"78":0,"79":0,"80":0,"82":0,"92":0,"94":0,"96":0,"98":0,"99":0,"103":0,"104":0,"105":0,"109":0,"118":0,"120":0,"121":0,"122":0,"132":0,"134":0,"135":0,"140":0};
_yuitest_coverage["/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js"].functions = {"SyncScroll:20":0,"autoWidth:67":0,"destructor:73":0,"(anonymous 2):104":0,"_bssInitParentScroll:91":0,"syncScroll:117":0,"fixScrollPosition:131":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js"].coveredLines = 31;
_yuitest_coverage["/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js"].coveredFunctions = 8;
_yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 1);
YUI.add('gallery-bt-syncscroll', function(Y) {

/**
 * Provide SyncScroll widget extension to sync status with parent scrollView
 *
 * @module gallery-bt-syncscroll
 * @static
 */

/**
 * SyncScroll is a Widget extension which can help you to handle size sync with parent scrollView
 *
 * @class SyncScroll
 * @namespace Bottle
 * @constructor
 * @param [config] {Object} Object literal with initial attribute values
 */
_yuitest_coverfunc("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 18);
var  WIDTH_CHANGE = 'widthChange',

SyncScroll = function (config) {
    _yuitest_coverfunc("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", "SyncScroll", 20);
_yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 21);
Y.on('btReady', this._bssInitParentScroll, this);
};

/**
 * Static property used to define the default attribute configuration.
 *
 * @property ATTRS
 * @type Object
 * @static
 * @protected
 */
_yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 32);
SyncScroll.ATTRS = {
    /**
     * Default callback method when parent scroll width changed
     *
     * @attribute syncScrollMethod
     * @type Function
    */
    syncScrollMethod: {
        writeOnce: true,
        validator: Y.Lang.isFunction
    },

    /**
     * Auto set width when screen size changed
     *
     * @attribute autoWidth
     * @writeOnce
     * @type Boolean
     */
    autoWidth: {
        validator: Y.Lang.isBoolean,
        lazyAdd: false,
        writeOnce: true
    }
};

/**
 * Static property used to define the default HTML parsing rules
 *
 * @property HTML_PARSER
 * @static
 * @protected
 * @type Object
 */
_yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 66);
SyncScroll.HTML_PARSER = {
    autoWidth: function (srcNode) {
        _yuitest_coverfunc("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", "autoWidth", 67);
_yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 68);
return (srcNode.getData('auto-width') === 'true');
    }
};

_yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 72);
SyncScroll.prototype = {
    destructor: function () {
        _yuitest_coverfunc("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", "destructor", 73);
_yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 74);
if (this._bssResizeHandle) {
            _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 75);
this._bssResizeHandle.detach();
            _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 76);
delete this._bssResizeHandle;
        }
        _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 78);
if (this._bssHandle) {
            _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 79);
this._bssHandle.detach();
            _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 80);
delete this._bssHandle;
        }
        _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 82);
delete this._bssParentScroll;
    },

    /**
     * Do initialize for parent scrollView checking
     *
     * @method _bssInitParentScroll
     * @private
     */
    _bssInitParentScroll: function () {
        _yuitest_coverfunc("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", "_bssInitParentScroll", 91);
_yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 92);
var V = this.get('syncScrollMethod'),
            that = this;
        _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 94);
this._bssParentScroll = Y.Widget.getByNode(this.get('boundingBox').ancestor('.yui3-scrollview'));

        _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 96);
if (V) {
            // sync width with parent scrollView
            _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 98);
if (this._bssParentScroll) {
                _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 99);
this._bssHandle = this._bssParentScroll.after(WIDTH_CHANGE, V, this);
            }

            // sync width with window
            _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 103);
if (this.get('autoWidth')) {
                _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 104);
window.addEventListener((Y.UA.mobile == 'Apple') ? 'orientationchange' : 'resize', function () {
                    _yuitest_coverfunc("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", "(anonymous 2)", 104);
_yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 105);
V.apply(that);
                }, false);
            }
        }
        _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 109);
this.syncScroll();
    },

    /**
     * sync parent scrollView. If none, do nothing.
     *
     * @method syncScroll
     */
    syncScroll: function () {
        _yuitest_coverfunc("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", "syncScroll", 117);
_yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 118);
var ps = this._bssParentScroll;

        _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 120);
if (ps) {
            _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 121);
ps._uiDimensionsChange();
            _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 122);
this.fixScrollPosition();
        }
    },

    /**
     * fix parent scrollView scroll position. If none, do nothing.
     *
     * @method fixScrollPosition
     */
    fixScrollPosition: function () {
        _yuitest_coverfunc("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", "fixScrollPosition", 131);
_yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 132);
var ps = this._bssParentScroll;

        _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 134);
if (ps && ps._maxScrollY) {
            _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 135);
ps.scrollTo(ps.get('scrollX'), Math.min(ps.get('scrollY'), ps._maxScrollY));
        }
    }
};

_yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 140);
Y.namespace('Bottle').SyncScroll = SyncScroll;


}, '@VERSION@' ,{requires:['base-build', 'widget']});
