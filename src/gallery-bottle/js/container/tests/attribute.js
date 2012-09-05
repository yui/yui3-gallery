YUI().use('container-testlib', function (Y) {
    var suite = new Y.Test.Suite('Container test suite: Attributes'),
        container = Y.containerTest.Instance,
        node = Y.Node.create('<div></div>'),
        A = Y.Assert,
        B = Y.bottleTest;

    suite.add(new Y.Test.Case({
        'test bodyNode writeOnce': function () {
            B.writeOnce(container, 'bodyNode', node);
        },

        'test set cfgScroll invalid': function () {
            container.set('cfgScroll', 1);
            Y.containerTest.cfgScrollIsDefault();
        },

        'test set footerFixed invalid': function () {
            container.set('footerFixed', 1);
            A.isFalse(container.get('footerFixed'));
        },

        'test footerNode writeOnce': function () {
            B.writeOnce(container, 'footerNode', node);
        },

        'test set headerFixed invalid': function () {
            container.set('headerFixed', 1);
            A.isFalse(container.get('headerFixed'));
        },

        'test headerNode writeOnce': function () {
            B.writeOnce(container, 'headerNode', node);
        },

        'test scrollNode writeOnce': function () {
            B.writeOnce(container, 'scrollNode', 1);
        },

        'test scrollView writeOnce': function () {
            B.writeOnce(container, 'scrollView', 1);
        },

        'test set translate3D invalid': function () {
            container.set('translate3D', 1);
            A.isTrue(container.get('translate3D'));
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
