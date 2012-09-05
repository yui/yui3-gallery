YUI().use('photogrid-testlib', function (Y) {
    var suite = new Y.Test.Suite('PhotoGrid test suite: Default Values'),
        photogrid = Y.photogridTest.Instance,
        A = Y.Assert,
        B = Y.bottleTest;

    suite.add(new Y.Test.Case({
        'test columnWidth: 200': function () {
            Y.photogridTest.columnWidthIsDefault();
        },

        'test gridType: vertical': function () {
            Y.photogridTest.gridTypeIsDefault();
        },

        'test moduleNode: > div': function () {
            A.areSame('> div', photogrid.get('moduleNode'));
        },

        'test photoNode: .img': function () {
            A.areSame('.img', photogrid.get('photoNode'));
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
