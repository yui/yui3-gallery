YUI().use('slidetab-testlib', function (Y) {
    var suite = new Y.Test.Suite('SlideTab test suite: Attributes'),
        slide = Y.slidetabTest.Instance,
        node = Y.Node.create('<div></div>'),
        A = Y.Assert,
        B = Y.bottleTest;

    suite.add(new Y.Test.Case({
        'test labelNode writeOnce': function () {
            B.writeOnce(slide, 'labelNode', node);
        },

        'test set labelWidth invalid': function () {
            slide.set('labelWidth', 'arc');
            A.areSame(30, slide.get('labelWidth'));
        },

        'test scrollView writeOnce': function () {
            B.writeOnce(slide, 'scrollView', 1);
        },

        'test set selectedIndex invalid': function () {
            slide.set('selectedIndex', -1);
            slide.set('selectedIndex', 999);
            slide.set('selectedIndex', 'arc');
            A.areSame(0, slide.get('selectedIndex'));
        },

        'test set showNeighbors invalid': function () {
            slide.set('showNeighbors', 'arc');
            A.isTrue(slide.get('showNeighbors'));
        },

        'test slideNode writeOnce': function () {
            B.writeOnce(slide, 'slideNode', node);
        },

        'test tabNode writeOnce': function () {
            B.writeOnce(slide, 'tabNode', node);
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
