/*global YUI:true*/
YUI().use('shortcut-testlib', function (Y) {
    'use strict';

    var suite = new Y.Test.Suite('ShortCut test suite: Functional'),
        B = Y.bottleTest,
        LEFT = 'left',
        RIGHT = 'right',
        TOP = 'top',
        BOTTOM = 'bottom',
        UNVEIL = 'unveil',
        PUSH = 'push',
        page = Y.Bottle.Page.getCurrent(),
        basicMenu = Y.Widget.getByNode(Y.one('#shortcutMenu')),
        sm2 = Y.Widget.getByNode(Y.one('#sm2')),
        waitTime = 1000,
        zIndexShow = 200,
        zIndexHide = 10,
        action = 'action',
        showFrom = 'showFrom',
        mask = 'mask',
        fullHeight = 'fullHeight',
        fullWidth = 'fullWidth',
        container2 = new Y.Bottle.Container({ srcNode: page.get('contentBox').cloneNode(true) }),
        resetWH = function () {
            basicMenu.set('width', 200);
            basicMenu.set('height', 200);
        };

    suite.add(new Y.Test.Case({
        "test get Instances" : function () {
            Y.shortcutTest.isInstances();
        },

        "test get Current" : function () {
            basicMenu.show();
            Y.shortcutTest.isGetcurrent();
            basicMenu.hide();
            this.wait(function () { }, waitTime);
        },

        "test basic show" : function () {
            basicMenu.show();
            Y.shortcutTest.isUnveil();
            Y.shortcutTest.areShowFrom(LEFT, UNVEIL);
            this.wait(function () {
                Y.shortcutTest.isShow();
                Y.shortcutTest.areZIndex(zIndexShow, basicMenu);
                Y.shortcutTest.withMask();
                Y.shortcutTest.areAction(UNVEIL);
                Y.shortcutTest.arePageFrom(LEFT, {action:true});
                Y.shortcutTest.isFullHeight();
            }, waitTime);
        },

        "test basic hide" : function () {
            resetWH();
            basicMenu.hide();
            this.wait(function () {
                Y.shortcutTest.isHide();
                Y.shortcutTest.areZIndex(zIndexHide, basicMenu);
                Y.shortcutTest.withoutMask();
                Y.shortcutTest.areShowFrom(LEFT, UNVEIL);
                Y.shortcutTest.arePageFrom(LEFT, {action:false});
            }, waitTime);
        },

        "test basic push show" : function () {
            basicMenu.set(action, PUSH);
            basicMenu.show();
            Y.shortcutTest.areShowFrom(LEFT, PUSH);
            Y.shortcutTest.isPush();
            this.wait(function () {
                Y.shortcutTest.isShow();
                Y.shortcutTest.areZIndex(zIndexShow, basicMenu);
                Y.shortcutTest.withMask();
                Y.shortcutTest.areAction(PUSH);
                Y.shortcutTest.arePageFrom(LEFT, {action:true});
                Y.shortcutTest.isFullHeight();
            }, waitTime);
        },

        "test basic push hide" : function () {
            resetWH();
            basicMenu.hide();
            this.wait(function () {
                Y.shortcutTest.isHide();
                Y.shortcutTest.areZIndex(zIndexHide, basicMenu);
                Y.shortcutTest.withoutMask();
                Y.shortcutTest.areShowFrom(LEFT, PUSH);
                Y.shortcutTest.arePageFrom(LEFT, {action:false});
            }, waitTime);
        },

        "test push show with right direction" : function () {
            basicMenu.set(showFrom, RIGHT);
            basicMenu.show();
            Y.shortcutTest.areShowFrom(RIGHT, PUSH);
            this.wait(function () {
                Y.shortcutTest.isShow();
                Y.shortcutTest.areZIndex(zIndexShow, basicMenu);
                Y.shortcutTest.withMask();
                Y.shortcutTest.areAction(PUSH);
                Y.shortcutTest.arePageFrom(RIGHT, {action:true});
                Y.shortcutTest.isFullHeight();
            }, waitTime);
        },

        "test push hide with right direction" : function () {
            resetWH();
            basicMenu.hide();
            this.wait(function () {
                Y.shortcutTest.isHide();
                Y.shortcutTest.areZIndex(zIndexHide, basicMenu);
                Y.shortcutTest.withoutMask();
                Y.shortcutTest.areShowFrom(RIGHT, PUSH);
                Y.shortcutTest.arePageFrom(RIGHT, {action:false});
            }, waitTime);
        },

        "test push show with top direction" : function () {
            basicMenu.set(showFrom, TOP);
            basicMenu.show();
            Y.shortcutTest.areShowFrom(TOP, PUSH);
            this.wait(function () {
                Y.shortcutTest.isShow();
                Y.shortcutTest.areZIndex(zIndexShow, basicMenu);
                Y.shortcutTest.withMask();
                Y.shortcutTest.areAction(PUSH);
                Y.shortcutTest.arePageFrom(TOP, {action:true});
                Y.shortcutTest.isFullWidth();
            }, waitTime);
        },

        "test push hide with top direction" : function () {
            resetWH();
            basicMenu.hide();
            this.wait(function () {
                Y.shortcutTest.isHide();
                Y.shortcutTest.areZIndex(zIndexHide, basicMenu);
                Y.shortcutTest.withoutMask();
                Y.shortcutTest.areShowFrom(TOP, PUSH);
                Y.shortcutTest.arePageFrom(TOP, {action:false});
            }, waitTime);
        },

        "test push show with bottom direction" : function () {
            basicMenu.set(showFrom, BOTTOM);
            basicMenu.show();
            Y.shortcutTest.areShowFrom(BOTTOM, PUSH);
            this.wait(function () {
                Y.shortcutTest.isShow();
                Y.shortcutTest.areZIndex(zIndexShow, basicMenu);
                Y.shortcutTest.withMask();
                Y.shortcutTest.areAction(PUSH);
                Y.shortcutTest.arePageFrom(BOTTOM, {action:true});
                Y.shortcutTest.isFullWidth();
            }, waitTime);
        },

        "test push hide with bottom direction" : function () {
            resetWH();
            basicMenu.hide();
            this.wait(function () {
                Y.shortcutTest.isHide();
                Y.shortcutTest.areZIndex(zIndexHide, basicMenu);
                Y.shortcutTest.withoutMask();
                Y.shortcutTest.areShowFrom(BOTTOM, PUSH);
                Y.shortcutTest.arePageFrom(BOTTOM, {action:false});
            }, waitTime);
        },

        "test push show without mask" : function () {
            basicMenu.set(mask, false);
            basicMenu.show();
            Y.shortcutTest.areShowFrom(BOTTOM, PUSH);
            this.wait(function () {
                Y.shortcutTest.isShow();
                Y.shortcutTest.areZIndex(zIndexShow, basicMenu);
                Y.shortcutTest.withoutMask();
                Y.shortcutTest.areAction(PUSH);
                Y.shortcutTest.arePageFrom(BOTTOM, {action:true});
            }, waitTime);
        },

        "test push hide without mask" : function () {
            resetWH();
            basicMenu.hide();
            this.wait(function () {
                Y.shortcutTest.isHide();
                Y.shortcutTest.areZIndex(zIndexHide, basicMenu);
                Y.shortcutTest.withoutMask();
                Y.shortcutTest.areShowFrom(BOTTOM, PUSH);
                Y.shortcutTest.arePageFrom(BOTTOM, {action:false});
                basicMenu.set(mask, true);
            }, waitTime);
        },

        "test push show without fullWidth" : function () {
            basicMenu.set(fullWidth, false);
            basicMenu.show();
            Y.shortcutTest.areShowFrom(BOTTOM, PUSH);
            this.wait(function () {
                Y.shortcutTest.isShow();
                Y.shortcutTest.areZIndex(zIndexShow, basicMenu);
                Y.shortcutTest.withMask();
                Y.shortcutTest.areAction(PUSH);
                Y.shortcutTest.arePageFrom(BOTTOM, {action:true});
                Y.shortcutTest.isNotFullWidth();
            }, waitTime);
        },

        "test push hide without fullWidth" : function () {
            resetWH();
            basicMenu.hide();
            this.wait(function () {
                Y.shortcutTest.isHide();
                Y.shortcutTest.areZIndex(zIndexHide, basicMenu);
                Y.shortcutTest.withoutMask();
                Y.shortcutTest.areShowFrom(BOTTOM, PUSH);
                Y.shortcutTest.arePageFrom(BOTTOM, {action:false});
                basicMenu.set(fullWidth, true);
            }, waitTime);
        },

        "test push show without fullHeight" : function () {
            basicMenu.set(showFrom, LEFT);
            basicMenu.set(fullHeight, false);
            basicMenu.show();
            Y.shortcutTest.areShowFrom(LEFT, PUSH);
            this.wait(function () {
                Y.shortcutTest.isShow();
                Y.shortcutTest.areZIndex(zIndexShow, basicMenu);
                Y.shortcutTest.withMask();
                Y.shortcutTest.areAction(PUSH);
                Y.shortcutTest.arePageFrom(LEFT, {action:true});
                Y.shortcutTest.isNotFullHeight();
            }, waitTime);
        },

        "test push hide without fullHeight" : function () {
            basicMenu.hide();
            this.wait(function () {
                Y.shortcutTest.isHide();
                Y.shortcutTest.areZIndex(zIndexHide, basicMenu);
                Y.shortcutTest.withoutMask();
                Y.shortcutTest.areShowFrom(LEFT, PUSH);
                Y.shortcutTest.arePageFrom(LEFT, {action:false});
                basicMenu.set(fullHeight, true);
            }, waitTime);
        },

        "test hide of without fullHeight" : function () {
            basicMenu.set(mask, false);
            basicMenu.hide();
            this.wait(function () {
                Y.shortcutTest.isHide();
                Y.shortcutTest.areZIndex(zIndexHide, basicMenu);
                Y.shortcutTest.withoutMask();
                Y.shortcutTest.areShowFrom(LEFT, PUSH);
                Y.shortcutTest.arePageFrom(LEFT, {action:false});
            }, waitTime);
        },

        "test hide after show another shortcut" : function () {
            basicMenu.show();
            
            Y.later(1000, this, function () {
                sm2.show();
            });
            this.wait(function () {
                Y.shortcutTest.isShow();
                Y.shortcutTest.withMask();
                Y.shortcutTest.areZIndex(zIndexShow, sm2);
                Y.shortcutTest.areZIndex(zIndexHide, basicMenu);
            }, waitTime * 3);
        },

        "test show push when page push" : function () {
            basicMenu.show();
            page.push(container2);
            Y.shortcutTest.areShowFrom(LEFT, PUSH);
            this.wait(function () {
                Y.shortcutTest.isShow();
                Y.shortcutTest.areZIndex(zIndexShow, basicMenu);
                Y.shortcutTest.withoutMask();
                Y.shortcutTest.areAction(PUSH);
                Y.shortcutTest.arePageFrom(LEFT, {action:true});
                Y.shortcutTest.isFullHeight();
                Y.shortcutTest.isPagePush();
            }, waitTime * 3);
        },

        "test show unveil when page pop" : function () {
            sm2.set(action, UNVEIL);
            sm2.show();
            page.pop(container2);
            Y.shortcutTest.areShowFrom(LEFT, UNVEIL);
            this.wait(function () {
                Y.shortcutTest.isShow();
                Y.shortcutTest.areZIndex(zIndexShow, sm2);
                Y.shortcutTest.withMask();
                Y.shortcutTest.isPagePop();
            }, waitTime * 3);
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
