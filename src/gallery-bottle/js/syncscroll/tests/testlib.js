YUI.add('syncscroll-testlib', function (Y) {
    Y.Bottle.init();

    Y.syncscrollTest = {
        Instance: Y.Widget.getByNode(Y.one('[data-role=photogrid]')),
        parentScroll: Y.Widget.getByNode(Y.one('[data-role=page]'))
    };
}, '0.0.1' ,{requires:['bottle-testlib']});
