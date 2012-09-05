YUI().use('shortcut-testlib', function (Y) {
    var suite = new Y.Test.Suite('ShortCut test suite: Default Values'),
        A = Y.Assert,
        B = Y.bottleTest,
        basicMenu = Y.Widget.getByNode(Y.one('#shortcutMenu'));

    suite.add(new Y.Test.Case({
        'test action: unveil': function () {
        	A.areEqual('unveil', basicMenu.get('action'));
        },

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

        'test fullHeight: true': function () {
            A.isTrue(basicMenu.get('fullHeight'));
        },

        'test fullWidth: true': function () {
            A.isFalse(basicMenu.get('fullWidth'));
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
