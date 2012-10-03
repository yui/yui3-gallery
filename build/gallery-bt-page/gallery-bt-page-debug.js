YUI.add('gallery-bt-page', function(Y) {

/**
 *
 * Provides Page widget which changes width and height with viewport.
 *
 * @module gallery-bt-page
 */

var ADDCHILD = 'addChild',
    current,
    instances = [];

/**
 * A basic Page Widget, which will automatically adapt the browser width
 * and height. Only one page will show in the same time. Use active
 * function can hide current page and show the other page. It also has
 * header and footer fixed support.
 *
 * @class Page
 * @constructor
 * @namespace Bottle
 * @extends PushPop
 * @uses WidgetParent
 * @uses WidgetPosition
 * @uses WidgetStack
 * @uses Bottle.PushPop
 * @param [config] {Object} Object literal with initial attribute values
 */
Y.Bottle.Page = Y.Base.create('btpage', Y.Widget, [Y.WidgetParent, Y.WidgetPosition, Y.WidgetStack, Y.Bottle.PushPop], {
    initializer: function () {
        instances.push(current = this);

        if (this.get('nativeScroll')) {
            this.get('boundingBox').addClass('btp-native');
        }

        this._bpgEventHandlers = new Y.EventHandle([
            this.after(ADDCHILD, this._afterPGAddChild)
        ]);
    },

    destructor: function () {
        this._bpgEventHandlers.detach();
        delete this._bpgEventHandlers;
    },

    /**
     * handle nativeScroll attribute when children added
     *
     * @method _afterPGAddChild
     * @protected
     */
    _afterPGAddChild: function (E) {
        E.child.set('nativeScroll', this.get('nativeScroll'));
    },

    /**
     * Resize the page to adapt the browser width and height. If the page enable the nativeScroll configuration, the widget height will not be touched
     *
     * @method resize
     */
    resize: function () {
        var W = Y.Bottle.Device.getBrowserWidth(),
            H = Y.Bottle.Device.getBrowserHeight();

        //reduce syncUI times
        if ((this.get('width') === W) && (this.get('height') === H)) {
            return;
        }

        if (this.get('nativeScroll')) {
            Y.fire('btSyncScreen');
            return;
        }
        
        this.setAttrs({width: W, height: H});
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
         * Use native browser scroll
         *
         * @attribute action
         * @type String
         * @default unveil
         */
        nativeScroll: {
            value: true,
            validator: Y.Lang.isBool,
            writeOnce: 'initOnly'
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
        nativeScroll: function (srcNode) {
            var D = srcNode.getData('native-scroll');

            if (D === 'false') {
                return false;
            }

            if (D === 'true') {
                return true;
            }
            return Y.Bottle.Device.getTouchSupport();
        }
    },

    /**
     * Get all instances of Page
     *
     * @method getInstances
     * @static
     * @return {Array} all instances of Page
     */
    getInstances: function () {
        return instances;
    },

    /**
     * Get current visible Page
     *
     * @method getCurrent
     * @static
     * @return {Object | undefined} current visible Page. If no any visible Page, return undefined.
     */
    getCurrent: function () {
        return current;
    }
});


}, '@VERSION@' ,{requires:['widget-position', 'widget-stack', 'gallery-bt-pushpop']});
