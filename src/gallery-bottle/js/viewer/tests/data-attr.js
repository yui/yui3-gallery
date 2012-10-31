YUI().use('viewer-testlib', function (Y) {
    var suite = new Y.Test.Suite('Viewer test suite: Data Attributes'),
        viewer = Y.viewerTest.Instance,
        A = Y.Assert,
        B = Y.bottleTest;

    suite.add(new Y.Test.Case({
        'test imageNode: .img': function () {
            A.areSame(1, viewer.get('imageNode').size());
        },

        'test cfgScroll': function () {
            B.areSame(0.6, viewer.get('deceleration'));
            A.areSame(0.7, viewer.get('bounce'));
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
