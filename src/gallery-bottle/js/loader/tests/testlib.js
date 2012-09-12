YUI.add('loader-testlib', function (Y) {
    Y.Bottle.init();

    Y.loaderTest = {
        Instance: Y.Widget.getByNode(Y.one('[data-role=loader]'))
    };
}, '0.0.1' ,{requires:['bottle-testlib']});
