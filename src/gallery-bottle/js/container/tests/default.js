YUI().use('container-testlib', function (Y) {
    var suite = new Y.Test.Suite('Container test suite: Default Values'),
        container = Y.containerTest.Instance,
        A = Y.Assert,
        B = Y.bottleTest;

    suite.add(new Y.Test.Case({
        'test bodyNode: Node': function () {
            B.instanceOf(container.get('bodyNode'), Y.Node);
        },

        'test cfgScroll: default': function () {
            Y.containerTest.cfgScrollIsDefault();
        },

        'test fullHeight: false': function () {
            A.isTrue(container.get('fullHeight'));
        },

        'test footerFixed: false': function () {
            A.isFalse(container.get('footerFixed'));
        },

        'test footerNode: Node': function () {
            B.instanceOf(container.get('footerNode'), Y.Node);
        },

        'test headerFixed: false': function () {
            A.isFalse(container.get('headerFixed'));
        },

        'test headerNode: Node': function () {
            B.instanceOf(container.get('headerNode'), Y.Node);
        },

        // do not test scrollNode default, it will be set when rendering
        // do not test scrollView default, it will be set when rendering

        'test translate3D: true': function () {
            A.isTrue(container.get('translate3D'));
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
