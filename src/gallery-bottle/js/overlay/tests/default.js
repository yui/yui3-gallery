YUI().use('overlay-testlib', function (Y) {
    var suite = new Y.Test.Suite('Overlay test suite: Default Values'),
        A = Y.Assert,
        B = Y.bottleTest,
        basicMenu = Y.Widget.getByNode(Y.one('#overlayMenu'));

    suite.add(new Y.Test.Case({

        'test showFrom: left': function () {
            A.areEqual('left', basicMenu.get('showFrom'));
        },

        'test mask: false': function () {
            A.isFalse(basicMenu.get('mask'));
        },

        'test olTrans: { duration: 0.5 }': function () {
            B.areSame({
                duration: 0.5
            }, basicMenu.get('olTrans'));
        },

        'test fullPage: true': function () {
            A.isTrue(basicMenu.get('fullPage'));
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
