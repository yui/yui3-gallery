YUI.add('task-tests', function(Y) {

    var Assert = Y.Test.Assert,
        Promise = Y.Promise

    var suite = new Y.Test.Suite('task');

    Y.mix(Promise, {
        resolve: function (value) {
            return new Promise(function (resolve) {
                resolve(value);
            });
        },
        reject: function (reason) {
            return new Promise(function (resolve, reject) {
                reject(reason);
            });
        }
    });

    suite.add(new Y.Test.Case({
        name: 'Task tests',
        'task() returns a promise': function () {
            Assert.isInstanceOf(Y.Promise, Y.task(function* () {}), 'Y.task should return a promise');
        },
        'wait for a promise': function () {
            var test = this,
                expected = 'hello world';

            Y.task(function* () {
                var value = yield Promise.resolve(expected);

                test.resume(function () {
                    Assert.areEqual(expected, value, 'yielded promise did not resolve to the expected value');
                });
            });

            test.wait(1000);
        },
        'catch a failure in a promise': function () {
            var test = this,
                expected = new Error('foo');

            Y.task(function* () {
                try {
                    yield Promise.reject(expected);
                } catch (error) {
                    test.resume(function () {
                        Assert.areSame(expected, error, 'try...catch did not catch the correct error');
                    });
                } 
            });

            test.wait(1000);
        },
        'multiple sequential yields': function () {
            var test = this;

            Y.task(function* () {
                var count = yield Promise.resolve(1);
                count = yield Promise.resolve(count + 2);
                count = yield Promise.resolve(count + 3);
                test.resume(function () {
                    Assert.areEqual(6, count, 'sequential sums failed to add up');
                });
            });

            test.wait(1000);
        },
        'returned promise resolves to the generator function returned value': function () {
            var test = this;

            Y.task(function* () {
                var one = yield Promise.resolve(1);
                return Promise.resolve(one + 2);
            }).then(function (result) {
                test.resume(function () {
                    Assert.areEqual(3, result, 'promise did not resolve to the last yielded value');
                });
            });

            test.wait(1000);
        },
        'errors thrown inside the generator function reject the returned promise': function () {
            var test = this,
                expected = new Error('foo');

            Y.task(function* () {
                throw expected;
            }).then(null, function (error) {
                test.resume(function () {
                    Assert.areSame(expected, error, 'returned promise did not reject to thrown error');
                });
            });

            test.wait(1000);
        },
        'errors thrown inside the generator function after yielding reject the returned promise': function () {
            var test = this,
                expected = new Error('foo');

            Y.task(function* () {
                yield 1;
                throw expected;
            }).then(null, function (error) {
                test.resume(function () {
                    Assert.areSame(expected, error, 'returned promise did not reject to thrown error');
                });
            });

            test.wait(1000);
        }
    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'test' ] });
