YUI().use('syncscroll-testlib', function (Y) {
    var suite = new Y.Test.Suite('SyncScroll test suite: Default Values'),
        pg = Y.syncscrollTest.Instance,
        A = Y.Assert,
        B = Y.bottleTest;

    suite.add(new Y.Test.Case({
        'test autoWidth: false': function () {
            A.isFalse(pg.get('autoWidth'));
        },

        'test syncScrollMethod: function': function () {
            A.areSame(pg._updateColumns, pg.get('syncScrollMethod'));
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
