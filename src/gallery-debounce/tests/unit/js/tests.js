YUI.add('debounce-tests', function(Y) {

    var Assert = Y.Test.Assert;

    var suite = new Y.Test.Suite('debounce');

    suite.add(new Y.Test.Case({
        name: "Debounce Tests",
        
        'debounce delays the execution of the function': function() {
            var counter = 0,
                i = 0, fn;

            fn = Y.debounce(2, function() {
                counter++;
            });

            for (i; i< 10; i++) {
                fn();
            }
            
            var fn1 = function() {
                counter++;
            };

            fn1.name = 'foo';

            fn = Y.debounce(10, fn1);

            Assert.isFunction(fn, 'Y.debounce failed to return a function');
            Assert.areNotSame(fn1, fn, 'Y.debounce failed to return a new function');
            Assert.isFalse(counter > 0, 'Y.debounce did not delay the function call');
        },
        'debounce does not delay the function if a -1 is passed': function() {
            var counter = 0,
                out = 0,
                i = 0, fn;

            fn = Y.debounce(-1, function() {
                counter++;
            });

            for (i; i< 3500; i++) {
                out++;
                fn();
            }
            
            var fn1 = function() {
                counter++;
            };

            fn1.name = 'foo';

            fn = Y.debounce(10, fn1);

            Assert.isFunction(fn, 'Y.debounce failed to return a function');
            Assert.areNotSame(fn1, fn, 'Y.debounce failed to return a new function');
            Assert.areEqual(out, counter, 'Y.debounce DID debounce the function call');
        },
        'debounced function executes only once when called under threshold': function () {
            var test = this,
                counter = 0;

            var fn = Y.debounce(200, function () {
                counter++;
            });

            setTimeout(function () {
                fn();
                setTimeout(function () {
                    fn();
                }, 50);
            }, 10);

            setTimeout(function () {
                test.resume(function () {
                    Assert.isFalse(counter < 1, 'debounced function was not called');
                    Assert.isFalse(counter > 1, 'debounced function was called more than once');
                });
            }, 500);

            test.wait(1000);
        }
    }));

    Y.Test.Runner.add(suite);

},'', { requires: [ 'test' ] });
