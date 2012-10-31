YUI().use('container-testlib', function (Y) {
    var suite = new Y.Test.Suite('Container test suite: Data Attributes'),
        container = Y.containerTest.Instance,
        A = Y.Assert,
        B = Y.bottleTest;

    suite.add(new Y.Test.Case({
        'test footerFixed: true': function () {
            A.isTrue(container.get('footerFixed'));
        },

        'test headerFixed: true': function () {
            A.isTrue(container.get('headerFixed'));
        },

        'test fullHeight: false': function () {
            A.isFalse(container.get('fullHeight'));
        },

        'test cfgScroll: from HTML': function () {
            B.areSame({
                deceleration: 0.5
            }, container.get('cfgScroll'));
        },

        'test translate3D: false': function () {
            A.isFalse(container.get('translate3D'));
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
