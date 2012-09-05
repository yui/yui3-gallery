YUI().use('carousel-testlib', function (Y) {
    var suite = new Y.Test.Suite('Carousel test suite: Default Values'),
        carousel = Y.carouselTest.Instance,
        A = Y.Assert,
        B = Y.bottleTest;

    suite.add(new Y.Test.Case({
        'test selectedIndex: 0': function () {
            A.areSame(0, carousel.get('selectedIndex'));
        },

        'test textLeft: ""': function () {
            A.areSame('', carousel.get('textLeft'));
        },

        'test textRight: ""': function () {
            A.areSame('', carousel.get('textRight'));
        },

        'test pageNode: NodeList': function () {
            B.instanceOf(carousel.get('pageNode'), Y.NodeList);
        },

        'test cfgScroll: default': function () {
            B.areSame({minDistance: 10, minVelocity: 0.3}, carousel.get('flick'));
        },

        'test indexNode: undefined': function () {
            A.areSame(undefined, carousel.get('indexNode'));
        },

        'test pageItems: 1': function () {
            A.areSame(1, carousel.get('pageItems'));
        },

        'test showBottons: true': function () {
            A.isTrue(carousel.get('showButtons'));
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
