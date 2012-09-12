/**
 *
 * Provides Page widget which changes width and height with viewport.
 *
 * @module gallery-bt-page
 */

var current,
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
    },

    /**
     * Resize the page to adapt the browser width and height.
     *
     * @method resize
     */
    resize: function () {
        var b_width = Y.Bottle.Device.getBrowserWidth(),
            b_height = Y.Bottle.Device.getBrowserHeight();

        //reduce syncUI times
        if ((this.get('width') === b_width) && (this.get('height') === b_height)) {
            return;
        }

        this.setAttrs({
            'width': b_width,
            'height': b_height
        });
    }
}, {
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
