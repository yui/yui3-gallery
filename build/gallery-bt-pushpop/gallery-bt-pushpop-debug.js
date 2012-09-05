YUI.add('gallery-bt-pushpop', function(Y) {

/**
 * Provide PushPop widget extension to handle Container push/pop transition.
 *
 * @module gallery-bt-pushpop
 * @static
 */
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
            return UNDERLAY_CFGS[V] || Y.Lang.isNumber(V);
        },
        setter: function (V) {
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
            this._updateTransitions(0, cfg);
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
            return DIRECTIONS[D];
        },
        setter: function (D) {
            this._updateTransitions(D);
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
PushPop.HTML_PARSER = {
    ppTrans: function (srcNode) {
        try {
            return Y.JSON.parse(srcNode.getData('cfg-pp-trans'));
        } catch (e) {
        }
    },
    pushFrom: function (srcNode) {
        return srcNode.getData('push-from');
    },
    underlay: function (srcNode) {
        return srcNode.getData('underlay');
    }
};

PushPop.prototype = {
    initializer: function () {
        var widget = this,
            srcNode = this.get('srcNode'),
            w = srcNode.get('offsetWidth'),
            h = srcNode.get('offsetHeight');

        if (!w) {
            this.set('width', w);
        }
        if (!h) {
            this.set('height', h);
        }

        this.get('contentBox').all('> [data-role=container]').each(function (O) {
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
        this._bppEventHandlers.detach();
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
        var D = direction || this.get('pushFrom'),
            trans = transition || this.get('ppTrans'),
            xy = DIRECTIONS[D];

        this._PUSHPOP_TRANS = Y.merge(trans, {
            left: xy[0] * this.get('width') + 'px',
            top: xy[1] * this.get('height') + 'px'
        });

        this._DONE_TRANS = Y.merge(trans, {
            left: 0,
            top: 0
        });

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
        var hw = this.get(HW);
        this.each(function (O) {
            this.set(HW, hw);
        });
        this._updateTransitions();
    },

    /**
     * handle child Widget height when self height changed
     *
     * @method _afterPPHeightChange
     * @protected
     */    
    _afterPPHeightChange: function () {
        this._syncOneSide('height');
    },

    /**
     * handle child Widget width when self width changed
     *
     * @method _afterPPWidthChange
     * @protected
     */    
    _afterPPWidthChange: function () {
        this._syncOneSide('width');
    },

    /**
     * handle child Widget
     *
     * @method _beforeAddChild
     * @protected
     */    
    _beforePPAddChild: function (E) {
        if (Y.instanceOf(E.child, this.get('defaultChildType'))) {
            this.sync(E.child);
        } else {
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
        widget.set('width', this.get('width'));
        widget.set('height', this.get('height'));
        return this;
    },

    /**
     * get top (last) item
     *
     * @method topItem
     * @return {WidgetChild} the top widget child
     */
    topItem: function () {
        return this.item(this.size() - 1);
    },

    /**
     * get top (last) scrollView
     *
     * @method topScroll
     * @return {ScrollView|undefined} the scrollview inside top widget child. If scrollview can not be found, return undefined.
     */
    topScroll: function () {
        var top = this.topItem();

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
        if (Y.instanceOf(widget, this.get('defaultChildType'))) {
            return widget;
        }
        if (Y.Lang.isNumber(widget)) {
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
        var W = this.getChild(widget),
            that = this;

        if (done === true) {
            W.get('boundingBox').setStyles({
                left: transition.left,
                top: transition.top
            });
        } else {
            W.get('boundingBox').transition(transition, function () {
                if (done) {
                    done.apply(that);
                }
            });
        }
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
        var index = this.size() - 1,
            underlay = this.get('underlay');

        if (underlay == 'with') {
            this.moveChild(index, this._UNDERLAY_TRANS);
        }

        this.add(widget);
        this.moveChild(widget, this._PUSHPOP_TRANS, true);

        if (Y.Lang.isNumber(underlay)) {
            return this.moveChild(index, this._UNDERLAY_TRANS, function () {
                Y.later(underlay, this, function () {
                    this.moveChild(widget, this._DONE_TRANS);
                });
            });
        } else {
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
        var index = this.size() - 1,
            widget = this.item(index),
            underlay = this.get('underlay');

        if (!widget) {
            return this;
        }

        if (underlay !== 'none') {
            this.moveChild(index - 1, this._UNDERLAY_TRANS, true);
            if ((underlay == 'with') && index) {
                this.moveChild(index - 1, this._DONE_TRANS);
            }
        }

        return this.moveChild(widget, this._PUSHPOP_TRANS, function () {
            widget.remove();
            if (!keep) {
                widget.destroy(true);
            }
            if (index && Y.Lang.isNumber(underlay)) {
                Y.later(underlay, this, function () {
                    this.moveChild(index - 1, this._DONE_TRANS);
                });
            }
        });
    }
};

Y.namespace('Bottle').PushPop = PushPop;


}, '@VERSION@' ,{requires:['base-build', 'widget-parent', 'gallery-bt-container']});
