/*global YUI:true*/
YUI().use('overlay-testlib', function (Y) {
    'use strict';
    var suite = new Y.Test.Suite('Overlay test suite: Attributes'),
        A = Y.Assert,
        B = Y.bottleTest,
        basicMenu = Y.Widget.getByNode(Y.one('#overlayMenu'));

    suite.add(new Y.Test.Case({

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

        'test fullPage invalid': function () {
            basicMenu.set('fullPage', 1);
            A.isTrue(basicMenu.get('fullPage'));
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
