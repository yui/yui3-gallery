YUI().use('carousel-testlib', function (Y) {
    var suite = new Y.Test.Suite('Carousel test suite: Functional'),
        carousel = Y.carouselTest.Instance,
        A = Y.Assert,
        B = Y.bottleTest,
        bounding = Y.one('.yui3-btcarousel'),
        items = carousel.get('pageNode');

    suite.add(new Y.Test.Case({
        'test rendering': function () {
            A.isObject(bounding, 'can not find .yui3-btcarousel');
            A.isTrue(bounding.hasClass('yui3-scrollview'), 'bounding box is not a scrollView');
            A.isTrue(bounding.hasClass('yui3-scrollview-horiz'), 'the scrollView should be horizontal');
            A.isFalse(bounding.hasClass('yui3-scrollview-vert'), 'the scrollView should not be vertical');
        },

        'test pageItems': function () {
            var W = bounding.get('offsetWidth');

            items.each(function (O) {
                A.areSame(W, O.get('offsetWidth'), 'page item width should be same as bounding box');
            });
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
