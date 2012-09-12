/*global YUI:true*/
YUI().use('loader-testlib', function (Y) {
    'use strict';
    var suite = new Y.Test.Suite('Loader test suite: Attributes'),
        loader = Y.loaderTest.Instance,
        A = Y.Assert,
        B = Y.bottleTest;

    suite.add(new Y.Test.Case({
        'test actionNode writeOnce': function () {
            loader.set('actionNode', 'b');
            A.areSame('a', loader.get('actionNode'));
        },

        'test actionAttr invalid': function () {
            loader.set('actionAttr', 1);
            A.areSame('href', loader.get('actionAttr'));
        },

        'test action invalid': function () {
            loader.set('action', 1);
            A.areSame('append', loader.get('action'));
        },

        'test parser invalid': function () {
            loader.set('parser', 'test');
            A.isTrue(Y.Lang.isFunction(loader.get('parser')));
        },

        'test selector invalid': function () {
            loader.set('selector', 1);
            A.areSame('*', loader.get('selector'));
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
