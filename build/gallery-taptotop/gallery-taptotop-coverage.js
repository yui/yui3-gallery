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
_yuitest_coverage["/build/gallery-taptotop/gallery-taptotop.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-taptotop/gallery-taptotop.js",
    code: []
};
_yuitest_coverage["/build/gallery-taptotop/gallery-taptotop.js"].code=["YUI.add('gallery-taptotop', function(Y) {","","","'use strict';","","// A regular link will scroll to the top just fine, but we want smooth, animated scroll,","// maybe with easing even. And we only want to reveal this control after the user ","// scrolls down a tad. And it would be nice to just plug this in without any additional","// markkup. Hence making this a plugin.","","function TapToTopPlugin(config) {","    TapToTopPlugin.superclass.constructor.apply(this, arguments);","}","TapToTopPlugin.NAME = 'tapToTopPlugin';","TapToTopPlugin.NS = 'tapToTop';","TapToTopPlugin.ATTRS = {","    TRIGGERING_DISTANCE: {","        value: 100","    },","    CSS_CLASS_SHOWN: {","        value: 'shown'","    }","};","","Y.extend(TapToTopPlugin, Y.Plugin.Base, {","","    initializer: function () {","        var host = this.get('host');","","        if (!host.one('#tapToTop')) {","            host.append('<a id=\"tapToTop\" href=\"#top\" title=\"Top of page\">Top of page<span class=\"circumflex\"><span class=\"bar\"></span><span class=\"bar\"></span></span></a>');","        }","","        this.btn = host.one('#tapToTop');","","        this.btnListener = this.btn.on('click', this._handleClick, this);","        this.windowListener = Y.on('scroll', this._handleWindowScroll, Y.config.win, this);","","        this.scrollAnimation = new Y.Anim({","            node: Y.one('body'),","            easing: 'easeOut',","            to: {","                scrollTop: 0","            }","        });","    },","","    destructor: function () {","        this.btnListener.detach();","        this.windowListener.detach();","    },","","    _handleClick: function (e) {","        e.preventDefault();","        this._scroll();","    },","","    _scroll: function () {","        this.scrollAnimation.run();","    },","","    _show: function () {","        this.btn.addClass(this.get('CSS_CLASS_SHOWN'));","    },","","    _hide: function () {","        this.btn.removeClass(this.get('CSS_CLASS_SHOWN'));","    },","","    _handleWindowScroll: function (e) {","        // listen for window scroll events, and when the window scrolls past n px, show the node","        if (e.currentTarget.get('pageYOffset') > this.get('TRIGGERING_DISTANCE')) {","            this._show();","        } else {","            this._hide();","        }","    }","","});","","Y.TapToTopPlugin = TapToTopPlugin;","","","","}, 'gallery-2012.10.24-20-01' ,{requires:['node','event','plugin','anim-base','anim-easing'], skinnable:true});"];
_yuitest_coverage["/build/gallery-taptotop/gallery-taptotop.js"].lines = {"1":0,"4":0,"11":0,"12":0,"14":0,"15":0,"16":0,"25":0,"28":0,"30":0,"31":0,"34":0,"36":0,"37":0,"39":0,"49":0,"50":0,"54":0,"55":0,"59":0,"63":0,"67":0,"72":0,"73":0,"75":0,"81":0};
_yuitest_coverage["/build/gallery-taptotop/gallery-taptotop.js"].functions = {"TapToTopPlugin:11":0,"initializer:27":0,"destructor:48":0,"_handleClick:53":0,"_scroll:58":0,"_show:62":0,"_hide:66":0,"_handleWindowScroll:70":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-taptotop/gallery-taptotop.js"].coveredLines = 26;
_yuitest_coverage["/build/gallery-taptotop/gallery-taptotop.js"].coveredFunctions = 9;
_yuitest_coverline("/build/gallery-taptotop/gallery-taptotop.js", 1);
YUI.add('gallery-taptotop', function(Y) {


_yuitest_coverfunc("/build/gallery-taptotop/gallery-taptotop.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-taptotop/gallery-taptotop.js", 4);
'use strict';

// A regular link will scroll to the top just fine, but we want smooth, animated scroll,
// maybe with easing even. And we only want to reveal this control after the user 
// scrolls down a tad. And it would be nice to just plug this in without any additional
// markkup. Hence making this a plugin.

_yuitest_coverline("/build/gallery-taptotop/gallery-taptotop.js", 11);
function TapToTopPlugin(config) {
    _yuitest_coverfunc("/build/gallery-taptotop/gallery-taptotop.js", "TapToTopPlugin", 11);
_yuitest_coverline("/build/gallery-taptotop/gallery-taptotop.js", 12);
TapToTopPlugin.superclass.constructor.apply(this, arguments);
}
_yuitest_coverline("/build/gallery-taptotop/gallery-taptotop.js", 14);
TapToTopPlugin.NAME = 'tapToTopPlugin';
_yuitest_coverline("/build/gallery-taptotop/gallery-taptotop.js", 15);
TapToTopPlugin.NS = 'tapToTop';
_yuitest_coverline("/build/gallery-taptotop/gallery-taptotop.js", 16);
TapToTopPlugin.ATTRS = {
    TRIGGERING_DISTANCE: {
        value: 100
    },
    CSS_CLASS_SHOWN: {
        value: 'shown'
    }
};

_yuitest_coverline("/build/gallery-taptotop/gallery-taptotop.js", 25);
Y.extend(TapToTopPlugin, Y.Plugin.Base, {

    initializer: function () {
        _yuitest_coverfunc("/build/gallery-taptotop/gallery-taptotop.js", "initializer", 27);
_yuitest_coverline("/build/gallery-taptotop/gallery-taptotop.js", 28);
var host = this.get('host');

        _yuitest_coverline("/build/gallery-taptotop/gallery-taptotop.js", 30);
if (!host.one('#tapToTop')) {
            _yuitest_coverline("/build/gallery-taptotop/gallery-taptotop.js", 31);
host.append('<a id="tapToTop" href="#top" title="Top of page">Top of page<span class="circumflex"><span class="bar"></span><span class="bar"></span></span></a>');
        }

        _yuitest_coverline("/build/gallery-taptotop/gallery-taptotop.js", 34);
this.btn = host.one('#tapToTop');

        _yuitest_coverline("/build/gallery-taptotop/gallery-taptotop.js", 36);
this.btnListener = this.btn.on('click', this._handleClick, this);
        _yuitest_coverline("/build/gallery-taptotop/gallery-taptotop.js", 37);
this.windowListener = Y.on('scroll', this._handleWindowScroll, Y.config.win, this);

        _yuitest_coverline("/build/gallery-taptotop/gallery-taptotop.js", 39);
this.scrollAnimation = new Y.Anim({
            node: Y.one('body'),
            easing: 'easeOut',
            to: {
                scrollTop: 0
            }
        });
    },

    destructor: function () {
        _yuitest_coverfunc("/build/gallery-taptotop/gallery-taptotop.js", "destructor", 48);
_yuitest_coverline("/build/gallery-taptotop/gallery-taptotop.js", 49);
this.btnListener.detach();
        _yuitest_coverline("/build/gallery-taptotop/gallery-taptotop.js", 50);
this.windowListener.detach();
    },

    _handleClick: function (e) {
        _yuitest_coverfunc("/build/gallery-taptotop/gallery-taptotop.js", "_handleClick", 53);
_yuitest_coverline("/build/gallery-taptotop/gallery-taptotop.js", 54);
e.preventDefault();
        _yuitest_coverline("/build/gallery-taptotop/gallery-taptotop.js", 55);
this._scroll();
    },

    _scroll: function () {
        _yuitest_coverfunc("/build/gallery-taptotop/gallery-taptotop.js", "_scroll", 58);
_yuitest_coverline("/build/gallery-taptotop/gallery-taptotop.js", 59);
this.scrollAnimation.run();
    },

    _show: function () {
        _yuitest_coverfunc("/build/gallery-taptotop/gallery-taptotop.js", "_show", 62);
_yuitest_coverline("/build/gallery-taptotop/gallery-taptotop.js", 63);
this.btn.addClass(this.get('CSS_CLASS_SHOWN'));
    },

    _hide: function () {
        _yuitest_coverfunc("/build/gallery-taptotop/gallery-taptotop.js", "_hide", 66);
_yuitest_coverline("/build/gallery-taptotop/gallery-taptotop.js", 67);
this.btn.removeClass(this.get('CSS_CLASS_SHOWN'));
    },

    _handleWindowScroll: function (e) {
        // listen for window scroll events, and when the window scrolls past n px, show the node
        _yuitest_coverfunc("/build/gallery-taptotop/gallery-taptotop.js", "_handleWindowScroll", 70);
_yuitest_coverline("/build/gallery-taptotop/gallery-taptotop.js", 72);
if (e.currentTarget.get('pageYOffset') > this.get('TRIGGERING_DISTANCE')) {
            _yuitest_coverline("/build/gallery-taptotop/gallery-taptotop.js", 73);
this._show();
        } else {
            _yuitest_coverline("/build/gallery-taptotop/gallery-taptotop.js", 75);
this._hide();
        }
    }

});

_yuitest_coverline("/build/gallery-taptotop/gallery-taptotop.js", 81);
Y.TapToTopPlugin = TapToTopPlugin;



}, 'gallery-2012.10.24-20-01' ,{requires:['node','event','plugin','anim-base','anim-easing'], skinnable:true});
