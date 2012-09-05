YUI().use('photogrid-testlib', function (Y) {
    var suite = new Y.Test.Suite('PhotoGrid test suite: Data Attributes'),
        photogrid = Y.photogridTest.Instance,
        A = Y.Assert,
        B = Y.bottleTest;

    suite.add(new Y.Test.Case({
        'test columnWidth: 300': function () {
            A.areSame(300, photogrid.get('columnWidth'));
        },

        'test gridType: horizontal': function () {
            A.areSame('horizontal', photogrid.get('gridType'));
        },

        'test moduleNode: div': function () {
            A.areSame('div', photogrid.get('moduleNode'));
        },

        'test photoNode: h1': function () {
            A.areSame('h1', photogrid.get('photoNode'));
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
