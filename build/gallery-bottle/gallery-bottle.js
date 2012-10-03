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
    BOTTLE_NATIVE = 'btNative',
    SYNC_SCREEN = 'btSyncScreen',
    htmlbody = Y.all('html, body'),
    body = Y.one('body'),
    btRoot = Y.one('.btRoot') || body.appendChild(Y.Node.create('<div class="btRoot"></div>')),
    inited = body.hasClass(BOTTLE_INIT),
    hideURL = false,
    nativeScroll = true,
    styles = {
        hidden: {overflow: 'hidden'},
        scroll: {
            overflow: 'auto',
            overflowX: 'hidden'
        }
    },

    resetBodySize = function (resize) {
        if (hideURL && !resize) {
            window.scrollTo(0, 1);
        }

        if (nativeScroll) {
            return;
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
            pageWidget;

        hideURL = hide;

        if (inited) {
            return;
        }

        if (pageNode) {
            htmlbody.setStyles(styles.hidden);
        }

        body.addClass(BOTTLE_INIT);
        inited = true;


        initWidgets('[data-role=photogrid]', Y.Bottle.PhotoGrid);
        initWidgets('[data-role=carousel]', Y.Bottle.Carousel);
        initWidgets('[data-role=slidetab]', Y.Bottle.SlideTab);
        initWidgets('[data-role=loader]', Y.Bottle.Loader);

        if (pageNode) {
            resetBodySize();

            pageWidget = new Y.Bottle.Page({srcNode: pageNode, render: true});
            pageWidget.resize();

            if (pageWidget.get('nativeScroll')) {
                htmlbody.setStyles(styles.scroll);
                body.addClass(BOTTLE_NATIVE);
                pageWidget.item(0).get('scrollView').disable();
                Y.publish(BOTTLE_NATIVE, {fireOnce: true});
                Y.fire(BOTTLE_NATIVE);
                Y.publish(SYNC_SCREEN);

                // disable scroll on shortcut and overlay
                btRoot.on('gesturemove', function (E) {
                    E.preventDefault();
                }, {standAlone:true, root: btRoot});
            } else {
                nativeScroll = false;
                resetBodySize();
            }
        }

        Y.all('[data-role=shortcut]').each(function (shortcutNode) {
            var unused = new Y.Bottle.ShortCut({
                srcNode: shortcutNode,
                visible: false,
                disabled: true,
                render: btRoot
            });
        });

        Y.all('[data-role=overlay]').each(function (overlayNode) {
            var unused = new Y.Bottle.Overlay({
                srcNode: overlayNode,
                visible: false,
                disabled: true,
                render: btRoot
            });
        });

        window.addEventListener((Y.UA.mobile == 'Apple') ? 'orientationchange' : 'resize', function () {
            var scCurrent = Y.Bottle.ShortCut.getCurrent(),
                overlayCurrent = Y.Bottle.Overlay.getCurrent(),
                page = Y.Bottle.Page.getCurrent();

            if (page) {
                resetBodySize(true);
                page.resize();
            } else {
                Y.fire(SYNC_SCREEN);
            }

            if (scCurrent) {
                scCurrent.scResize();
            }

            if (overlayCurrent) {
                overlayCurrent.olResize();
            }
        }, false);

        body.addClass(BOTTLE_READY);
        Y.publish(BOTTLE_READY, {fireOnce: true});
        Y.fire(BOTTLE_READY);
    };

Y.namespace('Bottle').init = init;


}, 'gallery-2012.10.03-20-02' ,{skinnable:true, requires:['gallery-bt-shortcut', 'gallery-bt-overlay', 'gallery-bt-photogrid', 'gallery-bt-slidetab', 'gallery-bt-carousel', 'gallery-bt-loader']});
