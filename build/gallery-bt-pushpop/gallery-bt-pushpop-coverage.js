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
_yuitest_coverage["/build/gallery-bt-pushpop/gallery-bt-pushpop.js"].code=["YUI.add('gallery-bt-pushpop', function(Y) {","","/**"," * Provide PushPop widget extension to handle Container push/pop transition."," *"," * @module gallery-bt-pushpop"," * @static"," */","var RENDERUI = 'renderUI',","","    PUSHPOP = 'pushpop',","","    HEIGHT_CHANGE = 'heightChange',","    WIDTH_CHANGE = 'widthChange',","","    ADDCHILD = 'addChild',","","    UNDERLAY_CFGS = {","        none: 'none',","        'with': 'with',","        after: 1","    },","","    DIRECTIONS = {","        right: [1, 0],","        left: [-1, 0],","        top: [0, -1],","        bottom: [0, 1],","        tr: [1, -1],","        br: [1, 1],","        tl: [-1, -1],","        bl: [-1, 1]","    },","","    moveWidget = function (W, T) {","        W.get('boundingBox').setStyles({","            left: T.left,","            top: T.top","        });","    },","","/**"," * PushPop extension that adds push, pop unshift animation and methods to Widget Parent"," *"," * @class PushPop"," * @namespace Bottle"," * @param [config] {Object} User configuration object"," */","PushPop = function (config) {","    /**","     * internal eventhandlers, keep for destructor","     *","     * @property _bppEventHandlers","     * @type EventHandle","     * @private","     */","    this._bppEventHandlers = new Y.EventHandle([","        Y.after(this._renderUIPushPop, this, RENDERUI),","","        this.before(ADDCHILD, this._beforePPAddChild),","        this.after(WIDTH_CHANGE, this._afterPPWidthChange),","        this.after(HEIGHT_CHANGE, this._afterPPHeightChange),","        this.on('destroy', this._destroyPushPop)","    ]);","};","","/**"," * Static property used to define the default attribute configuration."," *"," * @property ATTRS"," * @protected"," * @type Object"," * @static"," */","PushPop.ATTRS = {","    defaultChildType: {","        value: Y.Bottle.Container","    },","","    /**","     * Underlay animation, can be one of:","     * <dl>","     *     <dt>none</dt><dd>no underlay animation","     *     <dt>with</dt><dd>same time with  push/pop animation</dd>","     *     <dt>after</dt><dd>just after push/pop animation ends</dd>","     *     <dt>{Number}</dt><dd>wait N million seconds after push/pop animation ends</dd>","     * </dl>","     *","     * @attribute underlay","     * @type String","     * @default none","     */","    underlay: {","        value: 'none',","        validator: function (V) {","            return UNDERLAY_CFGS[V] || Y.Lang.isNumber(V);","        },","        setter: function (V) {","            return UNDERLAY_CFGS[V];","        }","    },","","    /**","     * Default transition setting for push pop","     *","     * @attribute ppTrans","     * @type Object","     * @default {dutation: 0.5}","     */","    ppTrans: {","        value: {","            duration: 0.5","        },","        lazyAdd: false,","        validator: Y.Lang.isObject,","        setter: function (cfg) {","            this._updateTransitions(0, cfg);","            return cfg;","        }","    },","","    /**","     * Push direction, can be one of 'right', 'left', 'top', 'bottom', 'tr', 'br', 'tl', 'bl'","     *","     * @attribute pushFrom","     * @type String","     * @default 'right'","     */ ","    pushFrom: {","        value: 'right',","        lazyAdd: false,","        validator: function (D) {","            return DIRECTIONS[D];","        },","        setter: function (D) {","            this._updateTransitions(D);","            return D;","        }","    }","};","","/**"," * Static property used to define the default HTML parsing rules"," *"," * @property HTML_PARSER"," * @protected"," * @static"," * @type Object"," */","PushPop.HTML_PARSER = {","    ppTrans: function (srcNode) {","        try {","            return Y.JSON.parse(srcNode.getData('cfg-pp-trans'));","        } catch (e) {","        }","    },","    pushFrom: function (srcNode) {","        return srcNode.getData('push-from');","    },","    underlay: function (srcNode) {","        return srcNode.getData('underlay');","    }","};","","PushPop.prototype = {","    initializer: function () {","        var widget = this,","            srcNode = this.get('srcNode'),","            w = srcNode.get('offsetWidth'),","            h = srcNode.get('offsetHeight');","","        if (!w) {","            this.set('width', w);","        }","        if (!h) {","            this.set('height', h);","        }","","        this.get('contentBox').all('> [data-role=container]').each(function (O) {","            widget.add({","                srcNode: O","            });","        });","    },","","    /**","     * do clean up jobs when destroyed","     *","     * @method _destroyPushPop","     * @private","     */    ","    _destroyPushPop: function () {","        this._bppEventHandlers.detach();","        delete this._bppEventHandlers;","    },","","    /**","     * sync one size (height or width) with all children","     *","     * @method _updateTransitions","     * @param [direction] {String} should be one of 'right', 'left', 'top', 'bottom', 'tr', 'br', 'tl', 'bl'. If omitted, current 'pushFrom' attribute will be used","     * @param [transition] {Object} transition config. If omitted, current 'ppTrans' attribute will be used","     * @protected","     */    ","    _updateTransitions: function (direction, transition) {","        var D = direction || this.get('pushFrom'),","            trans = transition || this.get('ppTrans'),","            xy = DIRECTIONS[D];","","        this._PUSHPOP_TRANS = Y.merge(trans, {","            left: xy[0] * this.get('width') + 'px',","            top: xy[1] * this.get('height') + 'px'","        });","","        this._DONE_TRANS = Y.merge(trans, {","            left: 0,","            top: 0","        });","","        this._UNDERLAY_TRANS = Y.merge(trans, {","            left: -xy[0] * this.get('width') + 'px',","            top: -xy[1] * this.get('height') + 'px'","        });","    },","","    /**","     * sync one size (height or width) with all children","     *","     * @method _syncOneSize","     * @param sideName {String} should be 'width' or 'height'","     * @protected","     */    ","    _syncOneSide: function (HW) {","        var hw = this.get(HW);","        this.each(function (O) {","            this.set(HW, hw);","        });","        this._updateTransitions();","    },","","    /**","     * handle child Widget height when self height changed","     *","     * @method _afterPPHeightChange","     * @protected","     */    ","    _afterPPHeightChange: function () {","        this._syncOneSide('height');","    },","","    /**","     * handle child Widget width when self width changed","     *","     * @method _afterPPWidthChange","     * @protected","     */    ","    _afterPPWidthChange: function () {","        this._syncOneSide('width');","    },","","    /**","     * handle child Widget","     *","     * @method _beforeAddChild","     * @protected","     */    ","    _beforePPAddChild: function (E) {","        if (Y.instanceOf(E.child, this.get('defaultChildType'))) {","            this.sync(E.child);","        } else {","            E.halt();","        }","    },","","    /**","     * add proper classname for pushpop","     *","     * @method _renderUIPushPop","     * @protected","     */    ","    _renderUIPushPop: function () {","        this.get('boundingBox').addClass(Y.Widget.getClassName(PUSHPOP));","    },","","    /**","     * sync a widget width and height with self","     *","     * @method sync","     * @param widget {Widget} widget to be synced","     * @chainable","     */","    sync: function (widget) {","        widget.set('width', this.get('width'));","        widget.set('height', this.get('height'));","        return this;","    },","","    /**","     * get top (last) item","     *","     * @method topItem","     * @return {WidgetChild} the top widget child","     */","    topItem: function () {","        return this.item(this.size() - 1);","    },","","    /**","     * get top (last) scrollView","     *","     * @method topScroll","     * @return {ScrollView|undefined} the scrollview inside top widget child. If scrollview can not be found, return undefined.","     */","    topScroll: function () {","        var top = this.topItem();","","        return top ? top.get('scrollView') : undefined;","    },","","    /**","     * sync a widget width and height with self","     *","     * @method getChild","     * @param widget {Widget | Integer} the child widget or index of child","     * @return { mixed } the child widget or undefined","     */","    getChild: function (widget) {","        if (Y.instanceOf(widget, this.get('defaultChildType'))) {","            return widget;","        }","        if (Y.Lang.isNumber(widget)) {","            return this.item(widget);","        }","    },","","    /**","     * move a child widget to a new position","     *","     * @method moveChild","     * @param widget {Widget | Integer} the child widget or index of child","     * @param transition {Object} transition configuration","     * @param [done] {Boolean | Function} When is true, move the child directly. When is a function, callback the function when transition done.","     * @chainable","     */","    moveChild: function (widget, transition, done) {","        var W = this.getChild(widget),","            that = this;","","        if (done === true) {","            moveWidget(W, transition);","        } else {","            if (this.get('visible')) {","                W.get('boundingBox').transition(transition, function () {","                    if (done) {","                        done.apply(that);","                    }","                });","            } else {","                moveWidget(W, transition);","                if (done) {","                    done.apply(that);","                }","            }","        }","        return this;","    },","","    /**","     * push a widget into html, overlap on plugged widget","     *","     * @method push","     * @param widget {Widget} widget to be pushed","     * @chainable","     */","    push: function (widget) {","        var index = this.size() - 1,","            underlay = this.get('underlay');","","        if (underlay == 'with') {","            this.moveChild(index, this._UNDERLAY_TRANS);","        }","","        this.add(widget);","        this.moveChild(widget, this._PUSHPOP_TRANS, true);","","        if (Y.Lang.isNumber(underlay)) {","            return this.moveChild(index, this._UNDERLAY_TRANS, function () {","                Y.later(underlay, this, function () {","                    this.moveChild(widget, this._DONE_TRANS);","                });","            });","        } else {","            return this.moveChild(widget, this._DONE_TRANS);","        }","    },","","    /**","     * pop current widget off html, and remove the widget from PushPop widget","     *","     * @method pop","     * @param [keep] {Boolean} <b>true</b> means do not destroy the widget. Default to destroy the widget after pop animation.","     * @chainable","     */","    pop: function (keep) {","        var index = this.size() - 1,","            widget = this.item(index),","            underlay = this.get('underlay');","","        if (!widget) {","            return this;","        }","","        if (underlay !== 'none') {","            this.moveChild(index - 1, this._UNDERLAY_TRANS, true);","            if ((underlay == 'with') && index) {","                this.moveChild(index - 1, this._DONE_TRANS);","            }","        }","","        return this.moveChild(widget, this._PUSHPOP_TRANS, function () {","            widget.remove();","            if (!keep) {","                widget.destroy(true);","            }","            if (index && Y.Lang.isNumber(underlay)) {","                Y.later(underlay, this, function () {","                    this.moveChild(index - 1, this._DONE_TRANS);","                });","            }","        });","    }","};","","Y.namespace('Bottle').PushPop = PushPop;","","","}, '@VERSION@' ,{requires:['base-build', 'widget-parent', 'gallery-bt-container']});"];
_yuitest_coverage["/build/gallery-bt-pushpop/gallery-bt-pushpop.js"].lines = {"1":0,"9":0,"36":0,"57":0,"75":0,"96":0,"99":0,"117":0,"118":0,"133":0,"136":0,"137":0,"150":0,"152":0,"153":0,"158":0,"161":0,"165":0,"167":0,"172":0,"173":0,"175":0,"176":0,"179":0,"180":0,"193":0,"194":0,"206":0,"210":0,"215":0,"220":0,"234":0,"235":0,"236":0,"238":0,"248":0,"258":0,"268":0,"269":0,"271":0,"282":0,"293":0,"294":0,"295":0,"305":0,"315":0,"317":0,"328":0,"329":0,"331":0,"332":0,"346":0,"349":0,"350":0,"352":0,"353":0,"354":0,"355":0,"359":0,"360":0,"361":0,"365":0,"376":0,"379":0,"380":0,"383":0,"384":0,"386":0,"387":0,"388":0,"389":0,"393":0,"405":0,"409":0,"410":0,"413":0,"414":0,"415":0,"416":0,"420":0,"421":0,"422":0,"423":0,"425":0,"426":0,"427":0,"434":0};
_yuitest_coverage["/build/gallery-bt-pushpop/gallery-bt-pushpop.js"].functions = {"moveWidget:35":0,"PushPop:49":0,"validator:95":0,"setter:98":0,"setter:116":0,"validator:132":0,"setter:135":0,"ppTrans:151":0,"pushFrom:157":0,"underlay:160":0,"(anonymous 2):179":0,"initializer:166":0,"_destroyPushPop:192":0,"_updateTransitions:205":0,"(anonymous 3):235":0,"_syncOneSide:233":0,"_afterPPHeightChange:247":0,"_afterPPWidthChange:257":0,"_beforePPAddChild:267":0,"_renderUIPushPop:281":0,"sync:292":0,"topItem:304":0,"topScroll:314":0,"getChild:327":0,"(anonymous 4):353":0,"moveChild:345":0,"(anonymous 6):388":0,"(anonymous 5):387":0,"push:375":0,"(anonymous 8):426":0,"(anonymous 7):420":0,"pop:404":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bt-pushpop/gallery-bt-pushpop.js"].coveredLines = 87;
_yuitest_coverage["/build/gallery-bt-pushpop/gallery-bt-pushpop.js"].coveredFunctions = 33;
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
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 75);
PushPop.ATTRS = {
    defaultChildType: {
        value: Y.Bottle.Container
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
            _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "validator", 95);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 96);
return UNDERLAY_CFGS[V] || Y.Lang.isNumber(V);
        },
        setter: function (V) {
            _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "setter", 98);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 99);
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
            _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "setter", 116);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 117);
this._updateTransitions(0, cfg);
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 118);
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
            _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "validator", 132);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 133);
return DIRECTIONS[D];
        },
        setter: function (D) {
            _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "setter", 135);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 136);
this._updateTransitions(D);
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 137);
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
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 150);
PushPop.HTML_PARSER = {
    ppTrans: function (srcNode) {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "ppTrans", 151);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 152);
try {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 153);
return Y.JSON.parse(srcNode.getData('cfg-pp-trans'));
        } catch (e) {
        }
    },
    pushFrom: function (srcNode) {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "pushFrom", 157);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 158);
return srcNode.getData('push-from');
    },
    underlay: function (srcNode) {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "underlay", 160);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 161);
return srcNode.getData('underlay');
    }
};

_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 165);
PushPop.prototype = {
    initializer: function () {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "initializer", 166);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 167);
var widget = this,
            srcNode = this.get('srcNode'),
            w = srcNode.get('offsetWidth'),
            h = srcNode.get('offsetHeight');

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 172);
if (!w) {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 173);
this.set('width', w);
        }
        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 175);
if (!h) {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 176);
this.set('height', h);
        }

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 179);
this.get('contentBox').all('> [data-role=container]').each(function (O) {
            _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "(anonymous 2)", 179);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 180);
widget.add({
                srcNode: O
            });
        });
    },

    /**
     * do clean up jobs when destroyed
     *
     * @method _destroyPushPop
     * @private
     */    
    _destroyPushPop: function () {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "_destroyPushPop", 192);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 193);
this._bppEventHandlers.detach();
        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 194);
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
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "_updateTransitions", 205);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 206);
var D = direction || this.get('pushFrom'),
            trans = transition || this.get('ppTrans'),
            xy = DIRECTIONS[D];

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 210);
this._PUSHPOP_TRANS = Y.merge(trans, {
            left: xy[0] * this.get('width') + 'px',
            top: xy[1] * this.get('height') + 'px'
        });

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 215);
this._DONE_TRANS = Y.merge(trans, {
            left: 0,
            top: 0
        });

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 220);
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
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "_syncOneSide", 233);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 234);
var hw = this.get(HW);
        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 235);
this.each(function (O) {
            _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "(anonymous 3)", 235);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 236);
this.set(HW, hw);
        });
        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 238);
this._updateTransitions();
    },

    /**
     * handle child Widget height when self height changed
     *
     * @method _afterPPHeightChange
     * @protected
     */    
    _afterPPHeightChange: function () {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "_afterPPHeightChange", 247);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 248);
this._syncOneSide('height');
    },

    /**
     * handle child Widget width when self width changed
     *
     * @method _afterPPWidthChange
     * @protected
     */    
    _afterPPWidthChange: function () {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "_afterPPWidthChange", 257);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 258);
this._syncOneSide('width');
    },

    /**
     * handle child Widget
     *
     * @method _beforeAddChild
     * @protected
     */    
    _beforePPAddChild: function (E) {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "_beforePPAddChild", 267);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 268);
if (Y.instanceOf(E.child, this.get('defaultChildType'))) {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 269);
this.sync(E.child);
        } else {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 271);
E.halt();
        }
    },

    /**
     * add proper classname for pushpop
     *
     * @method _renderUIPushPop
     * @protected
     */    
    _renderUIPushPop: function () {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "_renderUIPushPop", 281);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 282);
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
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "sync", 292);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 293);
widget.set('width', this.get('width'));
        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 294);
widget.set('height', this.get('height'));
        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 295);
return this;
    },

    /**
     * get top (last) item
     *
     * @method topItem
     * @return {WidgetChild} the top widget child
     */
    topItem: function () {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "topItem", 304);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 305);
return this.item(this.size() - 1);
    },

    /**
     * get top (last) scrollView
     *
     * @method topScroll
     * @return {ScrollView|undefined} the scrollview inside top widget child. If scrollview can not be found, return undefined.
     */
    topScroll: function () {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "topScroll", 314);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 315);
var top = this.topItem();

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 317);
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
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "getChild", 327);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 328);
if (Y.instanceOf(widget, this.get('defaultChildType'))) {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 329);
return widget;
        }
        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 331);
if (Y.Lang.isNumber(widget)) {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 332);
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
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "moveChild", 345);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 346);
var W = this.getChild(widget),
            that = this;

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 349);
if (done === true) {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 350);
moveWidget(W, transition);
        } else {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 352);
if (this.get('visible')) {
                _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 353);
W.get('boundingBox').transition(transition, function () {
                    _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "(anonymous 4)", 353);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 354);
if (done) {
                        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 355);
done.apply(that);
                    }
                });
            } else {
                _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 359);
moveWidget(W, transition);
                _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 360);
if (done) {
                    _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 361);
done.apply(that);
                }
            }
        }
        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 365);
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
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "push", 375);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 376);
var index = this.size() - 1,
            underlay = this.get('underlay');

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 379);
if (underlay == 'with') {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 380);
this.moveChild(index, this._UNDERLAY_TRANS);
        }

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 383);
this.add(widget);
        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 384);
this.moveChild(widget, this._PUSHPOP_TRANS, true);

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 386);
if (Y.Lang.isNumber(underlay)) {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 387);
return this.moveChild(index, this._UNDERLAY_TRANS, function () {
                _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "(anonymous 5)", 387);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 388);
Y.later(underlay, this, function () {
                    _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "(anonymous 6)", 388);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 389);
this.moveChild(widget, this._DONE_TRANS);
                });
            });
        } else {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 393);
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
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "pop", 404);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 405);
var index = this.size() - 1,
            widget = this.item(index),
            underlay = this.get('underlay');

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 409);
if (!widget) {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 410);
return this;
        }

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 413);
if (underlay !== 'none') {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 414);
this.moveChild(index - 1, this._UNDERLAY_TRANS, true);
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 415);
if ((underlay == 'with') && index) {
                _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 416);
this.moveChild(index - 1, this._DONE_TRANS);
            }
        }

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 420);
return this.moveChild(widget, this._PUSHPOP_TRANS, function () {
            _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "(anonymous 7)", 420);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 421);
widget.remove();
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 422);
if (!keep) {
                _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 423);
widget.destroy(true);
            }
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 425);
if (index && Y.Lang.isNumber(underlay)) {
                _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 426);
Y.later(underlay, this, function () {
                    _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "(anonymous 8)", 426);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 427);
this.moveChild(index - 1, this._DONE_TRANS);
                });
            }
        });
    }
};

_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 434);
Y.namespace('Bottle').PushPop = PushPop;


}, '@VERSION@' ,{requires:['base-build', 'widget-parent', 'gallery-bt-container']});
