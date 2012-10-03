YUI.add('gallery-bt-container', function(Y) {

/**
 * This module provides Container Widget which can handle scrollView with/without header/footer.
 * 
 * @module gallery-bt-container
 */
var HEIGHT_CHANGE = 'heightChange',
    WIDTH_CHANGE = 'widthChange',
    fixedPos = Y.Bottle.Device.getPositionFixedSupport(),

    handleFixPos = function (header, fixed, nativeScroll) {
        var node,
            pfix = fixed && fixedPos,
            ns = (nativeScroll !== undefined) ? nativeScroll : this.get('nativeScroll');

        if (this.get('scrollView')) {
            node = this.get(header ? 'headerNode' : 'footerNode');

            if (node) {
                node.setStyles({
                    position: (ns && pfix) ? 'fixed' : '',
                    top: (header && ns && pfix) ? 0 : '',
                    bottom: (!header && ns && pfix) ? 0 : '',
                    zIndex: (ns && pfix) ? 50 : ''
                });

                if (fixedPos) {
                    this.get('scrollView').get('boundingBox').setStyle(header ? 'marginTop' : 'marginBottom', (fixed && ns) ? (node.get('offsetHeight') + 'px') : 0);
                }
            }

            this.get(fixed ? 'srcNode' : 'scrollNode').insert(node, header ? 0 : undefined);

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
Y.namespace('Bottle').Container = Y.Base.create('btcontainer', Y.Widget, [Y.WidgetChild, Y.zui.Attribute], {
    initializer: function (config) {
        /**
         * internal eventhandlers, keep for destructor
         *
         * @property _btcEventHandlers
         * @type EventHandle
         * @private
         */
        this._btcEventHandlers = new Y.EventHandle([
            this.after(HEIGHT_CHANGE, this._syncScrollHeight),
            this.on(WIDTH_CHANGE, this._syncScrollWidth)
        ]);
    },

    destructor: function () {
        this._btcEventHandlers.detach();

        if (this.get('rendered')) {
            this.get('scrollView').destroy(true);
        }

        delete this._eventHandlers;
    },

    renderUI: function () {
        var scrollNode = Y.Node.create('<div class="bt-container-scroll"></div>'),
            srcNode = this.get('srcNode'),
            headerNode = this.get('headerNode'),
            bodyNode = this.get('bodyNode'),
            footerNode = this.get('footerNode'),
            scrollView = new Y.ScrollView(Y.merge(this.get('cfgScroll'), {
                srcNode: scrollNode
            }));

        this.set('scrollNode', scrollNode);
        this.set('scrollView', scrollView);

        srcNode.append(scrollNode);
        scrollNode.append(headerNode);
        scrollNode.append(bodyNode);
        scrollNode.append(footerNode);
        scrollView.render();

        // When HTML_PARSER running, there was no scrollView,
        // so we trigger value setter function again here.
        this.set_again('headerFixed');
        this.set_again('footerFixed');
        this.set_again('translate3D');
        this.set_again('nativeScroll');
    },

    /**
     * sync width of the scrollView with self
     *
     * @method _syncScrollWidth
     * @private
     */
    _syncScrollWidth: function (E) {
        var scroll = this.get('scrollView');

        if (scroll) {
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
        var height = this.get('height'),
            scroll = this.get('scrollView');

        if (!scroll || !height) {
            return;
        }

        Y.later(1, this, function () {
            height -= scroll.get('boundingBox').get('offsetTop');

            if (this.get('footerFixed')) {
                height -= this.get('footerNode').get('clientHeight');
            }
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
                var sv = this.get('scrollView');

                if (sv) {
                    sv.set('disabled', V);
                    if (V) {
                        sv.unplug(Y.zui.RAScroll);
                    } else {
                        sv.plug(Y.zui.RAScroll, {horizontal: false, cooperation: true});
                        if (!Y.Bottle.Device.getTouchSupport()) {
                            sv.plug(Y.zui.ScrollHelper);
                        }
                    }
                }

                handleFixPos.apply(this, [true, this.get('headerFixed'), V]);
                handleFixPos.apply(this, [false, this.get('footerFixed'), V]);
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
                var N = Y.one(node);
                if (N) {
                    N.addClass('bt-header');
                    this.set('headerFixed', N.getData('position') === 'fixed');
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
                var N = Y.one(node);
                if (N) {
                    N.addClass('bt-footer');
                    this.set('footerFixed', N.getData('position') === 'fixed');
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
                this.get('scrollNode').toggleClass('bt-translate3d', V);
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
                handleFixPos.apply(this, [true, fixed]);
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
                handleFixPos.apply(this, [false, fixed]);
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
            try {
                return Y.JSON.parse(srcNode.getData('cfg-scroll'));
            } catch (e) {
            }
        },

        translate3D: function (srcNode) {
            if (srcNode.getData('translate3d') === 'false') {
                return false;
            }
            return true;
        }
    }
});


}, '@VERSION@' ,{requires:['scrollview', 'widget-child', 'json-parse', 'gallery-zui-attribute', 'gallery-zui-rascroll', 'gallery-zui-scrollhelper', 'gallery-bt-device']});
