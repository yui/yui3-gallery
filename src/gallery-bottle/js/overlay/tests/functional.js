/*global YUI:true*/
YUI().use('overlay-testlib', function (Y) {
    'use strict';

    var suite = new Y.Test.Suite('Overlay test suite: Functional'),
        B = Y.bottleTest,
        page = Y.Bottle.Page.getCurrent(),
        basicMenu = Y.Widget.getByNode(Y.one('#overlayMenu')),
        overlayMenu2 = Y.Widget.getByNode(Y.one('#overlayMenu2')),
        waitTime = 1000,
        zIndexShow = 300,
        zIndexHide = 10,
        mask = 'mask',
        fullPage = 'fullPage',
        resetWH = function () {
            basicMenu.set('width', 200);
            basicMenu.set('height', 200);
        };

    suite.add(new Y.Test.Case({
        "test get Instances" : function () {
            Y.overlayTest.isInstances();
        },

        "test get Current" : function () {
            basicMenu.show();
            Y.overlayTest.isGetcurrent();
            basicMenu.hide();
            this.wait(function () { }, waitTime);
        },

        "test basic show" : function () {
            basicMenu.show();
            this.wait(function () {
                Y.overlayTest.isShow();
                Y.overlayTest.areZIndex(zIndexShow, basicMenu);
                Y.overlayTest.withMask();
                Y.overlayTest.isPageStay();
                Y.overlayTest.isFullPage();
            }, waitTime);
        },

        "test basic hide" : function () {
            basicMenu.hide();
            this.wait(function () {
                Y.overlayTest.isHide();
                Y.overlayTest.areZIndex(zIndexHide, basicMenu);
                Y.overlayTest.withoutMask();
                Y.overlayTest.isPageStay();
            }, waitTime);
        },

        "test overlay show without mask" : function () {
            basicMenu.set(mask, false);
            basicMenu.show();
            this.wait(function () {
                Y.overlayTest.isShow();
                Y.overlayTest.areZIndex(zIndexShow, basicMenu);
                Y.overlayTest.withoutMask();
                Y.overlayTest.isPageStay();
                Y.overlayTest.isFullPage();
            }, waitTime);
        },

        "test overlay hide without mask" : function () {
            basicMenu.hide();
            this.wait(function () {
                Y.overlayTest.isHide();
                Y.overlayTest.areZIndex(zIndexHide, basicMenu);
                Y.overlayTest.withoutMask();
                Y.overlayTest.isPageStay();
                basicMenu.set(mask, true);
            }, waitTime);
        },

        "test overlay show without fullPage" : function () {
            resetWH();
            basicMenu.set(fullPage, false);
            basicMenu.show();
            this.wait(function () {
                Y.overlayTest.isShow();
                Y.overlayTest.areZIndex(zIndexShow, basicMenu);
                Y.overlayTest.withMask();
                Y.overlayTest.isPageStay();
                Y.overlayTest.isNotFullPage();
            }, waitTime);
        },

        "test overlay hide without fullWidth" : function () {
            basicMenu.hide();
            this.wait(function () {
                Y.overlayTest.isHide();
                Y.overlayTest.areZIndex(zIndexHide, basicMenu);
                Y.overlayTest.withoutMask();
                Y.overlayTest.isPageStay();
                basicMenu.set(fullPage, true);
            }, waitTime);
        },

        "test hide after show another overlay" : function () {
            basicMenu.show();

            Y.later(waitTime, this, function () {
                overlayMenu2.show();
            });
            this.wait(function () {
                Y.overlayTest.isShow();
                Y.overlayTest.withMask();
                Y.overlayTest.areZIndex(zIndexShow, overlayMenu2);
                Y.overlayTest.areZIndex(zIndexHide, basicMenu);
            }, waitTime * 3);
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
