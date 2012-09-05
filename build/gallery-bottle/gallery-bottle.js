YUI.add('gallery-bottle', function(Y) {

/**
 * The bottle module collects all UI components, and provides initialize functions.
 *
 * @module gallery-bottle
 */

/**
 * Bottle is the base namespace for all Bottle Classes or statuc methods
 *
 * @class Bottle
 */

//handle body width and height
var BOTTLE_INIT = 'btInit',
    BOTTLE_READY = 'btReady',
    body = Y.one('body'),
    inited = body.hasClass(BOTTLE_INIT),
    hideURL = false,

    resetBodySize = function () {
        if (hideURL) {
            window.scrollTo(0, 0);
        }

        body.setStyles({
            width: Y.Bottle.Device.getBrowserWidth(),
            height: Y.Bottle.Device.getBrowserHeight()
        });
    },

    initWidgets = function(css, cls) {
        Y.all(css).each(function (srcNode) {
            var unused = new cls({
                srcNode: srcNode,
                render: true
            });
        });
    },

    /**
     * Initialize bottle UI library , create instances with supported data-roles.
     *
     * @method init
     * @param hideURL {Boolean} auto hide URL Bar when bottle inited or orientation changed
     */
    init = function (hide) {
        var pageNode = Y.one('[data-role=page]'),
            unused;

        hideURL = hide;

        if (inited) {
            return;
        }

        if (pageNode) {
            Y.one('html').setStyle('overflow', 'hidden');
            body.setStyle('overflow', 'hidden');
        }

        body.addClass(BOTTLE_INIT);
        inited = true;

        initWidgets('[data-role=photogrid]', Y.Bottle.PhotoGrid);
        initWidgets('[data-role=carousel]', Y.Bottle.Carousel);
        initWidgets('[data-role=slidetab]', Y.Bottle.SlideTab);

        if (pageNode) {
            resetBodySize();
            unused = (new Y.Bottle.Page({srcNode: pageNode, render: true})).resize();
        }

        Y.all('[data-role=shortcut]').each(function (shortcutNode) {
            unused = new Y.Bottle.ShortCut({
                srcNode: shortcutNode,
                visible: false,
                disabled: true,
                render: body
            });
        });

        Y.all('[data-role=overlay]').each(function (overlayNode) {
            unused = new Y.Bottle.Overlay({
                srcNode: overlayNode,
                visible: false,
                disabled: true,
                render: body
            });
        });

        window.addEventListener((Y.UA.mobile == 'Apple') ? 'orientationchange' : 'resize', function () {
            var scCurrent = Y.Bottle.ShortCut.getCurrent(),
                overlayCurrent = Y.Bottle.Overlay.getCurrent(),
                page = Y.Bottle.Page.getCurrent();

            if (page) {
                resetBodySize();
                page.resize();
            }

            if (scCurrent) {
                scCurrent.scResize();
            }

            if (overlayCurrent) {
                overlayCurrent.scResize();
            }
        }, false);

        body.addClass(BOTTLE_READY);
        Y.publish(BOTTLE_READY, {fireOnce: true});
        Y.fire(BOTTLE_READY);
    };

Y.namespace('Bottle').init = init;


}, 'gallery-2012.09.05-20-01' ,{requires:['gallery-bt-device', 'gallery-bt-shortcut', 'gallery-bt-overlay', 'gallery-bt-photogrid', 'gallery-bt-slidetab', 'gallery-bt-carousel'], optional:['gallery-bt-css']});
