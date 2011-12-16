/**
 * Tests for CSS3 transition synthetic events.
 *
 * Example usage:
 *
 * YUI.use('event-transition-tests', function(Y) {
 *     Y.Event.Transition.Tests.run();
 * });
 */

YUI.add('gallery-event-transition-tests', function (Y) {
    var YTest = Y.Test,
        YUnitTest = Y.UnitTest,

        suite = new YTest.Suite('CSS3 Transition Event Tests');

        suite.add(new YTest.Case({
            name: 'CSS3 Transition Event Tests',

            'the event should be fired after transition is complete': function () {
                var counter;

                Y.one('#transition').on('transitionend', function () {
                    counter += 1;
                });

                Y.one('#trigger').on('click', function () {
                    counter = 0;
                    Y.one('#transition').addClass('wow');
                });

                Y.one('#trigger').simulate('click');

                this.wait(function () {
                    Y.Assert.areEqual(counter, 3);
                }, 1100);
            }
        }));

    var Tests = {
        run: function () {
            new Y.Console({ newestOnTop: false }).render('#log');

            // Add and run the test
            YTest.Runner.add(suite);
            YTest.Runner.run();
        }
    };

    Y.namespace('Event.Transition').Tests = Tests;
}, '0.0.1', {
    requires: [
        'test',
        'console',
        'node-event-simulate',
        'gallery-event-transition'
    ]
});

