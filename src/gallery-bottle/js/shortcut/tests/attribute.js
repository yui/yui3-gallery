/*global YUI:true*/
YUI().use('shortcut-testlib', function (Y) {
    'use strict';
    var suite = new Y.Test.Suite('ShortCut test suite: Attributes'),
        A = Y.Assert,
        B = Y.bottleTest,
        basicMenu = Y.Widget.getByNode(Y.one('#shortcutMenu'));

    suite.add(new Y.Test.Case({
        'test action invalid': function () {
            basicMenu.set('action', 1);
            A.areEqual('unveil', basicMenu.get('action'));
        },

        'test showFrom invalid': function () {
            basicMenu.set('showFrom', 1);
            A.areEqual('left', basicMenu.get('showFrom'));
        },

        'test mask invalid': function () {
            basicMenu.set('mask', 1);
            A.isTrue(basicMenu.get('mask'));
        },

        'test scTrans invalid': function () {
            basicMenu.set('scTrans', 1);
            B.areSame({
                duration: undefined
            }, basicMenu.get('scTrans'));
        },

        'test fullHeight invalid': function () {
            basicMenu.set('fullHeight', 1);
            A.isTrue(basicMenu.get('fullHeight'));
        },

        'test fullWidth invalid': function () {
            basicMenu.set('fullWidth', 1);
            A.isFalse(basicMenu.get('fullWidth'));
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
