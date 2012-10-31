YUI().use('carousel-testlib', function (Y) {
    var suite = new Y.Test.Suite('Carousel test suite: Data Attributes'),
        carousel = Y.carouselTest.Instance,
        A = Y.Assert,
        B = Y.bottleTest;

    suite.add(new Y.Test.Case({
        'test selectedIndex: 1': function () {
            A.areSame(1, carousel.get('selectedIndex'));
        },

        'test pageItems: 2': function () {
            A.areSame(2, carousel.get('pageItems'));
        },

        'test textLeft: left': function () {
            A.areSame('left', carousel.get('textLeft'));
        },

        'test textRight: right': function () {
            A.areSame('right', carousel.get('textRight'));
        },

        'test pageNode: NodeList': function () {
            A.areSame(3, carousel.get('pageNode').size());
        },

        'test cfgScroll: ': function () {
            B.areSame(0.7, carousel.get('bounce'));
            B.areSame(0.6, carousel.get('deceleration'));
        },

        'test indexNode: BODY': function () {
            B.isTag('body', carousel.get('indexNode'));
        },

        'test showBottons: true': function () {
            A.isFalse(carousel.get('showButtons'));
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
