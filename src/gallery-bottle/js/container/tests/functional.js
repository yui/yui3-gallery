YUI().use('container-testlib', function (Y) {
    var suite = new Y.Test.Suite('Container test suite: Functional'),
        container = Y.containerTest.Instance,
        A = Y.Assert,
        B = Y.bottleTest;

    suite.add(new Y.Test.Case({
        'test headerFixed': function () {
            Y.containerTest.headerShouldBeNotFixed();
            container.set('headerFixed', true);
            Y.containerTest.headerShouldBeFixed();
        },
        'test footerFixed': function () {
            Y.containerTest.footerShouldBeNotFixed();
            container.set('footerFixed', true);
            Y.containerTest.footerShouldBeFixed();
        },
        'test translate3D': function () {
            container.set('translate3D', false);
            A.isNull(Y.one('.bt-translate3d'));
            container.set('translate3D', true);
            A.isObject(Y.one('.bt-translate3d'));
        },

        'test rendering': function () {
            A.isObject(Y.one('.bt-container-scroll'));
            A.isObject(Y.one('.yui3-scrollview-content'));
            A.isObject(Y.one('.yui3-scrollview'));
            A.isObject(Y.one('.yui3-btcontainer'));
            A.isTrue(Y.one('.yui3-btcontainer').get('offsetHeight') > 0);
            A.isTrue(Y.one('.yui3-btcontainer').get('offsetWidth') > 0);
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
