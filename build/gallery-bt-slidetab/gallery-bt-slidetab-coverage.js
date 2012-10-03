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
_yuitest_coverage["/build/gallery-bt-slidetab/gallery-bt-slidetab.js"].code=["YUI.add('gallery-bt-slidetab', function(Y) {","","/**"," * Provide SlideTab class which can help you to pick a tab to view with a slider."," *"," * @module gallery-bt-slidetab"," * @static"," */","","var WIDTH_CHANGE = 'widthChange',","    LABELWIDTH_CHANGE = 'labelWidthChange',","","    PREFIX = 'bst_',","","    CLASSES = {","        SLIDE: PREFIX + 'slide',","        INDEX: PREFIX + 'index',","        TAB: PREFIX + 'tab'","    },","","/**"," * SlideTab Widget is a Widget provides a slide selector which can help you to pick a tab to view."," *"," * @class SlideTab"," * @constructor"," * @namespace Bottle"," * @extends Widget"," * @uses WidgetStdMod"," * @uses Bottle.SyncScroll"," * @param [config] {Object} Object literal with initial attribute values",""," */","SlideTab = Y.Base.create('btslidetab', Y.Widget, [Y.WidgetStdMod, Y.Bottle.SyncScroll], {","    initializer: function () {","        this.set('syncScrollMethod', this._updateSlide);","","        /**","         * internal eventhandlers, keep for destructor","         *","         * @property _bstEventHandlers","         * @type EventHandle","         * @private","         */","        this._bstEventHandlers = new Y.EventHandle([","            this.after(LABELWIDTH_CHANGE, this._updateSlide),","            Y.once('btNative', this._nativeScroll, this)","        ]);","    },","","    destructor: function () {","        this._bstEventHandlers.detach();","        delete this._bstEventHandlers;","    },","","    renderUI: function () {","        var slideNode = this.get('slideNode'),","            slideParent = Y.Node.create('<div class=\"bst_slidebox\"></div>'),","            scrollView = new Y.ScrollView({","                srcNode: slideNode.replace(slideParent)","            }).plug(Y.zui.RAScroll);","","        scrollView.unplug(Y.Plugin.ScrollViewScrollbars);","        scrollView.render(slideParent);","        scrollView.get('boundingBox').setStyles({","            margin: '0 auto',","            width: this._percentWidth() + 'px'","        }).addClass(CLASSES.INDEX);","        scrollView.plug(Y.zui.ScrollSnapper);","        scrollView.pages.on('indexChange', function (E) {","            if (E.newVal > -1) {","                this.set('selectedIndex', E.newVal);","            }","        }, this);","        this.set('scrollView', scrollView);","        this._updateSlide();","    },","","    /**","     * toggle internal scrollview to support nativeScroll mode","     *","     * @method _nativeScroll","     * @protected","     */","    _nativeScroll: function () {","        this.get('scrollView')._prevent = {move: false, start: false, end: false};","    },","","    /**","     * return computed width by percentage of self.","     *","     * @method _percentWidth","     * @param [percentage] {Number} from 0 to 100. If omitted, default is 100","     * @protected","     */","    _percentWidth: function (P) {","        var V = P || this.get('labelWidth');","","        return Math.floor(V * this.get('boundingBox').get('offsetWidth') / 100);","    },","","    /**","     * display neighbors of current label or hide them.","     *","     * @method _showNeighbors","     * @param vis {Boolean} show neighbor or not","     * @protected","     */","    _showNeighbors: function (T) {","        var scroll = this.get('scrollView');","","        if (scroll) {","            scroll.get('boundingBox').setStyles({","                overflow: T ? 'visible' : 'hidden'","            });","        }","    },","","    /**","     * update width of slide control","     *","     * @method _updateSlide","     * @protected","     */","    _updateSlide: function () {","        var scroll = this.get('scrollView'),","            show = this.get('showNeighbors'),","            ttl = scroll.pages.get('total'),","            W = this._percentWidth();","","        this.get('labelNode').set('offsetWidth', W);","","        if (scroll) {","            if (show) {","                this._showNeighbors(false);","            }","            scroll.set('width', W);","            if (ttl) {","                scroll.pages.scrollTo(scroll.pages.get('index'), -1);","            }","            if (show) {","                this._showNeighbors(true);","            }","        }","    }","}, {","    /**","     * Static property used to define the default attribute configuration.","     *","     * @property ATTRS","     * @type Object","     * @static","     * @protected","     */","    ATTRS: {","        /**","         * selectd tab index, start from 0.","         *","         * @attribute selectedIndex","         * @type Number","         * @default 0","         */","        selectedIndex: {","            value: 0,","            lazyAdd: false,","            setter: function (V) {","                var ch = this.get('tabNode').get('children'),","                    oldV = this.get('selectedIndex'),","                    old = ch.item(oldV),","                    O = ch.item(V);","","                if (O && (old !== O)) {","                    O.addClass('on');","                    if (old) {","                        old.removeClass('on');","                    }","                    this.syncScroll();","                    return V * 1;","                }","                return oldV;","            }","        },","","        /**","         * Internal scrollview for slide","         *","         * @attribute scrollView","         * @type {Widget}","         */","        scrollView: {","            writeOnce: true","        },","","        /**","         * Default slider node css selector. After rendered, this attribute will be the Node object.","         *","         * @attribute slideNode","         * @type {String | Node}","         * @default '> ul'","         */","        slideNode: {","            lazyAdd: false,","            writeOnce: true,","            setter: function (V) {","                return this.get('contentBox').one(V).addClass(CLASSES.SLIDE);","            }","        },","","        /**","         * Default slider label nodes css selector. After rendered, this attribute will be the NodeList object.","         *","         * @attribute labelNode","         * @type {String | NodeList}","         * @default '> li'","         */","        labelNode: {","            lazyAdd: false,","            writeOnce: true,","            setter: function (V) {","                return this.get('slideNode').all(V);","            }","        },","","        /**","         * Set label nodes width by percentage of slideTab automatically. Set to 0 means to keep original width.","         *","         * @attribute labelWidth","         * @type {Number}","         * @default 30","         */","        labelWidth: {","            lazyAdd: false,","            validator: function (V) {","                return (V > 0) && (V <= 100);","            },","            setter: function (V) {","                return V * 1;","            }","        },","","","        /**","         * Show label neighbors or not","         *","         * @attribute showNeighbors","         * @type {Boolean}","         * @default true","         */","        showNeighbors: {","            lazyAdd: false,","            validator: Y.Lang.isBoolean,","            setter: function (V) {","                this._showNeighbors(V);","                return V;","            }","        },","","        /**","         * Default tab container node css selector. After rendered, this attribute will be the Node object.","         *","         * @attribute tabNode","         * @type {String | Node}","         * @default '> ul'","         */","        tabNode: {","            lazyAdd: false,","            writeOnce: true,","            setter: function (V) {","                return this.get('contentBox').one(V).addClass(CLASSES.TAB);","            }","        }","    },","","    /**","     * Static property used to define the default HTML parsing rules","     *","     * @property HTML_PARSER","     * @static","     * @protected","     * @type Object","     */","    HTML_PARSER: {","        slideNode: function (srcNode) {","            return srcNode.getData('slide-node') || '> ul';","        },","        labelNode: function (srcNode) {","            return srcNode.getData('label-node') || '> li';","        },","        labelWidth: function (srcNode) {","            return srcNode.getData('label-width') || 30;","        },","        showNeighbors: function (srcNode) {","            return (srcNode.getData('show-neighbors') !== 'false');","        },","        tabNode: function (srcNode) {","            return srcNode.getData('tab-node') || '> div';","        },","        selectedIndex: function (srcNode) {","            return srcNode.getData('selected-index') || 0;","        }","    }","});","","Y.namespace('Bottle').SlideTab = SlideTab;","","","}, '@VERSION@' ,{requires:['gallery-bt-syncscroll', 'widget-stdmod', 'gallery-zui-rascroll', 'gallery-zui-scrollsnapper']});"];
_yuitest_coverage["/build/gallery-bt-slidetab/gallery-bt-slidetab.js"].lines = {"1":0,"10":0,"35":0,"44":0,"51":0,"52":0,"56":0,"62":0,"63":0,"64":0,"68":0,"69":0,"70":0,"71":0,"74":0,"75":0,"85":0,"96":0,"98":0,"109":0,"111":0,"112":0,"125":0,"130":0,"132":0,"133":0,"134":0,"136":0,"137":0,"138":0,"140":0,"141":0,"166":0,"171":0,"172":0,"173":0,"174":0,"176":0,"177":0,"179":0,"204":0,"219":0,"233":0,"236":0,"252":0,"253":0,"268":0,"283":0,"286":0,"289":0,"292":0,"295":0,"298":0,"303":0};
_yuitest_coverage["/build/gallery-bt-slidetab/gallery-bt-slidetab.js"].functions = {"initializer:34":0,"destructor:50":0,"(anonymous 2):69":0,"renderUI:55":0,"_nativeScroll:84":0,"_percentWidth:95":0,"_showNeighbors:108":0,"_updateSlide:124":0,"setter:165":0,"setter:203":0,"setter:218":0,"validator:232":0,"setter:235":0,"setter:251":0,"setter:267":0,"slideNode:282":0,"labelNode:285":0,"labelWidth:288":0,"showNeighbors:291":0,"tabNode:294":0,"selectedIndex:297":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bt-slidetab/gallery-bt-slidetab.js"].coveredLines = 54;
_yuitest_coverage["/build/gallery-bt-slidetab/gallery-bt-slidetab.js"].coveredFunctions = 22;
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
            this.after(LABELWIDTH_CHANGE, this._updateSlide),
            Y.once('btNative', this._nativeScroll, this)
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
     * toggle internal scrollview to support nativeScroll mode
     *
     * @method _nativeScroll
     * @protected
     */
    _nativeScroll: function () {
        _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "_nativeScroll", 84);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 85);
this.get('scrollView')._prevent = {move: false, start: false, end: false};
    },

    /**
     * return computed width by percentage of self.
     *
     * @method _percentWidth
     * @param [percentage] {Number} from 0 to 100. If omitted, default is 100
     * @protected
     */
    _percentWidth: function (P) {
        _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "_percentWidth", 95);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 96);
var V = P || this.get('labelWidth');

        _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 98);
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
        _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "_showNeighbors", 108);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 109);
var scroll = this.get('scrollView');

        _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 111);
if (scroll) {
            _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 112);
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
        _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "_updateSlide", 124);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 125);
var scroll = this.get('scrollView'),
            show = this.get('showNeighbors'),
            ttl = scroll.pages.get('total'),
            W = this._percentWidth();

        _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 130);
this.get('labelNode').set('offsetWidth', W);

        _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 132);
if (scroll) {
            _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 133);
if (show) {
                _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 134);
this._showNeighbors(false);
            }
            _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 136);
scroll.set('width', W);
            _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 137);
if (ttl) {
                _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 138);
scroll.pages.scrollTo(scroll.pages.get('index'), -1);
            }
            _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 140);
if (show) {
                _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 141);
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
                _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "setter", 165);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 166);
var ch = this.get('tabNode').get('children'),
                    oldV = this.get('selectedIndex'),
                    old = ch.item(oldV),
                    O = ch.item(V);

                _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 171);
if (O && (old !== O)) {
                    _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 172);
O.addClass('on');
                    _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 173);
if (old) {
                        _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 174);
old.removeClass('on');
                    }
                    _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 176);
this.syncScroll();
                    _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 177);
return V * 1;
                }
                _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 179);
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
                _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "setter", 203);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 204);
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
                _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "setter", 218);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 219);
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
                _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "validator", 232);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 233);
return (V > 0) && (V <= 100);
            },
            setter: function (V) {
                _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "setter", 235);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 236);
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
                _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "setter", 251);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 252);
this._showNeighbors(V);
                _yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 253);
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
                _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "setter", 267);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 268);
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
            _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "slideNode", 282);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 283);
return srcNode.getData('slide-node') || '> ul';
        },
        labelNode: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "labelNode", 285);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 286);
return srcNode.getData('label-node') || '> li';
        },
        labelWidth: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "labelWidth", 288);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 289);
return srcNode.getData('label-width') || 30;
        },
        showNeighbors: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "showNeighbors", 291);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 292);
return (srcNode.getData('show-neighbors') !== 'false');
        },
        tabNode: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "tabNode", 294);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 295);
return srcNode.getData('tab-node') || '> div';
        },
        selectedIndex: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", "selectedIndex", 297);
_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 298);
return srcNode.getData('selected-index') || 0;
        }
    }
});

_yuitest_coverline("/build/gallery-bt-slidetab/gallery-bt-slidetab.js", 303);
Y.namespace('Bottle').SlideTab = SlideTab;


}, '@VERSION@' ,{requires:['gallery-bt-syncscroll', 'widget-stdmod', 'gallery-zui-rascroll', 'gallery-zui-scrollsnapper']});
