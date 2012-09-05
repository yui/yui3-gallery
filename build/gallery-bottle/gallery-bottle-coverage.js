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
_yuitest_coverage["/build/gallery-bottle/gallery-bottle.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-bottle/gallery-bottle.js",
    code: []
};
_yuitest_coverage["/build/gallery-bottle/gallery-bottle.js"].code=["YUI.add('gallery-bottle', function(Y) {","","/**"," * The bottle module collects all UI components, and provides initialize functions."," *"," * @module gallery-bottle"," */","","/**"," * Bottle is the base namespace for all Bottle Classes or statuc methods"," *"," * @class Bottle"," */","","//handle body width and height","var BOTTLE_INIT = 'btInit',","    BOTTLE_READY = 'btReady',","    body = Y.one('body'),","    inited = body.hasClass(BOTTLE_INIT),","    hideURL = false,","","    resetBodySize = function () {","        if (hideURL) {","            window.scrollTo(0, 0);","        }","","        body.setStyles({","            width: Y.Bottle.Device.getBrowserWidth(),","            height: Y.Bottle.Device.getBrowserHeight()","        });","    },","","    initWidgets = function(css, cls) {","        Y.all(css).each(function (srcNode) {","            var unused = new cls({","                srcNode: srcNode,","                render: true","            });","        });","    },","","    /**","     * Initialize bottle UI library , create instances with supported data-roles.","     *","     * @method init","     * @param hideURL {Boolean} auto hide URL Bar when bottle inited or orientation changed","     */","    init = function (hide) {","        var pageNode = Y.one('[data-role=page]'),","            unused;","","        hideURL = hide;","","        if (inited) {","            return;","        }","","        if (pageNode) {","            Y.one('html').setStyle('overflow', 'hidden');","            body.setStyle('overflow', 'hidden');","        }","","        body.addClass(BOTTLE_INIT);","        inited = true;","","        initWidgets('[data-role=photogrid]', Y.Bottle.PhotoGrid);","        initWidgets('[data-role=carousel]', Y.Bottle.Carousel);","        initWidgets('[data-role=slidetab]', Y.Bottle.SlideTab);","","        if (pageNode) {","            resetBodySize();","            unused = (new Y.Bottle.Page({srcNode: pageNode, render: true})).resize();","        }","","        Y.all('[data-role=shortcut]').each(function (shortcutNode) {","            unused = new Y.Bottle.ShortCut({","                srcNode: shortcutNode,","                visible: false,","                disabled: true,","                render: body","            });","        });","","        Y.all('[data-role=overlay]').each(function (overlayNode) {","            unused = new Y.Bottle.Overlay({","                srcNode: overlayNode,","                visible: false,","                disabled: true,","                render: body","            });","        });","","        window.addEventListener((Y.UA.mobile == 'Apple') ? 'orientationchange' : 'resize', function () {","            var scCurrent = Y.Bottle.ShortCut.getCurrent(),","                overlayCurrent = Y.Bottle.Overlay.getCurrent(),","                page = Y.Bottle.Page.getCurrent();","","            if (page) {","                resetBodySize();","                page.resize();","            }","","            if (scCurrent) {","                scCurrent.scResize();","            }","","            if (overlayCurrent) {","                overlayCurrent.scResize();","            }","        }, false);","","        body.addClass(BOTTLE_READY);","        Y.publish(BOTTLE_READY, {fireOnce: true});","        Y.fire(BOTTLE_READY);","    };","","Y.namespace('Bottle').init = init;","","","}, 'gallery-2012.09.05-20-01' ,{requires:['gallery-bt-device', 'gallery-bt-shortcut', 'gallery-bt-overlay', 'gallery-bt-photogrid', 'gallery-bt-slidetab', 'gallery-bt-carousel'], optional:['gallery-bt-css']});"];
_yuitest_coverage["/build/gallery-bottle/gallery-bottle.js"].lines = {"1":0,"16":0,"23":0,"24":0,"27":0,"34":0,"35":0,"49":0,"52":0,"54":0,"55":0,"58":0,"59":0,"60":0,"63":0,"64":0,"66":0,"67":0,"68":0,"70":0,"71":0,"72":0,"75":0,"76":0,"84":0,"85":0,"93":0,"94":0,"98":0,"99":0,"100":0,"103":0,"104":0,"107":0,"108":0,"112":0,"113":0,"114":0,"117":0};
_yuitest_coverage["/build/gallery-bottle/gallery-bottle.js"].functions = {"resetBodySize:22":0,"(anonymous 2):34":0,"initWidgets:33":0,"(anonymous 3):75":0,"(anonymous 4):84":0,"(anonymous 5):93":0,"init:48":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bottle/gallery-bottle.js"].coveredLines = 39;
_yuitest_coverage["/build/gallery-bottle/gallery-bottle.js"].coveredFunctions = 8;
_yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 1);
YUI.add('gallery-bottle', function(Y) {

/**
 * The bottle module collects all UI components, and provides initialize functions.
 *
 * @module gallery-bottle
 */

/**
 * Bottle is the base namespace for all Bottle Classes or statuc methods
 *
 * @class Bottle
 */

//handle body width and height
_yuitest_coverfunc("/build/gallery-bottle/gallery-bottle.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 16);
var BOTTLE_INIT = 'btInit',
    BOTTLE_READY = 'btReady',
    body = Y.one('body'),
    inited = body.hasClass(BOTTLE_INIT),
    hideURL = false,

    resetBodySize = function () {
        _yuitest_coverfunc("/build/gallery-bottle/gallery-bottle.js", "resetBodySize", 22);
_yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 23);
if (hideURL) {
            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 24);
window.scrollTo(0, 0);
        }

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 27);
body.setStyles({
            width: Y.Bottle.Device.getBrowserWidth(),
            height: Y.Bottle.Device.getBrowserHeight()
        });
    },

    initWidgets = function(css, cls) {
        _yuitest_coverfunc("/build/gallery-bottle/gallery-bottle.js", "initWidgets", 33);
_yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 34);
Y.all(css).each(function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bottle/gallery-bottle.js", "(anonymous 2)", 34);
_yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 35);
var unused = new cls({
                srcNode: srcNode,
                render: true
            });
        });
    },

    /**
     * Initialize bottle UI library , create instances with supported data-roles.
     *
     * @method init
     * @param hideURL {Boolean} auto hide URL Bar when bottle inited or orientation changed
     */
    init = function (hide) {
        _yuitest_coverfunc("/build/gallery-bottle/gallery-bottle.js", "init", 48);
_yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 49);
var pageNode = Y.one('[data-role=page]'),
            unused;

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 52);
hideURL = hide;

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 54);
if (inited) {
            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 55);
return;
        }

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 58);
if (pageNode) {
            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 59);
Y.one('html').setStyle('overflow', 'hidden');
            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 60);
body.setStyle('overflow', 'hidden');
        }

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 63);
body.addClass(BOTTLE_INIT);
        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 64);
inited = true;

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 66);
initWidgets('[data-role=photogrid]', Y.Bottle.PhotoGrid);
        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 67);
initWidgets('[data-role=carousel]', Y.Bottle.Carousel);
        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 68);
initWidgets('[data-role=slidetab]', Y.Bottle.SlideTab);

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 70);
if (pageNode) {
            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 71);
resetBodySize();
            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 72);
unused = (new Y.Bottle.Page({srcNode: pageNode, render: true})).resize();
        }

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 75);
Y.all('[data-role=shortcut]').each(function (shortcutNode) {
            _yuitest_coverfunc("/build/gallery-bottle/gallery-bottle.js", "(anonymous 3)", 75);
_yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 76);
unused = new Y.Bottle.ShortCut({
                srcNode: shortcutNode,
                visible: false,
                disabled: true,
                render: body
            });
        });

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 84);
Y.all('[data-role=overlay]').each(function (overlayNode) {
            _yuitest_coverfunc("/build/gallery-bottle/gallery-bottle.js", "(anonymous 4)", 84);
_yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 85);
unused = new Y.Bottle.Overlay({
                srcNode: overlayNode,
                visible: false,
                disabled: true,
                render: body
            });
        });

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 93);
window.addEventListener((Y.UA.mobile == 'Apple') ? 'orientationchange' : 'resize', function () {
            _yuitest_coverfunc("/build/gallery-bottle/gallery-bottle.js", "(anonymous 5)", 93);
_yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 94);
var scCurrent = Y.Bottle.ShortCut.getCurrent(),
                overlayCurrent = Y.Bottle.Overlay.getCurrent(),
                page = Y.Bottle.Page.getCurrent();

            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 98);
if (page) {
                _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 99);
resetBodySize();
                _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 100);
page.resize();
            }

            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 103);
if (scCurrent) {
                _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 104);
scCurrent.scResize();
            }

            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 107);
if (overlayCurrent) {
                _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 108);
overlayCurrent.scResize();
            }
        }, false);

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 112);
body.addClass(BOTTLE_READY);
        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 113);
Y.publish(BOTTLE_READY, {fireOnce: true});
        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 114);
Y.fire(BOTTLE_READY);
    };

_yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 117);
Y.namespace('Bottle').init = init;


}, 'gallery-2012.09.05-20-01' ,{requires:['gallery-bt-device', 'gallery-bt-shortcut', 'gallery-bt-overlay', 'gallery-bt-photogrid', 'gallery-bt-slidetab', 'gallery-bt-carousel'], optional:['gallery-bt-css']});
