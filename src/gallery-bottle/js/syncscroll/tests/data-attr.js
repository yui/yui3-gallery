YUI().use('syncscroll-testlib', function (Y) {
    var suite = new Y.Test.Suite('SyncScroll test suite: Data Attributes'),
        pg = Y.syncscrollTest.Instance,
        A = Y.Assert,
        B = Y.bottleTest;

    suite.add(new Y.Test.Case({
        'test autoWidth: true': function () {
            A.isTrue(pg.get('autoWidth'));
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
