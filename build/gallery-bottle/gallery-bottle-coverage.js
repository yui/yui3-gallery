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
_yuitest_coverage["/build/gallery-bottle/gallery-bottle.js"].code=["YUI.add('gallery-bottle', function(Y) {","","/**"," * The bottle module collects all UI components, and provides initialize functions."," *"," * @module gallery-bottle"," */","","/**"," * Bottle is the base namespace for all Bottle Classes or statuc methods"," *"," * @class Bottle"," */","","//handle body width and height","var BOTTLE_INIT = 'btInit',","    BOTTLE_READY = 'btReady',","    BOTTLE_NATIVE = 'btNative',","    SYNC_SCREEN = 'btSyncScreen',","    htmlbody = Y.all('html, body'),","    body = Y.one('body'),","    btRoot = Y.one('.btRoot') || body.appendChild(Y.Node.create('<div class=\"btRoot\"></div>')),","    inited = body.hasClass(BOTTLE_INIT),","    hideURL = false,","    nativeScroll = true,","    styles = {","        hidden: {overflow: 'hidden'},","        scroll: {","            overflow: 'auto',","            overflowX: 'hidden'","        }","    },","","    resetBodySize = function (resize) {","        if (hideURL && !resize) {","            window.scrollTo(0, 1);","        }","","        if (nativeScroll) {","            return;","        }","","        body.setStyles({","            width: Y.Bottle.Device.getBrowserWidth(),","            height: Y.Bottle.Device.getBrowserHeight()","        });","    },","","    initWidgets = function(css, cls) {","        Y.all(css).each(function (srcNode) {","            var unused = new cls({","                srcNode: srcNode,","                render: true","            });","        });","    },","","    /**","     * Initialize bottle UI library , create instances with supported data-roles.","     *","     * @method init","     * @param hideURL {Boolean} auto hide URL Bar when bottle inited or orientation changed","     */","    init = function (hide) {","        var pageNode = Y.one('[data-role=page]'),","            pageWidget;","","        hideURL = hide;","","        if (inited) {","            return;","        }","","        if (pageNode) {","            htmlbody.setStyles(styles.hidden);","        }","","        body.addClass(BOTTLE_INIT);","        inited = true;","","","        initWidgets('[data-role=photogrid]', Y.Bottle.PhotoGrid);","        initWidgets('[data-role=carousel]', Y.Bottle.Carousel);","        initWidgets('[data-role=slidetab]', Y.Bottle.SlideTab);","        initWidgets('[data-role=loader]', Y.Bottle.Loader);","","        if (pageNode) {","            resetBodySize();","","            pageWidget = new Y.Bottle.Page({srcNode: pageNode, render: true});","            pageWidget.resize();","","            if (pageWidget.get('nativeScroll')) {","                htmlbody.setStyles(styles.scroll);","                body.addClass(BOTTLE_NATIVE);","                pageWidget.item(0).get('scrollView').disable();","                Y.publish(BOTTLE_NATIVE, {fireOnce: true});","                Y.fire(BOTTLE_NATIVE);","                Y.publish(SYNC_SCREEN);","","                // disable scroll on shortcut and overlay","                btRoot.on('gesturemove', function (E) {","                    E.preventDefault();","                }, {standAlone:true, root: btRoot});","            } else {","                nativeScroll = false;","                resetBodySize();","            }","        }","","        Y.all('[data-role=shortcut]').each(function (shortcutNode) {","            var unused = new Y.Bottle.ShortCut({","                srcNode: shortcutNode,","                visible: false,","                disabled: true,","                render: btRoot","            });","        });","","        Y.all('[data-role=overlay]').each(function (overlayNode) {","            var unused = new Y.Bottle.Overlay({","                srcNode: overlayNode,","                visible: false,","                disabled: true,","                render: btRoot","            });","        });","","        window.addEventListener((Y.UA.mobile == 'Apple') ? 'orientationchange' : 'resize', function () {","            var scCurrent = Y.Bottle.ShortCut.getCurrent(),","                overlayCurrent = Y.Bottle.Overlay.getCurrent(),","                page = Y.Bottle.Page.getCurrent();","","            if (page) {","                resetBodySize(true);","                page.resize();","            } else {","                Y.fire(SYNC_SCREEN);","            }","","            if (scCurrent) {","                scCurrent.scResize();","            }","","            if (overlayCurrent) {","                overlayCurrent.olResize();","            }","        }, false);","","        body.addClass(BOTTLE_READY);","        Y.publish(BOTTLE_READY, {fireOnce: true});","        Y.fire(BOTTLE_READY);","    };","","Y.namespace('Bottle').init = init;","","","}, 'gallery-2012.10.03-20-02' ,{skinnable:true, requires:['gallery-bt-shortcut', 'gallery-bt-overlay', 'gallery-bt-photogrid', 'gallery-bt-slidetab', 'gallery-bt-carousel', 'gallery-bt-loader']});"];
_yuitest_coverage["/build/gallery-bottle/gallery-bottle.js"].lines = {"1":0,"16":0,"35":0,"36":0,"39":0,"40":0,"43":0,"50":0,"51":0,"65":0,"68":0,"70":0,"71":0,"74":0,"75":0,"78":0,"79":0,"82":0,"83":0,"84":0,"85":0,"87":0,"88":0,"90":0,"91":0,"93":0,"94":0,"95":0,"96":0,"97":0,"98":0,"99":0,"102":0,"103":0,"106":0,"107":0,"111":0,"112":0,"120":0,"121":0,"129":0,"130":0,"134":0,"135":0,"136":0,"138":0,"141":0,"142":0,"145":0,"146":0,"150":0,"151":0,"152":0,"155":0};
_yuitest_coverage["/build/gallery-bottle/gallery-bottle.js"].functions = {"resetBodySize:34":0,"(anonymous 2):50":0,"initWidgets:49":0,"(anonymous 3):102":0,"(anonymous 4):111":0,"(anonymous 5):120":0,"(anonymous 6):129":0,"init:64":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bottle/gallery-bottle.js"].coveredLines = 54;
_yuitest_coverage["/build/gallery-bottle/gallery-bottle.js"].coveredFunctions = 9;
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
    BOTTLE_NATIVE = 'btNative',
    SYNC_SCREEN = 'btSyncScreen',
    htmlbody = Y.all('html, body'),
    body = Y.one('body'),
    btRoot = Y.one('.btRoot') || body.appendChild(Y.Node.create('<div class="btRoot"></div>')),
    inited = body.hasClass(BOTTLE_INIT),
    hideURL = false,
    nativeScroll = true,
    styles = {
        hidden: {overflow: 'hidden'},
        scroll: {
            overflow: 'auto',
            overflowX: 'hidden'
        }
    },

    resetBodySize = function (resize) {
        _yuitest_coverfunc("/build/gallery-bottle/gallery-bottle.js", "resetBodySize", 34);
_yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 35);
if (hideURL && !resize) {
            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 36);
window.scrollTo(0, 1);
        }

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 39);
if (nativeScroll) {
            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 40);
return;
        }

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 43);
body.setStyles({
            width: Y.Bottle.Device.getBrowserWidth(),
            height: Y.Bottle.Device.getBrowserHeight()
        });
    },

    initWidgets = function(css, cls) {
        _yuitest_coverfunc("/build/gallery-bottle/gallery-bottle.js", "initWidgets", 49);
_yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 50);
Y.all(css).each(function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bottle/gallery-bottle.js", "(anonymous 2)", 50);
_yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 51);
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
        _yuitest_coverfunc("/build/gallery-bottle/gallery-bottle.js", "init", 64);
_yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 65);
var pageNode = Y.one('[data-role=page]'),
            pageWidget;

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 68);
hideURL = hide;

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 70);
if (inited) {
            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 71);
return;
        }

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 74);
if (pageNode) {
            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 75);
htmlbody.setStyles(styles.hidden);
        }

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 78);
body.addClass(BOTTLE_INIT);
        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 79);
inited = true;


        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 82);
initWidgets('[data-role=photogrid]', Y.Bottle.PhotoGrid);
        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 83);
initWidgets('[data-role=carousel]', Y.Bottle.Carousel);
        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 84);
initWidgets('[data-role=slidetab]', Y.Bottle.SlideTab);
        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 85);
initWidgets('[data-role=loader]', Y.Bottle.Loader);

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 87);
if (pageNode) {
            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 88);
resetBodySize();

            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 90);
pageWidget = new Y.Bottle.Page({srcNode: pageNode, render: true});
            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 91);
pageWidget.resize();

            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 93);
if (pageWidget.get('nativeScroll')) {
                _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 94);
htmlbody.setStyles(styles.scroll);
                _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 95);
body.addClass(BOTTLE_NATIVE);
                _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 96);
pageWidget.item(0).get('scrollView').disable();
                _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 97);
Y.publish(BOTTLE_NATIVE, {fireOnce: true});
                _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 98);
Y.fire(BOTTLE_NATIVE);
                _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 99);
Y.publish(SYNC_SCREEN);

                // disable scroll on shortcut and overlay
                _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 102);
btRoot.on('gesturemove', function (E) {
                    _yuitest_coverfunc("/build/gallery-bottle/gallery-bottle.js", "(anonymous 3)", 102);
_yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 103);
E.preventDefault();
                }, {standAlone:true, root: btRoot});
            } else {
                _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 106);
nativeScroll = false;
                _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 107);
resetBodySize();
            }
        }

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 111);
Y.all('[data-role=shortcut]').each(function (shortcutNode) {
            _yuitest_coverfunc("/build/gallery-bottle/gallery-bottle.js", "(anonymous 4)", 111);
_yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 112);
var unused = new Y.Bottle.ShortCut({
                srcNode: shortcutNode,
                visible: false,
                disabled: true,
                render: btRoot
            });
        });

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 120);
Y.all('[data-role=overlay]').each(function (overlayNode) {
            _yuitest_coverfunc("/build/gallery-bottle/gallery-bottle.js", "(anonymous 5)", 120);
_yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 121);
var unused = new Y.Bottle.Overlay({
                srcNode: overlayNode,
                visible: false,
                disabled: true,
                render: btRoot
            });
        });

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 129);
window.addEventListener((Y.UA.mobile == 'Apple') ? 'orientationchange' : 'resize', function () {
            _yuitest_coverfunc("/build/gallery-bottle/gallery-bottle.js", "(anonymous 6)", 129);
_yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 130);
var scCurrent = Y.Bottle.ShortCut.getCurrent(),
                overlayCurrent = Y.Bottle.Overlay.getCurrent(),
                page = Y.Bottle.Page.getCurrent();

            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 134);
if (page) {
                _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 135);
resetBodySize(true);
                _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 136);
page.resize();
            } else {
                _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 138);
Y.fire(SYNC_SCREEN);
            }

            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 141);
if (scCurrent) {
                _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 142);
scCurrent.scResize();
            }

            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 145);
if (overlayCurrent) {
                _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 146);
overlayCurrent.olResize();
            }
        }, false);

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 150);
body.addClass(BOTTLE_READY);
        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 151);
Y.publish(BOTTLE_READY, {fireOnce: true});
        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 152);
Y.fire(BOTTLE_READY);
    };

_yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 155);
Y.namespace('Bottle').init = init;


}, 'gallery-2012.10.03-20-02' ,{skinnable:true, requires:['gallery-bt-shortcut', 'gallery-bt-overlay', 'gallery-bt-photogrid', 'gallery-bt-slidetab', 'gallery-bt-carousel', 'gallery-bt-loader']});
