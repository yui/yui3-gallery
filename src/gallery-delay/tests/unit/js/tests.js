YUI.add('module-tests', function (Y) {
    'use strict';

    var suite = new Y.Test.Suite('gallery-delay');

    suite.add(new Y.Test.Case({
        name: 'Automated Tests',
        'test:001-apiExists': function () {
            Y.Assert.isFunction(Y.delay, 'Y.delay should be a function.');
        },
        'test:002-delay': function () {
            var a = false,
                test = this,

                fn = Y.delay(function () {
                    test.resume(function () {
                        Y.Assert.isTrue(a, 'fn should have been delayed.');
                    });
                }, 377);

            Y.Assert.isFunction(fn, 'Y.delay should return a function.');

            fn();

            a = true;

            test.wait(610);
        },
        'test:003-delay-with-arguments-and-context': function () {
            var a = Math.random(),
                b = Math.random(),
                c = Math.random(),
                object = {},
                test = this,

                fn = Y.delay(function (x, y, z) {
                    var me = this;

                    test.resume(function () {
                        Y.Assert.areSame(object, me, 'context should be the same.');
                        Y.Assert.areSame(a, x, 'arguments should be the same.');
                        Y.Assert.areSame(b, y, 'arguments should be the same.');
                        Y.Assert.areSame(c, z, 'arguments should be the same.');
                    });
                }, 377);

            fn.call(object, a, b, c);

            test.wait(610);
        },
        'test:004-delay-with-return-value': function () {
            var promise,
                test = this,

                fn = Y.delay(function () {
                    return [
                        'a',
                        'b',
                        'c'
                    ];
                }, 377);

            promise = fn();

            Y.Assert.isInstanceOf(Y.Promise, promise, 'promise should be an instance of Y.Promise.');

            promise.then(function (value) {
                test.resume(function () {
                    Y.ArrayAssert.itemsAreSame([
                        'a',
                        'b',
                        'c'
                    ], value, 'value should match return value.');
                });
            });

            test.wait(610);
        },
        'test:005-delay-cancel': function () {
            var a = false,
                promise,
                test = this,

                fn = Y.delay(function () {
                    a = true;
                }, 377);

            promise = fn();

            Y.Assert.isFunction(promise.cancel, 'promise.cancel should be a function.');

            Y.later(144, promise, promise.cancel);

            Y.later(610, null, function () {
                test.resume(function () {
                    Y.Assert.isFalse(a, 'fn should not have been executed.');
                });
            });

            test.wait(987);
        },
        'test:006-fast-delay': function () {
            var a = false,
                test = this,

                fn = Y.delay(function () {
                    test.resume(function () {
                        Y.Assert.isTrue(a, 'fn should have been delayed.');
                    });
                });

            Y.Assert.isFunction(fn, 'Y.delay should return a function.');

            fn();

            a = true;

            test.wait(610);
        },
        'test:007-fast-delay-with-arguments-and-context': function () {
            var a = Math.random(),
                b = Math.random(),
                c = Math.random(),
                object = {},
                test = this,

                fn = Y.delay(function (x, y, z) {
                    var me = this;

                    test.resume(function () {
                        Y.Assert.areSame(object, me, 'context should be the same.');
                        Y.Assert.areSame(a, x, 'arguments should be the same.');
                        Y.Assert.areSame(b, y, 'arguments should be the same.');
                        Y.Assert.areSame(c, z, 'arguments should be the same.');
                    });
                });

            fn.call(object, a, b, c);

            test.wait(610);
        },
        'test:008-fast-delay-with-return-value': function () {
            var promise,
                test = this,

                fn = Y.delay(function () {
                    return [
                        'a',
                        'b',
                        'c'
                    ];
                });

            promise = fn();

            Y.Assert.isInstanceOf(Y.Promise, promise, 'promise should be an instance of Y.Promise.');

            promise.then(function (value) {
                test.resume(function () {
                    Y.ArrayAssert.itemsAreSame([
                        'a',
                        'b',
                        'c'
                    ], value, 'value should match return value.');
                });
            });

            test.wait(610);
        },
        'test:009-fast-delay-cancel': function () {
            var a = false,
                promise,
                test = this,

                fn = Y.delay(function () {
                    a = true;
                });

            promise = fn();

            Y.Assert.isFunction(promise.cancel, 'promise.cancel should be a function.');

            promise.cancel();

            Y.later(377, null, function () {
                test.resume(function () {
                    Y.Assert.isFalse(a, 'fn should not have been executed.');
                });
            });

            test.wait(610);
        }
    }));

    Y.Test.Runner.add(suite);
}, '', {
    requires: [
        'gallery-delay',
        'test'
    ]
});