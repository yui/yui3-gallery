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
_yuitest_coverage["/build/gallery-bt-container/gallery-bt-container.js"].code=["YUI.add('gallery-bt-container', function(Y) {","","/**"," * This module provides Container Widget which can handle scrollView with/without header/footer."," * "," * @module gallery-bt-container"," */","var HEIGHT_CHANGE = 'heightChange',","    WIDTH_CHANGE = 'widthChange',","","    handleFixPos = function (header, fixed) {","        if (this.get('scrollView')) {","            this.get(fixed ? 'srcNode' : 'scrollNode').insert(this.get(header ? 'headerNode' : 'footerNode'), header ? 0 : undefined);","            this._syncScrollHeight();","        }","    };","","/**"," * A class for constructing container instances."," *"," * @class Container"," * @param [config] {Object} Object literal with initial attribute values"," * @extends Widget"," * @namespace Bottle"," * @uses WidgetChild"," * @uses Y.zui.Attribute"," * @constructor"," */","Y.namespace('Bottle').Container = Y.Base.create('btcontainer', Y.Widget, [Y.WidgetChild, Y.zui.Attribute], {","    initializer: function (config) {","        /**","         * internal eventhandlers, keep for destructor","         *","         * @property _btcEventHandlers","         * @type EventHandle","         * @private","         */","        this._btcEventHandlers = new Y.EventHandle([","            this.after(HEIGHT_CHANGE, this._syncScrollHeight),","            this.on(WIDTH_CHANGE, this._syncScrollWidth)","        ]);","    },","","    destructor: function () {","        this._btcEventHandlers.detach();","","        if (this.get('rendered')) {","            this.get('scrollView').destroy(true);","        }","","        delete this._eventHandlers;","    },","","    renderUI: function () {","        var scrollNode = Y.Node.create('<div class=\"bt-container-scroll\"></div>'),","            srcNode = this.get('srcNode'),","            headerNode = this.get('headerNode'),","            bodyNode = this.get('bodyNode'),","            footerNode = this.get('footerNode'),","            scrollView = new Y.ScrollView(Y.merge(this.get('cfgScroll'), {","                srcNode: scrollNode","            })).plug(Y.zui.RAScroll, {horizontal: false, cooperation: true});","","        this.set('scrollNode', scrollNode);","        this.set('scrollView', scrollView);","","        srcNode.append(scrollNode);","        scrollNode.append(headerNode);","        scrollNode.append(bodyNode);","        scrollNode.append(footerNode);","        scrollView.render();","","        // When HTML_PARSER running, there was no scrollView,","        // so we trigger value setter function again here.","        this.set_again('headerFixed');","        this.set_again('footerFixed');","        this.set_again('translate3D');","    },","","    /**","     * sync width of the scrollView with self","     *","     * @method _syncScrollWidth","     * @private","     */","    _syncScrollWidth: function (E) {","        var scroll = this.get('scrollView');","","        if (scroll) {","            scroll.set('width', E.newVal);","        }","    },","","    /**","     * Calculate and refresh height of the scrollView.","     *","     * @method _syncScrollHeight","     * @protected","     */","    _syncScrollHeight: function () {","        var height = this.get('height'),","            scroll = this.get('scrollView');","","        if (!scroll || !height) {","            return;","        }","","        height -= scroll.get('boundingBox').get('offsetTop');","","        if (this.get('footerFixed')) {","            height -= this.get('footerNode').get('clientHeight');","        }","","        scroll.set('height', height);","    }","}, {","    /**","     * Static property used to define the default attribute configuration.","     *","     * @property ATTRS","     * @protected","     * @static","     * @type Object","     */","    ATTRS: {","        /**","         * header node of the container","         * ","         * @attribute headerNode","         * @type Node","         * @writeOnce ","         * @default undefined","         */","        headerNode: {","            value: undefined,","            writeOnce: true,","            setter: function (node) {","                var N = Y.one(node);","                if (N) {","                    N.addClass('bt-header');","                    this.set('headerFixed', N.getData('position') === 'fixed');","                    return N;","                }","            }","        },","","        /**","         * footer node of the container","         *","         * @attribute footerNode","         * @type Node","         * @writeOnce ","         * @default undefined","         */","        footerNode: {","            value: undefined,","            writeOnce: true,","            setter: function (node) {","                var N = Y.one(node);","                if (N) {","                    N.addClass('bt-footer');","                    this.set('footerFixed', N.getData('position') === 'fixed');","                    return N;","                }","            }","        },","","        /**","         * body node of the container","         *","         * @attribute bodyNode","         * @type Node","         * @writeOnce ","         * @default undefined","         */","        bodyNode: {","            writeOnce: true","        },","","        /**","         * A new node be created for scrollview. Scroll node contains bodyNode and none 'fixed' headerNode/footerNode.","         *","         * @attribute scrollNode","         * @type Node","         * @writeOnce ","         * @default undefined","         */","        scrollNode: {","            writeOnce: true","        },","","        /**","         * ScrollView in the container","         *","         * @attribute scrollView","         * @type ScrollView","         * @writeOnce ","         * @default undefined","         */","        scrollView: {","            writeOnce: true","        },","","        /**","         * Configuration to create internal scrollView","         *","         * @attribute cfgScroll","         * @type Object","         * @writeOnce ","         * @default {flick: {minDistance: 10, minVelocity: 0.3}}","         */","        cfgScroll: {","            value: {","                flick: {","                    minDistance: 10,","                    minVelocity: 0.3","                }","            },","            writeOnce: true,","            lazyAdd: false","        },","","        /**","         * Boolean indicating if hardware acceleration in scrollview","         * animation is disabled.","         *","         * @attribute translate3D","         * @type Boolean","         * @default true","         */","        translate3D: {","            value: true,","            validator: Y.Lang.isBoolean,","            setter: function (V) {","                this.get('scrollNode').toggleClass('bt-translate3d', V);","                return V;","            }","        },","","        /**","         * Boolean indicating if header is fixed.","         *","         * @attribute headerFixed","         * @type Boolean","         * @default false","         */","        headerFixed: {","            value: false,","            validator: Y.Lang.isBoolean,","            setter: function (fixed) {","                handleFixPos.apply(this, [true, fixed]);","                return fixed;","            }","        },","","        /**","         * Boolean indicating if footer is fixed.","         *","         * @attribute footerFixed","         * @type Boolean","         * @default false","         */","        footerFixed: {","            value: false,","            validator: Y.Lang.isBoolean,","            setter: function (fixed) {","                handleFixPos.apply(this, [false, fixed]);","                return fixed;","            }","        }","    },","","    /**","     * Static property used to define the default HTML parsing rules","     *","     * @property HTML_PARSER","     * @protected","     * @static","     * @type Object","     */","    HTML_PARSER: {","        headerNode: '> [data-role=header]',","        bodyNode: '> [data-role=body]',","        footerNode: '> [data-role=footer]',","","        cfgScroll: function (srcNode) {","            try {","                return Y.JSON.parse(srcNode.getData('cfg-scroll'));","            } catch (e) {","            }","        },","","        translate3D: function (srcNode) {","            if (srcNode.getData('translate3d') === 'false') {","                return false;","            }","            return true;","        }","    }","});","","","}, '@VERSION@' ,{requires:['scrollview', 'widget-child', 'json-parse', 'gallery-zui-attribute', 'gallery-zui-rascroll']});"];
_yuitest_coverage["/build/gallery-bt-container/gallery-bt-container.js"].lines = {"1":0,"8":0,"12":0,"13":0,"14":0,"29":0,"38":0,"45":0,"47":0,"48":0,"51":0,"55":0,"64":0,"65":0,"67":0,"68":0,"69":0,"70":0,"71":0,"75":0,"76":0,"77":0,"87":0,"89":0,"90":0,"101":0,"104":0,"105":0,"108":0,"110":0,"111":0,"114":0,"138":0,"139":0,"140":0,"141":0,"142":0,"159":0,"160":0,"161":0,"162":0,"163":0,"235":0,"236":0,"251":0,"252":0,"267":0,"268":0,"287":0,"288":0,"294":0,"295":0,"297":0};
_yuitest_coverage["/build/gallery-bt-container/gallery-bt-container.js"].functions = {"handleFixPos:11":0,"initializer:30":0,"destructor:44":0,"renderUI:54":0,"_syncScrollWidth:86":0,"_syncScrollHeight:100":0,"setter:137":0,"setter:158":0,"setter:234":0,"setter:250":0,"setter:266":0,"cfgScroll:286":0,"translate3D:293":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bt-container/gallery-bt-container.js"].coveredLines = 53;
_yuitest_coverage["/build/gallery-bt-container/gallery-bt-container.js"].coveredFunctions = 14;
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

    handleFixPos = function (header, fixed) {
        _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "handleFixPos", 11);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 12);
if (this.get('scrollView')) {
            _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 13);
this.get(fixed ? 'srcNode' : 'scrollNode').insert(this.get(header ? 'headerNode' : 'footerNode'), header ? 0 : undefined);
            _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 14);
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
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 29);
Y.namespace('Bottle').Container = Y.Base.create('btcontainer', Y.Widget, [Y.WidgetChild, Y.zui.Attribute], {
    initializer: function (config) {
        /**
         * internal eventhandlers, keep for destructor
         *
         * @property _btcEventHandlers
         * @type EventHandle
         * @private
         */
        _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "initializer", 30);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 38);
this._btcEventHandlers = new Y.EventHandle([
            this.after(HEIGHT_CHANGE, this._syncScrollHeight),
            this.on(WIDTH_CHANGE, this._syncScrollWidth)
        ]);
    },

    destructor: function () {
        _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "destructor", 44);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 45);
this._btcEventHandlers.detach();

        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 47);
if (this.get('rendered')) {
            _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 48);
this.get('scrollView').destroy(true);
        }

        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 51);
delete this._eventHandlers;
    },

    renderUI: function () {
        _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "renderUI", 54);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 55);
var scrollNode = Y.Node.create('<div class="bt-container-scroll"></div>'),
            srcNode = this.get('srcNode'),
            headerNode = this.get('headerNode'),
            bodyNode = this.get('bodyNode'),
            footerNode = this.get('footerNode'),
            scrollView = new Y.ScrollView(Y.merge(this.get('cfgScroll'), {
                srcNode: scrollNode
            })).plug(Y.zui.RAScroll, {horizontal: false, cooperation: true});

        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 64);
this.set('scrollNode', scrollNode);
        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 65);
this.set('scrollView', scrollView);

        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 67);
srcNode.append(scrollNode);
        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 68);
scrollNode.append(headerNode);
        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 69);
scrollNode.append(bodyNode);
        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 70);
scrollNode.append(footerNode);
        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 71);
scrollView.render();

        // When HTML_PARSER running, there was no scrollView,
        // so we trigger value setter function again here.
        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 75);
this.set_again('headerFixed');
        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 76);
this.set_again('footerFixed');
        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 77);
this.set_again('translate3D');
    },

    /**
     * sync width of the scrollView with self
     *
     * @method _syncScrollWidth
     * @private
     */
    _syncScrollWidth: function (E) {
        _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "_syncScrollWidth", 86);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 87);
var scroll = this.get('scrollView');

        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 89);
if (scroll) {
            _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 90);
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
        _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "_syncScrollHeight", 100);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 101);
var height = this.get('height'),
            scroll = this.get('scrollView');

        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 104);
if (!scroll || !height) {
            _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 105);
return;
        }

        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 108);
height -= scroll.get('boundingBox').get('offsetTop');

        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 110);
if (this.get('footerFixed')) {
            _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 111);
height -= this.get('footerNode').get('clientHeight');
        }

        _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 114);
scroll.set('height', height);
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
                _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "setter", 137);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 138);
var N = Y.one(node);
                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 139);
if (N) {
                    _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 140);
N.addClass('bt-header');
                    _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 141);
this.set('headerFixed', N.getData('position') === 'fixed');
                    _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 142);
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
                _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "setter", 158);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 159);
var N = Y.one(node);
                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 160);
if (N) {
                    _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 161);
N.addClass('bt-footer');
                    _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 162);
this.set('footerFixed', N.getData('position') === 'fixed');
                    _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 163);
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
                _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "setter", 234);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 235);
this.get('scrollNode').toggleClass('bt-translate3d', V);
                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 236);
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
                _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "setter", 250);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 251);
handleFixPos.apply(this, [true, fixed]);
                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 252);
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
                _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "setter", 266);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 267);
handleFixPos.apply(this, [false, fixed]);
                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 268);
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
            _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "cfgScroll", 286);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 287);
try {
                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 288);
return Y.JSON.parse(srcNode.getData('cfg-scroll'));
            } catch (e) {
            }
        },

        translate3D: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-container/gallery-bt-container.js", "translate3D", 293);
_yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 294);
if (srcNode.getData('translate3d') === 'false') {
                _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 295);
return false;
            }
            _yuitest_coverline("/build/gallery-bt-container/gallery-bt-container.js", 297);
return true;
        }
    }
});


}, '@VERSION@' ,{requires:['scrollview', 'widget-child', 'json-parse', 'gallery-zui-attribute', 'gallery-zui-rascroll']});
