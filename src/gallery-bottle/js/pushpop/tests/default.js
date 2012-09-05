/*global YUI:true*/
YUI().use('pushpop-testlib', function (Y) {
    'use strict';
    var suite = new Y.Test.Suite('PushPop test suite: Default Values'),
        waiting = 250,
        page = Y.Bottle.Page.getCurrent(),
        A = Y.Assert,
        B = Y.bottleTest;

    suite.add(new Y.Test.Case({
        'test pushFrom: right': function () {
            A.areSame('right', page.get('pushFrom'));
        },

        'test ppTrans: default': function () {
            B.areSame({duration: 0.5}, page.get('ppTrans'));
        },
        
        'test underlay: none': function () {
            A.areSame('none', page.get('underlay'));
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
