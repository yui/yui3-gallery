/*global YUI:true*/
YUI().use('pushpop-testlib', function (Y) {
    'use strict';
    var suite = new Y.Test.Suite('PushPop test suite: Data Attributes'),
        page = Y.Bottle.Page.getCurrent(),
        A = Y.Assert,
        B = Y.bottleTest;

    suite.add(new Y.Test.Case({
        'test pushFrom: right': function () {
            A.areSame('br', page.get('pushFrom'));
        },

        'test ppTrans: from HTML': function () {
            B.areSame({
                duration: 1,
                easing: 'ease-in-out'
            }, page.get('ppTrans'));
        },

        'test underlay: after': function () {
            A.areSame(1, page.get('underlay'));
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
