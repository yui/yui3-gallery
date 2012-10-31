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
_yuitest_coverage["/build/gallery-bt-container/gallery-bt-container.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-bt-container/gallery-bt-container.js",
    code: []
};
_yuitest_coverage["/build/gallery-bt-container/gallery-bt-container.js"].code=["YUI.add('gallery-bt-container', function(Y) {","","/**"," * This module provides Container Widget which can handle scrollView with/without header/footer."," * "," * @module gallery-bt-container"," */","var HEIGHT_CHANGE = 'heightChange',","    WIDTH_CHANGE = 'widthChange',","    fixedPos = Y.Bottle.Device.getPositionFixedSupport(),","","    handleFixPos = function (header, fixed, nativeScroll) {","        var node,","            pfix = fixed && fixedPos,","            ns = (nativeScroll !== undefined) ? nativeScroll : this.get('nativeScroll');","","        if (this.get('scrollView')) {","            node = this.get(header ? 'headerNode' : 'footerNode');","","            if (node) {","                node.setStyles({","                    position: (ns && pfix) ? 'fixed' : '',","                    top: (header && ns && pfix) ? 0 : '',","                    bottom: (!header && ns && pfix) ? 0 : '',","                    zIndex: (ns && pfix) ? 50 : ''","                });","","                if (fixedPos) {","                    this.get('scrollView').get('boundingBox').setStyle(header ? 'marginTop' : 'marginBottom', (fixed && ns) ? (node.get('offsetHeight') + 'px') : 0);","                }","            }","","            this.get(fixed ? 'srcNode' : 'scrollNode').insert(node, header ? 0 : undefined);","","            this._syncScrollHeight();","        }","    };","","/**"," * A class for constructing container instances."," *"," * @class Container"," * @param [config] {Object} Object literal with initial attribute values"," * @extends Widget"," * @namespace Bottle"," * @uses WidgetChild"," * @uses Y.zui.Attribute"," * @constructor"," */","Y.namespace('Bottle').Container = Y.Base.create('btcontainer', Y.Widget, [Y.WidgetChild, Y.zui.Attribute], {","    initializer: function (config) {","        /**","         * internal eventhandlers, keep for destructor","         *","         * @property _btcEventHandlers","         * @type EventHandle","         * @private","         */","        this._btcEventHandlers = new Y.EventHandle([","            this.after(HEIGHT_CHANGE, this._syncScrollHeight),","            this.on(WIDTH_CHANGE, this._syncScrollWidth)","        ]);","    },","","    destructor: function () {","        this._btcEventHandlers.detach();","","        if (this.get('rendered')) {","            this.get('scrollView').destroy(true);","        }","","        delete this._eventHandlers;","    },","","    renderUI: function () {","        var scrollNode = Y.Node.create('<div class=\"bt-container-scroll\"></div>'),","            srcNode = this.get('srcNode'),","            headerNode = this.get('headerNode'),","            bodyNode = this.get('bodyNode'),","            footerNode = this.get('footerNode'),","            scrollView = new Y.ScrollView(Y.merge(this.get('cfgScroll'), {","                srcNode: scrollNode","            }));","","        this.set('scrollNode', scrollNode);","        this.set('scrollView', scrollView);","","        srcNode.append(scrollNode);","        scrollNode.append(headerNode);","        scrollNode.append(bodyNode);","        scrollNode.append(footerNode);","        scrollView.render();","","        // When HTML_PARSER running, there was no scrollView,","        // so we trigger value setter function again here.","        this.set_again('headerFixed');","        this.set_again('footerFixed');","        this.set_again('translate3D');","        this.set_again('nativeScroll');","    },","","    /**","     * sync width of the scrollView with self","     *","     * @method _syncScrollWidth","     * @private","     */","    _syncScrollWidth: function (E) {","        var scroll = this.get('scrollView');","","        if (scroll) {","            scroll.set('width', E.newVal);","        }","    },","","    /**","     * Calculate and refresh height of the scrollView.","     *","     * @method _syncScrollHeight","     * @protected","     */","    _syncScrollHeight: function () {","        var height = this.get('height'),","            footer,","            H,","            P,","            scroll = this.get('scrollView');","","        if (!scroll || !height) {","            return;","        }","","        Y.later(1, this, function () {","            height -= scroll.get('boundingBox').get('offsetTop');","            footer = this.get('footerNode');","","            if (this.get('footerFixed')) {","                height -= footer.get('clientHeight');","            } else {","                if (this.get('fullHeight')) {","                    P = footer.previous();","                    H = height - P.getY() - footer.get('clientHeight');","                    if (H > P.get('offsetHeight')) {","                        P.set('offsetHeight', H);","                    }","                }","            }","            scroll.set('height', height);","        });","    }","}, {","    /**","     * Static property used to define the default attribute configuration.","     *","     * @property ATTRS","     * @protected","     * @static","     * @type Object","     */","    ATTRS: {","        /**","         * use browser native scroll and css3 position fixed","         *","         * @attribute nativeScroll","         * @type Boolean","         * @default false","         */","        nativeScroll: {","            value: false,","            validator: Y.Lang.isBoolean,","            setter: function (V) {","                var sv = this.get('scrollView');","","                if (sv) {","                    sv.set('disabled', V);","                    if (V) {","                        sv.unplug(Y.zui.RAScroll);","                    } else {","                        sv.plug(Y.zui.RAScroll, {horizontal: false, cooperation: true});","                        if (!Y.Bottle.Device.getTouchSupport()) {","                            sv.plug(Y.zui.ScrollHelper);","                        }","                    }","                }","","                handleFixPos.apply(this, [true, this.get('headerFixed'), V]);","                handleFixPos.apply(this, [false, this.get('footerFixed'), V]);","                return V;","            }","        },","","        /**","         * header node of the container","         * ","         * @attribute headerNode","         * @type Node","         * @writeOnce ","         * @default undefined","         */","        headerNode: {","            value: undefined,","            writeOnce: true,","            setter: function (node) {","                var N = Y.one(node);","                if (N) {","                    N.addClass('bt-header');","                    this.set('headerFixed', N.getData('position') === 'fixed');","                    return N;","                }","            }","        },","","        /**","         * footer node of the container","         *","         * @attribute footerNode","         * @type Node","         * @writeOnce ","         * @default undefined","         */","        footerNode: {","            value: undefined,","            writeOnce: true,","            setter: function (node) {","                var N = Y.one(node);","                if (N) {","                    N.addClass('bt-footer');","                    this.set('footerFixed', N.getData('position') === 'fixed');","                    return N;","                }","            }","        },","","        /**","         * body node of the container","         *","         * @attribute bodyNode","         * @type Node","         * @writeOnce ","         * @default undefined","         */","        bodyNode: {","            writeOnce: true","        },","","        /**","         * A new node be created for scrollview. Scroll node contains bodyNode and none 'fixed' headerNode/footerNode.","         *","         * @attribute scrollNode","         * @type Node","         * @writeOnce ","         * @default undefined","         */","        scrollNode: {","            writeOnce: true","        },","","        /**","         * ScrollView in the container","         *","         * @attribute scrollView","         * @type ScrollView","         * @writeOnce ","         * @default undefined","         */","        scrollView: {","            writeOnce: true","        },","","        /**","         * Configuration to create internal scrollView","         *","         * @attribute cfgScroll","         * @type Object","         * @writeOnce ","         * @default {flick: {minDistance: 10, minVelocity: 0.3}}","         */","        cfgScroll: {","            value: {","                flick: {","                    minDistance: 10,","                    minVelocity: 0.3","                }","            },","            writeOnce: true,","            lazyAdd: false","        },","","        /**","         * Boolean indicating if the content size will scale to make the footer can fit to Container buttom.","         *","         * @attribute fullHeight","         * @type Boolean","         * @default true","         */","        fullHeight: {","            value: true,","            validator: Y.Lang.isBoolean","        },","           ","        /**","         * Boolean indicating if hardware acceleration in scrollview","         * animation is disabled.","         *","         * @attribute translate3D","         * @type Boolean","         * @default true","         */","        translate3D: {","            value: true,","            validator: Y.Lang.isBoolean,","            setter: function (V) {","                this.get('scrollNode').toggleClass('bt-translate3d', V);","                return V;","            }","        },","","        /**","         * Boolean indicating if header is fixed.","         *","         * @attribute headerFixed","         * @type Boolean","         * @default false","         */","        headerFixed: {","            value: false,","            validator: Y.Lang.isBoolean,","            setter: function (fixed) {","                handleFixPos.apply(this, [true, fixed]);","                return fixed;","            }","        },","","        /**","         * Boolean indicating if footer is fixed.","         *","         * @attribute footerFixed","         * @type Boolean","         * @default false","         */","        footerFixed: {","            value: false,","            validator: Y.Lang.isBoolean,","            setter: function (fixed) {","                handleFixPos.apply(this, [false, fixed]);","                return fixed;","            }","        }","    },","","    /**","     * Static property used to define the default HTML parsing rules","     *","     * @property HTML_PARSER","     * @protected","     * @static","     * @type Object","     */","    HTML_PARSER: {","        headerNode: '> [data-role=header]',","        bodyNode: '> [data-role=body]',","        footerNode: '> [data-role=footer]',","","        cfgScroll: function (srcNode) {","            try {","                return Y.JSON.parse(srcNode.getData('cfg-scroll'));","            } catch (e) {","            }","        },","","        fullHeight: function (srcNode) {","            if (srcNode.getData('full-height') === 'false') {","                return false;","            }","            return true;","        },","","        translate3D: function (srcNode) {","            if (srcNode.getData('translate3d') === 'false') {","                return false;","            }","            return true;","        }","    }","});","","","}, '@VERSION@' ,{requires:['scrollview', 'widget-child', 'json-parse', 'gallery-zui-attribute', 'gallery-zui-rascroll', 'gallery-zui-scrollhelper', 'gallery-bt-device']});"];
_yuitest_coverage["/build/gallery-bt-container/gallery-bt-container.js"].lines = {"1":0,"8":0,"13":0,"17":0,"18":0,"20":0,"21":0,"28":0,"29":0,"33":0,"35":0,"50":0,"59":0,"66":0,"68":0,"69":0,"72":0,"76":0,"85":0,"86":0,"88":0,"89":0,"90":0,"91":0,"92":0,"96":0,"97":0,"98":0,"99":0,"109":0,"111":0,"112":0,"123":0,"129":0,"130":0,"133":0,"134":0,"135":0,"137":0,"138":0,"140":0,"141":0,"142":0,"143":0,"144":0,"148":0,"172":0,"174":0,"175":0,"176":0,"177":0,"179":0,"180":0,"181":0,"186":0,"187":0,"188":0,"204":0,"205":0,"206":0,"207":0,"208":0,"225":0,"226":0,"227":0,"228":0,"229":0,"313":0,"314":0,"329":0,"330":0,"345":0,"346":0,"365":0,"366":0,"372":0,"373":0,"375":0,"379":0,"380":0,"382":0};
_yuitest_coverage["/build/gallery-bt-container/gallery-bt-container.js"].functions = {"handleFixPos:12":0,"initializer:51":0,"destructor:65":0,"renderUI:75":0,"_syncScrollWidth:108":0,"(anonymous 2):133":0,"_syncScrollHeight:122":0,"setter:171":0,"setter:203":0,"setter:224":0,"setter:312":0,"setter:328":0,"setter:344":0,"cfgScroll:364":0,"fullHeight:371":0,"translate3D:378":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bt-container/gallery-bt-container.js"].coveredLines = 81;
_yuitest_coverage["/build/gallery-bt-container/gallery-bt-container.js"].coveredFunctions = 17;
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 1);
YUI.add('gallery-bt-container', function(Y) {

/**
 * This module provides Container Widget which can handle scrollView with/without header/footer.
 * 
 * @module gallery-bt-container
 */
_yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 8);
var HEIGHT_CHANGE = 'heightChange',
    WIDTH_CHANGE = 'widthChange',
    fixedPos = Y.Bottle.Device.getPositionFixedSupport(),

    handleFixPos = function (header, fixed, nativeScroll) {
        _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "handleFixPos", 12);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 13);
var node,
            pfix = fixed && fixedPos,
            ns = (nativeScroll !== undefined) ? nativeScroll : this.get('nativeScroll');

        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 17);
if (this.get('scrollView')) {
            _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 18);
node = this.get(header ? 'headerNode' : 'footerNode');

            _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 20);
if (node) {
                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 21);
node.setStyles({
                    position: (ns && pfix) ? 'fixed' : '',
                    top: (header && ns && pfix) ? 0 : '',
                    bottom: (!header && ns && pfix) ? 0 : '',
                    zIndex: (ns && pfix) ? 50 : ''
                });

                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 28);
if (fixedPos) {
                    _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 29);
this.get('scrollView').get('boundingBox').setStyle(header ? 'marginTop' : 'marginBottom', (fixed && ns) ? (node.get('offsetHeight') + 'px') : 0);
                }
            }

            _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 33);
this.get(fixed ? 'srcNode' : 'scrollNode').insert(node, header ? 0 : undefined);

            _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 35);
this._syncScrollHeight();
        }
    };

/**
 * A class for constructing container instances.
 *
 * @class Container
 * @param [config] {Object} Object literal with initial attribute values
 * @extends Widget
 * @namespace Bottle
 * @uses WidgetChild
 * @uses Y.zui.Attribute
 * @constructor
 */
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 50);
Y.namespace('Bottle').Container = Y.Base.create('btcontainer', Y.Widget, [Y.WidgetChild, Y.zui.Attribute], {
    initializer: function (config) {
        /**
         * internal eventhandlers, keep for destructor
         *
         * @property _btcEventHandlers
         * @type EventHandle
         * @private
         */
        _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "initializer", 51);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 59);
this._btcEventHandlers = new Y.EventHandle([
            this.after(HEIGHT_CHANGE, this._syncScrollHeight),
            this.on(WIDTH_CHANGE, this._syncScrollWidth)
        ]);
    },

    destructor: function () {
        _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "destructor", 65);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 66);
this._btcEventHandlers.detach();

        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 68);
if (this.get('rendered')) {
            _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 69);
this.get('scrollView').destroy(true);
        }

        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 72);
delete this._eventHandlers;
    },

    renderUI: function () {
        _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "renderUI", 75);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 76);
var scrollNode = Y.Node.create('<div class="bt-container-scroll"></div>'),
            srcNode = this.get('srcNode'),
            headerNode = this.get('headerNode'),
            bodyNode = this.get('bodyNode'),
            footerNode = this.get('footerNode'),
            scrollView = new Y.ScrollView(Y.merge(this.get('cfgScroll'), {
                srcNode: scrollNode
            }));

        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 85);
this.set('scrollNode', scrollNode);
        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 86);
this.set('scrollView', scrollView);

        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 88);
srcNode.append(scrollNode);
        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 89);
scrollNode.append(headerNode);
        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 90);
scrollNode.append(bodyNode);
        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 91);
scrollNode.append(footerNode);
        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 92);
scrollView.render();

        // When HTML_PARSER running, there was no scrollView,
        // so we trigger value setter function again here.
        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 96);
this.set_again('headerFixed');
        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 97);
this.set_again('footerFixed');
        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 98);
this.set_again('translate3D');
        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 99);
this.set_again('nativeScroll');
    },

    /**
     * sync width of the scrollView with self
     *
     * @method _syncScrollWidth
     * @private
     */
    _syncScrollWidth: function (E) {
        _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "_syncScrollWidth", 108);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 109);
var scroll = this.get('scrollView');

        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 111);
if (scroll) {
            _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 112);
scroll.set('width', E.newVal);
        }
    },

    /**
     * Calculate and refresh height of the scrollView.
     *
     * @method _syncScrollHeight
     * @protected
     */
    _syncScrollHeight: function () {
        _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "_syncScrollHeight", 122);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 123);
var height = this.get('height'),
            footer,
            H,
            P,
            scroll = this.get('scrollView');

        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 129);
if (!scroll || !height) {
            _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 130);
return;
        }

        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 133);
Y.later(1, this, function () {
            _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "(anonymous 2)", 133);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 134);
height -= scroll.get('boundingBox').get('offsetTop');
            _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 135);
footer = this.get('footerNode');

            _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 137);
if (this.get('footerFixed')) {
                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 138);
height -= footer.get('clientHeight');
            } else {
                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 140);
if (this.get('fullHeight')) {
                    _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 141);
P = footer.previous();
                    _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 142);
H = height - P.getY() - footer.get('clientHeight');
                    _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 143);
if (H > P.get('offsetHeight')) {
                        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 144);
P.set('offsetHeight', H);
                    }
                }
            }
            _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 148);
scroll.set('height', height);
        });
    }
}, {
    /**
     * Static property used to define the default attribute configuration.
     *
     * @property ATTRS
     * @protected
     * @static
     * @type Object
     */
    ATTRS: {
        /**
         * use browser native scroll and css3 position fixed
         *
         * @attribute nativeScroll
         * @type Boolean
         * @default false
         */
        nativeScroll: {
            value: false,
            validator: Y.Lang.isBoolean,
            setter: function (V) {
                _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "setter", 171);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 172);
var sv = this.get('scrollView');

                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 174);
if (sv) {
                    _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 175);
sv.set('disabled', V);
                    _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 176);
if (V) {
                        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 177);
sv.unplug(Y.zui.RAScroll);
                    } else {
                        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 179);
sv.plug(Y.zui.RAScroll, {horizontal: false, cooperation: true});
                        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 180);
if (!Y.Bottle.Device.getTouchSupport()) {
                            _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 181);
sv.plug(Y.zui.ScrollHelper);
                        }
                    }
                }

                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 186);
handleFixPos.apply(this, [true, this.get('headerFixed'), V]);
                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 187);
handleFixPos.apply(this, [false, this.get('footerFixed'), V]);
                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 188);
return V;
            }
        },

        /**
         * header node of the container
         * 
         * @attribute headerNode
         * @type Node
         * @writeOnce 
         * @default undefined
         */
        headerNode: {
            value: undefined,
            writeOnce: true,
            setter: function (node) {
                _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "setter", 203);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 204);
var N = Y.one(node);
                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 205);
if (N) {
                    _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 206);
N.addClass('bt-header');
                    _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 207);
this.set('headerFixed', N.getData('position') === 'fixed');
                    _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 208);
return N;
                }
            }
        },

        /**
         * footer node of the container
         *
         * @attribute footerNode
         * @type Node
         * @writeOnce 
         * @default undefined
         */
        footerNode: {
            value: undefined,
            writeOnce: true,
            setter: function (node) {
                _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "setter", 224);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 225);
var N = Y.one(node);
                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 226);
if (N) {
                    _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 227);
N.addClass('bt-footer');
                    _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 228);
this.set('footerFixed', N.getData('position') === 'fixed');
                    _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 229);
return N;
                }
            }
        },

        /**
         * body node of the container
         *
         * @attribute bodyNode
         * @type Node
         * @writeOnce 
         * @default undefined
         */
        bodyNode: {
            writeOnce: true
        },

        /**
         * A new node be created for scrollview. Scroll node contains bodyNode and none 'fixed' headerNode/footerNode.
         *
         * @attribute scrollNode
         * @type Node
         * @writeOnce 
         * @default undefined
         */
        scrollNode: {
            writeOnce: true
        },

        /**
         * ScrollView in the container
         *
         * @attribute scrollView
         * @type ScrollView
         * @writeOnce 
         * @default undefined
         */
        scrollView: {
            writeOnce: true
        },

        /**
         * Configuration to create internal scrollView
         *
         * @attribute cfgScroll
         * @type Object
         * @writeOnce 
         * @default {flick: {minDistance: 10, minVelocity: 0.3}}
         */
        cfgScroll: {
            value: {
                flick: {
                    minDistance: 10,
                    minVelocity: 0.3
                }
            },
            writeOnce: true,
            lazyAdd: false
        },

        /**
         * Boolean indicating if the content size will scale to make the footer can fit to Container buttom.
         *
         * @attribute fullHeight
         * @type Boolean
         * @default true
         */
        fullHeight: {
            value: true,
            validator: Y.Lang.isBoolean
        },
           
        /**
         * Boolean indicating if hardware acceleration in scrollview
         * animation is disabled.
         *
         * @attribute translate3D
         * @type Boolean
         * @default true
         */
        translate3D: {
            value: true,
            validator: Y.Lang.isBoolean,
            setter: function (V) {
                _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "setter", 312);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 313);
this.get('scrollNode').toggleClass('bt-translate3d', V);
                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 314);
return V;
            }
        },

        /**
         * Boolean indicating if header is fixed.
         *
         * @attribute headerFixed
         * @type Boolean
         * @default false
         */
        headerFixed: {
            value: false,
            validator: Y.Lang.isBoolean,
            setter: function (fixed) {
                _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "setter", 328);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 329);
handleFixPos.apply(this, [true, fixed]);
                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 330);
return fixed;
            }
        },

        /**
         * Boolean indicating if footer is fixed.
         *
         * @attribute footerFixed
         * @type Boolean
         * @default false
         */
        footerFixed: {
            value: false,
            validator: Y.Lang.isBoolean,
            setter: function (fixed) {
                _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "setter", 344);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 345);
handleFixPos.apply(this, [false, fixed]);
                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 346);
return fixed;
            }
        }
    },

    /**
     * Static property used to define the default HTML parsing rules
     *
     * @property HTML_PARSER
     * @protected
     * @static
     * @type Object
     */
    HTML_PARSER: {
        headerNode: '> [data-role=header]',
        bodyNode: '> [data-role=body]',
        footerNode: '> [data-role=footer]',

        cfgScroll: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "cfgScroll", 364);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 365);
try {
                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 366);
return Y.JSON.parse(srcNode.getData('cfg-scroll'));
            } catch (e) {
            }
        },

        fullHeight: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "fullHeight", 371);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 372);
if (srcNode.getData('full-height') === 'false') {
                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 373);
return false;
            }
            _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 375);
return true;
        },

        translate3D: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "translate3D", 378);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 379);
if (srcNode.getData('translate3d') === 'false') {
                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 380);
return false;
            }
            _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 382);
return true;
        }
    }
});


}, '@VERSION@' ,{requires:['scrollview', 'widget-child', 'json-parse', 'gallery-zui-attribute', 'gallery-zui-rascroll', 'gallery-zui-scrollhelper', 'gallery-bt-device']});
