YUI().use('viewer-testlib', function (Y) {
    var suite = new Y.Test.Suite('Viewer test suite: Attributes'),
        viewer = Y.viewerTest.Instance,
        node = Y.Node.create('<div></div>'),
        A = Y.Assert,
        B = Y.bottleTest;

    suite.add(new Y.Test.Case({
        'test imageNode writeOnce': function () {
            B.writeOnce(viewer, 'imageNode', node);
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
