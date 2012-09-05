/*global YUI:true*/
YUI.add('shortcut-testlib', function (Y) {
    'use strict';
    Y.Bottle.init();

    var A = Y.Assert,
        B = Y.bottleTest,
        BW = Y.Bottle.Device.getBrowserWidth(),
        BH = Y.Bottle.Device.getBrowserHeight(),
        Instances = Y.Bottle.ShortCut.getInstances(),

        ACTION = {
            push: true,
            unveil: false
        },

        page = Y.Bottle.Page.getCurrent(),
        basicMenu = Y.Widget.getByNode(Y.one('#shortcutMenu')),
        mask = Y.one('.bt-shortcut-mask'),
        basicMenuBB = basicMenu.get('boundingBox'),
        basicMenuRegion = basicMenuBB.get('region'),

        shortcut = function () {
            return Y.Bottle.ShortCut.getCurrent();
        };

    Y.shortcutTest = {
        isPagePush : function () {
            var pageContent = Y.one('.yui3-btpage-content').get('children');

            A.areEqual(2, pageContent._nodes.length, 'The page of push is failed.');
            A.areEqual(shortcut().get('width'), pageContent.item(1).getX(), 'The page of push position is wrong.');
        },

        isPagePop : function () {
            var pageContent = Y.one('.yui3-btpage-content').get('children');

            A.areEqual(1, pageContent._nodes.length, 'The page of pop is failed.');
        },

        arePageFrom : function (sf, type) {
            var position = {
                    top: [page.get('boundingBox').getStyle('top'), basicMenuBB.getStyle('height')],
                    bottom: [page.get('boundingBox').getStyle('top'), ('-' + basicMenuBB.getStyle('height'))],
                    left: [page.get('boundingBox').getStyle('left'), basicMenuBB.getStyle('width')],
                    right: [page.get('boundingBox').getStyle('left'), ('-' + basicMenuBB.getStyle('width'))]
                },
                failMessage = 'The page of animation is wrong. The action is ' + type.action +'. The showFrom is ' + sf + '.';

            if (type.action) {
                if (position[sf][0] !== position[sf][1]) {
                    A.fail(failMessage);
                }
            } else {
                A.areEqual('0px', position[sf][0], failMessage);
            }
        },

        areShowFrom : function (sf, action) {
            var positions = {
                    top: [-(basicMenuRegion.height), BH, basicMenuBB.getY()],
                    bottom: [basicMenuRegion.height, BH, basicMenuBB.getY()],
                    left: [-(basicMenuRegion.width), BW, basicMenuBB.getX()],
                    right: [basicMenuRegion.width, BW, basicMenuBB.getX()]
                },
                failMessage = 'The animation of showFrom is fail. The action is ' + action +'. The showFrom is ' + sf + '.';

            if (ACTION[action]) {
                if (positions[sf][0] < 0 && positions[sf][2] < 0) {
                    return;
                } else if (positions[sf][0] > 0 && positions[sf][2] > positions[sf][1] - positions[sf][0]) {
                    return;
                } else {
                    A.fail(failMessage);
                }
            } else if (!ACTION[action]) {
                if (positions[sf][0] < 0 && positions[sf][2] === 0) {
                    return;
                } else if (positions[sf][0] > 0 && positions[sf][2] === positions[sf][1] - positions[sf][0]) {
                    return;
                } else {
                    A.fail(failMessage);
                }
            } else {
                A.fail(failMessage);
            }
        },

        isInstances : function () {
            A.isArray(Instances, 'The getInstances method is fail.');
            A.areSame(2, Instances.length, 'The getInstances method is fail.');
        },
        
        isGetcurrent : function () {
        	A.isObject(shortcut());
        },

        isUnveil : function () {
            A.areEqual(0, basicMenuBB.getX(), 'The basic unveil position is wrong');
        },

        isPush : function () {
            A.areNotEqual(0, basicMenuBB.getX(), 'The basic push position is wrong');
        },

        areAction : function (action) {
            A.areEqual(action, shortcut().get('action'), 'The action setting is wrong');
        },

        isShow : function () {
            A.isObject(shortcut(), 'It dose not get current shortcut.');
            A.isTrue(shortcut().get('visible'), "It is not shown");
        },

        isHide : function () {
            A.isUndefined(shortcut(), 'It dose not release shortcut.');
            A.isFalse(basicMenu.get('visible'), "It is not shown");
        },

        areZIndex : function (z, obj) {
            A.areEqual(z, obj.get('boundingBox').getStyle('zIndex'), 'The zIndex style is wrong');
        },

        withMask : function () {
            A.areEqual('block', mask.getStyle('display'), 'The mask is not show');
        },

        withoutMask : function () {
            A.areEqual('none', mask.getStyle('display'), 'The mask is not show');
        },

        isFullWidth : function () {
            B.isPxZero(basicMenuBB.getX(), 'The fullWidth is not false');
        },

        isFullHeight : function () {
            B.isPxZero(basicMenuBB.getY(), 'The fullHeight is not false');
        },

        isNotFullWidth : function () {
            A.areNotEqual(0, basicMenuBB.getX(), 'The fullWidth is not false');
        },

        isNotFullHeight : function () {
            A.areNotEqual(0, basicMenuBB.getY(), 'The fullHeight is not false');
        }
    };

}, '0.0.1', {requires: ['bottle-testlib']});
