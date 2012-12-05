YUI.add('module-tests', function (Y) {
    'use strict';

    var suite = new Y.Test.Suite('gallery-array-iterate');

    suite.add(new Y.Test.Case({
        name: 'Automated Tests',
        'test:001-apiExists': function () {
            Y.Assert.isFunction(Y.Array.iterate, 'Y.Array.iterate should be a function.');
        },
        'test:002-simpleIteration': function () {
            var arrayToIterate = [
                    0,
                    2,
                    4,
                    6,
                    8,
                    10,
                    12,
                    14,
                    16,
                    18,
                    20,
                    22,
                    24
                ],
                values = [];

            Y.Assert.isFalse(Y.Array.iterate(arrayToIterate, 1, function (value, index, array) {
                Y.Assert.isNumber(index, 'index should be a number.');
                Y.Assert.areSame(arrayToIterate, array, 'The arrays should be the same.');
                Y.Assert.areSame(value, array[index], 'value should be the same as array[index]');
                values.push(value);
            }), 'Y.Array.iterate should return false when not terminated early.');

            Y.ArrayAssert.itemsAreSame(arrayToIterate, values, 'All array items should be the same.');
        },
        'test:003-simpleIterationWithContextObject': function () {
            var arrayToIterate = [
                    0,
                    2,
                    4,
                    6,
                    8,
                    10,
                    12,
                    14,
                    16,
                    18,
                    20,
                    22,
                    24
                ],
                contextObject = {},
                iterations = 0;

            Y.Assert.isFalse(Y.Array.iterate(arrayToIterate, 1, function (value, index, array) {
                Y.Assert.areSame(contextObject, this, 'this should be the same contextObject.');
                Y.Assert.isNumber(index, 'index should be a number.');
                Y.Assert.areSame(arrayToIterate, array, 'The arrays should be the same.');
                Y.Assert.areSame(value, array[index], 'value should be the same as array[index]');
                iterations += 1;
            }, contextObject), 'Y.Array.iterate should return false when not terminated early.');

            Y.Assert.areSame(arrayToIterate.length, iterations, 'iterations should be the same as the length of the array.');
        },
        'test:004-nthItemIteration': function () {
            var arrayToIterate = [
                    0,
                    2,
                    4,
                    6,
                    8,
                    10,
                    12,
                    14,
                    16,
                    18,
                    20,
                    22,
                    24
                ],
                values = [];

            Y.Assert.isFalse(Y.Array.iterate(arrayToIterate, 3, function (value, index, array) {
                Y.Assert.isNumber(index, 'index should be a number.');
                Y.Assert.areSame(arrayToIterate, array, 'The arrays should be the same.');
                Y.Assert.areSame(value, array[index], 'value should be the same as array[index]');
                values.push(value);
            }), 'Y.Array.iterate should return false when not terminated early.');

            Y.ArrayAssert.itemsAreSame([
                0,
                6,
                12,
                18,
                24
            ], values, 'Every third array item should be the same.');
        },
        'test:005-backwardsIteration': function () {
            var arrayToIterate = [
                    0,
                    2,
                    4,
                    6,
                    8,
                    10,
                    12,
                    14,
                    16,
                    18,
                    20,
                    22,
                    24
                ],
                values = [];

            Y.Assert.isFalse(Y.Array.iterate(arrayToIterate, -1, function (value, index, array) {
                Y.Assert.isNumber(index, 'index should be a number.');
                Y.Assert.areSame(arrayToIterate, array, 'The arrays should be the same.');
                Y.Assert.areSame(value, array[index], 'value should be the same as array[index]');
                values.push(value);
            }), 'Y.Array.iterate should return false when not terminated early.');

            Y.ArrayAssert.itemsAreSame(arrayToIterate.reverse(), values, 'All array items should be the same in reverse order.');
        },
        'test:006-nthItemBackwardsIterationWithStartIndex': function () {
            var arrayToIterate = [
                    0,
                    2,
                    4,
                    6,
                    8,
                    10,
                    12,
                    14,
                    16,
                    18,
                    20,
                    22,
                    24
                ],
                values = [];

            Y.Assert.isFalse(Y.Array.iterate(arrayToIterate, 10, -4, function (value, index, array) {
                Y.Assert.isNumber(index, 'index should be a number.');
                Y.Assert.areSame(arrayToIterate, array, 'The arrays should be the same.');
                Y.Assert.areSame(value, array[index], 'value should be the same as array[index]');
                values.push(value);
            }), 'Y.Array.iterate should return false when not terminated early.');

            Y.ArrayAssert.itemsAreSame([
                20,
                12,
                4
            ], values, 'Every fourth array item backwards from index 10 should be the same.');
        },
        'test:007-earlyTermination': function () {
            var arrayToIterate = [
                    0,
                    2,
                    4,
                    6,
                    8,
                    10,
                    12,
                    14,
                    16,
                    18,
                    20,
                    22,
                    24
                ],
                values = [];

            Y.Assert.isTrue(Y.Array.iterate(arrayToIterate, 3, 2, function (value, index, array) {
                Y.Assert.isNumber(index, 'index should be a number.');
                Y.Assert.areSame(arrayToIterate, array, 'The arrays should be the same.');
                Y.Assert.areSame(value, array[index], 'value should be the same as array[index]');
                values.push(value);
                return index >= 9;
            }), 'Y.Array.iterate should return true when terminated early.');

            Y.ArrayAssert.itemsAreSame([
                6,
                10,
                14,
                18
            ], values, 'Every other array item from index 3 to index 9 should be the same.');
        }
    }));

    Y.Test.Runner.add(suite);
}, '', {
    requires: [
        'gallery-array-iterate',
        'test'
    ]
});