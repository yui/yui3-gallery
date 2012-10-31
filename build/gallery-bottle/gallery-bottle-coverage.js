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
_yuitest_coverage["/build/gallery-bottle/gallery-bottle.js"].code=["YUI.add('gallery-bottle', function(Y) {","","/**"," * The bottle module collects all UI components, and provides initialize functions."," *"," * @module gallery-bottle"," */","","/**"," * Bottle is the base namespace for all Bottle Classes or statuc methods"," *"," * @class Bottle"," */","","//handle body width and height","var BOTTLE_INIT = 'btInit',","    BOTTLE_READY = 'btReady',","    BOTTLE_NATIVE = 'btNative',","    BOTTLE_FOCUS = 'btFocus',","    SYNC_SCREEN = 'btSyncScreen',","    htmlbody = Y.all('html, body'),","    body = Y.one('body'),","    btRoot = Y.one('.btRoot') || body.appendChild(Y.Node.create('<div class=\"btRoot\"></div>')),","    inited = body.hasClass(BOTTLE_INIT),","    hideURL = false,","    nativeScroll = true,","    styles = {","        hidden: {overflow: 'hidden'},","        scroll: {","            overflow: 'auto',","            overflowX: 'hidden'","        }","    },","","    resetBodySize = function (resize) {","        if (hideURL && !resize) {","            window.scrollTo(0, 1);","        }","","        if (nativeScroll) {","            return;","        }","","        body.setStyles({","            width: Y.Bottle.Device.getBrowserWidth(),","            height: Y.Bottle.Device.getBrowserHeight()","        });","    },","","    handleResize = function (force) {","        var scCurrent = Y.Bottle.ShortCut.getCurrent(),","            overlayCurrent = Y.Bottle.Overlay.getCurrent(),","            page = Y.Bottle.Page.getCurrent();","","        if (page) {","            resetBodySize(true);","            page.resize();","        } else {","            Y.fire(SYNC_SCREEN);","        }","","        if (scCurrent) {","            scCurrent.scResize(force === true);","        }","","        if (overlayCurrent) {","            overlayCurrent.olResize(force === true);","        }","    },","","    initWidgets = function(css, cls) {","        Y.all(css).each(function (srcNode) {","            var unused = new cls({","                srcNode: srcNode,","                render: true","            });","        });","    },","","    /**","     * Initialize bottle UI library , create instances with supported data-roles.","     *","     * @method init","     * @param hideURL {Boolean} auto hide URL Bar when bottle inited or orientation changed","     */","    init = function (hide) {","        var pageNode = Y.one('[data-role=page]'),","            pageWidget;","","        hideURL = hide;","","        if (inited) {","            return;","        }","","        if (pageNode) {","            htmlbody.setStyles(styles.hidden);","        }","","        body.addClass(BOTTLE_INIT);","        inited = true;","","        initWidgets('[data-role=viewer]', Y.Bottle.Viewer);","        initWidgets('[data-role=photogrid]', Y.Bottle.PhotoGrid);","        initWidgets('[data-role=carousel]', Y.Bottle.Carousel);","        initWidgets('[data-role=slidetab]', Y.Bottle.SlideTab);","        initWidgets('[data-role=loader]', Y.Bottle.Loader);","","        if (pageNode) {","            resetBodySize();","","            pageWidget = new Y.Bottle.Page({srcNode: pageNode, render: true});","            pageWidget.resize();","","            if (pageWidget.get('nativeScroll')) {","                htmlbody.setStyles(styles.scroll);","                body.addClass(BOTTLE_NATIVE);","                pageWidget.item(0).get('scrollView').disable();","                Y.publish(BOTTLE_NATIVE, {fireOnce: true});","                Y.fire(BOTTLE_NATIVE);","                Y.publish(SYNC_SCREEN);","","                // disable scroll on shortcut and overlay","                btRoot.on('gesturemove', function (E) {","                    E.preventDefault();","                }, {standAlone:true, root: btRoot});","            } else {","                nativeScroll = false;","                resetBodySize();","            }","        }","","        Y.all('[data-role=shortcut]').each(function (shortcutNode) {","            var unused = new Y.Bottle.ShortCut({","                srcNode: shortcutNode,","                visible: false,","                disabled: true,","                render: btRoot","            });","        });","","        Y.all('[data-role=overlay]').each(function (overlayNode) {","            var unused = new Y.Bottle.Overlay({","                srcNode: overlayNode,","                visible: false,","                disabled: true,","                render: btRoot","            });","        });","","        Y.on((Y.UA.mobile == 'Apple') ? 'orientationchange' : 'resize', handleResize, window);","","        body.delegate('focus', function (E) {","            body.addClass(BOTTLE_FOCUS);","        }, 'input, select, textarea');","","","        body.delegate('blur', function (E) {","            body.removeClass(BOTTLE_FOCUS);","            handleResize(true);","        }, 'input, select, textarea');","","        body.addClass(BOTTLE_READY).removeClass('btHideSCO').removeClass('btInPlace').removeClass('btHideAll');","        Y.publish(BOTTLE_READY, {fireOnce: true});","        Y.fire(BOTTLE_READY);","    };","","Y.namespace('Bottle').init = init;","","","}, 'gallery-2012.10.31-20-00' ,{skinnable:true, requires:['gallery-bt-shortcut', 'gallery-bt-overlay', 'gallery-bt-photogrid', 'gallery-bt-slidetab', 'gallery-bt-carousel', 'gallery-bt-loader', 'gallery-bt-viewer']});"];
_yuitest_coverage["/build/gallery-bottle/gallery-bottle.js"].lines = {"1":0,"16":0,"36":0,"37":0,"40":0,"41":0,"44":0,"51":0,"55":0,"56":0,"57":0,"59":0,"62":0,"63":0,"66":0,"67":0,"72":0,"73":0,"87":0,"90":0,"92":0,"93":0,"96":0,"97":0,"100":0,"101":0,"103":0,"104":0,"105":0,"106":0,"107":0,"109":0,"110":0,"112":0,"113":0,"115":0,"116":0,"117":0,"118":0,"119":0,"120":0,"121":0,"124":0,"125":0,"128":0,"129":0,"133":0,"134":0,"142":0,"143":0,"151":0,"153":0,"154":0,"158":0,"159":0,"160":0,"163":0,"164":0,"165":0,"168":0};
_yuitest_coverage["/build/gallery-bottle/gallery-bottle.js"].functions = {"resetBodySize:35":0,"handleResize:50":0,"(anonymous 2):72":0,"initWidgets:71":0,"(anonymous 3):124":0,"(anonymous 4):133":0,"(anonymous 5):142":0,"(anonymous 6):153":0,"(anonymous 7):158":0,"init:86":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bottle/gallery-bottle.js"].coveredLines = 60;
_yuitest_coverage["/build/gallery-bottle/gallery-bottle.js"].coveredFunctions = 11;
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
    BOTTLE_FOCUS = 'btFocus',
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
        _yuitest_coverfunc("/build/gallery-bottle/gallery-bottle.js", "resetBodySize", 35);
_yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 36);
if (hideURL && !resize) {
            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 37);
window.scrollTo(0, 1);
        }

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 40);
if (nativeScroll) {
            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 41);
return;
        }

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 44);
body.setStyles({
            width: Y.Bottle.Device.getBrowserWidth(),
            height: Y.Bottle.Device.getBrowserHeight()
        });
    },

    handleResize = function (force) {
        _yuitest_coverfunc("/build/gallery-bottle/gallery-bottle.js", "handleResize", 50);
_yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 51);
var scCurrent = Y.Bottle.ShortCut.getCurrent(),
            overlayCurrent = Y.Bottle.Overlay.getCurrent(),
            page = Y.Bottle.Page.getCurrent();

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 55);
if (page) {
            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 56);
resetBodySize(true);
            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 57);
page.resize();
        } else {
            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 59);
Y.fire(SYNC_SCREEN);
        }

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 62);
if (scCurrent) {
            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 63);
scCurrent.scResize(force === true);
        }

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 66);
if (overlayCurrent) {
            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 67);
overlayCurrent.olResize(force === true);
        }
    },

    initWidgets = function(css, cls) {
        _yuitest_coverfunc("/build/gallery-bottle/gallery-bottle.js", "initWidgets", 71);
_yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 72);
Y.all(css).each(function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bottle/gallery-bottle.js", "(anonymous 2)", 72);
_yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 73);
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
        _yuitest_coverfunc("/build/gallery-bottle/gallery-bottle.js", "init", 86);
_yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 87);
var pageNode = Y.one('[data-role=page]'),
            pageWidget;

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 90);
hideURL = hide;

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 92);
if (inited) {
            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 93);
return;
        }

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 96);
if (pageNode) {
            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 97);
htmlbody.setStyles(styles.hidden);
        }

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 100);
body.addClass(BOTTLE_INIT);
        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 101);
inited = true;

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 103);
initWidgets('[data-role=viewer]', Y.Bottle.Viewer);
        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 104);
initWidgets('[data-role=photogrid]', Y.Bottle.PhotoGrid);
        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 105);
initWidgets('[data-role=carousel]', Y.Bottle.Carousel);
        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 106);
initWidgets('[data-role=slidetab]', Y.Bottle.SlideTab);
        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 107);
initWidgets('[data-role=loader]', Y.Bottle.Loader);

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 109);
if (pageNode) {
            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 110);
resetBodySize();

            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 112);
pageWidget = new Y.Bottle.Page({srcNode: pageNode, render: true});
            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 113);
pageWidget.resize();

            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 115);
if (pageWidget.get('nativeScroll')) {
                _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 116);
htmlbody.setStyles(styles.scroll);
                _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 117);
body.addClass(BOTTLE_NATIVE);
                _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 118);
pageWidget.item(0).get('scrollView').disable();
                _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 119);
Y.publish(BOTTLE_NATIVE, {fireOnce: true});
                _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 120);
Y.fire(BOTTLE_NATIVE);
                _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 121);
Y.publish(SYNC_SCREEN);

                // disable scroll on shortcut and overlay
                _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 124);
btRoot.on('gesturemove', function (E) {
                    _yuitest_coverfunc("/build/gallery-bottle/gallery-bottle.js", "(anonymous 3)", 124);
_yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 125);
E.preventDefault();
                }, {standAlone:true, root: btRoot});
            } else {
                _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 128);
nativeScroll = false;
                _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 129);
resetBodySize();
            }
        }

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 133);
Y.all('[data-role=shortcut]').each(function (shortcutNode) {
            _yuitest_coverfunc("/build/gallery-bottle/gallery-bottle.js", "(anonymous 4)", 133);
_yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 134);
var unused = new Y.Bottle.ShortCut({
                srcNode: shortcutNode,
                visible: false,
                disabled: true,
                render: btRoot
            });
        });

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 142);
Y.all('[data-role=overlay]').each(function (overlayNode) {
            _yuitest_coverfunc("/build/gallery-bottle/gallery-bottle.js", "(anonymous 5)", 142);
_yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 143);
var unused = new Y.Bottle.Overlay({
                srcNode: overlayNode,
                visible: false,
                disabled: true,
                render: btRoot
            });
        });

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 151);
Y.on((Y.UA.mobile == 'Apple') ? 'orientationchange' : 'resize', handleResize, window);

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 153);
body.delegate('focus', function (E) {
            _yuitest_coverfunc("/build/gallery-bottle/gallery-bottle.js", "(anonymous 6)", 153);
_yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 154);
body.addClass(BOTTLE_FOCUS);
        }, 'input, select, textarea');


        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 158);
body.delegate('blur', function (E) {
            _yuitest_coverfunc("/build/gallery-bottle/gallery-bottle.js", "(anonymous 7)", 158);
_yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 159);
body.removeClass(BOTTLE_FOCUS);
            _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 160);
handleResize(true);
        }, 'input, select, textarea');

        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 163);
body.addClass(BOTTLE_READY).removeClass('btHideSCO').removeClass('btInPlace').removeClass('btHideAll');
        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 164);
Y.publish(BOTTLE_READY, {fireOnce: true});
        _yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 165);
Y.fire(BOTTLE_READY);
    };

_yuitest_coverline("/build/gallery-bottle/gallery-bottle.js", 168);
Y.namespace('Bottle').init = init;


}, 'gallery-2012.10.31-20-00' ,{skinnable:true, requires:['gallery-bt-shortcut', 'gallery-bt-overlay', 'gallery-bt-photogrid', 'gallery-bt-slidetab', 'gallery-bt-carousel', 'gallery-bt-loader', 'gallery-bt-viewer']});
