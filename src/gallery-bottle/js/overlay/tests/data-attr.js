/*global YUI:true*/
YUI().use('overlay-testlib', function (Y) {
    'use strict';
    var suite = new Y.Test.Suite('Overlay test suite: Data Attributes'),
        A = Y.Assert,
        B = Y.bottleTest,
        basicMenu = Y.Widget.getByNode(Y.one('#overlayMenu'));

    suite.add(new Y.Test.Case({

        'test showFrom: right': function () {
            A.areEqual('right', basicMenu.get('showFrom'));
        },

        'test mask: false': function () {
            A.isFalse(basicMenu.get('mask'));
        },

        'test olTrans: from HTML': function () {
            B.areSame({
                duration: 2,
                easing: "ease-in-out"
            }, basicMenu.get('olTrans'));
        },

        'test fullPage: false': function () {
            A.isFalse(basicMenu.get('fullPage'));
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
