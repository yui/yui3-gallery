YUI().use('syncscroll-testlib', function (Y) {
    var suite = new Y.Test.Suite('SyncScroll test suite: Attributes'),
        pg = Y.syncscrollTest.Instance,
        A = Y.Assert,
        B = Y.bottleTest;

    suite.add(new Y.Test.Case({
        'test autoWidth writeOnce': function () {
            B.writeOnce(pg, 'autoWidth', true);
        },

        'test set syncScrollMethod invalid': function () {
            pg.set('syncScrollMethod', 'arc');
            A.isTrue(Y.Lang.isFunction(pg.get('syncScrollMethod')));
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
