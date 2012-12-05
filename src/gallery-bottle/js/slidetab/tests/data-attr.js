YUI().use('slidetab-testlib', function (Y) {
    var suite = new Y.Test.Suite('SlideTab test suite: Data Attributes'),
        slide = Y.slidetabTest.Instance,
        A = Y.Assert,
        B = Y.bottleTest;

    suite.add(new Y.Test.Case({
        'test labelNode: img': function () {
            B.isTag('img', slide.get('labelNode'));
        },

        'test labelWidth: 60': function () {
            A.areSame(60, slide.get('labelWidth'));
        },

        'test lazyLoad: false': function () {
            A.isFalse(slide.get('lazyLoad'));
        },

        'test selectedIndex: 1': function () {
            A.areSame(1, slide.get('selectedIndex'));
        },

        'test showNeighbors: false': function () {
            A.isFalse(slide.get('showNeighbors'));
        },

        'test slideNode: h2': function () {
            B.isTag('h2', slide.get('slideNode'));
        },

        'test tabNode: ul': function () {
            B.isTag('ul', slide.get('tabNode'));
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
