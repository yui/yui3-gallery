YUI().use('photogrid-testlib', function (Y) {
    var suite = new Y.Test.Suite('PhotoGrid test suite: Functional'),
        photogrid = Y.photogridTest.Instance,
        WAIT_RENDERING = 8000,
        A = Y.Assert,
        B = Y.bottleTest;

    suite.add(new Y.Test.Case({
        'test rendering': function () {
            var bounding = Y.one('.yui3-btphotogrid'),
                columns = bounding.all('.bpg_column'),
                num = columns.size(),
                last  = columns.item(num - 1);

            A.isObject(bounding);
            A.isTrue(num > 0);

            A.isTrue(bounding.get('offsetWidth') > 0);
            A.areSame(bounding.get('offsetWidth'), last.get('offsetWidth') + last.get('offsetLeft'));

            this.wait(function () {
                var nodes = Y.all('.bpg_module');

                A.areSame(32, nodes.size());
            }, WAIT_RENDERING);
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
