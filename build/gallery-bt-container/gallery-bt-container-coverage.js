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
_yuitest_coverage["/build/gallery-bt-container/gallery-bt-container.js"].code=["YUI.add('gallery-bt-container', function(Y) {","","/**"," * This module provides Container Widget which can handle scrollView with/without header/footer."," * "," * @module gallery-bt-container"," */","var HEIGHT_CHANGE = 'heightChange',","    WIDTH_CHANGE = 'widthChange',","    fixedPos = Y.Bottle.Device.getPositionFixedSupport(),","","    handleFixPos = function (header, fixed, nativeScroll) {","        var node,","            pfix = fixed && fixedPos,","            ns = (nativeScroll !== undefined) ? nativeScroll : this.get('nativeScroll');","","        if (this.get('scrollView')) {","            node = this.get(header ? 'headerNode' : 'footerNode');","","            if (node) {","                node.setStyles({","                    position: (ns && pfix) ? 'fixed' : '',","                    top: (header && ns && pfix) ? 0 : '',","                    bottom: (!header && ns && pfix) ? 0 : '',","                    zIndex: (ns && pfix) ? 50 : ''","                });","","                if (fixedPos) {","                    this.get('scrollView').get('boundingBox').setStyle(header ? 'marginTop' : 'marginBottom', (fixed && ns) ? (node.get('offsetHeight') + 'px') : 0);","                }","            }","","            this.get(fixed ? 'srcNode' : 'scrollNode').insert(node, header ? 0 : undefined);","","            this._syncScrollHeight();","        }","    };","","/**"," * A class for constructing container instances."," *"," * @class Container"," * @param [config] {Object} Object literal with initial attribute values"," * @extends Widget"," * @namespace Bottle"," * @uses WidgetChild"," * @uses Y.zui.Attribute"," * @constructor"," */","Y.namespace('Bottle').Container = Y.Base.create('btcontainer', Y.Widget, [Y.WidgetChild, Y.zui.Attribute], {","    initializer: function (config) {","        /**","         * internal eventhandlers, keep for destructor","         *","         * @property _btcEventHandlers","         * @type EventHandle","         * @private","         */","        this._btcEventHandlers = new Y.EventHandle([","            this.after(HEIGHT_CHANGE, this._syncScrollHeight),","            this.on(WIDTH_CHANGE, this._syncScrollWidth)","        ]);","    },","","    destructor: function () {","        this._btcEventHandlers.detach();","","        if (this.get('rendered')) {","            this.get('scrollView').destroy(true);","        }","","        delete this._eventHandlers;","    },","","    renderUI: function () {","        var scrollNode = Y.Node.create('<div class=\"bt-container-scroll\"></div>'),","            srcNode = this.get('srcNode'),","            headerNode = this.get('headerNode'),","            bodyNode = this.get('bodyNode'),","            footerNode = this.get('footerNode'),","            scrollView = new Y.ScrollView(Y.merge(this.get('cfgScroll'), {","                srcNode: scrollNode","            }));","","        this.set('scrollNode', scrollNode);","        this.set('scrollView', scrollView);","","        srcNode.append(scrollNode);","        scrollNode.append(headerNode);","        scrollNode.append(bodyNode);","        scrollNode.append(footerNode);","        scrollView.render();","","        // When HTML_PARSER running, there was no scrollView,","        // so we trigger value setter function again here.","        this.set_again('headerFixed');","        this.set_again('footerFixed');","        this.set_again('translate3D');","        this.set_again('nativeScroll');","    },","","    /**","     * sync width of the scrollView with self","     *","     * @method _syncScrollWidth","     * @private","     */","    _syncScrollWidth: function (E) {","        var scroll = this.get('scrollView');","","        if (scroll) {","            scroll.set('width', E.newVal);","        }","    },","","    /**","     * Calculate and refresh height of the scrollView.","     *","     * @method _syncScrollHeight","     * @protected","     */","    _syncScrollHeight: function () {","        var height = this.get('height'),","            scroll = this.get('scrollView');","","        if (!scroll || !height) {","            return;","        }","","        Y.later(1, this, function () {","            height -= scroll.get('boundingBox').get('offsetTop');","","            if (this.get('footerFixed')) {","                height -= this.get('footerNode').get('clientHeight');","            }","            scroll.set('height', height);","        });","    }","}, {","    /**","     * Static property used to define the default attribute configuration.","     *","     * @property ATTRS","     * @protected","     * @static","     * @type Object","     */","    ATTRS: {","        /**","         * use browser native scroll and css3 position fixed","         *","         * @attribute nativeScroll","         * @type Boolean","         * @default false","         */","        nativeScroll: {","            value: false,","            validator: Y.Lang.isBoolean,","            setter: function (V) {","                var sv = this.get('scrollView');","","                if (sv) {","                    sv.set('disabled', V);","                    if (V) {","                        sv.unplug(Y.zui.RAScroll);","                    } else {","                        sv.plug(Y.zui.RAScroll, {horizontal: false, cooperation: true});","                        if (!Y.Bottle.Device.getTouchSupport()) {","                            sv.plug(Y.zui.ScrollHelper);","                        }","                    }","                }","","                handleFixPos.apply(this, [true, this.get('headerFixed'), V]);","                handleFixPos.apply(this, [false, this.get('footerFixed'), V]);","                return V;","            }","        },","","        /**","         * header node of the container","         * ","         * @attribute headerNode","         * @type Node","         * @writeOnce ","         * @default undefined","         */","        headerNode: {","            value: undefined,","            writeOnce: true,","            setter: function (node) {","                var N = Y.one(node);","                if (N) {","                    N.addClass('bt-header');","                    this.set('headerFixed', N.getData('position') === 'fixed');","                    return N;","                }","            }","        },","","        /**","         * footer node of the container","         *","         * @attribute footerNode","         * @type Node","         * @writeOnce ","         * @default undefined","         */","        footerNode: {","            value: undefined,","            writeOnce: true,","            setter: function (node) {","                var N = Y.one(node);","                if (N) {","                    N.addClass('bt-footer');","                    this.set('footerFixed', N.getData('position') === 'fixed');","                    return N;","                }","            }","        },","","        /**","         * body node of the container","         *","         * @attribute bodyNode","         * @type Node","         * @writeOnce ","         * @default undefined","         */","        bodyNode: {","            writeOnce: true","        },","","        /**","         * A new node be created for scrollview. Scroll node contains bodyNode and none 'fixed' headerNode/footerNode.","         *","         * @attribute scrollNode","         * @type Node","         * @writeOnce ","         * @default undefined","         */","        scrollNode: {","            writeOnce: true","        },","","        /**","         * ScrollView in the container","         *","         * @attribute scrollView","         * @type ScrollView","         * @writeOnce ","         * @default undefined","         */","        scrollView: {","            writeOnce: true","        },","","        /**","         * Configuration to create internal scrollView","         *","         * @attribute cfgScroll","         * @type Object","         * @writeOnce ","         * @default {flick: {minDistance: 10, minVelocity: 0.3}}","         */","        cfgScroll: {","            value: {","                flick: {","                    minDistance: 10,","                    minVelocity: 0.3","                }","            },","            writeOnce: true,","            lazyAdd: false","        },","","        /**","         * Boolean indicating if hardware acceleration in scrollview","         * animation is disabled.","         *","         * @attribute translate3D","         * @type Boolean","         * @default true","         */","        translate3D: {","            value: true,","            validator: Y.Lang.isBoolean,","            setter: function (V) {","                this.get('scrollNode').toggleClass('bt-translate3d', V);","                return V;","            }","        },","","        /**","         * Boolean indicating if header is fixed.","         *","         * @attribute headerFixed","         * @type Boolean","         * @default false","         */","        headerFixed: {","            value: false,","            validator: Y.Lang.isBoolean,","            setter: function (fixed) {","                handleFixPos.apply(this, [true, fixed]);","                return fixed;","            }","        },","","        /**","         * Boolean indicating if footer is fixed.","         *","         * @attribute footerFixed","         * @type Boolean","         * @default false","         */","        footerFixed: {","            value: false,","            validator: Y.Lang.isBoolean,","            setter: function (fixed) {","                handleFixPos.apply(this, [false, fixed]);","                return fixed;","            }","        }","    },","","    /**","     * Static property used to define the default HTML parsing rules","     *","     * @property HTML_PARSER","     * @protected","     * @static","     * @type Object","     */","    HTML_PARSER: {","        headerNode: '> [data-role=header]',","        bodyNode: '> [data-role=body]',","        footerNode: '> [data-role=footer]',","","        cfgScroll: function (srcNode) {","            try {","                return Y.JSON.parse(srcNode.getData('cfg-scroll'));","            } catch (e) {","            }","        },","","        translate3D: function (srcNode) {","            if (srcNode.getData('translate3d') === 'false') {","                return false;","            }","            return true;","        }","    }","});","","","}, '@VERSION@' ,{requires:['scrollview', 'widget-child', 'json-parse', 'gallery-zui-attribute', 'gallery-zui-rascroll', 'gallery-zui-scrollhelper', 'gallery-bt-device']});"];
_yuitest_coverage["/build/gallery-bt-container/gallery-bt-container.js"].lines = {"1":0,"8":0,"13":0,"17":0,"18":0,"20":0,"21":0,"28":0,"29":0,"33":0,"35":0,"50":0,"59":0,"66":0,"68":0,"69":0,"72":0,"76":0,"85":0,"86":0,"88":0,"89":0,"90":0,"91":0,"92":0,"96":0,"97":0,"98":0,"99":0,"109":0,"111":0,"112":0,"123":0,"126":0,"127":0,"130":0,"131":0,"133":0,"134":0,"136":0,"160":0,"162":0,"163":0,"164":0,"165":0,"167":0,"168":0,"169":0,"174":0,"175":0,"176":0,"192":0,"193":0,"194":0,"195":0,"196":0,"213":0,"214":0,"215":0,"216":0,"217":0,"289":0,"290":0,"305":0,"306":0,"321":0,"322":0,"341":0,"342":0,"348":0,"349":0,"351":0};
_yuitest_coverage["/build/gallery-bt-container/gallery-bt-container.js"].functions = {"handleFixPos:12":0,"initializer:51":0,"destructor:65":0,"renderUI:75":0,"_syncScrollWidth:108":0,"(anonymous 2):130":0,"_syncScrollHeight:122":0,"setter:159":0,"setter:191":0,"setter:212":0,"setter:288":0,"setter:304":0,"setter:320":0,"cfgScroll:340":0,"translate3D:347":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bt-container/gallery-bt-container.js"].coveredLines = 72;
_yuitest_coverage["/build/gallery-bt-container/gallery-bt-container.js"].coveredFunctions = 16;
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
            scroll = this.get('scrollView');

        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 126);
if (!scroll || !height) {
            _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 127);
return;
        }

        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 130);
Y.later(1, this, function () {
            _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "(anonymous 2)", 130);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 131);
height -= scroll.get('boundingBox').get('offsetTop');

            _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 133);
if (this.get('footerFixed')) {
                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 134);
height -= this.get('footerNode').get('clientHeight');
            }
            _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 136);
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
                _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "setter", 159);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 160);
var sv = this.get('scrollView');

                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 162);
if (sv) {
                    _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 163);
sv.set('disabled', V);
                    _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 164);
if (V) {
                        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 165);
sv.unplug(Y.zui.RAScroll);
                    } else {
                        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 167);
sv.plug(Y.zui.RAScroll, {horizontal: false, cooperation: true});
                        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 168);
if (!Y.Bottle.Device.getTouchSupport()) {
                            _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 169);
sv.plug(Y.zui.ScrollHelper);
                        }
                    }
                }

                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 174);
handleFixPos.apply(this, [true, this.get('headerFixed'), V]);
                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 175);
handleFixPos.apply(this, [false, this.get('footerFixed'), V]);
                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 176);
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
                _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "setter", 191);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 192);
var N = Y.one(node);
                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 193);
if (N) {
                    _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 194);
N.addClass('bt-header');
                    _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 195);
this.set('headerFixed', N.getData('position') === 'fixed');
                    _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 196);
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
                _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "setter", 212);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 213);
var N = Y.one(node);
                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 214);
if (N) {
                    _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 215);
N.addClass('bt-footer');
                    _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 216);
this.set('footerFixed', N.getData('position') === 'fixed');
                    _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 217);
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
                _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "setter", 288);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 289);
this.get('scrollNode').toggleClass('bt-translate3d', V);
                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 290);
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
                _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "setter", 304);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 305);
handleFixPos.apply(this, [true, fixed]);
                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 306);
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
                _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "setter", 320);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 321);
handleFixPos.apply(this, [false, fixed]);
                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 322);
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
            _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "cfgScroll", 340);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 341);
try {
                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 342);
return Y.JSON.parse(srcNode.getData('cfg-scroll'));
            } catch (e) {
            }
        },

        translate3D: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "translate3D", 347);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 348);
if (srcNode.getData('translate3d') === 'false') {
                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 349);
return false;
            }
            _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 351);
return true;
        }
    }
});


}, '@VERSION@' ,{requires:['scrollview', 'widget-child', 'json-parse', 'gallery-zui-attribute', 'gallery-zui-rascroll', 'gallery-zui-scrollhelper', 'gallery-bt-device']});
