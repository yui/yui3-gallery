/*global YUI:true*/
YUI.add('overlay-testlib', function (Y) {
    'use strict';
    Y.Bottle.init();

    var A = Y.Assert,
        B = Y.bottleTest,
        BW = Y.Bottle.Device.getBrowserWidth(),
        BH = Y.Bottle.Device.getBrowserHeight(),
        Instances = Y.Bottle.Overlay.getInstances(),

        page = Y.Bottle.Page.getCurrent(),
        basicMenu = Y.Widget.getByNode(Y.one('#overlayMenu')),
        mask = Y.one('.bt-overlay-mask'),
        basicMenuBB = basicMenu.get('boundingBox'),

        overlay = function () {
            return Y.Bottle.Overlay.getCurrent();
        };

    Y.overlayTest = {

        isInstances : function () {
            A.isArray(Instances, 'The getInstances method is fail.');
            A.areSame(2, Instances.length, 'The getInstances method is fail.');
        },

        isGetcurrent : function () {
            A.isObject(overlay());
        },

        isShow : function () {
            A.isObject(overlay(), 'It dose not get current overlay.');
            A.isTrue(overlay().get('visible'), "It is not shown");
        },

        isHide : function () {
            A.isUndefined(overlay(), 'It dose not release overlay.');
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

        isPageStay : function () {
            A.areEqual('0px', page.get('boundingBox').getStyle('top'), 'The page moves');
            A.areEqual('0px', page.get('boundingBox').getStyle('left'), 'The page moves');
        },

        isFullPage : function () {
            B.isPxZero(basicMenuBB.getX(), 'The fullWidth is not false');
            B.isPxZero(basicMenuBB.getY(), 'The fullHeight is not false');
        },

        isNotFullPage : function () {
            A.areNotEqual(0, basicMenuBB.getX(), 'The fullWidth is not false');
            A.areNotEqual(0, basicMenuBB.getY(), 'The fullHeight is not false');
        }
    };

}, '0.0.1', {requires: ['bottle-testlib']});
