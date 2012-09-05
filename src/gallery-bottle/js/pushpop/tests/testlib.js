/*global YUI:true*/
YUI.add('pushpop-testlib', function (Y) {
    'use strict';

    var container2 = new Y.Bottle.Container({
        srcNode: Y.one('#container').cloneNode(true),
    }),
    page,
    A = Y.Assert,
    B = Y.bottleTest;

    Y.Bottle.init();

    page = Y.Bottle.Page.getCurrent();
    page.get('contentBox').one('.subheader').set('innerHTML', '2 seconds later something will be pushed');
    container2.get('contentBox').one('.subheader').set('innerHTML', 'I am pushed');

    Y.pushpopTest = {
        Instance: container2,

        basicSetting: function () {
            A.areEqual('right', page.get('pushFrom'), 'The pushFrom configuration is failed');
            A.isObject(page.get('ppTrans'), 'The ppTrans configuration is not an object');
            A.areEqual(0.5, page.get('ppTrans').duration, 'The ppTrans configuration is failed');
            A.areEqual('none', page.get('underlay'), 'The underlay configuration is failed');
        },

        isNotInvalid: function () {
            A.areNotEqual(1, page.get('pushFrom'), 'The pushFrom configuration is invalid');
            A.areEqual('right', page.get('pushFrom'), 'The pushFrom configuration is failed');
            A.isObject(page.get('ppTrans'), 'The ppTrans configuration is not an object');
            A.areNotEqual('10', page.get('underlay'), 'The underlay configuration is invalid');
            A.areEqual('none', page.get('underlay'), 'The underlay configuration is failed');
        },

        hasAttrSetting: function () {
            A.areEqual('br', page.get('pushFrom'), 'The pushFrom configuration is failed');
            A.isObject(page.get('ppTrans'), 'The ppTrans configuration is not an object');
            A.areEqual(1, page.get('ppTrans').duration, 'The ppTrans configuration is failed');
            A.areEqual(1, page.get('underlay'), 'The underlay configuration is failed');
        },

        testSet: function () {
            A.areNotEqual(0, Y.one('.yui3-btpage-content').get('children').item(1).getX(), 'The set function is wrong.');
        },

        hasPush: function () {
            A.areEqual(2, Y.one('.yui3-btpage-content').get('children')._nodes.length, 'The push has not shown.');
        },

        underlayIsNone: function () {
            var target = Y.one('.yui3-btpage-content').get('lastChild');

            B.isPxZero(target.getStyle('left'), 'The push left result is wrong.');
            B.isPxZero(target.getStyle('top'), 'The push top result is wrong.');
        },

        hasPop: function () {
            A.areEqual(1, Y.one('.yui3-btpage-content').get('children')._nodes.length, 'The pop has not shown.');
        },

        containerIsReset: function () {
            var target = Y.one('.yui3-btpage-content').get('children').item(0);

            B.isPxZero(target.getStyle('left'), 'The left of container is not reset.');
            B.isPxZero(target.getStyle('top'), 'The top of container is not reset.');
        },

        testXDirection: function (position, direction) {
            var target = Y.one('.yui3-btpage-content').get('children').item(position).getX(),
                failMessage = 'The container' + position + ' animation of going to ' + direction + ' is wrong.';

            if (position === 0) {
                if (direction === 'right' && target < 0) {
                    return;
                } else if (direction === 'left' && target > 0) {
                    return;
                } else {
                    A.fail(failMessage);
                }
            } else if (position === 1) {
                if (direction === 'right' && target > 0) {
                    return;
                } else if (direction === 'left' && target < 0) {
                    return;
                } else {
                    A.fail(failMessage);
                }
            } else {
                A.fail(failMessage);
            }
        },

        testYDirection: function (position, direction) {
            var target = Y.one('.yui3-btpage-content').get('children').item(position).getY(),
                failMessage = 'The container' + position + ' animation of going to ' + direction + ' is wrong.';

            if (position === 0) {
                if (direction === 'bottom' && target < 0) {
                    return;
                } else if (direction === 'top' && target > 0) {
                    return;
                } else {
                    A.fail(failMessage);
                }
            } else if (position === 1) {
                if (direction === 'bottom' && target > 0) {
                    return;
                } else if (direction === 'top' && target < 0) {
                    return;
                } else {
                    A.fail(failMessage);
                }
            } else {
                A.fail(failMessage);
            }
        }
    };

}, '0.0.1', { requires: ['bottle-testlib'] });
