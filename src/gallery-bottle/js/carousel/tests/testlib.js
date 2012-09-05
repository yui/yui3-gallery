YUI.add('carousel-testlib', function (Y) {
    Y.Bottle.init();

    Y.carouselTest = {
        Instance: Y.Widget.getByNode(Y.one('[data-role=carousel]'))
    };
}, '0.0.1' ,{requires:['bottle-testlib']});
