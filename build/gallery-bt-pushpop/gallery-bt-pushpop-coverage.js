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
_yuitest_coverage["/build/gallery-bt-pushpop/gallery-bt-pushpop.js"].code=["YUI.add('gallery-bt-pushpop', function(Y) {","","/**"," * Provide PushPop widget extension to handle Container push/pop transition."," *"," * @module gallery-bt-pushpop"," * @static"," */","var RENDERUI = 'renderUI',","","    PUSHPOP = 'pushpop',","","    HEIGHT_CHANGE = 'heightChange',","    WIDTH_CHANGE = 'widthChange',","","    ADDCHILD = 'addChild',","","    UNDERLAY_CFGS = {","        none: 'none',","        'with': 'with',","        after: 1","    },","","    DIRECTIONS = {","        right: [1, 0],","        left: [-1, 0],","        top: [0, -1],","        bottom: [0, 1],","        tr: [1, -1],","        br: [1, 1],","        tl: [-1, -1],","        bl: [-1, 1]","    },","","/**"," * PushPop extension that adds push, pop unshift animation and methods to Widget Parent"," *"," * @class PushPop"," * @namespace Bottle"," * @param [config] {Object} User configuration object"," */","PushPop = function (config) {","    /**","     * internal eventhandlers, keep for destructor","     *","     * @property _bppEventHandlers","     * @type EventHandle","     * @private","     */","    this._bppEventHandlers = new Y.EventHandle([","        Y.after(this._renderUIPushPop, this, RENDERUI),","","        this.before(ADDCHILD, this._beforePPAddChild),","        this.after(WIDTH_CHANGE, this._afterPPWidthChange),","        this.after(HEIGHT_CHANGE, this._afterPPHeightChange),","        this.on('destroy', this._destroyPushPop)","    ]);","};","","/**"," * Static property used to define the default attribute configuration."," *"," * @property ATTRS"," * @protected"," * @type Object"," * @static"," */","PushPop.ATTRS = {","    defaultChildType: {","        value: Y.Bottle.Container","    },","","    /**","     * Underlay animation, can be one of:","     * <dl>","     *     <dt>none</dt><dd>no underlay animation","     *     <dt>with</dt><dd>same time with  push/pop animation</dd>","     *     <dt>after</dt><dd>just after push/pop animation ends</dd>","     *     <dt>{Number}</dt><dd>wait N million seconds after push/pop animation ends</dd>","     * </dl>","     *","     * @attribute underlay","     * @type String","     * @default none","     */","    underlay: {","        value: 'none',","        validator: function (V) {","            return UNDERLAY_CFGS[V] || Y.Lang.isNumber(V);","        },","        setter: function (V) {","            return UNDERLAY_CFGS[V];","        }","    },","","    /**","     * Default transition setting for push pop","     *","     * @attribute ppTrans","     * @type Object","     * @default {dutation: 0.5}","     */","    ppTrans: {","        value: {","            duration: 0.5","        },","        lazyAdd: false,","        validator: Y.Lang.isObject,","        setter: function (cfg) {","            this._updateTransitions(0, cfg);","            return cfg;","        }","    },","","    /**","     * Push direction, can be one of 'right', 'left', 'top', 'bottom', 'tr', 'br', 'tl', 'bl'","     *","     * @attribute pushFrom","     * @type String","     * @default 'right'","     */ ","    pushFrom: {","        value: 'right',","        lazyAdd: false,","        validator: function (D) {","            return DIRECTIONS[D];","        },","        setter: function (D) {","            this._updateTransitions(D);","            return D;","        }","    }","};","","/**"," * Static property used to define the default HTML parsing rules"," *"," * @property HTML_PARSER"," * @protected"," * @static"," * @type Object"," */","PushPop.HTML_PARSER = {","    ppTrans: function (srcNode) {","        try {","            return Y.JSON.parse(srcNode.getData('cfg-pp-trans'));","        } catch (e) {","        }","    },","    pushFrom: function (srcNode) {","        return srcNode.getData('push-from');","    },","    underlay: function (srcNode) {","        return srcNode.getData('underlay');","    }","};","","PushPop.prototype = {","    initializer: function () {","        var widget = this,","            srcNode = this.get('srcNode'),","            w = srcNode.get('offsetWidth'),","            h = srcNode.get('offsetHeight');","","        if (!w) {","            this.set('width', w);","        }","        if (!h) {","            this.set('height', h);","        }","","        this.get('contentBox').all('> [data-role=container]').each(function (O) {","            widget.add({","                srcNode: O","            });","        });","    },","","    /**","     * do clean up jobs when destroyed","     *","     * @method _destroyPushPop","     * @private","     */    ","    _destroyPushPop: function () {","        this._bppEventHandlers.detach();","        delete this._bppEventHandlers;","    },","","    /**","     * sync one size (height or width) with all children","     *","     * @method _updateTransitions","     * @param [direction] {String} should be one of 'right', 'left', 'top', 'bottom', 'tr', 'br', 'tl', 'bl'. If omitted, current 'pushFrom' attribute will be used","     * @param [transition] {Object} transition config. If omitted, current 'ppTrans' attribute will be used","     * @protected","     */    ","    _updateTransitions: function (direction, transition) {","        var D = direction || this.get('pushFrom'),","            trans = transition || this.get('ppTrans'),","            xy = DIRECTIONS[D];","","        this._PUSHPOP_TRANS = Y.merge(trans, {","            left: xy[0] * this.get('width') + 'px',","            top: xy[1] * this.get('height') + 'px'","        });","","        this._DONE_TRANS = Y.merge(trans, {","            left: 0,","            top: 0","        });","","        this._UNDERLAY_TRANS = Y.merge(trans, {","            left: -xy[0] * this.get('width') + 'px',","            top: -xy[1] * this.get('height') + 'px'","        });","    },","","    /**","     * sync one size (height or width) with all children","     *","     * @method _syncOneSize","     * @param sideName {String} should be 'width' or 'height'","     * @protected","     */    ","    _syncOneSide: function (HW) {","        var hw = this.get(HW);","        this.each(function (O) {","            this.set(HW, hw);","        });","        this._updateTransitions();","    },","","    /**","     * handle child Widget height when self height changed","     *","     * @method _afterPPHeightChange","     * @protected","     */    ","    _afterPPHeightChange: function () {","        this._syncOneSide('height');","    },","","    /**","     * handle child Widget width when self width changed","     *","     * @method _afterPPWidthChange","     * @protected","     */    ","    _afterPPWidthChange: function () {","        this._syncOneSide('width');","    },","","    /**","     * handle child Widget","     *","     * @method _beforeAddChild","     * @protected","     */    ","    _beforePPAddChild: function (E) {","        if (Y.instanceOf(E.child, this.get('defaultChildType'))) {","            this.sync(E.child);","        } else {","            E.halt();","        }","    },","","    /**","     * add proper classname for pushpop","     *","     * @method _renderUIPushPop","     * @protected","     */    ","    _renderUIPushPop: function () {","        this.get('boundingBox').addClass(Y.Widget.getClassName(PUSHPOP));","    },","","    /**","     * sync a widget width and height with self","     *","     * @method sync","     * @param widget {Widget} widget to be synced","     * @chainable","     */","    sync: function (widget) {","        widget.set('width', this.get('width'));","        widget.set('height', this.get('height'));","        return this;","    },","","    /**","     * get top (last) item","     *","     * @method topItem","     * @return {WidgetChild} the top widget child","     */","    topItem: function () {","        return this.item(this.size() - 1);","    },","","    /**","     * get top (last) scrollView","     *","     * @method topScroll","     * @return {ScrollView|undefined} the scrollview inside top widget child. If scrollview can not be found, return undefined.","     */","    topScroll: function () {","        var top = this.topItem();","","        return top ? top.get('scrollView') : undefined;","    },","","    /**","     * sync a widget width and height with self","     *","     * @method getChild","     * @param widget {Widget | Integer} the child widget or index of child","     * @return { mixed } the child widget or undefined","     */","    getChild: function (widget) {","        if (Y.instanceOf(widget, this.get('defaultChildType'))) {","            return widget;","        }","        if (Y.Lang.isNumber(widget)) {","            return this.item(widget);","        }","    },","","    /**","     * move a child widget to a new position","     *","     * @method moveChild","     * @param widget {Widget | Integer} the child widget or index of child","     * @param transition {Object} transition configuration","     * @param [done] {Boolean | Function} When is true, move the child directly. When is a function, callback the function when transition done.","     * @chainable","     */","    moveChild: function (widget, transition, done) {","        var W = this.getChild(widget),","            that = this;","","        if (done === true) {","            W.get('boundingBox').setStyles({","                left: transition.left,","                top: transition.top","            });","        } else {","            W.get('boundingBox').transition(transition, function () {","                if (done) {","                    done.apply(that);","                }","            });","        }","        return this;","    },","","    /**","     * push a widget into html, overlap on plugged widget","     *","     * @method push","     * @param widget {Widget} widget to be pushed","     * @chainable","     */","    push: function (widget) {","        var index = this.size() - 1,","            underlay = this.get('underlay');","","        if (underlay == 'with') {","            this.moveChild(index, this._UNDERLAY_TRANS);","        }","","        this.add(widget);","        this.moveChild(widget, this._PUSHPOP_TRANS, true);","","        if (Y.Lang.isNumber(underlay)) {","            return this.moveChild(index, this._UNDERLAY_TRANS, function () {","                Y.later(underlay, this, function () {","                    this.moveChild(widget, this._DONE_TRANS);","                });","            });","        } else {","            return this.moveChild(widget, this._DONE_TRANS);","        }","    },","","    /**","     * pop current widget off html, and remove the widget from PushPop widget","     *","     * @method pop","     * @param [keep] {Boolean} <b>true</b> means do not destroy the widget. Default to destroy the widget after pop animation.","     * @chainable","     */","    pop: function (keep) {","        var index = this.size() - 1,","            widget = this.item(index),","            underlay = this.get('underlay');","","        if (!widget) {","            return this;","        }","","        if (underlay !== 'none') {","            this.moveChild(index - 1, this._UNDERLAY_TRANS, true);","            if ((underlay == 'with') && index) {","                this.moveChild(index - 1, this._DONE_TRANS);","            }","        }","","        return this.moveChild(widget, this._PUSHPOP_TRANS, function () {","            widget.remove();","            if (!keep) {","                widget.destroy(true);","            }","            if (index && Y.Lang.isNumber(underlay)) {","                Y.later(underlay, this, function () {","                    this.moveChild(index - 1, this._DONE_TRANS);","                });","            }","        });","    }","};","","Y.namespace('Bottle').PushPop = PushPop;","","","}, '@VERSION@' ,{requires:['base-build', 'widget-parent', 'gallery-bt-container']});"];
_yuitest_coverage["/build/gallery-bt-pushpop/gallery-bt-pushpop.js"].lines = {"1":0,"9":0,"50":0,"68":0,"89":0,"92":0,"110":0,"111":0,"126":0,"129":0,"130":0,"143":0,"145":0,"146":0,"151":0,"154":0,"158":0,"160":0,"165":0,"166":0,"168":0,"169":0,"172":0,"173":0,"186":0,"187":0,"199":0,"203":0,"208":0,"213":0,"227":0,"228":0,"229":0,"231":0,"241":0,"251":0,"261":0,"262":0,"264":0,"275":0,"286":0,"287":0,"288":0,"298":0,"308":0,"310":0,"321":0,"322":0,"324":0,"325":0,"339":0,"342":0,"343":0,"348":0,"349":0,"350":0,"354":0,"365":0,"368":0,"369":0,"372":0,"373":0,"375":0,"376":0,"377":0,"378":0,"382":0,"394":0,"398":0,"399":0,"402":0,"403":0,"404":0,"405":0,"409":0,"410":0,"411":0,"412":0,"414":0,"415":0,"416":0,"423":0};
_yuitest_coverage["/build/gallery-bt-pushpop/gallery-bt-pushpop.js"].functions = {"PushPop:42":0,"validator:88":0,"setter:91":0,"setter:109":0,"validator:125":0,"setter:128":0,"ppTrans:144":0,"pushFrom:150":0,"underlay:153":0,"(anonymous 2):172":0,"initializer:159":0,"_destroyPushPop:185":0,"_updateTransitions:198":0,"(anonymous 3):228":0,"_syncOneSide:226":0,"_afterPPHeightChange:240":0,"_afterPPWidthChange:250":0,"_beforePPAddChild:260":0,"_renderUIPushPop:274":0,"sync:285":0,"topItem:297":0,"topScroll:307":0,"getChild:320":0,"(anonymous 4):348":0,"moveChild:338":0,"(anonymous 6):377":0,"(anonymous 5):376":0,"push:364":0,"(anonymous 8):415":0,"(anonymous 7):409":0,"pop:393":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bt-pushpop/gallery-bt-pushpop.js"].coveredLines = 82;
_yuitest_coverage["/build/gallery-bt-pushpop/gallery-bt-pushpop.js"].coveredFunctions = 32;
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
    _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "PushPop", 42);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 50);
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
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 68);
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
            _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "validator", 88);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 89);
return UNDERLAY_CFGS[V] || Y.Lang.isNumber(V);
        },
        setter: function (V) {
            _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "setter", 91);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 92);
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
            _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "setter", 109);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 110);
this._updateTransitions(0, cfg);
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 111);
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
            _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "validator", 125);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 126);
return DIRECTIONS[D];
        },
        setter: function (D) {
            _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "setter", 128);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 129);
this._updateTransitions(D);
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 130);
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
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 143);
PushPop.HTML_PARSER = {
    ppTrans: function (srcNode) {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "ppTrans", 144);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 145);
try {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 146);
return Y.JSON.parse(srcNode.getData('cfg-pp-trans'));
        } catch (e) {
        }
    },
    pushFrom: function (srcNode) {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "pushFrom", 150);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 151);
return srcNode.getData('push-from');
    },
    underlay: function (srcNode) {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "underlay", 153);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 154);
return srcNode.getData('underlay');
    }
};

_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 158);
PushPop.prototype = {
    initializer: function () {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "initializer", 159);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 160);
var widget = this,
            srcNode = this.get('srcNode'),
            w = srcNode.get('offsetWidth'),
            h = srcNode.get('offsetHeight');

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 165);
if (!w) {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 166);
this.set('width', w);
        }
        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 168);
if (!h) {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 169);
this.set('height', h);
        }

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 172);
this.get('contentBox').all('> [data-role=container]').each(function (O) {
            _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "(anonymous 2)", 172);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 173);
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
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "_destroyPushPop", 185);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 186);
this._bppEventHandlers.detach();
        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 187);
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
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "_updateTransitions", 198);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 199);
var D = direction || this.get('pushFrom'),
            trans = transition || this.get('ppTrans'),
            xy = DIRECTIONS[D];

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 203);
this._PUSHPOP_TRANS = Y.merge(trans, {
            left: xy[0] * this.get('width') + 'px',
            top: xy[1] * this.get('height') + 'px'
        });

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 208);
this._DONE_TRANS = Y.merge(trans, {
            left: 0,
            top: 0
        });

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 213);
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
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "_syncOneSide", 226);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 227);
var hw = this.get(HW);
        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 228);
this.each(function (O) {
            _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "(anonymous 3)", 228);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 229);
this.set(HW, hw);
        });
        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 231);
this._updateTransitions();
    },

    /**
     * handle child Widget height when self height changed
     *
     * @method _afterPPHeightChange
     * @protected
     */    
    _afterPPHeightChange: function () {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "_afterPPHeightChange", 240);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 241);
this._syncOneSide('height');
    },

    /**
     * handle child Widget width when self width changed
     *
     * @method _afterPPWidthChange
     * @protected
     */    
    _afterPPWidthChange: function () {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "_afterPPWidthChange", 250);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 251);
this._syncOneSide('width');
    },

    /**
     * handle child Widget
     *
     * @method _beforeAddChild
     * @protected
     */    
    _beforePPAddChild: function (E) {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "_beforePPAddChild", 260);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 261);
if (Y.instanceOf(E.child, this.get('defaultChildType'))) {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 262);
this.sync(E.child);
        } else {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 264);
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
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "_renderUIPushPop", 274);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 275);
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
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "sync", 285);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 286);
widget.set('width', this.get('width'));
        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 287);
widget.set('height', this.get('height'));
        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 288);
return this;
    },

    /**
     * get top (last) item
     *
     * @method topItem
     * @return {WidgetChild} the top widget child
     */
    topItem: function () {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "topItem", 297);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 298);
return this.item(this.size() - 1);
    },

    /**
     * get top (last) scrollView
     *
     * @method topScroll
     * @return {ScrollView|undefined} the scrollview inside top widget child. If scrollview can not be found, return undefined.
     */
    topScroll: function () {
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "topScroll", 307);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 308);
var top = this.topItem();

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 310);
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
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "getChild", 320);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 321);
if (Y.instanceOf(widget, this.get('defaultChildType'))) {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 322);
return widget;
        }
        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 324);
if (Y.Lang.isNumber(widget)) {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 325);
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
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "moveChild", 338);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 339);
var W = this.getChild(widget),
            that = this;

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 342);
if (done === true) {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 343);
W.get('boundingBox').setStyles({
                left: transition.left,
                top: transition.top
            });
        } else {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 348);
W.get('boundingBox').transition(transition, function () {
                _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "(anonymous 4)", 348);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 349);
if (done) {
                    _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 350);
done.apply(that);
                }
            });
        }
        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 354);
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
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "push", 364);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 365);
var index = this.size() - 1,
            underlay = this.get('underlay');

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 368);
if (underlay == 'with') {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 369);
this.moveChild(index, this._UNDERLAY_TRANS);
        }

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 372);
this.add(widget);
        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 373);
this.moveChild(widget, this._PUSHPOP_TRANS, true);

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 375);
if (Y.Lang.isNumber(underlay)) {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 376);
return this.moveChild(index, this._UNDERLAY_TRANS, function () {
                _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "(anonymous 5)", 376);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 377);
Y.later(underlay, this, function () {
                    _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "(anonymous 6)", 377);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 378);
this.moveChild(widget, this._DONE_TRANS);
                });
            });
        } else {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 382);
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
        _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "pop", 393);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 394);
var index = this.size() - 1,
            widget = this.item(index),
            underlay = this.get('underlay');

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 398);
if (!widget) {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 399);
return this;
        }

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 402);
if (underlay !== 'none') {
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 403);
this.moveChild(index - 1, this._UNDERLAY_TRANS, true);
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 404);
if ((underlay == 'with') && index) {
                _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 405);
this.moveChild(index - 1, this._DONE_TRANS);
            }
        }

        _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 409);
return this.moveChild(widget, this._PUSHPOP_TRANS, function () {
            _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "(anonymous 7)", 409);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 410);
widget.remove();
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 411);
if (!keep) {
                _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 412);
widget.destroy(true);
            }
            _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 414);
if (index && Y.Lang.isNumber(underlay)) {
                _yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 415);
Y.later(underlay, this, function () {
                    _yuitest_coverfunc("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", "(anonymous 8)", 415);
_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 416);
this.moveChild(index - 1, this._DONE_TRANS);
                });
            }
        });
    }
};

_yuitest_coverline("/build/gallery-bt-pushpop/gallery-bt-pushpop.js", 423);
Y.namespace('Bottle').PushPop = PushPop;


}, '@VERSION@' ,{requires:['base-build', 'widget-parent', 'gallery-bt-container']});
