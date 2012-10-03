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
_yuitest_coverage["/build/gallery-bt-pushpop/gallery-bt-pushpop.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-bt-pushpop/gallery-bt-pushpop.js",
    code: []
};
_yuitest_coverage["/build/gallery-bt-pushpop/gallery-bt-pushpop.js"].code=["YUI.add('gallery-bt-pushpop', function(Y) {","","/**"," * Provide PushPop widget extension to handle Container push/pop transition."," *"," * @module gallery-bt-pushpop"," * @static"," */","var RENDERUI = 'renderUI',","","    PUSHPOP = 'pushpop',","","    HEIGHT_CHANGE = 'heightChange',","    WIDTH_CHANGE = 'widthChange',","","    ADDCHILD = 'addChild',","","    UNDERLAY_CFGS = {","        none: 'none',","        'with': 'with',","        after: 1","    },","","    DIRECTIONS = {","        right: [1, 0],","        left: [-1, 0],","        top: [0, -1],","        bottom: [0, 1],","        tr: [1, -1],","        br: [1, 1],","        tl: [-1, -1],","        bl: [-1, 1]","    },","","    moveWidget = function (W, T) {","        W.get('boundingBox').setStyles({","            left: T.left,","            top: T.top","        });","    },","","/**"," * PushPop extension that adds push, pop unshift animation and methods to Widget Parent"," *"," * @class PushPop"," * @namespace Bottle"," * @param [config] {Object} User configuration object"," */","PushPop = function (config) {","    /**","     * internal eventhandlers, keep for destructor","     *","     * @property _bppEventHandlers","     * @type EventHandle","     * @private","     */","    this._bppEventHandlers = new Y.EventHandle([","        Y.after(this._renderUIPushPop, this, RENDERUI),","","        this.before(ADDCHILD, this._beforePPAddChild),","        this.after(ADDCHILD, this._afterPPAddChild),","        this.after(WIDTH_CHANGE, this._afterPPWidthChange),","        this.after(HEIGHT_CHANGE, this._afterPPHeightChange),","        this.on('destroy', this._destroyPushPop)","    ]);","};","","/**"," * Static property used to define the default attribute configuration."," *"," * @property ATTRS"," * @protected"," * @type Object"," * @static"," */","PushPop.ATTRS = {","    /**","     * Default child class","     *","     * @attribute defaultChildType","     * @type Object","     * @default Y.Bottle.Container","     */","    defaultChildType: {","        value: Y.Bottle.Container","    },","","    /**","     * Default css3 selector to add children when rendering","     *","     * @property childQuery","     * @type String","     * @default '> [data-role=container]'","     */","    childQuery: {","        value: '> [data-role=container]',","        writeOnce: true","    },","","    /**","     * Default initial attributes for all children when rendering","     *","     * @property cfgChild","     * @type Object","     * @default {}","     */","    cfgChild: {","        value: {},","        validator: Y.Lang.isObject,","        writeOnce: true","    },","","    /**","     * Underlay animation, can be one of:","     * <dl>","     *     <dt>none</dt><dd>no underlay animation","     *     <dt>with</dt><dd>same time with  push/pop animation</dd>","     *     <dt>after</dt><dd>just after push/pop animation ends</dd>","     *     <dt>{Number}</dt><dd>wait N million seconds after push/pop animation ends</dd>","     * </dl>","     *","     * @attribute underlay","     * @type String","     * @default none","     */","    underlay: {","        value: 'none',","        validator: function (V) {","            return UNDERLAY_CFGS[V] || Y.Lang.isNumber(V);","        },","        setter: function (V) {","            return UNDERLAY_CFGS[V];","        }","    },","","    /**","     * Default transition setting for push pop","     *","     * @attribute ppTrans","     * @type Object","     * @default {dutation: 0.5}","     */","    ppTrans: {","        value: {","            duration: 0.5","        },","        lazyAdd: false,","        validator: Y.Lang.isObject,","        setter: function (cfg) {","            this._updateTransitions(0, cfg);","            return cfg;","        }","    },","","    /**","     * Push direction, can be one of 'right', 'left', 'top', 'bottom', 'tr', 'br', 'tl', 'bl'","     *","     * @attribute pushFrom","     * @type String","     * @default 'right'","     */ ","    pushFrom: {","        value: 'right',","        lazyAdd: false,","        validator: function (D) {","            return DIRECTIONS[D];","        },","        setter: function (D) {","            this._updateTransitions(D);","            return D;","        }","    }","};","","/**"," * Static property used to define the default HTML parsing rules"," *"," * @property HTML_PARSER"," * @protected"," * @static"," * @type Object"," */","PushPop.HTML_PARSER = {","    childQuery: function (srcNode) {","        return srcNode.getData('child-query');","    },","    cfgChild: function (srcNode) {","        try {","            return Y.JSON.parse(srcNode.getData('cfg-child'));","        } catch (e) {","        }","    },","    ppTrans: function (srcNode) {","        try {","            return Y.JSON.parse(srcNode.getData('cfg-pp-trans'));","        } catch (e) {","        }","    },","    pushFrom: function (srcNode) {","        return srcNode.getData('push-from');","    },","    underlay: function (srcNode) {","        return srcNode.getData('underlay');","    }","};","","PushPop.prototype = {","    initializer: function () {","        var srcNode = this.get('srcNode'),","            query = this.get('childQuery'),","            cfg = this.get('cfgChild');","","        if (!query) {","            return;","        }","","        this.get('contentBox').all(query).each(function (O) {","            this.add(Y.merge(cfg, {srcNode: O}));","        }, this);","    },","","    /**","     * do clean up jobs when destroyed","     *","     * @method _destroyPushPop","     * @private","     */    ","    _destroyPushPop: function () {","        this._bppEventHandlers.detach();","        delete this._bppEventHandlers;","    },","","    /**","     * sync one size (height or width) with all children","     *","     * @method _updateTransitions","     * @param [direction] {String} should be one of 'right', 'left', 'top', 'bottom', 'tr', 'br', 'tl', 'bl'. If omitted, current 'pushFrom' attribute will be used","     * @param [transition] {Object} transition config. If omitted, current 'ppTrans' attribute will be used","     * @protected","     */    ","    _updateTransitions: function (direction, transition) {","        var D = direction || this.get('pushFrom'),","            trans = transition || this.get('ppTrans'),","            xy = DIRECTIONS[D];","","        this._PUSHPOP_TRANS = Y.merge(trans, {","            left: xy[0] * this.get('width') + 'px',","            top: xy[1] * this.get('height') + 'px'","        });","","        this._DONE_TRANS = Y.merge(trans, {","            left: 0,","            top: 0","        });","","        this._UNDERLAY_TRANS = Y.merge(trans, {","            left: -xy[0] * this.get('width') + 'px',","            top: -xy[1] * this.get('height') + 'px'","        });","    },","","    /**","     * sync one size (height or width) with all children","     *","     * @method _syncOneSize","     * @param sideName {String} should be 'width' or 'height'","     * @protected","     */    ","    _syncOneSide: function (HW) {","        var hw = this.get(HW);","        this.each(function (O) {","            this.set(HW, hw);","        });","        this._updateTransitions();","    },","","    /**","     * handle child Widget height when self height changed","     *","     * @method _afterPPHeightChange","     * @protected","     */    ","    _afterPPHeightChange: function () {","        this._syncOneSide('height');","    },","","    /**","     * handle child Widget width when self width changed","     *","     * @method _afterPPWidthChange","     * @protected","     */    ","    _afterPPWidthChange: function () {","        this._syncOneSide('width');","    },","","    /**","     * handle add child Widget, if not defaultChildType, cancel add","     *","     * @method _beforePPAddChild","     * @protected","     */    ","    _beforePPAddChild: function (E) {","        if (!Y.instanceOf(E.child, this.get('defaultChildType'))) {","            E.halt();","        }","    },","","    /**","     * handle child Widget, sync size after add","     *","     * @method _afterPPAddChild","     * @protected","     */","    _afterPPAddChild: function (E) {","        this.sync(E.child);","    },","","    /**","     * add proper classname for pushpop","     *","     * @method _renderUIPushPop","     * @protected","     */    ","    _renderUIPushPop: function () {","        this.get('boundingBox').addClass(Y.Widget.getClassName(PUSHPOP));","    },","","    /**","     * sync a widget width and height with self","     *","     * @method sync","     * @param widget {Widget} widget to be synced","     * @chainable","     */","    sync: function (widget) {","        widget.set('width', this.get('width'));","        widget.set('height', this.get('height'));","        return this;","    },","","    /**","     * get top (last) item","     *","     * @method topItem","     * @return {WidgetChild} the top widget child","     */","    topItem: function () {","        return this.item(this.size() - 1);","    },","","    /**","     * get top (last) scrollView","     *","     * @method topScroll","     * @return {ScrollView|undefined} the scrollview inside top widget child. If scrollview can not be found, return undefined.","     */","    topScroll: function () {","        var top = this.topItem();","","        return top ? top.get('scrollView') : undefined;","    },","","    /**","     * sync a widget width and height with self","     *","     * @method getChild","     * @param widget {Widget | Integer} the child widget or index of child","     * @return { mixed } the child widget or undefined","     */","    getChild: function (widget) {","        if (Y.instanceOf(widget, this.get('defaultChildType'))) {","            return widget;","        }","        if (Y.Lang.isNumber(widget)) {","            return this.item(widget);","        }","    },","","    /**","     * move a child widget to a new position","     *","     * @method moveChild","     * @param widget {Widget | Integer} the child widget or index of child","     * @param transition {Object} transition configuration","     * @param [done] {Boolean | Function} When is true, move the child directly. When is a function, callback the function when transition done.","     * @chainable","     */","    moveChild: function (widget, transition, done) {","        var W = this.getChild(widget),","            that = this;","","        if (done === true) {","            moveWidget(W, transition);","        } else {","            if (this.get('visible')) {","                W.get('boundingBox').transition(transition, function () {","                    if (done) {","                        done.apply(that);","                    }","                });","            } else {","                moveWidget(W, transition);","                if (done) {","                    done.apply(that);","                }","            }","        }","        return this;","    },","","    /**","     * push a widget into html, overlap on plugged widget","     *","     * @method push","     * @param widget {Widget} widget to be pushed","     * @chainable","     */","    push: function (widget) {","        var index = this.size() - 1,","            underlay = this.get('underlay');","","        if (underlay == 'with') {","            this.moveChild(index, this._UNDERLAY_TRANS);","        }","","        this.add(widget);","        this.moveChild(widget, this._PUSHPOP_TRANS, true);","","        if (Y.Lang.isNumber(underlay)) {","            return this.moveChild(index, this._UNDERLAY_TRANS, function () {","                Y.later(underlay, this, function () {","                    this.moveChild(widget, this._DONE_TRANS);","                });","            });","        } else {","            return this.moveChild(widget, this._DONE_TRANS);","        }","    },","","    /**","     * pop current widget off html, and remove the widget from PushPop widget","     *","     * @method pop","     * @param [keep] {Boolean} <b>true</b> means do not destroy the widget. Default to destroy the widget after pop animation.","     * @chainable","     */","    pop: function (keep) {","        var index = this.size() - 1,","            widget = this.item(index),","            underlay = this.get('underlay');","","        if (!widget) {","            return this;","        }","","        if (underlay !== 'none') {","            this.moveChild(index - 1, this._UNDERLAY_TRANS, true);","            if ((underlay == 'with') && index) {","                this.moveChild(index - 1, this._DONE_TRANS);","            }","        }","","        return this.moveChild(widget, this._PUSHPOP_TRANS, function () {","            widget.remove();","            if (!keep) {","                widget.destroy(true);","            }","            if (index && Y.Lang.isNumber(underlay)) {","                Y.later(underlay, this, function () {","                    this.moveChild(index - 1, this._DONE_TRANS);","                });","            }","        });","    }","};","","Y.namespace('Bottle').PushPop = PushPop;","","","}, '@VERSION@' ,{requires:['base-build', 'widget-parent', 'gallery-bt-container']});"];
_yuitest_coverage["/build/gallery-bt-pushpop/gallery-bt-pushpop.js"].lines = {"1":0,"9":0,"36":0,"57":0,"76":0,"129":0,"132":0,"150":0,"151":0,"166":0,"169":0,"170":0,"183":0,"185":0,"188":0,"189":0,"194":0,"195":0,"200":0,"203":0,"207":0,"209":0,"213":0,"214":0,"217":0,"218":0,"229":0,"230":0,"242":0,"246":0,"251":0,"256":0,"270":0,"271":0,"272":0,"274":0,"284":0,"294":0,"304":0,"305":0,"316":0,"326":0,"337":0,"338":0,"339":0,"349":0,"359":0,"361":0,"372":0,"373":0,"375":0,"376":0,"390":0,"393":0,"394":0,"396":0,"397":0,"398":0,"399":0,"403":0,"404":0,"405":0,"409":0,"420":0,"423":0,"424":0,"427":0,"428":0,"430":0,"431":0,"432":0,"433":0,"437":0,"449":0,"453":0,"454":0,"457":0,"458":0,"459":0,"460":0,"464":0,"465":0,"466":0,"467":0,"469":0,"470":0,"471":0,"478":0};
_yuitest_coverage["/build/gallery-bt-pushpop/gallery-bt-pushpop.js"].functions = {"moveWidget:35":0,"PushPop:49":0,"validator:128":0,"setter:131":0,"setter:149":0,"validator:165":0,"setter:168":0,"childQuery:184":0,"cfgChild:187":0,"ppTrans:193":0,"pushFrom:199":0,"underlay:202":0,"(anonymous 2):217":0,"initializer:208":0,"_destroyPushPop:228":0,"_updateTransitions:241":0,"(anonymous 3):271":0,"_syncOneSide:269":0,"_afterPPHeightChange:283":0,"_afterPPWidthChange:293":0,"_beforePPAddChild:303":0,"_afterPPAddChild:315":0,"_renderUIPushPop:325":0,"sync:336":0,"topItem:348":0,"topScroll:358":0,"getChild:371":0,"(anonymous 4):397":0,"moveChild:389":0,"(anonymous 6):432":0,"(anonymous 5):431":0,"push:419":0,"(anonymous 8):470":0,"(anonymous 7):464":0,"pop:448":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bt-pushpop/gallery-bt-pushpop.js"].coveredLines = 88;
_yuitest_coverage["/build/gallery-bt-pushpop/gallery-bt-pushpop.js"].coveredFunctions = 36;
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 1);
YUI.add('gallery-bt-pushpop', function(Y) {

/**
 * Provide PushPop widget extension to handle Container push/pop transition.
 *
 * @module gallery-bt-pushpop
 * @static
 */
_yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 9);
var RENDERUI = 'renderUI',

    PUSHPOP = 'pushpop',

    HEIGHT_CHANGE = 'heightChange',
    WIDTH_CHANGE = 'widthChange',

    ADDCHILD = 'addChild',

    UNDERLAY_CFGS = {
        none: 'none',
        'with': 'with',
        after: 1
    },

    DIRECTIONS = {
        right: [1, 0],
        left: [-1, 0],
        top: [0, -1],
        bottom: [0, 1],
        tr: [1, -1],
        br: [1, 1],
        tl: [-1, -1],
        bl: [-1, 1]
    },

    moveWidget = function (W, T) {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "moveWidget", 35);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 36);
W.get('boundingBox').setStyles({
            left: T.left,
            top: T.top
        });
    },

/**
 * PushPop extension that adds push, pop unshift animation and methods to Widget Parent
 *
 * @class PushPop
 * @namespace Bottle
 * @param [config] {Object} User configuration object
 */
PushPop = function (config) {
    /**
     * internal eventhandlers, keep for destructor
     *
     * @property _bppEventHandlers
     * @type EventHandle
     * @private
     */
    _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "PushPop", 49);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 57);
this._bppEventHandlers = new Y.EventHandle([
        Y.after(this._renderUIPushPop, this, RENDERUI),

        this.before(ADDCHILD, this._beforePPAddChild),
        this.after(ADDCHILD, this._afterPPAddChild),
        this.after(WIDTH_CHANGE, this._afterPPWidthChange),
        this.after(HEIGHT_CHANGE, this._afterPPHeightChange),
        this.on('destroy', this._destroyPushPop)
    ]);
};

/**
 * Static property used to define the default attribute configuration.
 *
 * @property ATTRS
 * @protected
 * @type Object
 * @static
 */
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 76);
PushPop.ATTRS = {
    /**
     * Default child class
     *
     * @attribute defaultChildType
     * @type Object
     * @default Y.Bottle.Container
     */
    defaultChildType: {
        value: Y.Bottle.Container
    },

    /**
     * Default css3 selector to add children when rendering
     *
     * @property childQuery
     * @type String
     * @default '> [data-role=container]'
     */
    childQuery: {
        value: '> [data-role=container]',
        writeOnce: true
    },

    /**
     * Default initial attributes for all children when rendering
     *
     * @property cfgChild
     * @type Object
     * @default {}
     */
    cfgChild: {
        value: {},
        validator: Y.Lang.isObject,
        writeOnce: true
    },

    /**
     * Underlay animation, can be one of:
     * <dl>
     *     <dt>none</dt><dd>no underlay animation
     *     <dt>with</dt><dd>same time with  push/pop animation</dd>
     *     <dt>after</dt><dd>just after push/pop animation ends</dd>
     *     <dt>{Number}</dt><dd>wait N million seconds after push/pop animation ends</dd>
     * </dl>
     *
     * @attribute underlay
     * @type String
     * @default none
     */
    underlay: {
        value: 'none',
        validator: function (V) {
            _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "validator", 128);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 129);
return UNDERLAY_CFGS[V] || Y.Lang.isNumber(V);
        },
        setter: function (V) {
            _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "setter", 131);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 132);
return UNDERLAY_CFGS[V];
        }
    },

    /**
     * Default transition setting for push pop
     *
     * @attribute ppTrans
     * @type Object
     * @default {dutation: 0.5}
     */
    ppTrans: {
        value: {
            duration: 0.5
        },
        lazyAdd: false,
        validator: Y.Lang.isObject,
        setter: function (cfg) {
            _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "setter", 149);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 150);
this._updateTransitions(0, cfg);
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 151);
return cfg;
        }
    },

    /**
     * Push direction, can be one of 'right', 'left', 'top', 'bottom', 'tr', 'br', 'tl', 'bl'
     *
     * @attribute pushFrom
     * @type String
     * @default 'right'
     */ 
    pushFrom: {
        value: 'right',
        lazyAdd: false,
        validator: function (D) {
            _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "validator", 165);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 166);
return DIRECTIONS[D];
        },
        setter: function (D) {
            _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "setter", 168);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 169);
this._updateTransitions(D);
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 170);
return D;
        }
    }
};

/**
 * Static property used to define the default HTML parsing rules
 *
 * @property HTML_PARSER
 * @protected
 * @static
 * @type Object
 */
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 183);
PushPop.HTML_PARSER = {
    childQuery: function (srcNode) {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "childQuery", 184);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 185);
return srcNode.getData('child-query');
    },
    cfgChild: function (srcNode) {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "cfgChild", 187);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 188);
try {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 189);
return Y.JSON.parse(srcNode.getData('cfg-child'));
        } catch (e) {
        }
    },
    ppTrans: function (srcNode) {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "ppTrans", 193);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 194);
try {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 195);
return Y.JSON.parse(srcNode.getData('cfg-pp-trans'));
        } catch (e) {
        }
    },
    pushFrom: function (srcNode) {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "pushFrom", 199);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 200);
return srcNode.getData('push-from');
    },
    underlay: function (srcNode) {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "underlay", 202);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 203);
return srcNode.getData('underlay');
    }
};

_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 207);
PushPop.prototype = {
    initializer: function () {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "initializer", 208);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 209);
var srcNode = this.get('srcNode'),
            query = this.get('childQuery'),
            cfg = this.get('cfgChild');

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 213);
if (!query) {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 214);
return;
        }

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 217);
this.get('contentBox').all(query).each(function (O) {
            _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "(anonymous 2)", 217);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 218);
this.add(Y.merge(cfg, {srcNode: O}));
        }, this);
    },

    /**
     * do clean up jobs when destroyed
     *
     * @method _destroyPushPop
     * @private
     */    
    _destroyPushPop: function () {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "_destroyPushPop", 228);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 229);
this._bppEventHandlers.detach();
        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 230);
delete this._bppEventHandlers;
    },

    /**
     * sync one size (height or width) with all children
     *
     * @method _updateTransitions
     * @param [direction] {String} should be one of 'right', 'left', 'top', 'bottom', 'tr', 'br', 'tl', 'bl'. If omitted, current 'pushFrom' attribute will be used
     * @param [transition] {Object} transition config. If omitted, current 'ppTrans' attribute will be used
     * @protected
     */    
    _updateTransitions: function (direction, transition) {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "_updateTransitions", 241);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 242);
var D = direction || this.get('pushFrom'),
            trans = transition || this.get('ppTrans'),
            xy = DIRECTIONS[D];

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 246);
this._PUSHPOP_TRANS = Y.merge(trans, {
            left: xy[0] * this.get('width') + 'px',
            top: xy[1] * this.get('height') + 'px'
        });

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 251);
this._DONE_TRANS = Y.merge(trans, {
            left: 0,
            top: 0
        });

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 256);
this._UNDERLAY_TRANS = Y.merge(trans, {
            left: -xy[0] * this.get('width') + 'px',
            top: -xy[1] * this.get('height') + 'px'
        });
    },

    /**
     * sync one size (height or width) with all children
     *
     * @method _syncOneSize
     * @param sideName {String} should be 'width' or 'height'
     * @protected
     */    
    _syncOneSide: function (HW) {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "_syncOneSide", 269);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 270);
var hw = this.get(HW);
        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 271);
this.each(function (O) {
            _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "(anonymous 3)", 271);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 272);
this.set(HW, hw);
        });
        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 274);
this._updateTransitions();
    },

    /**
     * handle child Widget height when self height changed
     *
     * @method _afterPPHeightChange
     * @protected
     */    
    _afterPPHeightChange: function () {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "_afterPPHeightChange", 283);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 284);
this._syncOneSide('height');
    },

    /**
     * handle child Widget width when self width changed
     *
     * @method _afterPPWidthChange
     * @protected
     */    
    _afterPPWidthChange: function () {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "_afterPPWidthChange", 293);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 294);
this._syncOneSide('width');
    },

    /**
     * handle add child Widget, if not defaultChildType, cancel add
     *
     * @method _beforePPAddChild
     * @protected
     */    
    _beforePPAddChild: function (E) {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "_beforePPAddChild", 303);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 304);
if (!Y.instanceOf(E.child, this.get('defaultChildType'))) {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 305);
E.halt();
        }
    },

    /**
     * handle child Widget, sync size after add
     *
     * @method _afterPPAddChild
     * @protected
     */
    _afterPPAddChild: function (E) {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "_afterPPAddChild", 315);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 316);
this.sync(E.child);
    },

    /**
     * add proper classname for pushpop
     *
     * @method _renderUIPushPop
     * @protected
     */    
    _renderUIPushPop: function () {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "_renderUIPushPop", 325);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 326);
this.get('boundingBox').addClass(Y.Widget.getClassName(PUSHPOP));
    },

    /**
     * sync a widget width and height with self
     *
     * @method sync
     * @param widget {Widget} widget to be synced
     * @chainable
     */
    sync: function (widget) {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "sync", 336);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 337);
widget.set('width', this.get('width'));
        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 338);
widget.set('height', this.get('height'));
        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 339);
return this;
    },

    /**
     * get top (last) item
     *
     * @method topItem
     * @return {WidgetChild} the top widget child
     */
    topItem: function () {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "topItem", 348);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 349);
return this.item(this.size() - 1);
    },

    /**
     * get top (last) scrollView
     *
     * @method topScroll
     * @return {ScrollView|undefined} the scrollview inside top widget child. If scrollview can not be found, return undefined.
     */
    topScroll: function () {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "topScroll", 358);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 359);
var top = this.topItem();

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 361);
return top ? top.get('scrollView') : undefined;
    },

    /**
     * sync a widget width and height with self
     *
     * @method getChild
     * @param widget {Widget | Integer} the child widget or index of child
     * @return { mixed } the child widget or undefined
     */
    getChild: function (widget) {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "getChild", 371);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 372);
if (Y.instanceOf(widget, this.get('defaultChildType'))) {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 373);
return widget;
        }
        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 375);
if (Y.Lang.isNumber(widget)) {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 376);
return this.item(widget);
        }
    },

    /**
     * move a child widget to a new position
     *
     * @method moveChild
     * @param widget {Widget | Integer} the child widget or index of child
     * @param transition {Object} transition configuration
     * @param [done] {Boolean | Function} When is true, move the child directly. When is a function, callback the function when transition done.
     * @chainable
     */
    moveChild: function (widget, transition, done) {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "moveChild", 389);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 390);
var W = this.getChild(widget),
            that = this;

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 393);
if (done === true) {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 394);
moveWidget(W, transition);
        } else {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 396);
if (this.get('visible')) {
                _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 397);
W.get('boundingBox').transition(transition, function () {
                    _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "(anonymous 4)", 397);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 398);
if (done) {
                        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 399);
done.apply(that);
                    }
                });
            } else {
                _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 403);
moveWidget(W, transition);
                _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 404);
if (done) {
                    _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 405);
done.apply(that);
                }
            }
        }
        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 409);
return this;
    },

    /**
     * push a widget into html, overlap on plugged widget
     *
     * @method push
     * @param widget {Widget} widget to be pushed
     * @chainable
     */
    push: function (widget) {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "push", 419);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 420);
var index = this.size() - 1,
            underlay = this.get('underlay');

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 423);
if (underlay == 'with') {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 424);
this.moveChild(index, this._UNDERLAY_TRANS);
        }

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 427);
this.add(widget);
        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 428);
this.moveChild(widget, this._PUSHPOP_TRANS, true);

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 430);
if (Y.Lang.isNumber(underlay)) {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 431);
return this.moveChild(index, this._UNDERLAY_TRANS, function () {
                _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "(anonymous 5)", 431);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 432);
Y.later(underlay, this, function () {
                    _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "(anonymous 6)", 432);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 433);
this.moveChild(widget, this._DONE_TRANS);
                });
            });
        } else {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 437);
return this.moveChild(widget, this._DONE_TRANS);
        }
    },

    /**
     * pop current widget off html, and remove the widget from PushPop widget
     *
     * @method pop
     * @param [keep] {Boolean} <b>true</b> means do not destroy the widget. Default to destroy the widget after pop animation.
     * @chainable
     */
    pop: function (keep) {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "pop", 448);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 449);
var index = this.size() - 1,
            widget = this.item(index),
            underlay = this.get('underlay');

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 453);
if (!widget) {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 454);
return this;
        }

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 457);
if (underlay !== 'none') {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 458);
this.moveChild(index - 1, this._UNDERLAY_TRANS, true);
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 459);
if ((underlay == 'with') && index) {
                _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 460);
this.moveChild(index - 1, this._DONE_TRANS);
            }
        }

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 464);
return this.moveChild(widget, this._PUSHPOP_TRANS, function () {
            _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "(anonymous 7)", 464);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 465);
widget.remove();
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 466);
if (!keep) {
                _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 467);
widget.destroy(true);
            }
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 469);
if (index && Y.Lang.isNumber(underlay)) {
                _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 470);
Y.later(underlay, this, function () {
                    _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "(anonymous 8)", 470);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 471);
this.moveChild(index - 1, this._DONE_TRANS);
                });
            }
        });
    }
};

_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 478);
Y.namespace('Bottle').PushPop = PushPop;


}, '@VERSION@' ,{requires:['base-build', 'widget-parent', 'gallery-bt-container']});
