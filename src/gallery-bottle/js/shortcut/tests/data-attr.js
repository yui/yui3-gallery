/*global YUI:true*/
YUI().use('shortcut-testlib', function (Y) {
    'use strict';
    var suite = new Y.Test.Suite('ShortCut test suite: Data Attributes'),
        A = Y.Assert,
        B = Y.bottleTest,
        basicMenu = Y.Widget.getByNode(Y.one('#shortcutMenu'));

    suite.add(new Y.Test.Case({
        'test action: push': function () {
           A.areEqual('push', basicMenu.get('action'));
        },

        'test showFrom: right': function () {
            A.areEqual('right', basicMenu.get('showFrom'));
        },
        
        'test mask: false': function () {
            A.isFalse(basicMenu.get('mask'));
        },

        'test cfgScTrans: from HTML': function () {
            B.areSame({
                duration: 2,
                easing: "ease-in-out"
            }, basicMenu.get('scTrans'));
        },

        'test fullHeight: false': function () {
            A.isFalse(basicMenu.get('fullHeight'));
        },
        
        'test fullWidth: false': function () {
            A.isFalse(basicMenu.get('fullWidth'));
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
