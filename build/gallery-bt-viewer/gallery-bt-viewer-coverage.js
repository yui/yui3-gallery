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
_yuitest_coverage["/build/gallery-bt-viewer/gallery-bt-viewer.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-bt-viewer/gallery-bt-viewer.js",
    code: []
};
_yuitest_coverage["/build/gallery-bt-viewer/gallery-bt-viewer.js"].code=["YUI.add('gallery-bt-viewer', function(Y) {","","/**"," * Provide Viewer class to place html, text and images."," *"," * @module gallery-bt-viewer"," * @static"," */","","var WIDTH_CHANGE = 'widthChange',","","    PREFIX = 'bvi_',","","    CLASSES = {","        IMAGE: PREFIX + 'image',","        BOTTON: PREFIX + 'botton',","        EXPAND: PREFIX + 'expand'","    },","","    HTML_BTN = '<span class=\"' + CLASSES.BOTTON + '\"></span>',","","    initImage = function (O) {","        if (O.get('naturalWidth') > O.get('offsetWidth')) {","            O.insert(HTML_BTN, 'before');","        }","    },","","    handleClickBtn = function (E) {","        var O = E.currentTarget,","            I = O.next('.' + CLASSES.IMAGE);","","        O.toggleClass(CLASSES.EXPAND);","        I.toggleClass(CLASSES.EXPAND);","        this._uiDimensionsChange();","    },","","/**"," * is a Widget provides a HTML Viewer interface. When contents or images are wider then device, Viewer can be scroll horizontally. And, from beginning, all images in Viewer are scaled down to fit the device width, and a 'expand' button will be provided for each scaled images."," *"," * @class Viewer"," * @constructor"," * @namespace Bottle"," * @extends ScrollView"," * @uses Bottle.SyncScroll"," * @uses Y.zui.Attribute"," * @param [config] {Object} Object literal with initial attribute values"," */","Viewer = Y.Base.create('btviewer', Y.ScrollView, [Y.Bottle.SyncScroll, Y.zui.Attribute], {","    initializer: function () {","        try {","            this.setAttrs({flick: false, bounce: 0});","            this.setAttrs(Y.JSON.parse(this.get('contentBox').getData('cfg-scroll')));","        } catch (e) {","        }","        this.set('syncScrollMethod', this._uiDimensionsChange);","    },","","    destructor: function () {","        this.unplug(Y.zui.RAScroll);","        this._bviEventHandlers.detach();","        delete this._bviEventHandlers;","    },","","    renderUI: function () {","        var cnt = this.get('contentBox'),","            images = this.get('imageNode'),","            that = this;","","        this.plug(Y.zui.RAScroll);","        this.unplug(Y.Plugin.ScrollViewScrollbars);","","        if (!Y.Bottle.Device.getTouchSupport()) {","            this.plug(Y.zui.ScrollHelper);","        }","","        images.addClass(CLASSES.IMAGE);","","        images.each(function (O) {","            if (O.get('naturalWidth')) {","                initImage(O);","            } else {","                O.once('load', function (E) {","                    initImage(E.target);","                    that._uiDimensionsChange();","                });","            }","        });","","        /**","         * internal eventhandlers, keep for destructor","         *","         * @property _bviEventHandlers","         * @type EventHandle","         * @private","         */","        this._bviEventHandlers = new Y.EventHandle([","            cnt.delegate('click', handleClickBtn, '.' + CLASSES.BOTTON, this)","        ]);","","        Y.once('btNative', this._nativeScroll, this);","    },","","    /**","     * toggle internal scrollview to support nativeScroll mode","     *","     * @method _nativeScroll","     * @protected","     */","    _nativeScroll: function () {","        this._prevent = {move: false, start: false, end: false};","    }","}, {","    /**","     * Static property used to define the default attribute configuration.","     *","     * @property ATTRS","     * @type Object","     * @static","     * @protected","     */","    ATTRS: {","        /**","         * Default image node css selector. After the Widget initialized, the attribute will become the NodeList object.","         *","         * @attribute imageNode","         * @type {{String|NodeList}}","         * @default 'img'","         */","        imageNode: {","            writeOnce: true,","            lazyAdd: false,","            setter: function (V) {","                this._imageCSS = V;","                return this.get('contentBox').all(V);","            }","        }","    },","","    /**","     * Static property used to define the default HTML parsing rules","     *","     * @property HTML_PARSER","     * @static","     * @protected","     * @type Object","     */","    HTML_PARSER: {","        imageNode: function (srcNode) {","            return srcNode.getData('image-node') || 'img';","        }","    }","});","","Y.namespace('Bottle').Viewer = Viewer;","","","}, '@VERSION@' ,{requires:['gallery-bt-syncscroll', 'gallery-zui-rascroll', 'gallery-zui-attribute', 'gallery-zui-scrollhelper']});"];
_yuitest_coverage["/build/gallery-bt-viewer/gallery-bt-viewer.js"].lines = {"1":0,"10":0,"23":0,"24":0,"29":0,"32":0,"33":0,"34":0,"50":0,"51":0,"52":0,"55":0,"59":0,"60":0,"61":0,"65":0,"69":0,"70":0,"72":0,"73":0,"76":0,"78":0,"79":0,"80":0,"82":0,"83":0,"84":0,"96":0,"100":0,"110":0,"133":0,"134":0,"149":0,"154":0};
_yuitest_coverage["/build/gallery-bt-viewer/gallery-bt-viewer.js"].functions = {"initImage:22":0,"handleClickBtn:28":0,"initializer:49":0,"destructor:58":0,"(anonymous 3):82":0,"(anonymous 2):78":0,"renderUI:64":0,"_nativeScroll:109":0,"setter:132":0,"imageNode:148":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bt-viewer/gallery-bt-viewer.js"].coveredLines = 34;
_yuitest_coverage["/build/gallery-bt-viewer/gallery-bt-viewer.js"].coveredFunctions = 11;
_yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 1);
YUI.add('gallery-bt-viewer', function(Y) {

/**
 * Provide Viewer class to place html, text and images.
 *
 * @module gallery-bt-viewer
 * @static
 */

_yuitest_coverfunc("/build/gallery-bt-viewer/gallery-bt-viewer.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 10);
var WIDTH_CHANGE = 'widthChange',

    PREFIX = 'bvi_',

    CLASSES = {
        IMAGE: PREFIX + 'image',
        BOTTON: PREFIX + 'botton',
        EXPAND: PREFIX + 'expand'
    },

    HTML_BTN = '<span class="' + CLASSES.BOTTON + '"></span>',

    initImage = function (O) {
        _yuitest_coverfunc("/build/gallery-bt-viewer/gallery-bt-viewer.js", "initImage", 22);
_yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 23);
if (O.get('naturalWidth') > O.get('offsetWidth')) {
            _yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 24);
O.insert(HTML_BTN, 'before');
        }
    },

    handleClickBtn = function (E) {
        _yuitest_coverfunc("/build/gallery-bt-viewer/gallery-bt-viewer.js", "handleClickBtn", 28);
_yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 29);
var O = E.currentTarget,
            I = O.next('.' + CLASSES.IMAGE);

        _yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 32);
O.toggleClass(CLASSES.EXPAND);
        _yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 33);
I.toggleClass(CLASSES.EXPAND);
        _yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 34);
this._uiDimensionsChange();
    },

/**
 * is a Widget provides a HTML Viewer interface. When contents or images are wider then device, Viewer can be scroll horizontally. And, from beginning, all images in Viewer are scaled down to fit the device width, and a 'expand' button will be provided for each scaled images.
 *
 * @class Viewer
 * @constructor
 * @namespace Bottle
 * @extends ScrollView
 * @uses Bottle.SyncScroll
 * @uses Y.zui.Attribute
 * @param [config] {Object} Object literal with initial attribute values
 */
Viewer = Y.Base.create('btviewer', Y.ScrollView, [Y.Bottle.SyncScroll, Y.zui.Attribute], {
    initializer: function () {
        _yuitest_coverfunc("/build/gallery-bt-viewer/gallery-bt-viewer.js", "initializer", 49);
_yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 50);
try {
            _yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 51);
this.setAttrs({flick: false, bounce: 0});
            _yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 52);
this.setAttrs(Y.JSON.parse(this.get('contentBox').getData('cfg-scroll')));
        } catch (e) {
        }
        _yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 55);
this.set('syncScrollMethod', this._uiDimensionsChange);
    },

    destructor: function () {
        _yuitest_coverfunc("/build/gallery-bt-viewer/gallery-bt-viewer.js", "destructor", 58);
_yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 59);
this.unplug(Y.zui.RAScroll);
        _yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 60);
this._bviEventHandlers.detach();
        _yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 61);
delete this._bviEventHandlers;
    },

    renderUI: function () {
        _yuitest_coverfunc("/build/gallery-bt-viewer/gallery-bt-viewer.js", "renderUI", 64);
_yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 65);
var cnt = this.get('contentBox'),
            images = this.get('imageNode'),
            that = this;

        _yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 69);
this.plug(Y.zui.RAScroll);
        _yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 70);
this.unplug(Y.Plugin.ScrollViewScrollbars);

        _yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 72);
if (!Y.Bottle.Device.getTouchSupport()) {
            _yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 73);
this.plug(Y.zui.ScrollHelper);
        }

        _yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 76);
images.addClass(CLASSES.IMAGE);

        _yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 78);
images.each(function (O) {
            _yuitest_coverfunc("/build/gallery-bt-viewer/gallery-bt-viewer.js", "(anonymous 2)", 78);
_yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 79);
if (O.get('naturalWidth')) {
                _yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 80);
initImage(O);
            } else {
                _yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 82);
O.once('load', function (E) {
                    _yuitest_coverfunc("/build/gallery-bt-viewer/gallery-bt-viewer.js", "(anonymous 3)", 82);
_yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 83);
initImage(E.target);
                    _yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 84);
that._uiDimensionsChange();
                });
            }
        });

        /**
         * internal eventhandlers, keep for destructor
         *
         * @property _bviEventHandlers
         * @type EventHandle
         * @private
         */
        _yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 96);
this._bviEventHandlers = new Y.EventHandle([
            cnt.delegate('click', handleClickBtn, '.' + CLASSES.BOTTON, this)
        ]);

        _yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 100);
Y.once('btNative', this._nativeScroll, this);
    },

    /**
     * toggle internal scrollview to support nativeScroll mode
     *
     * @method _nativeScroll
     * @protected
     */
    _nativeScroll: function () {
        _yuitest_coverfunc("/build/gallery-bt-viewer/gallery-bt-viewer.js", "_nativeScroll", 109);
_yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 110);
this._prevent = {move: false, start: false, end: false};
    }
}, {
    /**
     * Static property used to define the default attribute configuration.
     *
     * @property ATTRS
     * @type Object
     * @static
     * @protected
     */
    ATTRS: {
        /**
         * Default image node css selector. After the Widget initialized, the attribute will become the NodeList object.
         *
         * @attribute imageNode
         * @type {{String|NodeList}}
         * @default 'img'
         */
        imageNode: {
            writeOnce: true,
            lazyAdd: false,
            setter: function (V) {
                _yuitest_coverfunc("/build/gallery-bt-viewer/gallery-bt-viewer.js", "setter", 132);
_yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 133);
this._imageCSS = V;
                _yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 134);
return this.get('contentBox').all(V);
            }
        }
    },

    /**
     * Static property used to define the default HTML parsing rules
     *
     * @property HTML_PARSER
     * @static
     * @protected
     * @type Object
     */
    HTML_PARSER: {
        imageNode: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-viewer/gallery-bt-viewer.js", "imageNode", 148);
_yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 149);
return srcNode.getData('image-node') || 'img';
        }
    }
});

_yuitest_coverline("/build/gallery-bt-viewer/gallery-bt-viewer.js", 154);
Y.namespace('Bottle').Viewer = Viewer;


}, '@VERSION@' ,{requires:['gallery-bt-syncscroll', 'gallery-zui-rascroll', 'gallery-zui-attribute', 'gallery-zui-scrollhelper']});
