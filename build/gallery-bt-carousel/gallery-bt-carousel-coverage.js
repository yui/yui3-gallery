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
_yuitest_coverage["/build/gallery-bt-carousel/gallery-bt-carousel.js"].code=["YUI.add('gallery-bt-carousel', function(Y) {","","/**"," * Provide Carousel class to rendering a lot of photo in many kinds of layout"," *"," * @module gallery-bt-carousel"," * @static"," */","","var WIDTH_CHANGE = 'widthChange',","","    PREFIX = 'bcr_',","","    CLASSES = {","        INDEXBOX: PREFIX + 'indexbox',","        INDEXITEM: PREFIX + 'indexitem',","        INDEXON: PREFIX + 'on',","        LEFT: PREFIX + 'btnl',","        RIGHT: PREFIX + 'btnr',","        SHOWBUTTON: PREFIX + 'showbtn',","        BUTTONOFF: PREFIX + 'off'","    },","","    HTMLS = {","        INDEXBOX: '<ol class=\"' + CLASSES.INDEXBOX + '\"></ol>',","        INDEXITEM: '<li class=\"' + CLASSES.INDEXITEM + '\"></li>',","        LEFT: '<div class=\"' + CLASSES.LEFT + '\"></li>',","        RIGHT: '<div class=\"' + CLASSES.RIGHT + '\"></li>'","    },","","/**"," * Carousel is a Widget which can help you to render a lot of photo in different patterns."," *"," * @class Carousel"," * @constructor"," * @namespace Bottle"," * @extends ScrollView"," * @uses Bottle.SyncScroll"," * @uses Y.zui.Attribute"," * @param [config] {Object} Object literal with initial attribute values"," */","Carousel = Y.Base.create('btcarousel', Y.ScrollView, [Y.Bottle.SyncScroll, Y.zui.Attribute], {","    initializer: function () {","        this.set('syncScrollMethod', this._updatePages);","        this.plug(Y.zui.RAScroll);","    },","","    destructor: function () {","        this.unsync('selectedIndex', this.pages, 'index');","        this.unplug(Y.zui.RAScroll);","        this._bpgEventHandlers.detach();","        delete this._bpgEventHandlers;","    },","","    renderUI: function () {","        var parent = this.get('indexNode') || this.get('boundingBox'),","            box = parent.appendChild(HTMLS.INDEXBOX),","            all = this.pages.get('total'),","            index = this.get('contentBox').getData('selected-index') || 0,","            I;","","        this._indexes = [];","        for (I=0;I<all;I++) {","            this._indexes.push(box.appendChild(HTMLS.INDEXITEM));","        }","","        this.unplug(Y.Plugin.ScrollViewScrollbars);","        this._updatePages();","        this.sync('selectedIndex', this.pages, 'index');","","        /**","         * left button Node","         *","         * @property leftButton","         * @type Node","         */","        this.leftButton = parent.appendChild(HTMLS.LEFT).setHTML(this.get('textLeft'));","","        /**","         * right button Node","         *","         * @property rightButton","         * @type Node","         */","        this.rightButton = parent.appendChild(HTMLS.RIGHT).setHTML(this.get('textRight'));","","        /**","         * internal eventhandlers, keep for destructor","         *","         * @property _bpgEventHandlers","         * @type EventHandle","         * @private","         */","        this._bpgEventHandlers = new Y.EventHandle([","            this.after(WIDTH_CHANGE, this._updatePages),","            this.leftButton.on('click', this.pages.prev, this.pages),","            this.rightButton.on('click', this.pages.next, this.pages)","        ]);","","        this.set('selectedIndex', index);","        this._updateButtons(index);","    },","","    /**","     * udpate left/right buttons status","     *","     * @method _updateButtons","     * @protected","     */","    _updateButtons: function (V) {","        if (this.leftButton) {","            this.leftButton.toggleClass(CLASSES.BUTTONOFF, (V === 0));","            this.rightButton.toggleClass(CLASSES.BUTTONOFF, (V === this.pages.get('total') - 1));","        }","    },"," ","    /**","     * udpate page nodes width","     *","     * @method _updatePages","     * @protected","     */","    _updatePages: function () {","        this.get('pageNode').set('offsetWidth', Math.floor(this.get('boundingBox').get('offsetWidth') / this.get('pageItems')));","        this._uiDimensionsChange();","    }","}, {","    /**","     * Static property used to define the default attribute configuration.","     *","     * @property ATTRS","     * @type Object","     * @static","     * @protected","     */","    ATTRS: {","        /**","         * Default pages node css selector. After the Widget initialized, the attribute will become the NodeList object.","         *","         * @attribute pageNode","         * @type {{String|NodeList}}","         * @default '> li'","         */","        pageNode: {","            value: '> li',","            writeOnce: true,","            lazyAdd: false,","            setter: function (V) {","                this._pageCSS = V;","                return this.get('contentBox').all(V);","            }","        },","","        /**","         * Specify how many items in a page.","         *","         * @attribute pageItems","         * @type {{Number}}","         * @default 1","         */","        pageItems: {","            value: 1,","            lazyAdd: false,","            writeOnce: true,","            validator: Y.Lang.isNumber,","            setter: function (V) {","                var v = Math.max(1, Math.floor(V));","","                this.plug(Y.zui.ScrollSnapper, {selector: this._pageCSS + ((v > 1) ? (':nth-child(' + v + 'n+1)') : '')});","                return v;","            }","        },","","        /**","         * Specify page indicator parent Node. If the Node can not be found or omitted, the indicator will be appended into the boundingBox.","         *","         * @attribute indexNode","         * @type {{String|Node}}","         */","        indexNode: {","            writeOnce: true,","            setter: Y.one","        },","","        /**","         * Specify wording for left button","         *","         * @attribute textRight","         * @type {{String}}","         */","        textRight: {","            value: '',","            writeOnce: true","        },","","        /**","         * Specify wording for left button","         *","         * @attribute textLeft","         * @type {{String}}","         */","        textLeft: {","            value: '',","            writeOnce: true","        },","","        /**","         * Display left button and right botton when set to true.","         *","         * @attribute showButtons","         * @type Boolean","         * @default true","         */","        showButtons: {","            value: true,","            lazyAdd: false,","            validator: Y.Lang.isBoolean,","            setter: function (V) {","                this.get('boundingBox').toggleClass(CLASSES.SHOWBUTTON, V);","                return V;","            }","        },","","        /**","         * selectd page index, start from 0.","         *","         * @attribute selectedIndex","         * @type Number","         * @default 0","         */","        selectedIndex: {","            setter: function (V) {","                var pages = this._indexes,","                    oldV = this.get('selectedIndex'),","                    old = pages ? pages[oldV] : undefined,","                    O = pages ? pages[V] : undefined;","","                if (O && (old !== O)) {","                    if (old) {","                        old.removeClass(CLASSES.INDEXON);","                    }","                    O.addClass(CLASSES.INDEXON);","","                    this._updateButtons(V);","","                    return V * 1;","                }","","                return oldV;","            }","        }","    },","","    /**","     * Static property used to define the default HTML parsing rules","     *","     * @property HTML_PARSER","     * @static","     * @protected","     * @type Object","     */","    HTML_PARSER: {","        pageItems: function (srcNode) {","            var pi = srcNode.getData('page-items');","            return pi ? pi * 1 : 1;","        },","        pageNode: function (srcNode) {","            try {","                this.setAttrs(Y.JSON.parse(srcNode.getData('cfg-scroll')));","            } catch (e) {","            }","            return srcNode.getData('page-node');","        },","        textLeft: function (srcNode) {","            return srcNode.getData('text-left') || '';","        },","        textRight: function (srcNode) {","            return srcNode.getData('text-right') || '';","        },","        indexNode: function (srcNode) {","            return srcNode.getData('index-node');","        },","        showButtons: function (srcNode) {","            return srcNode.getData('show-buttons') !== 'false';","        }","    }","});","","Y.namespace('Bottle').Carousel = Carousel;","","","}, '@VERSION@' ,{requires:['gallery-bt-syncscroll', 'gallery-zui-rascroll', 'gallery-zui-scrollsnapper', 'gallery-zui-attribute']});"];
_yuitest_coverage["/build/gallery-bt-carousel/gallery-bt-carousel.js"].lines = {"1":0,"10":0,"44":0,"45":0,"49":0,"50":0,"51":0,"52":0,"56":0,"62":0,"63":0,"64":0,"67":0,"68":0,"69":0,"77":0,"85":0,"94":0,"100":0,"101":0,"111":0,"112":0,"113":0,"124":0,"125":0,"149":0,"150":0,"167":0,"169":0,"170":0,"219":0,"220":0,"233":0,"238":0,"239":0,"240":0,"242":0,"244":0,"246":0,"249":0,"264":0,"265":0,"268":0,"269":0,"272":0,"275":0,"278":0,"281":0,"284":0,"289":0};
_yuitest_coverage["/build/gallery-bt-carousel/gallery-bt-carousel.js"].functions = {"initializer:43":0,"destructor:48":0,"renderUI:55":0,"_updateButtons:110":0,"_updatePages:123":0,"setter:148":0,"setter:166":0,"setter:218":0,"setter:232":0,"pageItems:263":0,"pageNode:267":0,"textLeft:274":0,"textRight:277":0,"indexNode:280":0,"showButtons:283":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bt-carousel/gallery-bt-carousel.js"].coveredLines = 50;
_yuitest_coverage["/build/gallery-bt-carousel/gallery-bt-carousel.js"].coveredFunctions = 16;
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
this._bpgEventHandlers.detach();
        _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 52);
delete this._bpgEventHandlers;
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
        _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 68);
this._updatePages();
        _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 69);
this.sync('selectedIndex', this.pages, 'index');

        /**
         * left button Node
         *
         * @property leftButton
         * @type Node
         */
        _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 77);
this.leftButton = parent.appendChild(HTMLS.LEFT).setHTML(this.get('textLeft'));

        /**
         * right button Node
         *
         * @property rightButton
         * @type Node
         */
        _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 85);
this.rightButton = parent.appendChild(HTMLS.RIGHT).setHTML(this.get('textRight'));

        /**
         * internal eventhandlers, keep for destructor
         *
         * @property _bpgEventHandlers
         * @type EventHandle
         * @private
         */
        _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 94);
this._bpgEventHandlers = new Y.EventHandle([
            this.after(WIDTH_CHANGE, this._updatePages),
            this.leftButton.on('click', this.pages.prev, this.pages),
            this.rightButton.on('click', this.pages.next, this.pages)
        ]);

        _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 100);
this.set('selectedIndex', index);
        _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 101);
this._updateButtons(index);
    },

    /**
     * udpate left/right buttons status
     *
     * @method _updateButtons
     * @protected
     */
    _updateButtons: function (V) {
        _yuitest_coverfunc("/build/gallery-bt-carousel/gallery-bt-carousel.js", "_updateButtons", 110);
_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 111);
if (this.leftButton) {
            _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 112);
this.leftButton.toggleClass(CLASSES.BUTTONOFF, (V === 0));
            _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 113);
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
        _yuitest_coverfunc("/build/gallery-bt-carousel/gallery-bt-carousel.js", "_updatePages", 123);
_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 124);
this.get('pageNode').set('offsetWidth', Math.floor(this.get('boundingBox').get('offsetWidth') / this.get('pageItems')));
        _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 125);
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
                _yuitest_coverfunc("/build/gallery-bt-carousel/gallery-bt-carousel.js", "setter", 148);
_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 149);
this._pageCSS = V;
                _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 150);
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
                _yuitest_coverfunc("/build/gallery-bt-carousel/gallery-bt-carousel.js", "setter", 166);
_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 167);
var v = Math.max(1, Math.floor(V));

                _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 169);
this.plug(Y.zui.ScrollSnapper, {selector: this._pageCSS + ((v > 1) ? (':nth-child(' + v + 'n+1)') : '')});
                _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 170);
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
                _yuitest_coverfunc("/build/gallery-bt-carousel/gallery-bt-carousel.js", "setter", 218);
_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 219);
this.get('boundingBox').toggleClass(CLASSES.SHOWBUTTON, V);
                _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 220);
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
                _yuitest_coverfunc("/build/gallery-bt-carousel/gallery-bt-carousel.js", "setter", 232);
_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 233);
var pages = this._indexes,
                    oldV = this.get('selectedIndex'),
                    old = pages ? pages[oldV] : undefined,
                    O = pages ? pages[V] : undefined;

                _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 238);
if (O && (old !== O)) {
                    _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 239);
if (old) {
                        _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 240);
old.removeClass(CLASSES.INDEXON);
                    }
                    _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 242);
O.addClass(CLASSES.INDEXON);

                    _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 244);
this._updateButtons(V);

                    _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 246);
return V * 1;
                }

                _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 249);
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
            _yuitest_coverfunc("/build/gallery-bt-carousel/gallery-bt-carousel.js", "pageItems", 263);
_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 264);
var pi = srcNode.getData('page-items');
            _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 265);
return pi ? pi * 1 : 1;
        },
        pageNode: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-carousel/gallery-bt-carousel.js", "pageNode", 267);
_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 268);
try {
                _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 269);
this.setAttrs(Y.JSON.parse(srcNode.getData('cfg-scroll')));
            } catch (e) {
            }
            _yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 272);
return srcNode.getData('page-node');
        },
        textLeft: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-carousel/gallery-bt-carousel.js", "textLeft", 274);
_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 275);
return srcNode.getData('text-left') || '';
        },
        textRight: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-carousel/gallery-bt-carousel.js", "textRight", 277);
_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 278);
return srcNode.getData('text-right') || '';
        },
        indexNode: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-carousel/gallery-bt-carousel.js", "indexNode", 280);
_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 281);
return srcNode.getData('index-node');
        },
        showButtons: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-carousel/gallery-bt-carousel.js", "showButtons", 283);
_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 284);
return srcNode.getData('show-buttons') !== 'false';
        }
    }
});

_yuitest_coverline("/build/gallery-bt-carousel/gallery-bt-carousel.js", 289);
Y.namespace('Bottle').Carousel = Carousel;


}, '@VERSION@' ,{requires:['gallery-bt-syncscroll', 'gallery-zui-rascroll', 'gallery-zui-scrollsnapper', 'gallery-zui-attribute']});
