YUI().use('viewer-testlib', function (Y) {
    var suite = new Y.Test.Suite('Viewer test suite: Default Values'),
        viewer = Y.viewerTest.Instance,
        A = Y.Assert,
        B = Y.bottleTest;

    suite.add(new Y.Test.Case({
        'test pageNode: NodeList': function () {
            B.instanceOf(viewer.get('imageNode'), Y.NodeList);
            A.areSame(5, viewer.get('imageNode'));
        },

        'test cfgScroll: default': function () {
            A.areSame(false, viewer.get('flick'));
            A.areSame(0, viewer.get('bounce'));
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
