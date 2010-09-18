YUI.add('gallery-carousel-anim', function(Y) {

/**
 * Create an animation plugin for the Carousel widget.
 *
 * @class CarouselAnimPlugin
 * @extends Plugin.Base
 * @param config {Object} Configuration options for the widget
 * @constructor
 */
function CarouselAnimPlugin() {
    CarouselAnimPlugin.superclass.constructor.apply(this, arguments);
}

// Some useful abbreviations
var JS = Y.Lang;

/**
 * The identity of the plugin.
 *
 * @property CarouselAnimPlugin.NAME
 * @type String
 * @default "carouselAnimPlugin"
 * @readOnly
 * @protected
 * @static
 */
CarouselAnimPlugin.NAME = "carouselAnimPlugin";

/**
 * The namespace for the plugin.
 *
 * @property CarouselAnimPlugin.NS
 * @type String
 * @default "anim"
 * @readOnly
 * @protected
 * @static
 */
CarouselAnimPlugin.NS = "anim";

/**
 * Static property used to define the default attribute configuration of the
 * plugin.
 *
 * @property CarouselAnimPlugin.ATTRS
 * @type Object
 * @protected
 * @static
 */
CarouselAnimPlugin.ATTRS = {
    /**
     * The configuration of the animation attributes for the Carousel. The
     * speed attribute takes the value in seconds; the effect attribute is used
     * to set one of the Animation Utility's built-in effects
     * (like YAHOO.util.Easing.easeOut)
     */
    animation: {
        validator: "_validateAnimation",
        value: { speed: 0, effect: Y.Easing.easeOut }
    }
};

Y.CarouselAnimPlugin = Y.extend(CarouselAnimPlugin, Y.Plugin.Base, {
    /**
     * Initialize the Animation plugin and plug the necessary events.
      *
      * @method initializer
      * @protected
     */
    initializer: function (config) {
        this.beforeHostMethod("scrollTo", this.animateAndScrollTo);
    },

    /**
     * Animate and scroll the Carousel widget to make the item at index
     * visible.
     *
     * @method animateAndScrollTo
     * @param {Number} index The index to be scrolled to
     * @public
     */
    animateAndScrollTo: function (index) {
        var self = this,
            anim, animation, carousel, cb, from, isVertical, to;

        if (this.get("host").get("rendered")) {
            Y.log("animateAndScrollTo(" + index + ") invoked", "info",
                  CarouselAnimPlugin.NAME);
            animation = self.get("animation");
            carousel = self.get("host");
            if (carousel && animation.speed > 0) {
                cb = carousel.get("contentBox");
                isVertical = carousel.get("isVertical");
                if (isVertical) {
                    from = { top: carousel.get("top") };
                    to = { top: carousel._getOffsetForIndex(index) };
                } else {
                    from = { left: carousel.get("left") };
                    to = { left: carousel._getOffsetForIndex(index) };
                }
                anim = new Y.Anim({
                    node: cb,
                    from: from,
                    to: to,
                    duration: animation.speed,
                    easing: animation.effect
                });
                anim.run();
                return new Y.Do.Prevent();
            }
        }

        return false;
    },

    /**
     * Validate the animation configuration attribute.
     *
     * @method _validateAnimation
     * @param {Object} config The animation configuration
     * @protected
     */
    _validateAnimation: function (config) {
        var rv = false;

        Y.log("_validateAnimation called with " + config, "info",
              CarouselAnimPlugin.NAME);
        if (JS.isObject(config)) {
            if (JS.isNumber(config.speed)) {
                rv = true;
            }
            if (!JS.isUndefined(config.effect) &&
                !JS.isFunction(config.effect)) {
                rv = false;
            }
        }

        return rv;
    },

    /*
     * The animation object.
     */
    _animObj: null
});


}, '@VERSION@' ,{requires:['gallery-carousel', 'anim', 'plugin', 'pluginhost']});
