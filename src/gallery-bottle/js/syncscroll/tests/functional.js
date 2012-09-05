YUI().use('syncscroll-testlib', function (Y) {
    var suite = new Y.Test.Suite('SyncScroll test suite: Functional'),
        pg = Y.syncscrollTest.Instance,
        sc = Y.syncscrollTest.parentScroll,
        A = Y.Assert,
        B = Y.bottleTest;

    suite.add(new Y.Test.Case({
        'test scroll change width': function () {
            var test = this,
                called = false;
            pg.set('syncScrollMethod', function () {
                called = true;
            });
            sc.set('width', 200);
            this.wait(function () {
                A.isTrue(called, 'Change scroll width should callback to syncScrollMethod!');
            }, 1000);
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
