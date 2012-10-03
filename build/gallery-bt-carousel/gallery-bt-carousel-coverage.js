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
_yuitest_coverage["/build/gallery-bt-carousel/gallery-bt-carousel.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-bt-carousel/gallery-bt-carousel.js",
    code: []
};
_yuitest_coverage["/build/gallery-bt-carousel/gallery-bt-carousel.js"].code=["YUI.add('gallery-bt-carousel', function(Y) {","","/**"," * Provide Carousel class to rendering a lot of photo in many kinds of layout"," *"," * @module gallery-bt-carousel"," * @static"," */","","var WIDTH_CHANGE = 'widthChange',","","    PREFIX = 'bcr_',","","    CLASSES = {","        INDEXBOX: PREFIX + 'indexbox',","        INDEXITEM: PREFIX + 'indexitem',","        INDEXON: PREFIX + 'on',","        LEFT: PREFIX + 'btnl',","        RIGHT: PREFIX + 'btnr',","        SHOWBUTTON: PREFIX + 'showbtn',","        BUTTONOFF: PREFIX + 'off'","    },","","    HTMLS = {","        INDEXBOX: '<ol class=\"' + CLASSES.INDEXBOX + '\"></ol>',","        INDEXITEM: '<li class=\"' + CLASSES.INDEXITEM + '\"></li>',","        LEFT: '<div class=\"' + CLASSES.LEFT + '\"></li>',","        RIGHT: '<div class=\"' + CLASSES.RIGHT + '\"></li>'","    },","","/**"," * Carousel is a Widget which can help you to render a lot of photo in different patterns."," *"," * @class Carousel"," * @constructor"," * @namespace Bottle"," * @extends ScrollView"," * @uses Bottle.SyncScroll"," * @uses Y.zui.Attribute"," * @param [config] {Object} Object literal with initial attribute values"," */","Carousel = Y.Base.create('btcarousel', Y.ScrollView, [Y.Bottle.SyncScroll, Y.zui.Attribute], {","    initializer: function () {","        this.set('syncScrollMethod', this._updatePages);","        this.plug(Y.zui.RAScroll);","    },","","    destructor: function () {","        this.unsync('selectedIndex', this.pages, 'index');","        this.unplug(Y.zui.RAScroll);","        this._bcrEventHandlers.detach();","        delete this._bcrEventHandlers;","    },","","    renderUI: function () {","        var parent = this.get('indexNode') || this.get('boundingBox'),","            box = parent.appendChild(HTMLS.INDEXBOX),","            all = this.pages.get('total'),","            index = this.get('contentBox').getData('selected-index') || 0,","            I;","","        this._indexes = [];","        for (I=0;I<all;I++) {","            this._indexes.push(box.appendChild(HTMLS.INDEXITEM));","        }","","        this.unplug(Y.Plugin.ScrollViewScrollbars);","","        if (!Y.Bottle.Device.getTouchSupport()) {","            this.plug(Y.zui.ScrollHelper);","        }","","        this._updatePages();","        this.sync('selectedIndex', this.pages, 'index');","","        /**","         * left button Node","         *","         * @property leftButton","         * @type Node","         */","        this.leftButton = parent.appendChild(HTMLS.LEFT).setHTML(this.get('textLeft'));","","        /**","         * right button Node","         *","         * @property rightButton","         * @type Node","         */","        this.rightButton = parent.appendChild(HTMLS.RIGHT).setHTML(this.get('textRight'));","","        /**","         * internal eventhandlers, keep for destructor","         *","         * @property _bcrEventHandlers","         * @type EventHandle","         * @private","         */","        this._bcrEventHandlers = new Y.EventHandle([","            this.leftButton.on('click', this.pages.prev, this.pages),","            this.rightButton.on('click', this.pages.next, this.pages)","        ]);","","        Y.once('btNative', this._nativeScroll, this);","","        this.set('selectedIndex', index);","        this._updateButtons(index);","    },","","    /**","     * toggle internal scrollview to support nativeScroll mode","     *","     * @method _nativeScroll","     * @protected","     */","    _nativeScroll: function () {","        this._prevent = {move: false, start: false, end: false};","    },","","    /**","     * udpate left/right buttons status","     *","     * @method _updateButtons","     * @protected","     */","    _updateButtons: function (V) {","        if (this.leftButton) {","            this.leftButton.toggleClass(CLASSES.BUTTONOFF, (V === 0));","            this.rightButton.toggleClass(CLASSES.BUTTONOFF, (V === this.pages.get('total') - 1));","        }","    },"," ","    /**","     * udpate page nodes width","     *","     * @method _updatePages","     * @protected","     */","    _updatePages: function () {","        this.get('pageNode').set('offsetWidth', Math.floor(this.get('boundingBox').get('offsetWidth') / this.get('pageItems')));","        this._uiDimensionsChange();","    }","}, {","    /**","     * Static property used to define the default attribute configuration.","     *","     * @property ATTRS","     * @type Object","     * @static","     * @protected","     */","    ATTRS: {","        /**","         * Default pages node css selector. After the Widget initialized, the attribute will become the NodeList object.","         *","         * @attribute pageNode","         * @type {{String|NodeList}}","         * @default '> li'","         */","        pageNode: {","            value: '> li',","            writeOnce: true,","            lazyAdd: false,","            setter: function (V) {","                this._pageCSS = V;","                return this.get('contentBox').all(V);","            }","        },","","        /**","         * Specify how many items in a page.","         *","         * @attribute pageItems","         * @type {{Number}}","         * @default 1","         */","        pageItems: {","            value: 1,","            lazyAdd: false,","            writeOnce: true,","            validator: Y.Lang.isNumber,","            setter: function (V) {","                var v = Math.max(1, Math.floor(V));","","                this.plug(Y.zui.ScrollSnapper, {selector: this._pageCSS + ((v > 1) ? (':nth-child(' + v + 'n+1)') : '')});","                return v;","            }","        },","","        /**","         * Specify page indicator parent Node. If the Node can not be found or omitted, the indicator will be appended into the boundingBox.","         *","         * @attribute indexNode","         * @type {{String|Node}}","         */","        indexNode: {","            writeOnce: true,","            setter: Y.one","        },","","        /**","         * Specify wording for left button","         *","         * @attribute textRight","         * @type {{String}}","         */","        textRight: {","            value: '',","            writeOnce: true","        },","","        /**","         * Specify wording for left button","         *","         * @attribute textLeft","         * @type {{String}}","         */","        textLeft: {","            value: '',","            writeOnce: true","        },","","        /**","         * Display left button and right botton when set to true.","         *","         * @attribute showButtons","         * @type Boolean","         * @default true","         */","        showButtons: {","            value: true,","            lazyAdd: false,","            validator: Y.Lang.isBoolean,","            setter: function (V) {","                this.get('boundingBox').toggleClass(CLASSES.SHOWBUTTON, V);","                return V;","            }","        },","","        /**","         * selectd page index, start from 0.","         *","         * @attribute selectedIndex","         * @type Number","         * @default 0","         */","        selectedIndex: {","            setter: function (V) {","                var pages = this._indexes,","                    oldV = this.get('selectedIndex'),","                    old = pages ? pages[oldV] : undefined,","                    O = pages ? pages[V] : undefined;","","                if (O && (old !== O)) {","                    if (old) {","                        old.removeClass(CLASSES.INDEXON);","                    }","                    O.addClass(CLASSES.INDEXON);","","                    this._updateButtons(V);","","                    return V * 1;","                }","","                return oldV;","            }","        }","    },","","    /**","     * Static property used to define the default HTML parsing rules","     *","     * @property HTML_PARSER","     * @static","     * @protected","     * @type Object","     */","    HTML_PARSER: {","        pageItems: function (srcNode) {","            var pi = srcNode.getData('page-items');","            return pi ? pi * 1 : 1;","        },","        pageNode: function (srcNode) {","            try {","                this.setAttrs(Y.JSON.parse(srcNode.getData('cfg-scroll')));","            } catch (e) {","            }","            return srcNode.getData('page-node');","        },","        textLeft: function (srcNode) {","            return srcNode.getData('text-left') || '';","        },","        textRight: function (srcNode) {","            return srcNode.getData('text-right') || '';","        },","        indexNode: function (srcNode) {","            return srcNode.getData('index-node');","        },","        showButtons: function (srcNode) {","            return srcNode.getData('show-buttons') !== 'false';","        }","    }","});","","Y.namespace('Bottle').Carousel = Carousel;","","","}, '@VERSION@' ,{requires:['gallery-bt-syncscroll', 'gallery-zui-rascroll', 'gallery-zui-scrollsnapper', 'gallery-zui-attribute', 'gallery-zui-scrollhelper']});"];
_yuitest_coverage["/build/gallery-bt-carousel/gallery-bt-carousel.js"].lines = {"1":0,"10":0,"44":0,"45":0,"49":0,"50":0,"51":0,"52":0,"56":0,"62":0,"63":0,"64":0,"67":0,"69":0,"70":0,"73":0,"74":0,"82":0,"90":0,"99":0,"104":0,"106":0,"107":0,"117":0,"127":0,"128":0,"129":0,"140":0,"141":0,"165":0,"166":0,"183":0,"185":0,"186":0,"235":0,"236":0,"249":0,"254":0,"255":0,"256":0,"258":0,"260":0,"262":0,"265":0,"280":0,"281":0,"284":0,"285":0,"288":0,"291":0,"294":0,"297":0,"300":0,"305":0};
_yuitest_coverage["/build/gallery-bt-carousel/gallery-bt-carousel.js"].functions = {"initializer:43":0,"destructor:48":0,"renderUI:55":0,"_nativeScroll:116":0,"_updateButtons:126":0,"_updatePages:139":0,"setter:164":0,"setter:182":0,"setter:234":0,"setter:248":0,"pageItems:279":0,"pageNode:283":0,"textLeft:290":0,"textRight:293":0,"indexNode:296":0,"showButtons:299":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bt-carousel/gallery-bt-carousel.js"].coveredLines = 54;
_yuitest_coverage["/build/gallery-bt-carousel/gallery-bt-carousel.js"].coveredFunctions = 17;
_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 1);
YUI.add('gallery-bt-carousel', function(Y) {

/**
 * Provide Carousel class to rendering a lot of photo in many kinds of layout
 *
 * @module gallery-bt-carousel
 * @static
 */

_yuitest_coverfunc("/build/gallery-bt-carousel/gallery-bt-carousel.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 10);
var WIDTH_CHANGE = 'widthChange',

    PREFIX = 'bcr_',

    CLASSES = {
        INDEXBOX: PREFIX + 'indexbox',
        INDEXITEM: PREFIX + 'indexitem',
        INDEXON: PREFIX + 'on',
        LEFT: PREFIX + 'btnl',
        RIGHT: PREFIX + 'btnr',
        SHOWBUTTON: PREFIX + 'showbtn',
        BUTTONOFF: PREFIX + 'off'
    },

    HTMLS = {
        INDEXBOX: '<ol class="' + CLASSES.INDEXBOX + '"></ol>',
        INDEXITEM: '<li class="' + CLASSES.INDEXITEM + '"></li>',
        LEFT: '<div class="' + CLASSES.LEFT + '"></li>',
        RIGHT: '<div class="' + CLASSES.RIGHT + '"></li>'
    },

/**
 * Carousel is a Widget which can help you to render a lot of photo in different patterns.
 *
 * @class Carousel
 * @constructor
 * @namespace Bottle
 * @extends ScrollView
 * @uses Bottle.SyncScroll
 * @uses Y.zui.Attribute
 * @param [config] {Object} Object literal with initial attribute values
 */
Carousel = Y.Base.create('btcarousel', Y.ScrollView, [Y.Bottle.SyncScroll, Y.zui.Attribute], {
    initializer: function () {
        _yuitest_coverfunc("/build/gallery-bt-carousel/gallery-bt-carousel.js", "initializer", 43);
_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 44);
this.set('syncScrollMethod', this._updatePages);
        _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 45);
this.plug(Y.zui.RAScroll);
    },

    destructor: function () {
        _yuitest_coverfunc("/build/gallery-bt-carousel/gallery-bt-carousel.js", "destructor", 48);
_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 49);
this.unsync('selectedIndex', this.pages, 'index');
        _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 50);
this.unplug(Y.zui.RAScroll);
        _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 51);
this._bcrEventHandlers.detach();
        _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 52);
delete this._bcrEventHandlers;
    },

    renderUI: function () {
        _yuitest_coverfunc("/build/gallery-bt-carousel/gallery-bt-carousel.js", "renderUI", 55);
_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 56);
var parent = this.get('indexNode') || this.get('boundingBox'),
            box = parent.appendChild(HTMLS.INDEXBOX),
            all = this.pages.get('total'),
            index = this.get('contentBox').getData('selected-index') || 0,
            I;

        _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 62);
this._indexes = [];
        _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 63);
for (I=0;I<all;I++) {
            _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 64);
this._indexes.push(box.appendChild(HTMLS.INDEXITEM));
        }

        _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 67);
this.unplug(Y.Plugin.ScrollViewScrollbars);

        _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 69);
if (!Y.Bottle.Device.getTouchSupport()) {
            _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 70);
this.plug(Y.zui.ScrollHelper);
        }

        _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 73);
this._updatePages();
        _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 74);
this.sync('selectedIndex', this.pages, 'index');

        /**
         * left button Node
         *
         * @property leftButton
         * @type Node
         */
        _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 82);
this.leftButton = parent.appendChild(HTMLS.LEFT).setHTML(this.get('textLeft'));

        /**
         * right button Node
         *
         * @property rightButton
         * @type Node
         */
        _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 90);
this.rightButton = parent.appendChild(HTMLS.RIGHT).setHTML(this.get('textRight'));

        /**
         * internal eventhandlers, keep for destructor
         *
         * @property _bcrEventHandlers
         * @type EventHandle
         * @private
         */
        _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 99);
this._bcrEventHandlers = new Y.EventHandle([
            this.leftButton.on('click', this.pages.prev, this.pages),
            this.rightButton.on('click', this.pages.next, this.pages)
        ]);

        _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 104);
Y.once('btNative', this._nativeScroll, this);

        _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 106);
this.set('selectedIndex', index);
        _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 107);
this._updateButtons(index);
    },

    /**
     * toggle internal scrollview to support nativeScroll mode
     *
     * @method _nativeScroll
     * @protected
     */
    _nativeScroll: function () {
        _yuitest_coverfunc("/build/gallery-bt-carousel/gallery-bt-carousel.js", "_nativeScroll", 116);
_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 117);
this._prevent = {move: false, start: false, end: false};
    },

    /**
     * udpate left/right buttons status
     *
     * @method _updateButtons
     * @protected
     */
    _updateButtons: function (V) {
        _yuitest_coverfunc("/build/gallery-bt-carousel/gallery-bt-carousel.js", "_updateButtons", 126);
_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 127);
if (this.leftButton) {
            _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 128);
this.leftButton.toggleClass(CLASSES.BUTTONOFF, (V === 0));
            _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 129);
this.rightButton.toggleClass(CLASSES.BUTTONOFF, (V === this.pages.get('total') - 1));
        }
    },
 
    /**
     * udpate page nodes width
     *
     * @method _updatePages
     * @protected
     */
    _updatePages: function () {
        _yuitest_coverfunc("/build/gallery-bt-carousel/gallery-bt-carousel.js", "_updatePages", 139);
_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 140);
this.get('pageNode').set('offsetWidth', Math.floor(this.get('boundingBox').get('offsetWidth') / this.get('pageItems')));
        _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 141);
this._uiDimensionsChange();
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
         * Default pages node css selector. After the Widget initialized, the attribute will become the NodeList object.
         *
         * @attribute pageNode
         * @type {{String|NodeList}}
         * @default '> li'
         */
        pageNode: {
            value: '> li',
            writeOnce: true,
            lazyAdd: false,
            setter: function (V) {
                _yuitest_coverfunc("/build/gallery-bt-carousel/gallery-bt-carousel.js", "setter", 164);
_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 165);
this._pageCSS = V;
                _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 166);
return this.get('contentBox').all(V);
            }
        },

        /**
         * Specify how many items in a page.
         *
         * @attribute pageItems
         * @type {{Number}}
         * @default 1
         */
        pageItems: {
            value: 1,
            lazyAdd: false,
            writeOnce: true,
            validator: Y.Lang.isNumber,
            setter: function (V) {
                _yuitest_coverfunc("/build/gallery-bt-carousel/gallery-bt-carousel.js", "setter", 182);
_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 183);
var v = Math.max(1, Math.floor(V));

                _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 185);
this.plug(Y.zui.ScrollSnapper, {selector: this._pageCSS + ((v > 1) ? (':nth-child(' + v + 'n+1)') : '')});
                _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 186);
return v;
            }
        },

        /**
         * Specify page indicator parent Node. If the Node can not be found or omitted, the indicator will be appended into the boundingBox.
         *
         * @attribute indexNode
         * @type {{String|Node}}
         */
        indexNode: {
            writeOnce: true,
            setter: Y.one
        },

        /**
         * Specify wording for left button
         *
         * @attribute textRight
         * @type {{String}}
         */
        textRight: {
            value: '',
            writeOnce: true
        },

        /**
         * Specify wording for left button
         *
         * @attribute textLeft
         * @type {{String}}
         */
        textLeft: {
            value: '',
            writeOnce: true
        },

        /**
         * Display left button and right botton when set to true.
         *
         * @attribute showButtons
         * @type Boolean
         * @default true
         */
        showButtons: {
            value: true,
            lazyAdd: false,
            validator: Y.Lang.isBoolean,
            setter: function (V) {
                _yuitest_coverfunc("/build/gallery-bt-carousel/gallery-bt-carousel.js", "setter", 234);
_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 235);
this.get('boundingBox').toggleClass(CLASSES.SHOWBUTTON, V);
                _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 236);
return V;
            }
        },

        /**
         * selectd page index, start from 0.
         *
         * @attribute selectedIndex
         * @type Number
         * @default 0
         */
        selectedIndex: {
            setter: function (V) {
                _yuitest_coverfunc("/build/gallery-bt-carousel/gallery-bt-carousel.js", "setter", 248);
_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 249);
var pages = this._indexes,
                    oldV = this.get('selectedIndex'),
                    old = pages ? pages[oldV] : undefined,
                    O = pages ? pages[V] : undefined;

                _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 254);
if (O && (old !== O)) {
                    _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 255);
if (old) {
                        _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 256);
old.removeClass(CLASSES.INDEXON);
                    }
                    _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 258);
O.addClass(CLASSES.INDEXON);

                    _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 260);
this._updateButtons(V);

                    _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 262);
return V * 1;
                }

                _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 265);
return oldV;
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
        pageItems: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-carousel/gallery-bt-carousel.js", "pageItems", 279);
_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 280);
var pi = srcNode.getData('page-items');
            _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 281);
return pi ? pi * 1 : 1;
        },
        pageNode: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-carousel/gallery-bt-carousel.js", "pageNode", 283);
_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 284);
try {
                _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 285);
this.setAttrs(Y.JSON.parse(srcNode.getData('cfg-scroll')));
            } catch (e) {
            }
            _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 288);
return srcNode.getData('page-node');
        },
        textLeft: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-carousel/gallery-bt-carousel.js", "textLeft", 290);
_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 291);
return srcNode.getData('text-left') || '';
        },
        textRight: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-carousel/gallery-bt-carousel.js", "textRight", 293);
_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 294);
return srcNode.getData('text-right') || '';
        },
        indexNode: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-carousel/gallery-bt-carousel.js", "indexNode", 296);
_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 297);
return srcNode.getData('index-node');
        },
        showButtons: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-carousel/gallery-bt-carousel.js", "showButtons", 299);
_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 300);
return srcNode.getData('show-buttons') !== 'false';
        }
    }
});

_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 305);
Y.namespace('Bottle').Carousel = Carousel;


}, '@VERSION@' ,{requires:['gallery-bt-syncscroll', 'gallery-zui-rascroll', 'gallery-zui-scrollsnapper', 'gallery-zui-attribute', 'gallery-zui-scrollhelper']});
