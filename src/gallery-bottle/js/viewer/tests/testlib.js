YUI.add('viewer-testlib', function (Y) {
    Y.Bottle.init();

    Y.viewerTest = {
        Instance: Y.Widget.getByNode(Y.one('[data-role=viewer]'))
    };
}, '0.0.1' ,{requires:['bottle-testlib']});
