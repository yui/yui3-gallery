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
_yuitest_coverage["/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js",
    code: []
};
_yuitest_coverage["/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js"].code=["YUI.add('gallery-zui-scrollsnapper', function(Y) {","","/**"," * ZUI ScrollSnapper is a scrollView plugin to replace YUI3 ScrollViewPaginator plugin."," * It provides same interface and namespace, and better user interaction."," *"," * @module gallery-zui-scrollsnapper"," */","","/**"," * ScrollSnapper is a ScrollView plugin to replace YUI3 ScrollViewPaginator."," *"," * @class ScrollSnapper"," * @namespace zui "," * @extends Plugin.Base"," * @constructor"," */","var ScrollSnapper = function () {","        ScrollSnapper.superclass.constructor.apply(this, arguments);","    };","","ScrollSnapper.NAME = 'pluginScrollSnapper';","ScrollSnapper.NS = 'pages';","ScrollSnapper.ATTRS = {","    /**","     * CSS selector for a page inside the scrollview. The scrollview","     * will snap to the closest page.","     *","     * @attribute selector","     * @type {String}","     */","    selector: {","        value: null","    },","","    /**","     * The active page number for a paged scrollview","     *","     * @attribute index","     * @type {Number}","     * @default 0","     */","    index: {","        value: 0,","        lazyAdd: false,","        setter: function (val) {","            var T = this.get('total'),","                I = this.get('index'),","                V = Math.max(Math.floor(val), 0);","","            if (T && (V >= T)) {","                V = T - 1;","            }","","            if (this._pages) {","                this.scrollTo(V, (I == V) ? -1 : 0);","            }","","            return V;","        }","    },","","    /**","     * The total number of pages","     *","     * @attribute total","     * @type {Number}","     * @default 0","     */","    total: {","        value: 0","    }","};","","Y.namespace('zui').ScrollSnapper = Y.extend(ScrollSnapper, Y.Plugin.Base, {","    initializer: function () {","        this._host = this.get('host').setAttrs({","     //       deceleration: 0.6,","     //       bounce: 0","        });","        this._vertical = this._host._scrollsVertical;","        this._snapAttr = this._vertical ? 'offsetTop' : 'offsetLeft';","        this._snapRange = this._vertical ? 'offsetHeight' : 'offsetWidth';","        this._snapSource = this._vertical ? 'scrollY' : 'scrollX';","        this.afterHostMethod('_uiDimensionsChange', this._updatePages);","        this.afterHostEvent('render', this._updatePages);","        this.afterHostEvent('scrollEnd', this._scrollEnded);","        this._updatePages();","    },","","    /**","     * Update page positions","     *","     * @method _updatePages","     * @protected","     */","    _updatePages: function () {","        var cb = this._host.get('contentBox'),","            S = this.get('selector');","","        this._pages = S ? cb.all(S) : cb.get('children');","        this.set('total', this._pages.size());","    },","","    /**","     * internal scrollEnd event handler","     *","     * @method _scrollEnded","     * @protected","     */","    _scrollEnded: function (E) {","        if (this._host._flicking) {","            this._snapping = false;","            return;","        }","        if (!this._snapping) {","            this.snapTo(this.snapIndex());","        } else {","            this._snapping = false;","        }","    },","","    /**","     * Snap to a page, same as set('index', page)","     *","     * @method snapTo","     * @param page {Number} page index, start from 0","     */","    snapTo: function (page) {","        this.set('index', page);","    },","","    /**","     * Scroll to a given page in the scrollview","     *","     * @method scrollTo","     * @param page {Number} page index, start from 0","     * @param duration {Number} The number of ms the animation should last","     * @param easing {String} The timing function to use in the animation","     */","    scrollTo: function (page, duration, easing) {","        var V = Math.max(Math.floor(page), 0),","            T = Math.max(duration, 0),","            O = this._pages.item(V),","            D = O ? O.get(this._snapAttr) : 0;","","        if (T > 0) {","            this._snapping = true;","        }","        if (this._vertical) {","            this._host.scrollTo(0, D, T, easing);","        } else {","            this._host.scrollTo(D, 0, T, easing);","        }","    },","","    /**","     * Scroll to the next page in the scrollview, with animation","     *","     * @method next","     */","    next: function () {","        var index = this.get('index');","        if(index < this.get('total') - 1) {","            this.set('index', index + 1);","        }","    },","","    /**","     * Scroll to the previous page in the scrollview, with animation","     *","     * @method prev","     */","    prev: function () {","        var index = this.get('index');","        if(index > 0) {","            this.set('index', index - 1);","        }","    },","","    /**","     * Get nearest page index","     *","     * @method snapIndex","     */","    snapIndex: function () {","        var A = this._snapAttr,","            R = this._snapRange,","            C = this._host.get(this._snapSource), // + this._range,","            I, O,","            pages = this._pages,","            T = pages.size();","        for (I=0;I<T;I++) {","            O = pages.item(I);","            if (C < O.get(A) + O.get(R) / 2) {","                return I;","            }","        }","        return null;","    }","});","","","}, 'gallery-2012.08.22-20-00' ,{requires:['scrollview-base', 'plugin'], skinnable:false});"];
_yuitest_coverage["/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js"].lines = {"1":0,"18":0,"19":0,"22":0,"23":0,"24":0,"47":0,"51":0,"52":0,"55":0,"56":0,"59":0,"75":0,"77":0,"81":0,"82":0,"83":0,"84":0,"85":0,"86":0,"87":0,"88":0,"98":0,"101":0,"102":0,"112":0,"113":0,"114":0,"116":0,"117":0,"119":0,"130":0,"142":0,"147":0,"148":0,"150":0,"151":0,"153":0,"163":0,"164":0,"165":0,"175":0,"176":0,"177":0,"187":0,"193":0,"194":0,"195":0,"196":0,"199":0};
_yuitest_coverage["/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js"].functions = {"ScrollSnapper:18":0,"setter:46":0,"initializer:76":0,"_updatePages:97":0,"_scrollEnded:111":0,"snapTo:129":0,"scrollTo:141":0,"next:162":0,"prev:174":0,"snapIndex:186":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js"].coveredLines = 50;
_yuitest_coverage["/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js"].coveredFunctions = 11;
_yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 1);
YUI.add('gallery-zui-scrollsnapper', function(Y) {

/**
 * ZUI ScrollSnapper is a scrollView plugin to replace YUI3 ScrollViewPaginator plugin.
 * It provides same interface and namespace, and better user interaction.
 *
 * @module gallery-zui-scrollsnapper
 */

/**
 * ScrollSnapper is a ScrollView plugin to replace YUI3 ScrollViewPaginator.
 *
 * @class ScrollSnapper
 * @namespace zui 
 * @extends Plugin.Base
 * @constructor
 */
_yuitest_coverfunc("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 18);
var ScrollSnapper = function () {
        _yuitest_coverfunc("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", "ScrollSnapper", 18);
_yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 19);
ScrollSnapper.superclass.constructor.apply(this, arguments);
    };

_yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 22);
ScrollSnapper.NAME = 'pluginScrollSnapper';
_yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 23);
ScrollSnapper.NS = 'pages';
_yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 24);
ScrollSnapper.ATTRS = {
    /**
     * CSS selector for a page inside the scrollview. The scrollview
     * will snap to the closest page.
     *
     * @attribute selector
     * @type {String}
     */
    selector: {
        value: null
    },

    /**
     * The active page number for a paged scrollview
     *
     * @attribute index
     * @type {Number}
     * @default 0
     */
    index: {
        value: 0,
        lazyAdd: false,
        setter: function (val) {
            _yuitest_coverfunc("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", "setter", 46);
_yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 47);
var T = this.get('total'),
                I = this.get('index'),
                V = Math.max(Math.floor(val), 0);

            _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 51);
if (T && (V >= T)) {
                _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 52);
V = T - 1;
            }

            _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 55);
if (this._pages) {
                _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 56);
this.scrollTo(V, (I == V) ? -1 : 0);
            }

            _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 59);
return V;
        }
    },

    /**
     * The total number of pages
     *
     * @attribute total
     * @type {Number}
     * @default 0
     */
    total: {
        value: 0
    }
};

_yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 75);
Y.namespace('zui').ScrollSnapper = Y.extend(ScrollSnapper, Y.Plugin.Base, {
    initializer: function () {
        _yuitest_coverfunc("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", "initializer", 76);
_yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 77);
this._host = this.get('host').setAttrs({
     //       deceleration: 0.6,
     //       bounce: 0
        });
        _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 81);
this._vertical = this._host._scrollsVertical;
        _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 82);
this._snapAttr = this._vertical ? 'offsetTop' : 'offsetLeft';
        _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 83);
this._snapRange = this._vertical ? 'offsetHeight' : 'offsetWidth';
        _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 84);
this._snapSource = this._vertical ? 'scrollY' : 'scrollX';
        _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 85);
this.afterHostMethod('_uiDimensionsChange', this._updatePages);
        _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 86);
this.afterHostEvent('render', this._updatePages);
        _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 87);
this.afterHostEvent('scrollEnd', this._scrollEnded);
        _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 88);
this._updatePages();
    },

    /**
     * Update page positions
     *
     * @method _updatePages
     * @protected
     */
    _updatePages: function () {
        _yuitest_coverfunc("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", "_updatePages", 97);
_yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 98);
var cb = this._host.get('contentBox'),
            S = this.get('selector');

        _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 101);
this._pages = S ? cb.all(S) : cb.get('children');
        _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 102);
this.set('total', this._pages.size());
    },

    /**
     * internal scrollEnd event handler
     *
     * @method _scrollEnded
     * @protected
     */
    _scrollEnded: function (E) {
        _yuitest_coverfunc("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", "_scrollEnded", 111);
_yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 112);
if (this._host._flicking) {
            _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 113);
this._snapping = false;
            _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 114);
return;
        }
        _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 116);
if (!this._snapping) {
            _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 117);
this.snapTo(this.snapIndex());
        } else {
            _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 119);
this._snapping = false;
        }
    },

    /**
     * Snap to a page, same as set('index', page)
     *
     * @method snapTo
     * @param page {Number} page index, start from 0
     */
    snapTo: function (page) {
        _yuitest_coverfunc("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", "snapTo", 129);
_yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 130);
this.set('index', page);
    },

    /**
     * Scroll to a given page in the scrollview
     *
     * @method scrollTo
     * @param page {Number} page index, start from 0
     * @param duration {Number} The number of ms the animation should last
     * @param easing {String} The timing function to use in the animation
     */
    scrollTo: function (page, duration, easing) {
        _yuitest_coverfunc("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", "scrollTo", 141);
_yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 142);
var V = Math.max(Math.floor(page), 0),
            T = Math.max(duration, 0),
            O = this._pages.item(V),
            D = O ? O.get(this._snapAttr) : 0;

        _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 147);
if (T > 0) {
            _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 148);
this._snapping = true;
        }
        _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 150);
if (this._vertical) {
            _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 151);
this._host.scrollTo(0, D, T, easing);
        } else {
            _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 153);
this._host.scrollTo(D, 0, T, easing);
        }
    },

    /**
     * Scroll to the next page in the scrollview, with animation
     *
     * @method next
     */
    next: function () {
        _yuitest_coverfunc("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", "next", 162);
_yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 163);
var index = this.get('index');
        _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 164);
if(index < this.get('total') - 1) {
            _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 165);
this.set('index', index + 1);
        }
    },

    /**
     * Scroll to the previous page in the scrollview, with animation
     *
     * @method prev
     */
    prev: function () {
        _yuitest_coverfunc("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", "prev", 174);
_yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 175);
var index = this.get('index');
        _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 176);
if(index > 0) {
            _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 177);
this.set('index', index - 1);
        }
    },

    /**
     * Get nearest page index
     *
     * @method snapIndex
     */
    snapIndex: function () {
        _yuitest_coverfunc("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", "snapIndex", 186);
_yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 187);
var A = this._snapAttr,
            R = this._snapRange,
            C = this._host.get(this._snapSource), // + this._range,
            I, O,
            pages = this._pages,
            T = pages.size();
        _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 193);
for (I=0;I<T;I++) {
            _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 194);
O = pages.item(I);
            _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 195);
if (C < O.get(A) + O.get(R) / 2) {
                _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 196);
return I;
            }
        }
        _yuitest_coverline("/build/gallery-zui-scrollsnapper/gallery-zui-scrollsnapper.js", 199);
return null;
    }
});


}, 'gallery-2012.08.22-20-00' ,{requires:['scrollview-base', 'plugin'], skinnable:false});
