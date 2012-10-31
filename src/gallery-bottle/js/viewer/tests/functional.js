YUI().use('viewer-testlib', function (Y) {
    var suite = new Y.Test.Suite('Viewer test suite: Functional'),
        viewer = Y.viewerTest.Instance,
        A = Y.Assert,
        B = Y.bottleTest,
        bounding = Y.one('.yui3-btviewer'),

    suite.add(new Y.Test.Case({
        'test rendering': function () {
            A.isObject(bounding, 'can not find .yui3-btviewer');
            A.isTrue(bounding.hasClass('yui3-scrollview'), 'bounding box is not a scrollView');
            A.isTrue(bounding.hasClass('yui3-scrollview-horiz'), 'the scrollView should be horizontal');
            A.isFalse(bounding.hasClass('yui3-scrollview-vert'), 'the scrollView should not be vertical');
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
