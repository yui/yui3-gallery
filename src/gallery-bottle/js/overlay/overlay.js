/*jslint nomen: true*/
/**
 * This module provides Overlay Widget which can show/hide with different transitions or directions.
 *
 * @module gallery-bt-overlay
 */
var Mask = Y.one('.bt-overlay-mask') || Y.one('body').appendChild(Y.Node.create('<div class="bt-overlay-mask"></div>')),
    WIDTH_CHANGE = 'widthChange',
    HEIGHT_CHANGE = 'heightChange',
    VISIBLE_CHANGE = 'visibleChange',

    instances = [],
    current,
    body = Y.one('body'),
    next,

    POSITIONS = {
        top: ['tc', 0, -1, 'bc', 0.5, 0],
        bottom: ['bc', 0, 1, 'tc', 0.5, 1],
        left: ['lc', -1, 0, 'rc', 0, 0.5],
        right: ['rc', 1, 0, 'lc', 1, 0.5]
    },

    /**
     * A basic Overlay widget which support three types of animation. Use
     * show and hide function to display Overlay. Only one Overlay will show
     * in the same time.
     *
     * @class Overlay
     * @param [config] {Object} Object literal with initial attribute values
     * @extends Widget
     * @uses WidgetParent
     * @uses WidgetPosition
     * @uses WidgetStack
     * @uses WidgetPositionAlign
     * @uses Bottle.PushPop
     * @constructor
     * @namespace Bottle
     */
    Overlay = Y.Base.create('btoverlay', Y.Widget, [Y.WidgetParent, Y.WidgetPosition, Y.WidgetStack, Y.WidgetPositionAlign, Y.Bottle.PushPop], {
        initializer: function (cfg) {
            instances.push(this);

            if (!cfg.zIndex) {
                this.set('zIndex', 200);
            }

            /**
             * internal eventhandlers, keep for destructor
             *
             * @property _bscEventHandlers
             * @type EventHandle
             * @private
             */
            this._bscEventHandlers = new Y.EventHandle([
                this.after(WIDTH_CHANGE, this._updatePositionShow),
                this.after(HEIGHT_CHANGE, this._updatePositionShow),
                this.after(VISIBLE_CHANGE, this._doShowHide)
            ]);

            //this._updatePositionHide();
            //this._updatePositionShow();
        },

        destructor: function () {
            this._bscEventHandlers.detach();
            delete this._bscEventHandlers;
        },

        renderUI: function () {
            var O = this.get('boundingBox'),
                W = O.get('offsetWidth'),
                H = O.get('offsetHeight');

            if (!this.get('height') && H) {
                this.set('height', H);
            }

            if (!this.get('width') && W) {
                this.set('width', W);
            }
        },

        /**
         * Resize the Overlay to adapt the browser width and height.
         *
         * @method olResize
         * @param [force=false] {Boolean} <b>true</b> to forece resize even when Overlay is not visibile.
         */
        olResize: function (force) {
            //reduce syncUI times
            if (!force && (this.get('width') === Y.Bottle.Device.getBrowserWidth())) {
                return;
            }

            if (!force && (this.get('height') === Y.Bottle.Device.getBrowserHeight())) {
                return;
            }

            if (!this.get('visible') && !force) {
                return;
            }

            this._updateFullSize();
            this._updatePositionShow();
        },

        /**
         * handle child full Height or width
         *
         * @method _updateFullSize
         * @protected
         */
        _updateFullSize: function () {
            if (this.get('fullPage')) {
                this.set('width', Y.Bottle.Device.getBrowserWidth(), {noAlign: true});
                this.set('height', Y.Bottle.Device.getBrowserHeight(), {noAlign: true});
            }
        },

        /**
         * Update showed Overlay position based on action and showFrom
         *
         * @method _updatePositionShow
         * @protected
         */
        _updatePositionShow: function (E) {
            var pos = (E && E.showFrom) ? E.showFrom : this.get('showFrom'),
                vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),
                noAlign = (E && E.noAlign) ? true : false,
                posData = POSITIONS[pos];

            if (!vis) {
                return;
            }

            if (noAlign) {
                return;
            }
            if (this.get('fullPage')) {
                this.align(body, [posData[3], posData[3]]);
            } else {
                this.centered(body);
            }
        },

        /**
         * move the Overlay to hidden place
         *
         * @method _updatePositionHide
         * @protected
         */
        _updatePositionHide: function (E) {
            var vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),
                posData = POSITIONS[this.get('showFrom')];

            if (!vis) {
                this.align(null, [posData[3], posData[0]]);
            }
        },

        /**
         * Show or hide the mask.
         *
         * @method _displayMask
         * @param show {Boolean} true to display, false to hide.
         * @protected
         */
        _displayMask: function (show) {
            Mask.setStyle('display', show ? 'block' : 'none');
        },

        /**
         * do transition on a node with top and left css properties
         *
         * @method _doTransition
         * @param node {Node} node to do transition
         * @param left {Number} css left in px
         * @param top {Number} css top in px
         * @param [done] {Function} If provided, call this function when transition done
         * @protected
         */
        _doTransition: function (node, left, top, done) {
            var that = this;

            Y.later(1, this, function () {
                node.transition(Y.merge(this.get('olTrans'), {
                    left: left + 'px',
                    top: top + 'px'
                }), function () {
                    if (done) {
                        done.apply(that);
                    }
                });
            });
        },

        /**
         * handle Overlay transition when show or hide
         *
         * @method _doneShowHide
         * @protected
         */
        _doneShowHide: function () {
            var show = this.get('visible'),
                mask = this.get('mask');

            if (mask) {
                this._displayMask(show);
            }

            this.set('disabled', show ? false : true);

            if (next) {
                next.show();
                next = undefined;
            }
        },

        /**
         * handle Overlay transition when show or hide
         *
         * @method _doShowHide
         * @protected
         */
        _doShowHide: function (E) {
            var show = E.newVal,
                selfDir = show ? 0 : 1,
                pageDir = show ? -1 : 0,
                posData = POSITIONS[this.get('showFrom')],
                node = this.get('boundingBox'),
                pageRegion,
                nodeX,
                nodeY;

            if (show) {
                this.enable();
                this._updateFullSize();
                this._updatePositionHide({visible: false});
                current = this;
            } else {
                this._updatePositionShow({visible: true});
                if (this.get('mask')) {
                    this._displayMask(false);
                }
                current = undefined;
            }

            if (this.get('fullPage')) {
                this._doTransition(node, posData[4] * body.get('offsetWidth') + (selfDir * posData[1] - posData[4]) * this.get('width'), posData[5] * body.get('offsetHeight') + (selfDir * posData[2] - posData[5]) * this.get('height'), this._doneShowHide);
            } else {
                pageRegion = body.get('region');
                if (show) {
                    nodeX = pageRegion.left + Math.floor(pageRegion.width / 2) - (this.get('width') / 2);
                    nodeY = pageRegion.top + Math.floor(pageRegion.height / 2) - (this.get('height') / 2);
                } else {
                    switch (this.get('showFrom')) {
                    case 'top':
                        nodeX = pageRegion.left + Math.floor(pageRegion.width / 2) - (this.get('width') / 2);
                        nodeY = - this.get('height');
                        break;
                    case 'bottom':
                        nodeX = pageRegion.left + Math.floor(pageRegion.width / 2) - (this.get('width') / 2);
                        nodeY = pageRegion.bottom;
                        break;
                    case 'right':
                        nodeX = pageRegion.right;
                        nodeY = pageRegion.top + Math.floor(pageRegion.height / 2) - (this.get('height') / 2);
                        break;
                    case 'left':
                    default:
                        nodeX = - this.get('width');
                        nodeY = pageRegion.top + Math.floor(pageRegion.height / 2) - (this.get('height') / 2);
                        break;
                    }
                }
                this._doTransition(node, nodeX, nodeY, this._doneShowHide);
            }
        }
    }, {
        /**
         * Static property used to define the default attribute configuration.
         *
         * @property ATTRS
         * @protected
         * @type Object
         * @static
         */
        ATTRS: {
            /**
             * The Overlay show direction. Should be one of:
             * <dl>
             *  <dt>top</dt><dd>top</dd>
             *  <dt>left</dt><dd>left</dd>
             *  <dt>right</dt><dd>right</dd>
             *  <dt>bottom</dt><dd>bottom</dd>
             * </dl>
             *
             * @attribute showFrom
             * @type String
             * @default left
             */
            showFrom: {
                value: 'left',
                lazyAdd: false,
                validator: function (V) {
                    return POSITIONS[V] ? true : false;
                },
                setter: function (V) {
                    var F,
                        B = this.get('contentBox'),
                        fwh = POSITIONS[V][1];

                    if (V === this.get('showFrom')) {
                        return V;
                    }
                    this._updatePositionShow({showFrom: V});

                    return V;
                }
            },

            /**
             * Boolean indicating if Overlay needs to display mask or not.
             *
             * @attribute mask
             * @type Boolean
             * @default true
             */
            mask: {
                value: true,
                validator: Y.Lang.isBoolean,
                setter: function (V) {
                    if (this.get('visible')) {
                        this._displayMask(V);
                    }

                    return V;
                }
            },

            /**
             * Default transition setting for Overlay
             *
             * @attribute olTrans
             * @type Object
             * @default {dutation: 0.5}
             */
            olTrans: {
                value: {
                    duration: 0.5
                }
            },

            /**
             * Boolean indicating if Overlay needs to adjusting height to match viewport when it shows from top or bottom.
             *
             * @attribute fullPage
             * @type Boolean
             * @default true
             */
            fullPage: {
                value: true,
                validator: Y.Lang.isBoolean,
                lazyAdd: false,
                setter: function (V) {
                    if (V) {
                        this.olResize();
                    }
                    return V;
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
            mask: function (srcNode) {
                if (srcNode.getData('mask') === 'false') {
                    return false;
                }
                return true;
            },

            showFrom: function (srcNode) {
                return srcNode.getData('show-from');
            },

            olTrans: function (srcNode) {
                try {
                    return Y.JSON.parse(srcNode.getData('cfg-ol-trans'));
                } catch (e) {
                }
            },

            fullPage: function (srcNode) {
                if (srcNode.getData('full-page') === 'false') {
                    return false;
                }
                return true;
            }
        },

        /**
         * Get all instances of Overlay
         *
         * @method getInstances
         * @static
         * @return {Array} all instances of Overlay
         */
        getInstances: function () {
            return instances;
        },

        /**
         * Get current visilbe Overlay
         *
         * @method getCurrent
         * @static
         * @return {Object | undefined} current visible Overlay. If no any visible Overlay, return undefined.
         */
        getCurrent: function () {
            return current;
        }
    });

Y.Bottle.Overlay = Overlay;

//create Overlay mask
Mask.on('click', function () {
    current.hide();
});
