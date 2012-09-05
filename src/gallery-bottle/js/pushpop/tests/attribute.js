/*global YUI:true*/
YUI().use('pushpop-testlib', function (Y) {
    'use strict';
    var suite = new Y.Test.Suite('PushPop test suite: Attributes'),
        waiting = 3000,
        page = Y.Bottle.Page.getCurrent(),
        A = Y.Assert,
        B = Y.bottleTest;

    suite.add(new Y.Test.Case({
        'test set pushFrom invalid': function () {
            page.set('pushFrom', 2);
            A.areSame('right', page.get('pushFrom'));
        },

        'test set ppTrans invalid': function () {
            page.set('ppTrans', 2);
            A.isObject(page.get('ppTrans'));
        },

        'test set underlay invalid': function () {
            page.set('underlay', 'arc');
            A.areSame('none', page.get('underlay'));
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
