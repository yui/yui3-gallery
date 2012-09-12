YUI().use('loader-testlib', 'node-event-simulate', function (Y) {
    var suite = new Y.Test.Suite('Loader test suite: Functional'),
        loader = Y.loaderTest.Instance,
        node = loader.get('contentBox'),
        ajaxTime = 2000,
        A = Y.Assert,
        B = Y.bottleTest;

    suite.add(new Y.Test.Case({
        'test click then ajax append': function () {
            var link = Y.all('a:not([data-action])').item(1);

            A.isFalse(Y.Lang.isObject(link.next('title')));
            link.simulate('click');

            this.wait(function () {
                A.isTrue(link.hasClass('blo_loaded'));
                A.isTrue(Y.Lang.isObject(link.next('title')));
            }, ajaxTime);
        },

        'test click then ajax error': function () {
            var link = Y.all('a:not([data-action])').item(0);

            link.simulate('click');

            this.wait(function () {
                link.hasClass('blo_error');
            }, ajaxTime);
        },

        'test click then ajax replace': function () {
            var link = Y.one('a[data-action=replace]');

            A.isTrue(Y.Lang.isObject(link.previous()));
            link.simulate('click');

            this.wait(function () {
                A.isTrue(link.hasClass('blo_loaded'));
                A.isFalse(Y.Lang.isObject(link.previous()));
            }, ajaxTime);
        },

        'test click then ajax insert': function () {
            var link = Y.one('a[data-action=insert]');

            A.isFalse(Y.Lang.isObject(link.previous('meta')));
            link.simulate('click');

            this.wait(function () {
                A.isTrue(link.hasClass('blo_loaded'));
                A.isTrue(Y.Lang.isObject(link.previous('meta')));
            }, ajaxTime);
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
