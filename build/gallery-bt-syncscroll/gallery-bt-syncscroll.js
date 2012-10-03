YUI.add('gallery-bt-syncscroll', function(Y) {

/**
 * Provide SyncScroll widget extension to sync status with parent scrollView
 *
 * @module gallery-bt-syncscroll
 * @static
 */

/**
 * SyncScroll is a Widget extension which can help you to handle size sync with parent scrollView
 *
 * @class SyncScroll
 * @namespace Bottle
 * @constructor
 * @param [config] {Object} Object literal with initial attribute values
 */
var  WIDTH_CHANGE = 'widthChange',

SyncScroll = function (config) {
    Y.on('btReady', this._bssInitParentScroll, this);
};

/**
 * Static property used to define the default attribute configuration.
 *
 * @property ATTRS
 * @type Object
 * @static
 * @protected
 */
SyncScroll.ATTRS = {
    /**
     * Default callback method when parent scroll width changed
     *
     * @attribute syncScrollMethod
     * @type Function
    */
    syncScrollMethod: {
        writeOnce: true,
        validator: Y.Lang.isFunction
    }
};

SyncScroll.prototype = {
    destructor: function () {
        if (this._bssResizeHandle) {
            this._bssResizeHandle.detach();
            delete this._bssResizeHandle;
        }
        if (this._bssHandle) {
            this._bssHandle.detach();
            delete this._bssHandle;
        }
        delete this._bssParentScroll;
    },

    /**
     * Do initialize for parent scrollView checking
     *
     * @method _bssInitParentScroll
     * @private
     */
    _bssInitParentScroll: function () {
        var V = this.get('syncScrollMethod'),
            pg = Y.Bottle.Page.getCurrent(),
            hs = [this.after(WIDTH_CHANGE, V, this)];

        this._bssParentScroll = Y.Widget.getByNode(this.get('boundingBox').ancestor('.yui3-scrollview'));

        if (V) {
            // sync width with parent scrollView
            if (this._bssParentScroll) {
                hs.push(this._bssParentScroll.after(WIDTH_CHANGE, V, this));
            }

            // sync width with screen width
            if (!pg || pg.get('nativeScroll')) {
                hs.push(Y.on('btSyncScreen', Y.bind(V, this)));
            }

            this._bssHandle = new Y.EventHandle(hs);
        }
        this.syncScroll();
    },

    /**
     * sync parent scrollView. If none, do nothing.
     *
     * @method syncScroll
     */
    syncScroll: function () {
        var ps = this._bssParentScroll;

        if (ps) {
            ps._uiDimensionsChange();
            this.fixScrollPosition();
        }
    },

    /**
     * fix parent scrollView scroll position. If none, do nothing.
     *
     * @method fixScrollPosition
     */
    fixScrollPosition: function () {
        var ps = this._bssParentScroll;

        if (ps && ps._maxScrollY) {
            ps.scrollTo(ps.get('scrollX'), Math.min(ps.get('scrollY'), ps._maxScrollY));
        }
    }
};

Y.namespace('Bottle').SyncScroll = SyncScroll;


}, '@VERSION@' ,{requires:['gallery-bt-page']});
