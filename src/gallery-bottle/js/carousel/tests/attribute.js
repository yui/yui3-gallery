YUI().use('carousel-testlib', function (Y) {
    var suite = new Y.Test.Suite('Carousel test suite: Attributes'),
        carousel = Y.carouselTest.Instance,
        node = Y.Node.create('<div></div>'),
        A = Y.Assert,
        B = Y.bottleTest;

    suite.add(new Y.Test.Case({
        'test indexNode writeOnce': function () {
            carousel.set('indexNode', 'body');
            B.writeOnce(carousel, 'indexNode', node);
        },

        'test pageNode writeOnce': function () {
            B.writeOnce(carousel, 'pageNode', node);
        },

        'test selectedIndex range': function () {
            carousel.set('selectedIndex', -1);
            A.areSame(0, carousel.get('selectedIndex'));

            carousel.set('selectedIndex', 8);
            A.areSame(0, carousel.get('selectedIndex'));

            carousel.set('selectedIndex', 7);
            A.areSame(7, carousel.get('selectedIndex'));
        },

        'test next': function () {
            carousel.set('selectedIndex', 0);
            A.areSame(0, carousel.get('selectedIndex'));

            carousel.pages.next();
            A.areSame(1, carousel.get('selectedIndex'));

            carousel.pages.next();
            A.areSame(2, carousel.get('selectedIndex'));

            carousel.pages.next();
            carousel.pages.next();
            carousel.pages.next();
            carousel.pages.next();
            carousel.pages.next();
            A.areSame(7, carousel.get('selectedIndex'));

            carousel.pages.next();
            carousel.pages.next();
            carousel.pages.next();
            A.areSame(7, carousel.get('selectedIndex'));
        },

        'test prev': function () {
            carousel.set('selectedIndex', 7);
            A.areSame(7, carousel.get('selectedIndex'));

            carousel.pages.prev();
            A.areSame(6, carousel.get('selectedIndex'));

            carousel.pages.prev();
            A.areSame(5, carousel.get('selectedIndex'));

            carousel.pages.prev();
            carousel.pages.prev();
            carousel.pages.prev();
            carousel.pages.prev();
            carousel.pages.prev();
            A.areSame(0, carousel.get('selectedIndex'));

            carousel.pages.prev();
            carousel.pages.prev();
            carousel.pages.prev();
            A.areSame(0, carousel.get('selectedIndex'));
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
