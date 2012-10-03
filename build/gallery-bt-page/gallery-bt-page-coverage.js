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
_yuitest_coverage["/build/gallery-bt-page/gallery-bt-page.js"].code=["YUI.add('gallery-bt-page', function(Y) {","","/**"," *"," * Provides Page widget which changes width and height with viewport."," *"," * @module gallery-bt-page"," */","","var ADDCHILD = 'addChild',","    current,","    instances = [];","","/**"," * A basic Page Widget, which will automatically adapt the browser width"," * and height. Only one page will show in the same time. Use active"," * function can hide current page and show the other page. It also has"," * header and footer fixed support."," *"," * @class Page"," * @constructor"," * @namespace Bottle"," * @extends PushPop"," * @uses WidgetParent"," * @uses WidgetPosition"," * @uses WidgetStack"," * @uses Bottle.PushPop"," * @param [config] {Object} Object literal with initial attribute values"," */","Y.Bottle.Page = Y.Base.create('btpage', Y.Widget, [Y.WidgetParent, Y.WidgetPosition, Y.WidgetStack, Y.Bottle.PushPop], {","    initializer: function () {","        instances.push(current = this);","","        if (this.get('nativeScroll')) {","            this.get('boundingBox').addClass('btp-native');","        }","","        this._bpgEventHandlers = new Y.EventHandle([","            this.after(ADDCHILD, this._afterPGAddChild)","        ]);","    },","","    destructor: function () {","        this._bpgEventHandlers.detach();","        delete this._bpgEventHandlers;","    },","","    /**","     * handle nativeScroll attribute when children added","     *","     * @method _afterPGAddChild","     * @protected","     */","    _afterPGAddChild: function (E) {","        E.child.set('nativeScroll', this.get('nativeScroll'));","    },","","    /**","     * Resize the page to adapt the browser width and height. If the page enable the nativeScroll configuration, the widget height will not be touched","     *","     * @method resize","     */","    resize: function () {","        var W = Y.Bottle.Device.getBrowserWidth(),","            H = Y.Bottle.Device.getBrowserHeight();","","        //reduce syncUI times","        if ((this.get('width') === W) && (this.get('height') === H)) {","            return;","        }","","        if (this.get('nativeScroll')) {","            Y.fire('btSyncScreen');","            return;","        }","        ","        this.setAttrs({width: W, height: H});","    }","}, {","    /**","     * Static property used to define the default attribute configuration.","     *","     * @property ATTRS","     * @protected","     * @type Object","     * @static","     */","    ATTRS: {","        /**","         * Use native browser scroll","         *","         * @attribute action","         * @type String","         * @default unveil","         */","        nativeScroll: {","            value: true,","            validator: Y.Lang.isBool,","            writeOnce: 'initOnly'","        }","    },","","    /**","     * Static property used to define the default HTML parsing rules","     *","     * @property HTML_PARSER","     * @protected","     * @static","     * @type Object","     */","    HTML_PARSER: {","        nativeScroll: function (srcNode) {","            var D = srcNode.getData('native-scroll');","","            if (D === 'false') {","                return false;","            }","","            if (D === 'true') {","                return true;","            }","            return Y.Bottle.Device.getTouchSupport();","        }","    },","","    /**","     * Get all instances of Page","     *","     * @method getInstances","     * @static","     * @return {Array} all instances of Page","     */","    getInstances: function () {","        return instances;","    },","","    /**","     * Get current visible Page","     *","     * @method getCurrent","     * @static","     * @return {Object | undefined} current visible Page. If no any visible Page, return undefined.","     */","    getCurrent: function () {","        return current;","    }","});","","","}, '@VERSION@' ,{requires:['widget-position', 'widget-stack', 'gallery-bt-pushpop']});"];
_yuitest_coverage["/build/gallery-bt-page/gallery-bt-page.js"].lines = {"1":0,"10":0,"30":0,"32":0,"34":0,"35":0,"38":0,"44":0,"45":0,"55":0,"64":0,"68":0,"69":0,"72":0,"73":0,"74":0,"77":0,"113":0,"115":0,"116":0,"119":0,"120":0,"122":0,"134":0,"145":0};
_yuitest_coverage["/build/gallery-bt-page/gallery-bt-page.js"].functions = {"initializer:31":0,"destructor:43":0,"_afterPGAddChild:54":0,"resize:63":0,"nativeScroll:112":0,"getInstances:133":0,"getCurrent:144":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bt-page/gallery-bt-page.js"].coveredLines = 25;
_yuitest_coverage["/build/gallery-bt-page/gallery-bt-page.js"].coveredFunctions = 8;
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
var ADDCHILD = 'addChild',
    current,
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
 * @uses Bottle.PushPop
 * @param [config] {Object} Object literal with initial attribute values
 */
_yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 30);
Y.Bottle.Page = Y.Base.create('btpage', Y.Widget, [Y.WidgetParent, Y.WidgetPosition, Y.WidgetStack, Y.Bottle.PushPop], {
    initializer: function () {
        _yuitest_coverfunc("/build/gallery-bt-page/gallery-bt-page.js", "initializer", 31);
_yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 32);
instances.push(current = this);

        _yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 34);
if (this.get('nativeScroll')) {
            _yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 35);
this.get('boundingBox').addClass('btp-native');
        }

        _yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 38);
this._bpgEventHandlers = new Y.EventHandle([
            this.after(ADDCHILD, this._afterPGAddChild)
        ]);
    },

    destructor: function () {
        _yuitest_coverfunc("/build/gallery-bt-page/gallery-bt-page.js", "destructor", 43);
_yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 44);
this._bpgEventHandlers.detach();
        _yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 45);
delete this._bpgEventHandlers;
    },

    /**
     * handle nativeScroll attribute when children added
     *
     * @method _afterPGAddChild
     * @protected
     */
    _afterPGAddChild: function (E) {
        _yuitest_coverfunc("/build/gallery-bt-page/gallery-bt-page.js", "_afterPGAddChild", 54);
_yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 55);
E.child.set('nativeScroll', this.get('nativeScroll'));
    },

    /**
     * Resize the page to adapt the browser width and height. If the page enable the nativeScroll configuration, the widget height will not be touched
     *
     * @method resize
     */
    resize: function () {
        _yuitest_coverfunc("/build/gallery-bt-page/gallery-bt-page.js", "resize", 63);
_yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 64);
var W = Y.Bottle.Device.getBrowserWidth(),
            H = Y.Bottle.Device.getBrowserHeight();

        //reduce syncUI times
        _yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 68);
if ((this.get('width') === W) && (this.get('height') === H)) {
            _yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 69);
return;
        }

        _yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 72);
if (this.get('nativeScroll')) {
            _yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 73);
Y.fire('btSyncScreen');
            _yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 74);
return;
        }
        
        _yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 77);
this.setAttrs({width: W, height: H});
    }
}, {
    /**
     * Static property used to define the default attribute configuration.
     *
     * @property ATTRS
     * @protected
     * @type Object
     * @static
     */
    ATTRS: {
        /**
         * Use native browser scroll
         *
         * @attribute action
         * @type String
         * @default unveil
         */
        nativeScroll: {
            value: true,
            validator: Y.Lang.isBool,
            writeOnce: 'initOnly'
        }
    },

    /**
     * Static property used to define the default HTML parsing rules
     *
     * @property HTML_PARSER
     * @protected
     * @static
     * @type Object
     */
    HTML_PARSER: {
        nativeScroll: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-page/gallery-bt-page.js", "nativeScroll", 112);
_yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 113);
var D = srcNode.getData('native-scroll');

            _yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 115);
if (D === 'false') {
                _yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 116);
return false;
            }

            _yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 119);
if (D === 'true') {
                _yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 120);
return true;
            }
            _yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 122);
return Y.Bottle.Device.getTouchSupport();
        }
    },

    /**
     * Get all instances of Page
     *
     * @method getInstances
     * @static
     * @return {Array} all instances of Page
     */
    getInstances: function () {
        _yuitest_coverfunc("/build/gallery-bt-page/gallery-bt-page.js", "getInstances", 133);
_yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 134);
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
        _yuitest_coverfunc("/build/gallery-bt-page/gallery-bt-page.js", "getCurrent", 144);
_yuitest_coverline("/build/gallery-bt-page/gallery-bt-page.js", 145);
return current;
    }
});


}, '@VERSION@' ,{requires:['widget-position', 'widget-stack', 'gallery-bt-pushpop']});
