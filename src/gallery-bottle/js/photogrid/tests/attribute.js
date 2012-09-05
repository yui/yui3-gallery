YUI().use('photogrid-testlib', function (Y) {
    var suite = new Y.Test.Suite('PhotoGrid test suite: Attributes'),
        photogrid = Y.photogridTest.Instance,
        A = Y.Assert,
        B = Y.bottleTest;

    suite.add(new Y.Test.Case({
        'test set columnWidth invalid': function () {
            photogrid.set('columnWidth', 'a');
            photogrid.set('columnWidth', 0);
            photogrid.set('columnWidth', '-1');
            photogrid.set('columnWidth', -1);
            Y.photogridTest.columnWidthIsDefault();
        },

        'test set gridType invalid': function () {
            photogrid.set('gridType', 1);
            Y.photogridTest.gridTypeIsDefault();
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
