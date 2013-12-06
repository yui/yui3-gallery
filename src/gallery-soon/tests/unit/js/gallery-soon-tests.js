YUI.add('gallery-soon-tests', function (Y) {
    'use strict';

    var Assert      = Y.Assert,
    	ArrayAssert = Y.Test.ArrayAssert;

    var suite = new Y.Test.Suite('gallery-soon');

    suite.add(new Y.Test.Case({
        name: 'Y.soon Tests',
        'test API structure': function () {
            Assert.isFunction(Y.soon, 'Y.soon should be a function.');
            Assert.isFunction(Y.soon._asynchronizer, 'Y.soon._asynchronizer should be a function.');
            Assert.isString(Y.soon._impl, 'Y.soon._impl should be a string.');
        },
        'enforce asynchronicity': function () {
            var test = this,
                reference = [];

            reference.push('a');
            Y.soon(function () {
                reference.push('c');
                Y.soon(function () {
                    reference.push('e');
                    test.resume(function () {
                        ArrayAssert.itemsAreSame(['a', 'b', 'c', 'd', 'e'], reference, 'Y.soon should not execute synchronously');
                    });
                });
                reference.push('d');
            });
            reference.push('b');

            test.wait();
        },
        'the callback should only be called once': function () {
            var count = 0,
                test = this,
                timer = Y.soon(function () {
                    count += 1;

                    if (count > 1) {
                        test.resume(function () {
                            Assert.fail('Y.soon() callback function should not execute multiple times.');
                        });
                    } else {
                        test.resume(function () {
                            // Arbitrary timeout to test that the callback
                            // function does not execute again.
                            test.wait(function () {
                                Assert.isTrue(true);
                            }, 150);
                        });
                    }
                });

            Assert.areSame(0, count);
            Assert.isObject(timer);
            Assert.isFunction(timer.cancel);

            test.wait();
        },
        'the cancel token should prevent the callback from being called': function () {
            var count = 0,
                timer = Y.soon(function () {
                    count += 1;
                });

            timer.cancel();

            this.wait(function () {
                Assert.areSame(0, count);
            }, 250);
        }
    }));

    Y.Test.Runner.add(suite);
}, '', {
    requires: [
        'test',
        'gallery-soon'
    ]
});