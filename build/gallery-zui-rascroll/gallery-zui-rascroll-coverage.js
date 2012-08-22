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
_yuitest_coverage["/build/gallery-zui-rascroll/gallery-zui-rascroll.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-zui-rascroll/gallery-zui-rascroll.js",
    code: []
};
_yuitest_coverage["/build/gallery-zui-rascroll/gallery-zui-rascroll.js"].code=["YUI.add('gallery-zui-rascroll', function(Y) {","","/**"," * The RAScrollPlugin help to handle scrollView behaviors."," * When a Horizontal scrollView is placed inside a Vertical scrollView,"," * user can do only x or y direction slick."," *"," * @module gallery-zui-rascroll"," */ ","var dragging = 0,","/**"," * RAScrollPlugin is a ScrollView plugin that adds right angle flick behaviors."," *"," * @class RAScrollPlugin"," * @namespace zui "," * @extends Plugin.Base"," * @constructor"," */","    RAScrollPlugin = function () {","        RAScrollPlugin.superclass.constructor.apply(this, arguments);","    };","","RAScrollPlugin.NAME = 'pluginRAScroll';","RAScrollPlugin.NS = 'zras';","RAScrollPlugin.ATTRS = {","    /**","     * make the scrollView as horizontal or not.","     *","     * @attribute horizontal","     * @default true","     * @type Boolean","     */","    horizontal: {","        value: true,","        lazyAdd: false,","        validator: Y.Lang.isBoolean,","        setter: function (V) {","            this._hori = V;","            return V;","        }","    },","","    /**","     * A boolean decides the right angle behavior should started when other scrollView is also dragged.","     *","     * @attribute cooperation","     * @default false","     * @type Boolean","     */","    cooperation: {","        value: false,","        lazyAdd: false,","        validator: Y.Lang.isBoolean,","        setter: function (V) {","            this._coop = V;","            return V;","        }","    }","};","","Y.namespace('zui').RAScroll = Y.extend(RAScrollPlugin, Y.Plugin.Base, {","    initializer: function () {","        this._host = this.get('host');","        this._node = this._host.get('boundingBox');","        this._start = false;","        this._onlyX = false;","","        this._handles.push(new Y.EventHandle([","            this._node.on('gesturemovestart', Y.bind(this.handleGestureMoveStart, this)),","            this._node.on('gesturemove', Y.bind(this.handleGestureMove, this)),","            this._host.get('contentBox').on('gesturemoveend', Y.bind(this.handleGestureMoveEnd, this), {standAlone: true})","        ]));","","        this.syncScroll();","    },","","    /**","     * internal gesturemovestart event handler","     *","     * @method handleGestureMoveStart","     * @protected","     */","    handleGestureMoveStart: function (E) {","        dragging++;","    },","","    /**","     * internal gesturemove event handler","     *","     * @method handleGestureMove","     * @protected","     */","    handleGestureMove: function (E) {","        if (this._start) {","            return;","        }","","        this._start = true;","        this._onlyX = Math.abs(this._host._startClientX - E.clientX) > Math.abs(this._host._startClientY - E.clientY);","","        if (this._coop && dragging < 2) {","            return;","        }","","        if (this._hori ? !this._onlyX : this._onlyX) {","            this._host.set('disabled', true);","        }","    },","","    /**","     * internal gesturemoveend event handler","     *","     * @method handleGestureMoveEnd","     * @protected","     */","    handleGestureMoveEnd: function (E) {","        this._start = false;","        dragging--;","","        if (this._coop && dragging === 0) {","            return;","        }","        if (this._hori ? !this._onlyX : this._onlyX) {","            this._host.set('disabled', false);","        }","    },","","    /**","     * sync width or height for vertical scroll or horizontal scroll","     *","     * @method syncScroll","     */","    syncScroll: function () {","        if (this._hori) {","            this._node.set('offsetHeight', this._node.get('scrollHeight'));","        } else {","            this.syncWidth();","        }","    },","","    /**","     * make the scrollView become vertical scrolling","     *","     * @method syncWidth","     */","    syncWidth: function () {","        var c = this._host.get('contentBox'),","            sw = this._node.get('scrollWidth'),","            pw = this._node.get('offsetWidth');","","        if (sw > pw) {","            c.set('offsetWidth', c.get('offsetWidth') + pw - sw);","        }","    }","});","","","}, 'gallery-2012.08.22-20-00' ,{requires:['scrollview'], skinnable:false});"];
_yuitest_coverage["/build/gallery-zui-rascroll/gallery-zui-rascroll.js"].lines = {"1":0,"10":0,"20":0,"23":0,"24":0,"25":0,"38":0,"39":0,"55":0,"56":0,"61":0,"63":0,"64":0,"65":0,"66":0,"68":0,"74":0,"84":0,"94":0,"95":0,"98":0,"99":0,"101":0,"102":0,"105":0,"106":0,"117":0,"118":0,"120":0,"121":0,"123":0,"124":0,"134":0,"135":0,"137":0,"147":0,"151":0,"152":0};
_yuitest_coverage["/build/gallery-zui-rascroll/gallery-zui-rascroll.js"].functions = {"RAScrollPlugin:19":0,"setter:37":0,"setter:54":0,"initializer:62":0,"handleGestureMoveStart:83":0,"handleGestureMove:93":0,"handleGestureMoveEnd:116":0,"syncScroll:133":0,"syncWidth:146":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-zui-rascroll/gallery-zui-rascroll.js"].coveredLines = 38;
_yuitest_coverage["/build/gallery-zui-rascroll/gallery-zui-rascroll.js"].coveredFunctions = 10;
_yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 1);
YUI.add('gallery-zui-rascroll', function(Y) {

/**
 * The RAScrollPlugin help to handle scrollView behaviors.
 * When a Horizontal scrollView is placed inside a Vertical scrollView,
 * user can do only x or y direction slick.
 *
 * @module gallery-zui-rascroll
 */ 
_yuitest_coverfunc("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 10);
var dragging = 0,
/**
 * RAScrollPlugin is a ScrollView plugin that adds right angle flick behaviors.
 *
 * @class RAScrollPlugin
 * @namespace zui 
 * @extends Plugin.Base
 * @constructor
 */
    RAScrollPlugin = function () {
        _yuitest_coverfunc("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", "RAScrollPlugin", 19);
_yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 20);
RAScrollPlugin.superclass.constructor.apply(this, arguments);
    };

_yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 23);
RAScrollPlugin.NAME = 'pluginRAScroll';
_yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 24);
RAScrollPlugin.NS = 'zras';
_yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 25);
RAScrollPlugin.ATTRS = {
    /**
     * make the scrollView as horizontal or not.
     *
     * @attribute horizontal
     * @default true
     * @type Boolean
     */
    horizontal: {
        value: true,
        lazyAdd: false,
        validator: Y.Lang.isBoolean,
        setter: function (V) {
            _yuitest_coverfunc("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", "setter", 37);
_yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 38);
this._hori = V;
            _yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 39);
return V;
        }
    },

    /**
     * A boolean decides the right angle behavior should started when other scrollView is also dragged.
     *
     * @attribute cooperation
     * @default false
     * @type Boolean
     */
    cooperation: {
        value: false,
        lazyAdd: false,
        validator: Y.Lang.isBoolean,
        setter: function (V) {
            _yuitest_coverfunc("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", "setter", 54);
_yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 55);
this._coop = V;
            _yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 56);
return V;
        }
    }
};

_yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 61);
Y.namespace('zui').RAScroll = Y.extend(RAScrollPlugin, Y.Plugin.Base, {
    initializer: function () {
        _yuitest_coverfunc("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", "initializer", 62);
_yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 63);
this._host = this.get('host');
        _yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 64);
this._node = this._host.get('boundingBox');
        _yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 65);
this._start = false;
        _yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 66);
this._onlyX = false;

        _yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 68);
this._handles.push(new Y.EventHandle([
            this._node.on('gesturemovestart', Y.bind(this.handleGestureMoveStart, this)),
            this._node.on('gesturemove', Y.bind(this.handleGestureMove, this)),
            this._host.get('contentBox').on('gesturemoveend', Y.bind(this.handleGestureMoveEnd, this), {standAlone: true})
        ]));

        _yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 74);
this.syncScroll();
    },

    /**
     * internal gesturemovestart event handler
     *
     * @method handleGestureMoveStart
     * @protected
     */
    handleGestureMoveStart: function (E) {
        _yuitest_coverfunc("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", "handleGestureMoveStart", 83);
_yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 84);
dragging++;
    },

    /**
     * internal gesturemove event handler
     *
     * @method handleGestureMove
     * @protected
     */
    handleGestureMove: function (E) {
        _yuitest_coverfunc("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", "handleGestureMove", 93);
_yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 94);
if (this._start) {
            _yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 95);
return;
        }

        _yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 98);
this._start = true;
        _yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 99);
this._onlyX = Math.abs(this._host._startClientX - E.clientX) > Math.abs(this._host._startClientY - E.clientY);

        _yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 101);
if (this._coop && dragging < 2) {
            _yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 102);
return;
        }

        _yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 105);
if (this._hori ? !this._onlyX : this._onlyX) {
            _yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 106);
this._host.set('disabled', true);
        }
    },

    /**
     * internal gesturemoveend event handler
     *
     * @method handleGestureMoveEnd
     * @protected
     */
    handleGestureMoveEnd: function (E) {
        _yuitest_coverfunc("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", "handleGestureMoveEnd", 116);
_yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 117);
this._start = false;
        _yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 118);
dragging--;

        _yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 120);
if (this._coop && dragging === 0) {
            _yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 121);
return;
        }
        _yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 123);
if (this._hori ? !this._onlyX : this._onlyX) {
            _yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 124);
this._host.set('disabled', false);
        }
    },

    /**
     * sync width or height for vertical scroll or horizontal scroll
     *
     * @method syncScroll
     */
    syncScroll: function () {
        _yuitest_coverfunc("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", "syncScroll", 133);
_yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 134);
if (this._hori) {
            _yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 135);
this._node.set('offsetHeight', this._node.get('scrollHeight'));
        } else {
            _yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 137);
this.syncWidth();
        }
    },

    /**
     * make the scrollView become vertical scrolling
     *
     * @method syncWidth
     */
    syncWidth: function () {
        _yuitest_coverfunc("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", "syncWidth", 146);
_yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 147);
var c = this._host.get('contentBox'),
            sw = this._node.get('scrollWidth'),
            pw = this._node.get('offsetWidth');

        _yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 151);
if (sw > pw) {
            _yuitest_coverline("/build/gallery-zui-rascroll/gallery-zui-rascroll.js", 152);
c.set('offsetWidth', c.get('offsetWidth') + pw - sw);
        }
    }
});


}, 'gallery-2012.08.22-20-00' ,{requires:['scrollview'], skinnable:false});
