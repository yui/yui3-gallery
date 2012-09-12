YUI().use('loader-testlib', function (Y) {
    var suite = new Y.Test.Suite('Loader test suite: Default Values'),
        loader = Y.loaderTest.Instance,
        A = Y.Assert,
        B = Y.bottleTest;

    suite.add(new Y.Test.Case({
        'test actionNode: a': function () {
            A.areSame('a', loader.get('actionNode'));
        },

        'test actionAttr: href': function () {
            A.areSame('href', loader.get('actionAttr'));
        },

        'test action: append': function () {
            A.areSame('append', loader.get('action'));
        },

        'test parser: none': function () {
            var parser = loader.get('parser');

            A.areSame('123abc', parser('123abc'));
        },

        'test selector: *': function () {
            A.areSame('*', loader.get('selector'));
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
