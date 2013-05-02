YUI.add('module-tests', function (Y) {
    'use strict';

    var suite = new Y.Test.Suite('gallery-lazy-promise');

    suite.add(new Y.Test.Case({
        name: 'Basic promise behavior copied from the promise module.',
        'calling Y.LazyPromise as a function should return an instance of Y.LazyPromise': function () {
            Y.Assert.isInstanceOf(Y.LazyPromise, Y.LazyPromise(function () {}), 'Y.LazyPromise as a function should return a lazyPromise');
        },
        'lazyPromise.then returns a promise': function () {
            var lazyPromise = new Y.LazyPromise(function (fulfill) {
                fulfill(5);
            });

            Y.Assert.isInstanceOf(Y.Promise, lazyPromise.then(), 'lazyPromise.then returns a promise');
        },
        'lazyPromise state should change only once': function () {
            var fulfilled = new Y.LazyPromise(function (fulfill, reject) {
                    Y.Assert.areEqual('pending', this.getStatus(), 'before fulfillment the resolver status should be "pending"');

                    fulfill(5);

                    Y.Assert.areEqual('fulfilled', this.getStatus(), 'once fulfilled the resolver status should be "fulfilled"');

                    reject(new Error('reject'));

                    Y.Assert.areEqual('fulfilled', this.getStatus(), 'rejecting a fulfilled lazyPromise should not change its status');
                }),
                rejected = new Y.LazyPromise(function (fulfill, reject) {
                    Y.Assert.areEqual('pending', this.getStatus(), 'before rejection the resolver status should be "pending"');

                    reject(new Error('reject'));

                    Y.Assert.areEqual('rejected', this.getStatus(), 'once rejected the resolver status should be "rejected"');

                    fulfill(5);

                    Y.Assert.areEqual('rejected', this.getStatus(), 'fulfilling a rejected lazyPromise should not change its status');
                });

            fulfilled.then();
            rejected.then();

            Y.Assert.areEqual('fulfilled', fulfilled.getStatus(), 'status of a fulfilled lazyPromise should be "fulfilled"');
            Y.Assert.areEqual('rejected', rejected.getStatus(), 'status of a rejected lazyPromise should be "rejected"');
        },
        'fulfilling more than once should not change the lazyPromise value': function () {
            var test = this;

            new Y.LazyPromise(function (fulfill) {
                fulfill(true);
                fulfill(5);
            }).then(function (value) {
                test.resume(function () {
                    Y.Assert.areSame(true, value, 'value should remain the same');
                });
            });

            test.wait(100);
        },
        'rejecting more than once should not change the rejection reason': function () {
            var test = this;

            new Y.LazyPromise(function (fulfill, reject) {
                reject(new Error('foo'));
                reject(new Error('bar'));
            }).then(null, function (reason) {
                test.resume(function () {
                    Y.Assert.areEqual('foo', reason.message, 'reason should remain the same');
                });
            });

            test.wait(100);
        },
        'correct value for "this" inside the lazyPromise init function': function () {
            var lazyPromiseA,
                lazyPromiseB = new Y.LazyPromise(function () {
                    lazyPromiseA = this;

                    Y.Assert.isInstanceOf(Y.LazyPromise, this, '"this" should be a lazyPromise');
                });

            lazyPromiseB.then();

            Y.Assert.areSame(lazyPromiseA, lazyPromiseB, 'the return value of Y.LazyPromise and "this" inside the init function should be the same');
        },
        'callbacks passed to then should be called asynchronously': function () {
            var foo = false,
                test = this;

            new Y.LazyPromise(function (fulfill) {
                fulfill();
            }).then(function () {
                foo = true;
                test.resume();
            });

            Y.Assert.areEqual(false, foo, 'callback should not modify local variable in this turn of the event loop');

            test.wait();
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Behavior of the then() callbacks copied from the promise module',
        'throwing inside a callback should turn into a rejection': function () {
            var error = new Error('Arbitrary error'),
                test = this;

            new Y.LazyPromise(function (fulfill) {
                fulfill(5);
            }).then(function (value) {
                throw error;
            }).then(null, function (reason) {
                test.resume(function () {
                    Y.Assert.areSame(error, reason, 'thrown error should become the rejection reason');
                });
            });

            test.wait(50);
        },
        'returning a lazyPromise from a callback should link both promises': function () {
            var test = this;

            new Y.LazyPromise(function (fulfill) {
                fulfill('placeholder');
            }).then(function () {
                return new Y.LazyPromise(function (fulfill) {
                    fulfill(5);
                });
            }).then(function (value) {
                test.resume(function () {
                    Y.Assert.areEqual(5, value, 'new value should be the value from the returned lazyPromise');
                });
            });

            test.wait(100);
        }/*,
        '|this| inside a callback must be undefined in strict mode': function () {
            var test = this,
                fulfilled = new Y.Promise(function (fulfill) {
                    fulfill('value');
                }),
                fulfilledThis,
                rejected = new Y.Promise(function (fulfill, reject) {
                    reject('reason');
                }),
                rejectedThis;

            fulfilled.then(function () {
                fulfilledThis = this;
                rejected.then(null, function () {
                    rejectedThis = this;
                    test.resume(function () {
                        Y.Assert.isUndefined(fulfilledThis, 'in strict mode |this| in the success callback must be undefined');
                        Y.Assert.isUndefined(rejectedThis, 'in strict mode |this| in the failure callback must be undefined');
                    });
                });
            });

            test.wait(300);
        }*/
    }));

    suite.add(new Y.Test.Case({
        name: 'Automated Tests',
        'LazyPromise detection with Y.Promise.isPromise': function () {
            Y.Assert.isTrue(Y.Promise.isPromise(new Y.LazyPromise(function () {})), 'a lazyPromise should be identified as a promise');
        },
        'fn should not be executed until then and should not be executed more than once': function () {
            var foo = 0,
                lazyPromise = new Y.LazyPromise(function (fulfill) {
                    foo += 1;
                    fulfill();
                }),
                test = this;

            Y.Assert.areEqual(0, foo, 'fn should not modify local variable until then is called');

            lazyPromise.then(function () {
                test.resume(function () {
                    Y.Assert.areEqual(1, foo, 'fn should have modified local variable before lazyPromise was fulfilled');

                    lazyPromise.then(function () {
                        test.resume(function () {
                            Y.Assert.areEqual(1, foo, 'fn should not modify local variable a second time');
                        });
                    });

                    test.wait();
                });
            });

            test.wait();
        },
        'state should be pending even before fn is executed': function () {
            Y.Assert.areSame('pending', new Y.LazyPromise(function () {}).getStatus());
        }
    }));

    Y.Test.Runner.add(suite);
}, '', {
    requires: [
        'gallery-lazy-promise',
        'test'
    ]
});