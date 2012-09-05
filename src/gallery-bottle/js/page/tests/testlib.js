YUI.add('page-testlib', function (Y) {
    Y.Bottle.init();

    Y.pageTest = {
        Instance: Y.Widget.getByNode(Y.one('[data-role=page]'))
    };
}, '0.0.1', {requires: ['bottle-testlib']});
