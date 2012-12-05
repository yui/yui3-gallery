YUI().use('slidetab-testlib', function (Y) {
    var suite = new Y.Test.Suite('SlideTab test suite: Default Values'),
        slide = Y.slidetabTest.Instance,
        A = Y.Assert,
        B = Y.bottleTest;

    suite.add(new Y.Test.Case({
        'test labelNode: NodeList': function () {
            B.instanceOf(slide.get('labelNode'), Y.NodeList);
        },

        'test labelWidth: 30': function () {
            A.areSame(30, slide.get('labelWidth'));
        },

        'test lazyLoad: true': function () {
            A.isTrue(slide.get('lazyLoad'));
        },

        // do not test scrollView default, it will be set when rendering

        'test selectedIndex: 0': function () {
            A.areSame(0, slide.get('selectedIndex'));
        },

        'test showNeighbors: true': function () {
            A.isTrue(slide.get('showNeighbors'));
        },

        'test slideNode: Node': function () {
            B.instanceOf(slide.get('slideNode'), Y.Node);
        },

        'test tabNode: Node': function () {
            B.instanceOf(slide.get('tabNode'), Y.Node);
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
