YUI().use('slidetab-testlib', function (Y) {
    var suite = new Y.Test.Suite('SlideTab test suite: Functional'),
        slide = Y.slidetabTest.Instance,
        A = Y.Assert,
        B = Y.bottleTest;

    suite.add(new Y.Test.Case({
        'test slide to tab 1': function () {
            slide.get('scrollView').pages.next();
            this.wait(function () {
                A.areSame(1, slide.get('selectedIndex'), 'selectedIndex should be 1');
                slide.get('tabNode').get('children').each(function (O, I) {
                    if (I == 1) {
                        A.isTrue(O.hasClass('on'), 'tab 1 should have "on" class');
                    } else {
                        A.isFalse(O.hasClass('on'), 'tab ' + I + ' should not have "on" class');
                    }
                });
            }, 1000);
        }
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
