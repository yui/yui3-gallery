YUI().use('loader-testlib', function (Y) {
    var suite = new Y.Test.Suite('Loader test suite: Data Attributes'),
        loader = Y.loaderTest.Instance,
        A = Y.Assert,
        B = Y.bottleTest;

    suite.add(new Y.Test.Case({
        'test actionNode: img': function () {
            A.areSame('img', loader.get('actionNode'));
        },

        'test actionAttr: alt': function () {
            A.areSame('alt', loader.get('actionAttr'));
        },

        'test action: insert': function () {
            A.areSame('insert', loader.get('action'));
        },

        'test parser: json': function () {
            var parser = loader.get('parser');

            B.areSame({a: 10}, parser('{"a": 10}'));
        },

        'test selector: data.msg': function () {
            A.areSame('data.msg', loader.get('selector'));
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
