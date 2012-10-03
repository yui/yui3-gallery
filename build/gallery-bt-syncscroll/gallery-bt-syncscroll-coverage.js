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
_yuitest_coverage["/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js"].code=["YUI.add('gallery-bt-syncscroll', function(Y) {","","/**"," * Provide SyncScroll widget extension to sync status with parent scrollView"," *"," * @module gallery-bt-syncscroll"," * @static"," */","","/**"," * SyncScroll is a Widget extension which can help you to handle size sync with parent scrollView"," *"," * @class SyncScroll"," * @namespace Bottle"," * @constructor"," * @param [config] {Object} Object literal with initial attribute values"," */","var  WIDTH_CHANGE = 'widthChange',","","SyncScroll = function (config) {","    Y.on('btReady', this._bssInitParentScroll, this);","};","","/**"," * Static property used to define the default attribute configuration."," *"," * @property ATTRS"," * @type Object"," * @static"," * @protected"," */","SyncScroll.ATTRS = {","    /**","     * Default callback method when parent scroll width changed","     *","     * @attribute syncScrollMethod","     * @type Function","    */","    syncScrollMethod: {","        writeOnce: true,","        validator: Y.Lang.isFunction","    }","};","","SyncScroll.prototype = {","    destructor: function () {","        if (this._bssResizeHandle) {","            this._bssResizeHandle.detach();","            delete this._bssResizeHandle;","        }","        if (this._bssHandle) {","            this._bssHandle.detach();","            delete this._bssHandle;","        }","        delete this._bssParentScroll;","    },","","    /**","     * Do initialize for parent scrollView checking","     *","     * @method _bssInitParentScroll","     * @private","     */","    _bssInitParentScroll: function () {","        var V = this.get('syncScrollMethod'),","            pg = Y.Bottle.Page.getCurrent(),","            hs = [this.after(WIDTH_CHANGE, V, this)];","","        this._bssParentScroll = Y.Widget.getByNode(this.get('boundingBox').ancestor('.yui3-scrollview'));","","        if (V) {","            // sync width with parent scrollView","            if (this._bssParentScroll) {","                hs.push(this._bssParentScroll.after(WIDTH_CHANGE, V, this));","            }","","            // sync width with screen width","            if (!pg || pg.get('nativeScroll')) {","                hs.push(Y.on('btSyncScreen', Y.bind(V, this)));","            }","","            this._bssHandle = new Y.EventHandle(hs);","        }","        this.syncScroll();","    },","","    /**","     * sync parent scrollView. If none, do nothing.","     *","     * @method syncScroll","     */","    syncScroll: function () {","        var ps = this._bssParentScroll;","","        if (ps) {","            ps._uiDimensionsChange();","            this.fixScrollPosition();","        }","    },","","    /**","     * fix parent scrollView scroll position. If none, do nothing.","     *","     * @method fixScrollPosition","     */","    fixScrollPosition: function () {","        var ps = this._bssParentScroll;","","        if (ps && ps._maxScrollY) {","            ps.scrollTo(ps.get('scrollX'), Math.min(ps.get('scrollY'), ps._maxScrollY));","        }","    }","};","","Y.namespace('Bottle').SyncScroll = SyncScroll;","","","}, '@VERSION@' ,{requires:['gallery-bt-page']});"];
_yuitest_coverage["/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js"].lines = {"1":0,"18":0,"21":0,"32":0,"45":0,"47":0,"48":0,"49":0,"51":0,"52":0,"53":0,"55":0,"65":0,"69":0,"71":0,"73":0,"74":0,"78":0,"79":0,"82":0,"84":0,"93":0,"95":0,"96":0,"97":0,"107":0,"109":0,"110":0,"115":0};
_yuitest_coverage["/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js"].functions = {"SyncScroll:20":0,"destructor:46":0,"_bssInitParentScroll:64":0,"syncScroll:92":0,"fixScrollPosition:106":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js"].coveredLines = 29;
_yuitest_coverage["/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js"].coveredFunctions = 6;
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
    }
};

_yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 45);
SyncScroll.prototype = {
    destructor: function () {
        _yuitest_coverfunc("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", "destructor", 46);
_yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 47);
if (this._bssResizeHandle) {
            _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 48);
this._bssResizeHandle.detach();
            _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 49);
delete this._bssResizeHandle;
        }
        _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 51);
if (this._bssHandle) {
            _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 52);
this._bssHandle.detach();
            _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 53);
delete this._bssHandle;
        }
        _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 55);
delete this._bssParentScroll;
    },

    /**
     * Do initialize for parent scrollView checking
     *
     * @method _bssInitParentScroll
     * @private
     */
    _bssInitParentScroll: function () {
        _yuitest_coverfunc("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", "_bssInitParentScroll", 64);
_yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 65);
var V = this.get('syncScrollMethod'),
            pg = Y.Bottle.Page.getCurrent(),
            hs = [this.after(WIDTH_CHANGE, V, this)];

        _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 69);
this._bssParentScroll = Y.Widget.getByNode(this.get('boundingBox').ancestor('.yui3-scrollview'));

        _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 71);
if (V) {
            // sync width with parent scrollView
            _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 73);
if (this._bssParentScroll) {
                _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 74);
hs.push(this._bssParentScroll.after(WIDTH_CHANGE, V, this));
            }

            // sync width with screen width
            _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 78);
if (!pg || pg.get('nativeScroll')) {
                _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 79);
hs.push(Y.on('btSyncScreen', Y.bind(V, this)));
            }

            _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 82);
this._bssHandle = new Y.EventHandle(hs);
        }
        _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 84);
this.syncScroll();
    },

    /**
     * sync parent scrollView. If none, do nothing.
     *
     * @method syncScroll
     */
    syncScroll: function () {
        _yuitest_coverfunc("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", "syncScroll", 92);
_yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 93);
var ps = this._bssParentScroll;

        _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 95);
if (ps) {
            _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 96);
ps._uiDimensionsChange();
            _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 97);
this.fixScrollPosition();
        }
    },

    /**
     * fix parent scrollView scroll position. If none, do nothing.
     *
     * @method fixScrollPosition
     */
    fixScrollPosition: function () {
        _yuitest_coverfunc("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", "fixScrollPosition", 106);
_yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 107);
var ps = this._bssParentScroll;

        _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 109);
if (ps && ps._maxScrollY) {
            _yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 110);
ps.scrollTo(ps.get('scrollX'), Math.min(ps.get('scrollY'), ps._maxScrollY));
        }
    }
};

_yuitest_coverline("/build/gallery-bt-syncscroll/gallery-bt-syncscroll.js", 115);
Y.namespace('Bottle').SyncScroll = SyncScroll;


}, '@VERSION@' ,{requires:['gallery-bt-page']});
