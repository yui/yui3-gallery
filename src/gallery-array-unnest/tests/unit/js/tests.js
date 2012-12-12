YUI.add('module-tests', function (Y) {
    'use strict';

    var suite = new Y.Test.Suite('gallery-array-unnest');

    suite.add(new Y.Test.Case({
        name: 'Automated Tests',
        'test:001-apiExists': function () {
            Y.Assert.isFunction(Y.Array.unnest, 'Y.Array.unnest should be a function.');
        },
        'test:002-depth1': function () {
            var array = Y.Array.unnest([
                0,
                1,
                2,
                [
                    3,
                    4,
                    5
                ],
                [
                    6,
                    [
                        7,
                        [
                            8,
                            9
                        ]
                    ]
                ]
            ]);

            Y.Assert.isArray(array, 'array should be an array.');
            Y.Assert.areSame(8, array.length, 'array.length should be 8.');

            Y.Assert.areSame(0, array[0], 'array[0] should be 0.');
            Y.Assert.areSame(1, array[1], 'array[1] should be 1.');
            Y.Assert.areSame(2, array[2], 'array[2] should be 2.');
            Y.Assert.areSame(3, array[3], 'array[3] should be 3.');
            Y.Assert.areSame(4, array[4], 'array[4] should be 4.');
            Y.Assert.areSame(5, array[5], 'array[5] should be 5.');
            Y.Assert.areSame(6, array[6], 'array[6] should be 6.');

            Y.Assert.isArray(array[7], 'array[7] should be an array.');
            Y.Assert.areSame(2, array[7].length, 'array[7].length should be 2.');

            Y.Assert.areSame(7, array[7][0], 'array[7][0] should be 7.');

            Y.Assert.isArray(array[7][1], 'array[7][1] should be an array.');
            Y.Assert.areSame(2, array[7][1].length, 'array[7][1].length should be 2.');

            Y.Assert.areSame(8, array[7][1][0], 'array[7][1][0] should be 8.');
            Y.Assert.areSame(9, array[7][1][1], 'array[7][1][0] should be 9.');
        },
        'test:003-depth3': function () {
            Y.ArrayAssert.itemsAreSame([
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9
            ], Y.Array.unnest([
                0,
                1,
                2,
                [
                    3,
                    4,
                    5
                ],
                [
                    6,
                    [
                        7,
                        [
                            8,
                            9
                        ]
                    ]
                ]
            ], 3));
        }
    }));

    Y.Test.Runner.add(suite);
}, '', {
    requires: [
        'gallery-array-unnest',
        'test'
    ]
});