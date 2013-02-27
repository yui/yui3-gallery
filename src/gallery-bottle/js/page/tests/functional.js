YUI().use('page-testlib', function (Y) {
    var suite = new Y.Test.Suite('Page test suite: Functional'),
        node = Y.one('[data-role=page]'),
        page = Y.pageTest.Instance,
        A = Y.Assert,
        B = Y.bottleTest;

    suite.add(new Y.Test.Case({
        'test rendering': function () {
            A.isObject(node, 'page node does not exist');
            A.isTrue(node.get('parentNode').hasClass('yui3-widget'), 'Can not find yui3-widget class');
            A.isTrue(node.get('parentNode').hasClass('yui3-btpage'), 'Can not find yui3-btpage class');
        },

        'test getCurrent': function () {
            A.areSame(page, Y.Bottle.Page.getCurrent());
        },

        'test getInstances': function () {
            A.areSame(page, Y.Bottle.Page.getInstances()[0]);
            A.areSame(1, Y.Bottle.Page.getInstances().length);
        },

        'test getScrollY': function () {
            A.areSame(0, Y.Bottle.Page.getScrollY());
            Y.Bottle.Page.scrollTo(50);
            A.areSame(50, Y.Bottle.Page.getScrollY());
        },

        'test onScroll': function () {
            Y.Bottle.Page.onScroll(function () {
                alert('dummy function not exec in test');
            });
            A.isTrue(true);
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
