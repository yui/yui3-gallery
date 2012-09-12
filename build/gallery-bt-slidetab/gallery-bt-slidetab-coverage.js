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
_yuitest_coverage["/build/gallery-bt-slidetab/gallery-bt-slidetab.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-bt-slidetab/gallery-bt-slidetab.js",
    code: []
};
_yuitest_coverage["/build/gallery-bt-slidetab/gallery-bt-slidetab.js"].code=["YUI.add('gallery-bt-slidetab', function(Y) {","","/**"," * Provide SlideTab class which can help you to pick a tab to view with a slider."," *"," * @module gallery-bt-slidetab"," * @static"," */","","var WIDTH_CHANGE = 'widthChange',","    LABELWIDTH_CHANGE = 'labelWidthChange',","","    PREFIX = 'bst_',","","    CLASSES = {","        SLIDE: PREFIX + 'slide',","        INDEX: PREFIX + 'index',","        TAB: PREFIX + 'tab'","    },","","/**"," * SlideTab Widget is a Widget provides a slide selector which can help you to pick a tab to view."," *"," * @class SlideTab"," * @constructor"," * @namespace Bottle"," * @extends Widget"," * @uses WidgetStdMod"," * @uses Bottle.SyncScroll"," * @param [config] {Object} Object literal with initial attribute values",""," */","SlideTab = Y.Base.create('btslidetab', Y.Widget, [Y.WidgetStdMod, Y.Bottle.SyncScroll], {","    initializer: function () {","        this.set('syncScrollMethod', this._updateSlide);","","        /**","         * internal eventhandlers, keep for destructor","         *","         * @property _bstEventHandlers","         * @type EventHandle","         * @private","         */","        this._bstEventHandlers = new Y.EventHandle([","            this.after(WIDTH_CHANGE, this._updateSlide),","            this.after(LABELWIDTH_CHANGE, this._updateSlide)","        ]);","    },","","    destructor: function () {","        this._bstEventHandlers.detach();","        delete this._bstEventHandlers;","    },","","    renderUI: function () {","        var slideNode = this.get('slideNode'),","            slideParent = Y.Node.create('<div class=\"bst_slidebox\"></div>'),","            scrollView = new Y.ScrollView({","                srcNode: slideNode.replace(slideParent)","            }).plug(Y.zui.RAScroll);","","        scrollView.unplug(Y.Plugin.ScrollViewScrollbars);","        scrollView.render(slideParent);","        scrollView.get('boundingBox').setStyles({","            margin: '0 auto',","            width: this._percentWidth() + 'px'","        }).addClass(CLASSES.INDEX);","        scrollView.plug(Y.zui.ScrollSnapper);","        scrollView.pages.on('indexChange', function (E) {","            if (E.newVal > -1) {","                this.set('selectedIndex', E.newVal);","            }","        }, this);","        this.set('scrollView', scrollView);","        this._updateSlide();","    },","","    /**","     * return computed width by percentage of self.","     *","     * @method _percentWidth","     * @param [percentage] {Number} from 0 to 100. If omitted, default is 100","     * @protected","     */","    _percentWidth: function (P) {","        var V = P || this.get('labelWidth');","","        return Math.floor(V * this.get('boundingBox').get('offsetWidth') / 100);","    },","","    /**","     * display neighbors of current label or hide them.","     *","     * @method _showNeighbors","     * @param vis {Boolean} show neighbor or not","     * @protected","     */","    _showNeighbors: function (T) {","        var scroll = this.get('scrollView');","","        if (scroll) {","            scroll.get('boundingBox').setStyles({","                overflow: T ? 'visible' : 'hidden'","            });","        }","    },","","    /**","     * update width of slide control","     *","     * @method _updateSlide","     * @protected","     */","    _updateSlide: function () {","        var scroll = this.get('scrollView'),","            show = this.get('showNeighbors'),","            ttl = scroll.pages.get('total'),","            W = this._percentWidth();","","        this.get('labelNode').set('offsetWidth', W);","","        if (scroll) {","            if (show) {","                this._showNeighbors(false);","            }","            scroll.set('width', W);","            if (ttl) {","                scroll.pages.scrollTo(scroll.pages.get('index'), -1);","            }","            if (show) {","                this._showNeighbors(true);","            }","        }","    }","}, {","    /**","     * Static property used to define the default attribute configuration.","     *","     * @property ATTRS","     * @type Object","     * @static","     * @protected","     */","    ATTRS: {","        /**","         * selectd tab index, start from 0.","         *","         * @attribute selectedIndex","         * @type Number","         * @default 0","         */","        selectedIndex: {","            value: 0,","            lazyAdd: false,","            setter: function (V) {","                var ch = this.get('tabNode').get('children'),","                    oldV = this.get('selectedIndex'),","                    old = ch.item(oldV),","                    O = ch.item(V);","","                if (O && (old !== O)) {","                    O.addClass('on');","                    if (old) {","                        old.removeClass('on');","                    }","                    this.syncScroll();","                    return V * 1;","                }","                return oldV;","            }","        },","","        /**","         * Internal scrollview for slide","         *","         * @attribute scrollView","         * @type {Widget}","         */","        scrollView: {","            writeOnce: true","        },","","        /**","         * Default slider node css selector. After rendered, this attribute will be the Node object.","         *","         * @attribute slideNode","         * @type {String | Node}","         * @default '> ul'","         */","        slideNode: {","            lazyAdd: false,","            writeOnce: true,","            setter: function (V) {","                return this.get('contentBox').one(V).addClass(CLASSES.SLIDE);","            }","        },","","        /**","         * Default slider label nodes css selector. After rendered, this attribute will be the NodeList object.","         *","         * @attribute labelNode","         * @type {String | NodeList}","         * @default '> li'","         */","        labelNode: {","            lazyAdd: false,","            writeOnce: true,","            setter: function (V) {","                return this.get('slideNode').all(V);","            }","        },","","        /**","         * Set label nodes width by percentage of slideTab automatically. Set to 0 means to keep original width.","         *","         * @attribute labelWidth","         * @type {Number}","         * @default 30","         */","        labelWidth: {","            lazyAdd: false,","            validator: function (V) {","                return (V > 0) && (V <= 100);","            },","            setter: function (V) {","                return V * 1;","            }","        },","","","        /**","         * Show label neighbors or not","         *","         * @attribute showNeighbors","         * @type {Boolean}","         * @default true","         */","        showNeighbors: {","            lazyAdd: false,","            validator: Y.Lang.isBoolean,","            setter: function (V) {","                this._showNeighbors(V);","                return V;","            }","        },","","        /**","         * Default tab container node css selector. After rendered, this attribute will be the Node object.","         *","         * @attribute tabNode","         * @type {String | Node}","         * @default '> ul'","         */","        tabNode: {","            lazyAdd: false,","            writeOnce: true,","            setter: function (V) {","                return this.get('contentBox').one(V).addClass(CLASSES.TAB);","            }","        }","    },","","    /**","     * Static property used to define the default HTML parsing rules","     *","     * @property HTML_PARSER","     * @static","     * @protected","     * @type Object","     */","    HTML_PARSER: {","        slideNode: function (srcNode) {","            return srcNode.getData('slide-node') || '> ul';","        },","        labelNode: function (srcNode) {","            return srcNode.getData('label-node') || '> li';","        },","        labelWidth: function (srcNode) {","            return srcNode.getData('label-width') || 30;","        },","        showNeighbors: function (srcNode) {","            return (srcNode.getData('show-neighbors') !== 'false');","        },","        tabNode: function (srcNode) {","            return srcNode.getData('tab-node') || '> div';","        },","        selectedIndex: function (srcNode) {","            return srcNode.getData('selected-index') || 0;","        }","    }","});","","Y.namespace('Bottle').SlideTab = SlideTab;","","","}, '@VERSION@' ,{requires:['gallery-bt-syncscroll', 'scrollview', 'widget-stdmod', 'scrollview-paginator', 'gallery-zui-rascroll', 'gallery-zui-scrollsnapper']});"];
_yuitest_coverage["/build/gallery-bt-slidetab/gallery-bt-slidetab.js"].lines = {"1":0,"10":0,"35":0,"44":0,"51":0,"52":0,"56":0,"62":0,"63":0,"64":0,"68":0,"69":0,"70":0,"71":0,"74":0,"75":0,"86":0,"88":0,"99":0,"101":0,"102":0,"115":0,"120":0,"122":0,"123":0,"124":0,"126":0,"127":0,"128":0,"130":0,"131":0,"156":0,"161":0,"162":0,"163":0,"164":0,"166":0,"167":0,"169":0,"194":0,"209":0,"223":0,"226":0,"242":0,"243":0,"258":0,"273":0,"276":0,"279":0,"282":0,"285":0,"288":0,"293":0};
_yuitest_coverage["/build/gallery-bt-slidetab/gallery-bt-slidetab.js"].functions = {"initializer:34":0,"destructor:50":0,"(anonymous 2):69":0,"renderUI:55":0,"_percentWidth:85":0,"_showNeighbors:98":0,"_updateSlide:114":0,"setter:155":0,"setter:193":0,"setter:208":0,"validator:222":0,"setter:225":0,"setter:241":0,"setter:257":0,"slideNode:272":0,"labelNode:275":0,"labelWidth:278":0,"showNeighbors:281":0,"tabNode:284":0,"selectedIndex:287":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bt-slidetab/gallery-bt-slidetab.js"].coveredLines = 53;
_yuitest_coverage["/build/gallery-bt-slidetab/gallery-bt-slidetab.js"].coveredFunctions = 21;
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 1);
YUI.add('gallery-bt-slidetab', function(Y) {

/**
 * Provide SlideTab class which can help you to pick a tab to view with a slider.
 *
 * @module gallery-bt-slidetab
 * @static
 */

_yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 10);
var WIDTH_CHANGE = 'widthChange',
    LABELWIDTH_CHANGE = 'labelWidthChange',

    PREFIX = 'bst_',

    CLASSES = {
        SLIDE: PREFIX + 'slide',
        INDEX: PREFIX + 'index',
        TAB: PREFIX + 'tab'
    },

/**
 * SlideTab Widget is a Widget provides a slide selector which can help you to pick a tab to view.
 *
 * @class SlideTab
 * @constructor
 * @namespace Bottle
 * @extends Widget
 * @uses WidgetStdMod
 * @uses Bottle.SyncScroll
 * @param [config] {Object} Object literal with initial attribute values

 */
SlideTab = Y.Base.create('btslidetab', Y.Widget, [Y.WidgetStdMod, Y.Bottle.SyncScroll], {
    initializer: function () {
        _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "initializer", 34);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 35);
this.set('syncScrollMethod', this._updateSlide);

        /**
         * internal eventhandlers, keep for destructor
         *
         * @property _bstEventHandlers
         * @type EventHandle
         * @private
         */
        _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 44);
this._bstEventHandlers = new Y.EventHandle([
            this.after(WIDTH_CHANGE, this._updateSlide),
            this.after(LABELWIDTH_CHANGE, this._updateSlide)
        ]);
    },

    destructor: function () {
        _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "destructor", 50);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 51);
this._bstEventHandlers.detach();
        _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 52);
delete this._bstEventHandlers;
    },

    renderUI: function () {
        _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "renderUI", 55);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 56);
var slideNode = this.get('slideNode'),
            slideParent = Y.Node.create('<div class="bst_slidebox"></div>'),
            scrollView = new Y.ScrollView({
                srcNode: slideNode.replace(slideParent)
            }).plug(Y.zui.RAScroll);

        _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 62);
scrollView.unplug(Y.Plugin.ScrollViewScrollbars);
        _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 63);
scrollView.render(slideParent);
        _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 64);
scrollView.get('boundingBox').setStyles({
            margin: '0 auto',
            width: this._percentWidth() + 'px'
        }).addClass(CLASSES.INDEX);
        _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 68);
scrollView.plug(Y.zui.ScrollSnapper);
        _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 69);
scrollView.pages.on('indexChange', function (E) {
            _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "(anonymous 2)", 69);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 70);
if (E.newVal > -1) {
                _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 71);
this.set('selectedIndex', E.newVal);
            }
        }, this);
        _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 74);
this.set('scrollView', scrollView);
        _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 75);
this._updateSlide();
    },

    /**
     * return computed width by percentage of self.
     *
     * @method _percentWidth
     * @param [percentage] {Number} from 0 to 100. If omitted, default is 100
     * @protected
     */
    _percentWidth: function (P) {
        _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "_percentWidth", 85);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 86);
var V = P || this.get('labelWidth');

        _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 88);
return Math.floor(V * this.get('boundingBox').get('offsetWidth') / 100);
    },

    /**
     * display neighbors of current label or hide them.
     *
     * @method _showNeighbors
     * @param vis {Boolean} show neighbor or not
     * @protected
     */
    _showNeighbors: function (T) {
        _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "_showNeighbors", 98);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 99);
var scroll = this.get('scrollView');

        _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 101);
if (scroll) {
            _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 102);
scroll.get('boundingBox').setStyles({
                overflow: T ? 'visible' : 'hidden'
            });
        }
    },

    /**
     * update width of slide control
     *
     * @method _updateSlide
     * @protected
     */
    _updateSlide: function () {
        _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "_updateSlide", 114);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 115);
var scroll = this.get('scrollView'),
            show = this.get('showNeighbors'),
            ttl = scroll.pages.get('total'),
            W = this._percentWidth();

        _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 120);
this.get('labelNode').set('offsetWidth', W);

        _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 122);
if (scroll) {
            _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 123);
if (show) {
                _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 124);
this._showNeighbors(false);
            }
            _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 126);
scroll.set('width', W);
            _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 127);
if (ttl) {
                _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 128);
scroll.pages.scrollTo(scroll.pages.get('index'), -1);
            }
            _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 130);
if (show) {
                _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 131);
this._showNeighbors(true);
            }
        }
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
         * selectd tab index, start from 0.
         *
         * @attribute selectedIndex
         * @type Number
         * @default 0
         */
        selectedIndex: {
            value: 0,
            lazyAdd: false,
            setter: function (V) {
                _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "setter", 155);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 156);
var ch = this.get('tabNode').get('children'),
                    oldV = this.get('selectedIndex'),
                    old = ch.item(oldV),
                    O = ch.item(V);

                _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 161);
if (O && (old !== O)) {
                    _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 162);
O.addClass('on');
                    _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 163);
if (old) {
                        _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 164);
old.removeClass('on');
                    }
                    _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 166);
this.syncScroll();
                    _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 167);
return V * 1;
                }
                _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 169);
return oldV;
            }
        },

        /**
         * Internal scrollview for slide
         *
         * @attribute scrollView
         * @type {Widget}
         */
        scrollView: {
            writeOnce: true
        },

        /**
         * Default slider node css selector. After rendered, this attribute will be the Node object.
         *
         * @attribute slideNode
         * @type {String | Node}
         * @default '> ul'
         */
        slideNode: {
            lazyAdd: false,
            writeOnce: true,
            setter: function (V) {
                _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "setter", 193);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 194);
return this.get('contentBox').one(V).addClass(CLASSES.SLIDE);
            }
        },

        /**
         * Default slider label nodes css selector. After rendered, this attribute will be the NodeList object.
         *
         * @attribute labelNode
         * @type {String | NodeList}
         * @default '> li'
         */
        labelNode: {
            lazyAdd: false,
            writeOnce: true,
            setter: function (V) {
                _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "setter", 208);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 209);
return this.get('slideNode').all(V);
            }
        },

        /**
         * Set label nodes width by percentage of slideTab automatically. Set to 0 means to keep original width.
         *
         * @attribute labelWidth
         * @type {Number}
         * @default 30
         */
        labelWidth: {
            lazyAdd: false,
            validator: function (V) {
                _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "validator", 222);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 223);
return (V > 0) && (V <= 100);
            },
            setter: function (V) {
                _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "setter", 225);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 226);
return V * 1;
            }
        },


        /**
         * Show label neighbors or not
         *
         * @attribute showNeighbors
         * @type {Boolean}
         * @default true
         */
        showNeighbors: {
            lazyAdd: false,
            validator: Y.Lang.isBoolean,
            setter: function (V) {
                _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "setter", 241);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 242);
this._showNeighbors(V);
                _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 243);
return V;
            }
        },

        /**
         * Default tab container node css selector. After rendered, this attribute will be the Node object.
         *
         * @attribute tabNode
         * @type {String | Node}
         * @default '> ul'
         */
        tabNode: {
            lazyAdd: false,
            writeOnce: true,
            setter: function (V) {
                _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "setter", 257);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 258);
return this.get('contentBox').one(V).addClass(CLASSES.TAB);
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
        slideNode: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "slideNode", 272);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 273);
return srcNode.getData('slide-node') || '> ul';
        },
        labelNode: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "labelNode", 275);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 276);
return srcNode.getData('label-node') || '> li';
        },
        labelWidth: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "labelWidth", 278);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 279);
return srcNode.getData('label-width') || 30;
        },
        showNeighbors: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "showNeighbors", 281);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 282);
return (srcNode.getData('show-neighbors') !== 'false');
        },
        tabNode: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "tabNode", 284);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 285);
return srcNode.getData('tab-node') || '> div';
        },
        selectedIndex: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "selectedIndex", 287);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 288);
return srcNode.getData('selected-index') || 0;
        }
    }
});

_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 293);
Y.namespace('Bottle').SlideTab = SlideTab;


}, '@VERSION@' ,{requires:['gallery-bt-syncscroll', 'scrollview', 'widget-stdmod', 'scrollview-paginator', 'gallery-zui-rascroll', 'gallery-zui-scrollsnapper']});
