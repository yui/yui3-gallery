YUI().use('overlay-testlib', function (Y) {
    var suite = new Y.Test.Suite('Overlay test suite: Default Values'),
        A = Y.Assert,
        B = Y.bottleTest,
        basicMenu = Y.Widget.getByNode(Y.one('#overlayMenu'));

    suite.add(new Y.Test.Case({

        'test showFrom: left': function () {
            A.areEqual('left', basicMenu.get('showFrom'));
        },

        'test mask: true': function () {
            A.isTrue(basicMenu.get('mask'));
        },

        'test scTrans: { duration: 0.5 }': function () {
            B.areSame({
                duration: 0.5
            }, basicMenu.get('scTrans'));
        },

        'test fullPage: true': function () {
            A.isTrue(basicMenu.get('fullPage'));
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
