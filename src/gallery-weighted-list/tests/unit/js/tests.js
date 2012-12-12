YUI.add('module-tests', function (Y) {
    'use strict';

    var suite = new Y.Test.Suite('gallery-weighted-list');

    suite.add(new Y.Test.Case({
        name: 'Automated Tests',
        'test:001-apiExists': function () {
            Y.Assert.isUndefined(Y.Alea, 'Y.Alea should not be loaded when tests begin.');
            Y.Assert.isFunction(Y.WeightedList, 'Y.WeightedList should be a function.');

            var weightedList = new Y.WeightedList();

            Y.Assert.isObject(weightedList, 'weightedList should be an object.');
            Y.Assert.isInstanceOf(Y.WeightedList, weightedList, 'weightedList should be an instance of Y.WeightedList.');

            Y.Assert.isFunction(weightedList.add, 'weightedList.add should be a function.');
            Y.Assert.isFunction(weightedList.dedupe, 'weightedList.dedupe should be a function.');
            Y.Assert.isFunction(weightedList.each, 'weightedList.each should be a function.');
            Y.Assert.isFunction(weightedList.every, 'weightedList.every should be a function.');
            Y.Assert.isFunction(weightedList.filter, 'weightedList.filter should be a function.');
            Y.Assert.isFunction(weightedList.find, 'weightedList.find should be a function.');
            Y.Assert.isFunction(weightedList.grep, 'weightedList.grep should be a function.');
            Y.Assert.isFunction(weightedList.indexOf, 'weightedList.indexOf should be a function.');
            Y.Assert.isFunction(weightedList.invoke, 'weightedList.invoke should be a function.');
            Y.Assert.isFunction(weightedList.isEmpty, 'weightedList.isEmpty should be a function.');
            Y.Assert.isFunction(weightedList.item, 'weightedList.item should be a function.');
            Y.Assert.isFunction(weightedList.itemsAreEqual, 'weightedList.itemsAreEqual should be a function.');
            Y.Assert.isFunction(weightedList.lastIndexOf, 'weightedList.lastIndexOf should be a function.');
            Y.Assert.isFunction(weightedList.map, 'weightedList.map should be a function.');
            Y.Assert.isFunction(weightedList.partition, 'weightedList.partition should be a function.');
            Y.Assert.isFunction(weightedList.reduce, 'weightedList.reduce should be a function.');
            Y.Assert.isFunction(weightedList.reject, 'weightedList.reject should be a function.');
            Y.Assert.isFunction(weightedList.remove, 'weightedList.remove should be a function.');
            Y.Assert.isFunction(weightedList.removeIndex, 'weightedList.removeIndex should be a function.');
            Y.Assert.isFunction(weightedList.size, 'weightedList.size should be a function.');
            Y.Assert.isFunction(weightedList.some, 'weightedList.some should be a function.');
            Y.Assert.isFunction(weightedList.toArray, 'weightedList.toArray should be a function.');
            Y.Assert.isFunction(weightedList.toJSON, 'weightedList.toJSON should be a function.');
            Y.Assert.isFunction(weightedList.toString, 'weightedList.toString should be a function.');
            Y.Assert.isFunction(weightedList.unique, 'weightedList.unique should be a function.');
            Y.Assert.isFunction(weightedList.update, 'weightedList.update should be a function.');
            Y.Assert.isFunction(weightedList.updateValue, 'weightedList.updateValue should be a function.');
            Y.Assert.isFunction(weightedList.updateWeight, 'weightedList.updateWeight should be a function.');
            Y.Assert.isFunction(weightedList.value, 'weightedList.value should be a function.');
            Y.Assert.isFunction(weightedList.weight, 'weightedList.weight should be a function.');

            Y.Assert.isFunction(weightedList._random, 'weightedList._random should be a function.');
            Y.Assert.isFunction(weightedList._randomIndex, 'weightedList._randomIndex should be a function.');
            Y.Assert.isFunction(weightedList._update, 'weightedList._update should be a function.');

            Y.Assert.isArray(weightedList._array, 'weightedList._array should be an array.');
        },
        'test:002-accessors': function () {
            var item0,
                item1,
                item2,
                item3,
                item4,
                weightedList = new Y.WeightedList();

            Y.Assert.areSame(0, weightedList.add('a'), 'The first array index should be 0.');
            Y.Assert.areSame(1, weightedList.add('b', 2), 'The second array index should be 1.');
            Y.Assert.areSame(2, weightedList.add('c', 3), 'The third array index should be 2.');
            Y.Assert.areSame(3, weightedList.add('d', 4), 'The fourth array index should be 3.');
            Y.Assert.areSame(4, weightedList.add('e', 5), 'The fifth array index should be 4.');

            Y.Assert.isFalse(weightedList.isEmpty(), 'weightedList.isEmpty() should be false.');
            Y.Assert.areSame(5, weightedList.size(), 'weightedList.size() should be 5.');

            item0 = weightedList.item(0);
            Y.Assert.isObject(item0);
            Y.Assert.areSame(0, item0.index, 'item0.index should be 0.');
            Y.Assert.areSame('a', item0.value, 'item0.value should be \'a\'.');
            Y.Assert.areSame(1, item0.weight, 'item0.weight should be 1.');

            item1 = weightedList.item(1);
            Y.Assert.isObject(item1);
            Y.Assert.areSame(1, item1.index, 'item1.index should be 1.');
            Y.Assert.areSame('b', item1.value, 'item1.value should be \'b\'.');
            Y.Assert.areSame(2, item1.weight, 'item1.weight should be 2.');

            item2 = weightedList.item(2);
            Y.Assert.isObject(item2);
            Y.Assert.areSame(2, item2.index, 'item2.index should be 2.');
            Y.Assert.areSame('c', item2.value, 'item2.value should be \'c\'.');
            Y.Assert.areSame(3, item2.weight, 'item2.weight should be 3.');

            item3 = weightedList.item(3);
            Y.Assert.isObject(item3);
            Y.Assert.areSame(3, item3.index, 'item3.index should be 3.');
            Y.Assert.areSame('d', item3.value, 'item3.value should be \'d\'.');
            Y.Assert.areSame(4, item3.weight, 'item3.weight should be 4.');

            item4 = weightedList.item(4);
            Y.Assert.isObject(item4);
            Y.Assert.areSame(4, item4.index, 'item4.index should be 4.');
            Y.Assert.areSame('e', item4.value, 'item4.value should be \'e\'.');
            Y.Assert.areSame(5, item4.weight, 'item4.weight should be 5.');

            Y.ArrayAssert.itemsAreSame([
                'a',
                'b',
                'c',
                'd',
                'e'
            ], weightedList.toArray(), 'weightedList.toArray() should be [\'a\', \'b\', \'c\', \'d\', \'e\'].');
            Y.ArrayAssert.itemsAreSame([
                'a',
                'b',
                'c',
                'd',
                'e'
            ], weightedList.toJSON(), 'weightedList.toJSON() should be [\'a\', \'b\', \'c\', \'d\', \'e\'].');
            Y.Assert.areSame('a,b,c,d,e', weightedList.toString(), 'weightedList.toString() should be \'a,b,c,d,e\'.');

            Y.Assert.areSame('a', weightedList.value(0), 'weightedList.value(0) should be \'a\'.');
            Y.Assert.areSame('b', weightedList.value(1), 'weightedList.value(1) should be \'b\'.');
            Y.Assert.areSame('c', weightedList.value(2), 'weightedList.value(2) should be \'c\'.');
            Y.Assert.areSame('d', weightedList.value(3), 'weightedList.value(3) should be \'d\'.');
            Y.Assert.areSame('e', weightedList.value(4), 'weightedList.value(4) should be \'e\'.');

            Y.Assert.areSame(1, weightedList.weight(0), 'weightedList.weight(0) should be 1.');
            Y.Assert.areSame(2, weightedList.weight(1), 'weightedList.weight(1) should be 2.');
            Y.Assert.areSame(3, weightedList.weight(2), 'weightedList.weight(2) should be 3.');
            Y.Assert.areSame(4, weightedList.weight(3), 'weightedList.weight(3) should be 4.');
            Y.Assert.areSame(5, weightedList.weight(4), 'weightedList.weight(4) should be 5.');

            weightedList.update(0, 'x', 10).updateValue(1, 'y').updateWeight(2, 30).update(3, 'z', 40).update(4, 'x');

            item0 = weightedList.item(0);
            Y.Assert.isObject(item0);
            Y.Assert.areSame(0, item0.index, 'item0.index should be 0.');
            Y.Assert.areSame('x', item0.value, 'item0.value should be \'x\'.');
            Y.Assert.areSame(10, item0.weight, 'item0.weight should be 10.');

            item1 = weightedList.item(1);
            Y.Assert.isObject(item1);
            Y.Assert.areSame(1, item1.index, 'item1.index should be 1.');
            Y.Assert.areSame('y', item1.value, 'item1.value should be \'y\'.');
            Y.Assert.areSame(2, item1.weight, 'item1.weight should be 2.');

            item2 = weightedList.item(2);
            Y.Assert.isObject(item2);
            Y.Assert.areSame(2, item2.index, 'item2.index should be 2.');
            Y.Assert.areSame('c', item2.value, 'item2.value should be \'c\'.');
            Y.Assert.areSame(30, item2.weight, 'item2.weight should be 30.');

            item3 = weightedList.item(3);
            Y.Assert.isObject(item3);
            Y.Assert.areSame(3, item3.index, 'item3.index should be 3.');
            Y.Assert.areSame('z', item3.value, 'item3.value should be \'z\'.');
            Y.Assert.areSame(40, item3.weight, 'item3.weight should be 40.');

            item4 = weightedList.item(4);
            Y.Assert.isObject(item4);
            Y.Assert.areSame(4, item4.index, 'item4.index should be 4.');
            Y.Assert.areSame('x', item4.value, 'item4.value should be \'x\'.');
            Y.Assert.areSame(1, item4.weight, 'item4.weight should be 1.');

            Y.ArrayAssert.itemsAreSame([
                'x',
                'y',
                'c',
                'z',
                'x'
            ], weightedList.toArray(), 'weightedList.toArray() should be [\'x\', \'y\', \'c\', \'z\', \'x\'].');
            Y.ArrayAssert.itemsAreSame([
                'x',
                'y',
                'c',
                'z',
                'x'
            ], weightedList.toJSON(), 'weightedList.toJSON() should be [\'x\', \'y\', \'c\', \'z\', \'x\'].');
            Y.Assert.areSame('x,y,c,z,x', weightedList.toString(), 'weightedList.toString() should be \'x,y,c,z,x\'.');

            Y.Assert.areSame('x', weightedList.value(0), 'weightedList.value(0) should be \'x\'.');
            Y.Assert.areSame('y', weightedList.value(1), 'weightedList.value(1) should be \'y\'.');
            Y.Assert.areSame('c', weightedList.value(2), 'weightedList.value(2) should be \'c\'.');
            Y.Assert.areSame('z', weightedList.value(3), 'weightedList.value(3) should be \'z\'.');
            Y.Assert.areSame('x', weightedList.value(4), 'weightedList.value(4) should be \'x\'.');

            Y.Assert.areSame(10, weightedList.weight(0), 'weightedList.weight(0) should be 10.');
            Y.Assert.areSame(2, weightedList.weight(1), 'weightedList.weight(1) should be 2.');
            Y.Assert.areSame(30, weightedList.weight(2), 'weightedList.weight(2) should be 30.');
            Y.Assert.areSame(40, weightedList.weight(3), 'weightedList.weight(3) should be 40.');
            Y.Assert.areSame(1, weightedList.weight(4), 'weightedList.weight(4) should be 1.');

            Y.Assert.areSame(1, weightedList.remove('c'), 'weightedList.remove(\'c\') should be 1.');

            Y.Assert.areSame(4, weightedList.size(), 'weightedList.size() should be 4.');

            item0 = weightedList.item(0);
            Y.Assert.isObject(item0);
            Y.Assert.areSame(0, item0.index, 'item0.index should be 0.');
            Y.Assert.areSame('x', item0.value, 'item0.value should be \'x\'.');
            Y.Assert.areSame(10, item0.weight, 'item0.weight should be 10.');

            item1 = weightedList.item(1);
            Y.Assert.isObject(item1);
            Y.Assert.areSame(1, item1.index, 'item1.index should be 1.');
            Y.Assert.areSame('y', item1.value, 'item1.value should be \'y\'.');
            Y.Assert.areSame(2, item1.weight, 'item1.weight should be 2.');

            item2 = weightedList.item(2);
            Y.Assert.isObject(item2);
            Y.Assert.areSame(2, item2.index, 'item2.index should be 2.');
            Y.Assert.areSame('z', item2.value, 'item2.value should be \'z\'.');
            Y.Assert.areSame(40, item2.weight, 'item2.weight should be 40.');

            item3 = weightedList.item(3);
            Y.Assert.isObject(item3);
            Y.Assert.areSame(3, item3.index, 'item3.index should be 3.');
            Y.Assert.areSame('x', item3.value, 'item3.value should be \'x\'.');
            Y.Assert.areSame(1, item3.weight, 'item3.weight should be 1.');

            Y.ArrayAssert.itemsAreSame([
                'x',
                'y',
                'z',
                'x'
            ], weightedList.toArray(), 'weightedList.toArray() should be [\'x\', \'y\', \'z\', \'x\'].');
            Y.ArrayAssert.itemsAreSame([
                'x',
                'y',
                'z',
                'x'
            ], weightedList.toJSON(), 'weightedList.toJSON() should be [\'x\', \'y\', \'z\', \'x\'].');
            Y.Assert.areSame('x,y,z,x', weightedList.toString(), 'weightedList.toString() should be \'x,y,z,x\'.');

            Y.Assert.areSame('x', weightedList.value(0), 'weightedList.value(0) should be \'x\'.');
            Y.Assert.areSame('y', weightedList.value(1), 'weightedList.value(1) should be \'y\'.');
            Y.Assert.areSame('z', weightedList.value(2), 'weightedList.value(2) should be \'z\'.');
            Y.Assert.areSame('x', weightedList.value(3), 'weightedList.value(3) should be \'x\'.');

            Y.Assert.areSame(10, weightedList.weight(0), 'weightedList.weight(0) should be 10.');
            Y.Assert.areSame(2, weightedList.weight(1), 'weightedList.weight(1) should be 2.');
            Y.Assert.areSame(40, weightedList.weight(2), 'weightedList.weight(2) should be 40.');
            Y.Assert.areSame(1, weightedList.weight(3), 'weightedList.weight(3) should be 1.');

            Y.Assert.areSame(2, weightedList.remove('x', true), 'weightedList.remove(\'x\', true) should be 2.');

            Y.Assert.areSame(2, weightedList.size(), 'weightedList.size() should be 2.');

            item0 = weightedList.item(0);
            Y.Assert.isObject(item0);
            Y.Assert.areSame(0, item0.index, 'item0.index should be 0.');
            Y.Assert.areSame('y', item0.value, 'item0.value should be \'y\'.');
            Y.Assert.areSame(2, item0.weight, 'item0.weight should be 2.');

            item1 = weightedList.item(1);
            Y.Assert.isObject(item1);
            Y.Assert.areSame(1, item1.index, 'item1.index should be 1.');
            Y.Assert.areSame('z', item1.value, 'item1.value should be \'z\'.');
            Y.Assert.areSame(40, item1.weight, 'item1.weight should be 40.');

            Y.ArrayAssert.itemsAreSame([
                'y',
                'z'
            ], weightedList.toArray(), 'weightedList.toArray() should be [\'y\', \'z\'].');
            Y.ArrayAssert.itemsAreSame([
                'y',
                'z'
            ], weightedList.toJSON(), 'weightedList.toJSON() should be [\'y\', \'z\'].');
            Y.Assert.areSame('y,z', weightedList.toString(), 'weightedList.toString() should be \'y,z\'.');

            Y.Assert.areSame('y', weightedList.value(0), 'weightedList.value(0) should be \'y\'.');
            Y.Assert.areSame('z', weightedList.value(1), 'weightedList.value(1) should be \'z\'.');

            Y.Assert.areSame(2, weightedList.weight(0), 'weightedList.weight(0) should be 2.');
            Y.Assert.areSame(40, weightedList.weight(1), 'weightedList.weight(1) should be 40.');

            weightedList.removeIndex(0);

            Y.Assert.areSame(1, weightedList.size(), 'weightedList.size() should be 1.');

            item0 = weightedList.item(0);
            Y.Assert.isObject(item0);
            Y.Assert.areSame(0, item0.index, 'item0.index should be 0.');
            Y.Assert.areSame('z', item0.value, 'item0.value should be \'z\'.');
            Y.Assert.areSame(40, item0.weight, 'item0.weight should be 40.');

            Y.ArrayAssert.itemsAreSame([
                'z'
            ], weightedList.toArray(), 'weightedList.toArray() should be [\'z\'].');
            Y.ArrayAssert.itemsAreSame([
                'z'
            ], weightedList.toJSON(), 'weightedList.toJSON() should be [\'z\'].');
            Y.Assert.areSame('z', weightedList.toString(), 'weightedList.toString() should be \'z\'.');

            Y.Assert.areSame('z', weightedList.value(0), 'weightedList.value(0) should be \'z\'.');

            Y.Assert.areSame(40, weightedList.weight(0), 'weightedList.weight(0) should be 40.');

            Y.Assert.areSame(0, weightedList.remove('x'), 'weightedList.remove(\'x\') should be 0.');
            weightedList.removeIndex(0);

            Y.Assert.isTrue(weightedList.isEmpty(), 'weightedList.isEmpty() should be true.');
        },
        'test:003-dedupe': function () {
            var dedupedWeightedList,
                weightedList = new Y.WeightedList();

            weightedList.add('a', 1);
            weightedList.add('b', 2);
            weightedList.add('c', 4);
            weightedList.add('a', 8);
            weightedList.add('b', 16);
            weightedList.add('c', 32);
            weightedList.add('a', 64);

            dedupedWeightedList = weightedList.dedupe();

            Y.Assert.areSame(3, dedupedWeightedList.size(), 'dedupedWeightedList.size() should be 3.');
            Y.Assert.areSame('a', dedupedWeightedList.value(0), 'dedupedWeightedList.value(0) should be \'a\'.');
            Y.Assert.areSame('b', dedupedWeightedList.value(1), 'dedupedWeightedList.value(1) should be \'b\'.');
            Y.Assert.areSame('c', dedupedWeightedList.value(2), 'dedupedWeightedList.value(2) should be \'c\'.');
            Y.Assert.areSame(73, dedupedWeightedList.weight(0), 'dedupedWeightedList.weight(0) should be 73.');
            Y.Assert.areSame(18, dedupedWeightedList.weight(1), 'dedupedWeightedList.weight(1) should be 18.');
            Y.Assert.areSame(36, dedupedWeightedList.weight(2), 'dedupedWeightedList.weight(2) should be 36.');

            dedupedWeightedList = weightedList.dedupe('first');

            Y.Assert.areSame(3, dedupedWeightedList.size(), 'dedupedWeightedList.size() should be 3.');
            Y.Assert.areSame('a', dedupedWeightedList.value(0), 'dedupedWeightedList.value(0) should be \'a\'.');
            Y.Assert.areSame('b', dedupedWeightedList.value(1), 'dedupedWeightedList.value(1) should be \'b\'.');
            Y.Assert.areSame('c', dedupedWeightedList.value(2), 'dedupedWeightedList.value(2) should be \'c\'.');
            Y.Assert.areSame(1, dedupedWeightedList.weight(0), 'dedupedWeightedList.weight(0) should be 1.');
            Y.Assert.areSame(2, dedupedWeightedList.weight(1), 'dedupedWeightedList.weight(1) should be 2.');
            Y.Assert.areSame(4, dedupedWeightedList.weight(2), 'dedupedWeightedList.weight(2) should be 4.');
        },
        'test:004-each': function () {
            var randomValue = Math.random(),
                values = [],
                weightedList = new Y.WeightedList();

            weightedList.add('a', 1);
            weightedList.add('b', 2);
            weightedList.add('c', 4);
            weightedList.add('a', 8);
            weightedList.add('b', 16);
            weightedList.add('c', 32);
            weightedList.add('a', 64);

            weightedList.each(function () {
                values = values.concat(Y.Array(arguments));
            });

            Y.ArrayAssert.itemsAreSame([
                'a',
                0,
                1,
                'b',
                1,
                2,
                'c',
                2,
                4,
                'a',
                3,
                8,
                'b',
                4,
                16,
                'c',
                5,
                32,
                'a',
                6,
                64
            ], values, 'values should be the same as expectedValues.');

            weightedList.each(function () {
                Y.Assert.areSame(randomValue, this, 'this should be the same as random value.');
            }, randomValue);
        },
        'test:005-every': function () {
            var randomValue = Math.random(),
                values = [],
                weightedList = new Y.WeightedList();

            weightedList.add('a', 1);
            weightedList.add('b', 2);
            weightedList.add('c', 4);
            weightedList.add('a', 8);
            weightedList.add('b', 16);
            weightedList.add('c', 32);
            weightedList.add('a', 64);

            Y.Assert.isTrue(weightedList.every(function () {
                values = values.concat(Y.Array(arguments));
                return true;
            }));

            Y.ArrayAssert.itemsAreSame([
                'a',
                0,
                1,
                'b',
                1,
                2,
                'c',
                2,
                4,
                'a',
                3,
                8,
                'b',
                4,
                16,
                'c',
                5,
                32,
                'a',
                6,
                64
            ], values, 'values should be the same as expectedValues.');

            values = [];

            Y.Assert.isFalse(weightedList.every(function (value, index, weight) {
                Y.Assert.isString(value, 'value should be a string.');
                Y.Assert.isNumber(index, 'index should be a number.');
                Y.Assert.isNumber(weight, 'weight should be a number.');

                values = values.concat([
                    value,
                    index,
                    weight
                ]);
                return weight !== 8;
            }));

            Y.ArrayAssert.itemsAreSame([
                'a',
                0,
                1,
                'b',
                1,
                2,
                'c',
                2,
                4,
                'a',
                3,
                8
            ], values, 'values should be the same as expectedValues.');

            weightedList.every(function () {
                Y.Assert.areSame(randomValue, this, 'this should be the same as random value.');
            }, randomValue);
        },
        'test:006-filter': function () {
            var filteredWeightedList,
                randomValue = Math.random(),
                weightedList = new Y.WeightedList();

            weightedList.add('a', 1);
            weightedList.add('b', 2);
            weightedList.add('c', 4);
            weightedList.add('a', 8);
            weightedList.add('b', 16);
            weightedList.add('c', 32);
            weightedList.add('a', 64);

            filteredWeightedList = weightedList.filter(function (value, index, weight) {
                Y.Assert.isString(value, 'value should be a string.');
                Y.Assert.isNumber(index, 'index should be a number.');
                Y.Assert.isNumber(weight, 'weight should be a number.');
                return index % 2;
            });

            Y.Assert.areSame(3, filteredWeightedList.size(), 'filteredWeightedList.size() should be 3.');
            Y.Assert.areSame('b', filteredWeightedList.value(0), 'filteredWeightedList.value(0) should be \'b\'.');
            Y.Assert.areSame('a', filteredWeightedList.value(1), 'filteredWeightedList.value(1) should be \'a\'.');
            Y.Assert.areSame('c', filteredWeightedList.value(2), 'filteredWeightedList.value(2) should be \'c\'.');
            Y.Assert.areSame(2, filteredWeightedList.weight(0), 'filteredWeightedList.weight(0) should be 2.');
            Y.Assert.areSame(8, filteredWeightedList.weight(1), 'filteredWeightedList.weight(1) should be 8.');
            Y.Assert.areSame(32, filteredWeightedList.weight(2), 'filteredWeightedList.weight(2) should be 32.');

            weightedList.filter(function () {
                Y.Assert.areSame(randomValue, this, 'this should be the same as random value.');
            }, randomValue);
        },
        'test:007-find': function () {
            var randomValue = Math.random(),
                weightedList = new Y.WeightedList();

            weightedList.add('a', 1);
            weightedList.add('b', 2);
            weightedList.add('c', 4);
            weightedList.add('d', 8);
            weightedList.add('e', 16);
            weightedList.add('f', 32);
            weightedList.add('g', 64);

            Y.Assert.areSame('d', weightedList.find(function (value, index, weight) {
                Y.Assert.isString(value, 'value should be a string.');
                Y.Assert.isNumber(index, 'index should be a number.');
                Y.Assert.isNumber(weight, 'weight should be a number.');
                return weight === 8;
            }), 'weightedList.filter(...) should be \'d\'.');

            weightedList.find(function () {
                Y.Assert.areSame(randomValue, this, 'this should be the same as random value.');
            }, randomValue);
        },
        'test:008-grep': function () {
            var greppedWeightedList,
                weightedList = new Y.WeightedList();

            weightedList.add('a', 1);
            weightedList.add('b', 2);
            weightedList.add('c', 4);
            weightedList.add('a', 8);
            weightedList.add('b', 16);
            weightedList.add('c', 32);
            weightedList.add('a', 64);

            greppedWeightedList = weightedList.grep(/a/);

            Y.Assert.areSame(3, greppedWeightedList.size(), 'greppedWeightedList.size() should be 3.');
            Y.Assert.areSame('a', greppedWeightedList.value(0), 'greppedWeightedList.value(0) should be \'a\'.');
            Y.Assert.areSame('a', greppedWeightedList.value(1), 'greppedWeightedList.value(1) should be \'a\'.');
            Y.Assert.areSame('a', greppedWeightedList.value(2), 'greppedWeightedList.value(2) should be \'a\'.');
            Y.Assert.areSame(1, greppedWeightedList.weight(0), 'greppedWeightedList.weight(0) should be 1.');
            Y.Assert.areSame(8, greppedWeightedList.weight(1), 'greppedWeightedList.weight(1) should be 8.');
            Y.Assert.areSame(64, greppedWeightedList.weight(2), 'greppedWeightedList.weight(2) should be 64.');
        },
        'test:009-indexOf': function () {
            var weightedList = new Y.WeightedList();

            weightedList.add('a', 1);
            weightedList.add('b', 2);
            weightedList.add('c', 4);
            weightedList.add('a', 8);
            weightedList.add('b', 16);
            weightedList.add('c', 32);
            weightedList.add('a', 64);

            Y.Assert.areSame(0, weightedList.indexOf('a'), 'weightedList.indexOf(\'a\') should be 0.');
            Y.Assert.areSame(1, weightedList.indexOf('b'), 'weightedList.indexOf(\'b\') should be 1.');
            Y.Assert.areSame(2, weightedList.indexOf('c'), 'weightedList.indexOf(\'c\') should be 2.');
            Y.Assert.areSame(-1, weightedList.indexOf('d'), 'weightedList.indexOf(\'d\') should be -1.');
            Y.Assert.areSame(6, weightedList.indexOf('a', 5), 'weightedList.indexOf(\'a\', 5) should be 6.');
            Y.Assert.areSame(-1, weightedList.indexOf('b', 5), 'weightedList.indexOf(\'b\', 5) should be -1.');
            Y.Assert.areSame(5, weightedList.indexOf('c', 5), 'weightedList.indexOf(\'c\', 5) should be 5.');
            Y.Assert.areSame(6, weightedList.indexOf('a', -2), 'weightedList.indexOf(\'a\', -2) should be 6.');
            Y.Assert.areSame(-1, weightedList.indexOf('b', -2), 'weightedList.indexOf(\'b\', -2) should be -1.');
            Y.Assert.areSame(5, weightedList.indexOf('c', -2), 'weightedList.indexOf(\'c\', -2) should be 5.');
        },
        'test:010-invoke': function () {
            var invokedWeightedList,
                weightedList = new Y.WeightedList();

            weightedList.add({
                getValue: function () {
                    return 'a';
                }
            }, 1);
            weightedList.add({
                getValue: function () {
                    return 'b';
                }
            }, 2);
            weightedList.add({
                differentMethodName: function () {
                    return 'c';
                }
            }, 4);
            weightedList.add({
                getValue: function () {
                    return 'd';
                }
            }, 8);
            weightedList.add({
                getValue: function () {
                    return 'e';
                }
            }, 16);
            weightedList.add({
                getValue: function () {
                    return 'f';
                }
            }, 32);
            weightedList.add({
                getValue: function () {
                    return 'g';
                }
            }, 64);

            invokedWeightedList = weightedList.invoke('getValue');

            Y.Assert.areSame(7, invokedWeightedList.size(), 'invokedWeightedList.size() should be 7.');
            Y.Assert.areSame('a', invokedWeightedList.value(0), 'invokedWeightedList.value(0) should be \'a\'.');
            Y.Assert.areSame('b', invokedWeightedList.value(1), 'invokedWeightedList.value(1) should be \'b\'.');
            Y.Assert.isNull(invokedWeightedList.value(2), 'invokedWeightedList.value(2) should be null.');
            Y.Assert.areSame('d', invokedWeightedList.value(3), 'invokedWeightedList.value(2) should be \'d\'.');
            Y.Assert.areSame('e', invokedWeightedList.value(4), 'invokedWeightedList.value(3) should be \'e\'.');
            Y.Assert.areSame('f', invokedWeightedList.value(5), 'invokedWeightedList.value(4) should be \'f\'.');
            Y.Assert.areSame('g', invokedWeightedList.value(6), 'invokedWeightedList.value(5) should be \'g\'.');
            Y.Assert.areSame(1, invokedWeightedList.weight(0), 'invokedWeightedList.weight(0) should be 1.');
            Y.Assert.areSame(2, invokedWeightedList.weight(1), 'invokedWeightedList.weight(1) should be 2.');
            Y.Assert.areSame(4, invokedWeightedList.weight(2), 'invokedWeightedList.weight(2) should be 4.');
            Y.Assert.areSame(8, invokedWeightedList.weight(3), 'invokedWeightedList.weight(2) should be 8.');
            Y.Assert.areSame(16, invokedWeightedList.weight(4), 'invokedWeightedList.weight(3) should be 16.');
            Y.Assert.areSame(32, invokedWeightedList.weight(5), 'invokedWeightedList.weight(4) should be 32.');
            Y.Assert.areSame(64, invokedWeightedList.weight(6), 'invokedWeightedList.weight(5) should be 64.');
        },
        'test:011-lastIndexOf': function () {
            var weightedList = new Y.WeightedList();

            weightedList.add('a', 1);
            weightedList.add('b', 2);
            weightedList.add('c', 4);
            weightedList.add('a', 8);
            weightedList.add('b', 16);
            weightedList.add('c', 32);
            weightedList.add('a', 64);

            Y.Assert.areSame(6, weightedList.lastIndexOf('a'), 'weightedList.lastIndexOf(\'a\') should be 6.');
            Y.Assert.areSame(4, weightedList.lastIndexOf('b'), 'weightedList.lastIndexOf(\'b\') should be 4.');
            Y.Assert.areSame(5, weightedList.lastIndexOf('c'), 'weightedList.lastIndexOf(\'c\') should be 5.');
            Y.Assert.areSame(-1, weightedList.lastIndexOf('d'), 'weightedList.lastIndexOf(\'d\') should be -1.');
            Y.Assert.areSame(0, weightedList.lastIndexOf('a', 1), 'weightedList.lastIndexOf(\'a\', 1) should be 0.');
            Y.Assert.areSame(1, weightedList.lastIndexOf('b', 1), 'weightedList.lastIndexOf(\'b\', 1) should be 1.');
            Y.Assert.areSame(-1, weightedList.lastIndexOf('c', 1), 'weightedList.lastIndexOf(\'c\', 1) should be -1.');
            Y.Assert.areSame(0, weightedList.lastIndexOf('a', -6), 'weightedList.lastIndexOf(\'a\', -6) should be 0.');
            Y.Assert.areSame(1, weightedList.lastIndexOf('b', -6), 'weightedList.lastIndexOf(\'b\', -6) should be 1.');
            Y.Assert.areSame(-1, weightedList.lastIndexOf('c', -6), 'weightedList.lastIndexOf(\'c\', -6) should be -1.');
        },
        'test:012-map': function () {
            var mappedWeightedList,
                randomValue = Math.random(),
                weightedList = new Y.WeightedList();

            weightedList.add('a', 1);
            weightedList.add('b', 2);
            weightedList.add('c', 4);
            weightedList.add('a', 8);
            weightedList.add('b', 16);
            weightedList.add('c', 32);
            weightedList.add('a', 64);

            mappedWeightedList = weightedList.map(function (value, index, weight) {
                return [
                    value,
                    index,
                    weight
                ];
            });

            Y.Assert.areSame(7, mappedWeightedList.size(), 'mappedWeightedList.size() should be 7.');
            Y.ArrayAssert.itemsAreSame([
                'a',
                0,
                1
            ], mappedWeightedList.value(0), 'mappedWeightedList.value(0) should be [\'a\', 0, 1].');
            Y.ArrayAssert.itemsAreSame([
                'b',
                1,
                2
            ], mappedWeightedList.value(1), 'mappedWeightedList.value(1) should be [\'b\', 1, 2].');
            Y.ArrayAssert.itemsAreSame([
                'c',
                2,
                4
            ], mappedWeightedList.value(2), 'mappedWeightedList.value(2) should be [\'c\', 2, 4].');
            Y.ArrayAssert.itemsAreSame([
                'a',
                3,
                8
            ], mappedWeightedList.value(3), 'mappedWeightedList.value(3) should be [\'a\', 3, 8].');
            Y.ArrayAssert.itemsAreSame([
                'b',
                4,
                16
            ], mappedWeightedList.value(4), 'mappedWeightedList.value(4) should be [\'b\', 4, 16].');
            Y.ArrayAssert.itemsAreSame([
                'c',
                5,
                32
            ], mappedWeightedList.value(5), 'mappedWeightedList.value(5) should be [\'c\', 5, 32].');
            Y.ArrayAssert.itemsAreSame([
                'a',
                6,
                64
            ], mappedWeightedList.value(6), 'mappedWeightedList.value(6) should be [\'a\', 6, 64].');
            Y.Assert.areSame(1, mappedWeightedList.weight(0), 'mappedWeightedList.weight(0) should be 1.');
            Y.Assert.areSame(2, mappedWeightedList.weight(1), 'mappedWeightedList.weight(1) should be 2.');
            Y.Assert.areSame(4, mappedWeightedList.weight(2), 'mappedWeightedList.weight(2) should be 4.');
            Y.Assert.areSame(8, mappedWeightedList.weight(3), 'mappedWeightedList.weight(3) should be 8.');
            Y.Assert.areSame(16, mappedWeightedList.weight(4), 'mappedWeightedList.weight(4) should be 16.');
            Y.Assert.areSame(32, mappedWeightedList.weight(5), 'mappedWeightedList.weight(5) should be 32.');
            Y.Assert.areSame(64, mappedWeightedList.weight(6), 'mappedWeightedList.weight(6) should be 64.');

            weightedList.map(function () {
                Y.Assert.areSame(randomValue, this, 'this should be the same as random value.');
            }, randomValue);
        },
        'test:013-partition': function () {
            var partition,
                randomValue = Math.random(),
                weightedList = new Y.WeightedList();

            weightedList.add('a', 1);
            weightedList.add('b', 2);
            weightedList.add('c', 4);
            weightedList.add('a', 8);
            weightedList.add('b', 16);
            weightedList.add('c', 32);
            weightedList.add('a', 64);

            partition = weightedList.partition(function (value, index, weight) {
                Y.Assert.isString(value, 'value should be a string.');
                Y.Assert.isNumber(index, 'index should be a number.');
                Y.Assert.isNumber(weight, 'weight should be a number.');
                return index % 2;
            });

            Y.Assert.areSame(3, partition.matches.size(), 'partition.matches.size() should be 3.');
            Y.Assert.areSame('b', partition.matches.value(0), 'partition.matches.value(0) should be \'b\'.');
            Y.Assert.areSame('a', partition.matches.value(1), 'partition.matches.value(1) should be \'a\'.');
            Y.Assert.areSame('c', partition.matches.value(2), 'partition.matches.value(2) should be \'c\'.');
            Y.Assert.areSame(2, partition.matches.weight(0), 'partition.matches.weight(0) should be 2.');
            Y.Assert.areSame(8, partition.matches.weight(1), 'partition.matches.weight(1) should be 8.');
            Y.Assert.areSame(32, partition.matches.weight(2), 'partition.matches.weight(2) should be 32.');

            Y.Assert.areSame(4, partition.rejects.size(), 'partition.rejects.size() should be 4.');
            Y.Assert.areSame('a', partition.rejects.value(0), 'partition.rejects.value(0) should be \'a\'.');
            Y.Assert.areSame('c', partition.rejects.value(1), 'partition.rejects.value(1) should be \'c\'.');
            Y.Assert.areSame('b', partition.rejects.value(2), 'partition.rejects.value(2) should be \'b\'.');
            Y.Assert.areSame('a', partition.rejects.value(3), 'partition.rejects.value(3) should be \'a\'.');
            Y.Assert.areSame(1, partition.rejects.weight(0), 'partition.rejects.weight(0) should be 1.');
            Y.Assert.areSame(4, partition.rejects.weight(1), 'partition.rejects.weight(1) should be 4.');
            Y.Assert.areSame(16, partition.rejects.weight(2), 'partition.rejects.weight(2) should be 16.');
            Y.Assert.areSame(64, partition.rejects.weight(3), 'partition.rejects.weight(3) should be 64.');

            weightedList.partition(function () {
                Y.Assert.areSame(randomValue, this, 'this should be the same as random value.');
            }, randomValue);
        },
        'test:014-reduce': function () {
            var randomValue = Math.random(),
                weightedList = new Y.WeightedList();

            weightedList.add('a', 1);
            weightedList.add('b', 2);
            weightedList.add('c', 4);
            weightedList.add('d', 8);
            weightedList.add('e', 16);
            weightedList.add('f', 32);
            weightedList.add('g', 64);

            Y.Assert.areSame(127, weightedList.reduce(0, function (weightSum, value, index, weight) {
                Y.Assert.isNumber(weightSum, 'weightSum should be a number.');
                Y.Assert.isString(value, 'value should be a string.');
                Y.Assert.isNumber(index, 'index should be a number.');
                Y.Assert.isNumber(weight, 'weight should be a number.');
                return weightSum + weight;
            }), 'weightedList.reduce(...) should be 127.');

            weightedList.reduce(0, function () {
                Y.Assert.areSame(randomValue, this, 'this should be the same as random value.');
            }, randomValue);
        },
        'test:015-reject': function () {
            var randomValue = Math.random(),
                rejectedWeightedList,
                weightedList = new Y.WeightedList();

            weightedList.add('a', 1);
            weightedList.add('b', 2);
            weightedList.add('c', 4);
            weightedList.add('a', 8);
            weightedList.add('b', 16);
            weightedList.add('c', 32);
            weightedList.add('a', 64);

            rejectedWeightedList = weightedList.reject(function (value, index, weight) {
                Y.Assert.isString(value, 'value should be a string.');
                Y.Assert.isNumber(index, 'index should be a number.');
                Y.Assert.isNumber(weight, 'weight should be a number.');
                return index % 2;
            });

            Y.Assert.areSame(4, rejectedWeightedList.size(), 'rejectedWeightedList.size() should be 4.');
            Y.Assert.areSame('a', rejectedWeightedList.value(0), 'rejectedWeightedList.value(0) should be \'a\'.');
            Y.Assert.areSame('c', rejectedWeightedList.value(1), 'rejectedWeightedList.value(1) should be \'c\'.');
            Y.Assert.areSame('b', rejectedWeightedList.value(2), 'rejectedWeightedList.value(2) should be \'b\'.');
            Y.Assert.areSame('a', rejectedWeightedList.value(3), 'rejectedWeightedList.value(3) should be \'a\'.');
            Y.Assert.areSame(1, rejectedWeightedList.weight(0), 'rejectedWeightedList.weight(0) should be 1.');
            Y.Assert.areSame(4, rejectedWeightedList.weight(1), 'rejectedWeightedList.weight(1) should be 4.');
            Y.Assert.areSame(16, rejectedWeightedList.weight(2), 'rejectedWeightedList.weight(2) should be 16.');
            Y.Assert.areSame(64, rejectedWeightedList.weight(3), 'rejectedWeightedList.weight(3) should be 64.');

            weightedList.reject(function () {
                Y.Assert.areSame(randomValue, this, 'this should be the same as random value.');
            }, randomValue);
        },
        'test:016-some': function () {
            var randomValue = Math.random(),
                values = [],
                weightedList = new Y.WeightedList();

            weightedList.add('a', 1);
            weightedList.add('b', 2);
            weightedList.add('c', 4);
            weightedList.add('a', 8);
            weightedList.add('b', 16);
            weightedList.add('c', 32);
            weightedList.add('a', 64);

            Y.Assert.isFalse(weightedList.some(function () {
                values = values.concat(Y.Array(arguments));
            }));

            Y.ArrayAssert.itemsAreSame([
                'a',
                0,
                1,
                'b',
                1,
                2,
                'c',
                2,
                4,
                'a',
                3,
                8,
                'b',
                4,
                16,
                'c',
                5,
                32,
                'a',
                6,
                64
            ], values, 'values should be the same as expectedValues.');

            values = [];

            Y.Assert.isTrue(weightedList.some(function (value, index, weight) {
                Y.Assert.isString(value, 'value should be a string.');
                Y.Assert.isNumber(index, 'index should be a number.');
                Y.Assert.isNumber(weight, 'weight should be a number.');

                values = values.concat([
                    value,
                    index,
                    weight
                ]);
                return weight === 8;
            }));

            Y.ArrayAssert.itemsAreSame([
                'a',
                0,
                1,
                'b',
                1,
                2,
                'c',
                2,
                4,
                'a',
                3,
                8
            ], values, 'values should be the same as expectedValues.');

            weightedList.some(function () {
                Y.Assert.areSame(randomValue, this, 'this should be the same as random value.');
            }, randomValue);
        },
        'test:017-unique': function () {
            var uniqueWeightedList,
                weightedList = new Y.WeightedList();

            weightedList.add(1, 1);
            weightedList.add(2, 2);
            weightedList.add(3, 4);
            weightedList.add(1, 8);
            weightedList.add(2, 16);
            weightedList.add(3, 32);
            weightedList.add(1, 64);

            uniqueWeightedList = weightedList.unique();

            Y.Assert.areSame(3, uniqueWeightedList.size(), 'uniqueWeightedList.size() should be 3.');
            Y.Assert.areSame(1, uniqueWeightedList.value(0), 'uniqueWeightedList.value(0) should be 1.');
            Y.Assert.areSame(2, uniqueWeightedList.value(1), 'uniqueWeightedList.value(1) should be 2.');
            Y.Assert.areSame(3, uniqueWeightedList.value(2), 'uniqueWeightedList.value(2) should be 3.');
            Y.Assert.areSame(73, uniqueWeightedList.weight(0), 'uniqueWeightedList.weight(0) should be 73.');
            Y.Assert.areSame(18, uniqueWeightedList.weight(1), 'uniqueWeightedList.weight(1) should be 18.');
            Y.Assert.areSame(36, uniqueWeightedList.weight(2), 'uniqueWeightedList.weight(2) should be 36.');

            uniqueWeightedList = weightedList.unique('first');

            Y.Assert.areSame(3, uniqueWeightedList.size(), 'uniqueWeightedList.size() should be 3.');
            Y.Assert.areSame(1, uniqueWeightedList.value(0), 'uniqueWeightedList.value(0) should be 1.');
            Y.Assert.areSame(2, uniqueWeightedList.value(1), 'uniqueWeightedList.value(1) should be 2.');
            Y.Assert.areSame(3, uniqueWeightedList.value(2), 'uniqueWeightedList.value(2) should be 3.');
            Y.Assert.areSame(1, uniqueWeightedList.weight(0), 'uniqueWeightedList.weight(0) should be 1.');
            Y.Assert.areSame(2, uniqueWeightedList.weight(1), 'uniqueWeightedList.weight(1) should be 2.');
            Y.Assert.areSame(4, uniqueWeightedList.weight(2), 'uniqueWeightedList.weight(2) should be 4.');
        },
        'test:018-emptyArrayChecks': function () {
            var partition,
                randomValue = Math.random(),
                weightedList = new Y.WeightedList();

            Y.Assert.isTrue(weightedList.dedupe().isEmpty(), 'weightedList.dedupe().isEmpty() should be true.');
            weightedList.each(function () {
                Y.Assert.fail('The callback function passed to weightedList.each should not get called.');
            });
            Y.Assert.isTrue(weightedList.every(function () {
                Y.Assert.fail('The callback function passed to weightedList.every should not get called.');
            }), 'weightedList.every(...) should be true.');
            Y.Assert.isTrue(weightedList.filter(function () {
                Y.Assert.fail('The callback function passed to weightedList.filter should not get called.');
            }).isEmpty(), 'weightedList.filter(...).isEmpty() should be true.');
            Y.Assert.isNull(weightedList.find(function () {
                Y.Assert.fail('The callback function passed to weightedList.find should not get called.');
            }), 'weightedList.find(...) should be null.');
            Y.Assert.isTrue(weightedList.grep().isEmpty(), 'weightedList.grep().isEmpty() should be true.');
            Y.Assert.isTrue(weightedList.invoke().isEmpty(), 'weightedList.invoke().isEmpty() should be true.');
            Y.Assert.isTrue(weightedList.isEmpty(), 'weightedList.isEmpty() should be true.');
            Y.Assert.isNull(weightedList.item(), 'weightedList.item() should be null.');
            Y.Assert.isTrue(weightedList.map(function () {
                Y.Assert.fail('The callback function passed to weightedList.map should not get called.');
            }).isEmpty(), 'weightedList.map(...).isEmpty() should be true.');
            partition = weightedList.partition(function () {
                Y.Assert.fail('The callback function passed to weightedList.partition should not get called.');
            });
            Y.Assert.isTrue(partition.matches.isEmpty(), 'partition.matches.isEmpty() should be true.');
            Y.Assert.isTrue(partition.rejects.isEmpty(), 'partition.rejects.isEmpty() should be true.');
            Y.Assert.areSame(randomValue, weightedList.reduce(randomValue, function () {
                Y.Assert.fail('The callback function passed to weightedList.reduce should not get called.');
            }), 'randomValue should be passed back unmodified from weightedList.reduce.');
            Y.Assert.isTrue(weightedList.reject(function () {
                Y.Assert.fail('The callback function passed to weightedList.reject should not get called.');
            }).isEmpty(), 'weightedList.reject(...).isEmpty() should be true.');
            Y.Assert.areSame(0, weightedList.size(), 'weightedList.size() should be 0.');
            Y.Assert.isFalse(weightedList.some(function () {
                Y.Assert.fail('The callback function passed to weightedList.some should not get called.');
            }), 'weightedList.some(...) should be false.');
            Y.ArrayAssert.itemsAreSame([], weightedList.toArray(), 'weightedList.toArray() should be an empty array.');
            Y.ArrayAssert.itemsAreSame([], weightedList.toJSON(), 'weightedList.toJSON() should be an empty array.');
            Y.Assert.areSame('', weightedList.toString(), 'weightedList.toString() should be an empty string.');
            Y.Assert.isTrue(weightedList.unique().isEmpty(), 'weightedList.unique().isEmpty() should be true.');
            Y.Assert.isNull(weightedList.value(), 'weightedList.value() should be null.');
            Y.Assert.isNull(weightedList.weight(), 'weightedList.weight() should be null.');
        },
        'test:019-probability': function () {
            var i = 0,
                resultsIndex = {
                    '0': 0,
                    '1': 0,
                    '2': 0,
                    '3': 0,
                    '4': 0,
                    '5': 0,
                    '6': 0
                },
                resultsValue = {
                    a: 0,
                    b: 0,
                    c: 0,
                    d: 0,
                    e: 0,
                    f: 0,
                    g: 0
                },
                resultsWeight = {
                    '1': 0,
                    '2': 0,
                    '3': 0,
                    '4': 0,
                    '5': 0,
                    '6': 0,
                    '7': 0
                },
                weightedList = new Y.WeightedList();

            weightedList.add('a', 1);
            weightedList.add('b', 2);
            weightedList.add('c', 3);
            weightedList.add('d', 4);
            weightedList.add('e', 5);
            weightedList.add('f', 6);
            weightedList.add('g', 7);

            for (; i < 6765; i += 1) {
                resultsIndex[weightedList.item().index] += 1;
                resultsValue[weightedList.value()] += 1;
                resultsWeight[weightedList.weight()] += 1;
            }

            Y.assert(resultsIndex[6] > resultsIndex[5], '6 should come up more often than 5');
            Y.assert(resultsIndex[5] > resultsIndex[4], '5 should come up more often than 4');
            Y.assert(resultsIndex[4] > resultsIndex[3], '4 should come up more often than 3');
            Y.assert(resultsIndex[3] > resultsIndex[2], '3 should come up more often than 2');
            Y.assert(resultsIndex[2] > resultsIndex[1], '2 should come up more often than 1');
            Y.assert(resultsIndex[1] > resultsIndex[0], '1 should come up more often than 0');

            Y.assert(resultsValue.g > resultsValue.f, 'g should come up more often than f');
            Y.assert(resultsValue.f > resultsValue.e, 'f should come up more often than e');
            Y.assert(resultsValue.e > resultsValue.d, 'e should come up more often than d');
            Y.assert(resultsValue.d > resultsValue.c, 'd should come up more often than c');
            Y.assert(resultsValue.c > resultsValue.b, 'c should come up more often than b');
            Y.assert(resultsValue.b > resultsValue.a, 'b should come up more often than a');

            Y.assert(resultsWeight[7] > resultsWeight[6], '7 should come up more often than 6');
            Y.assert(resultsWeight[6] > resultsWeight[5], '6 should come up more often than 5');
            Y.assert(resultsWeight[5] > resultsWeight[4], '5 should come up more often than 4');
            Y.assert(resultsWeight[4] > resultsWeight[3], '4 should come up more often than 3');
            Y.assert(resultsWeight[3] > resultsWeight[2], '3 should come up more often than 2');
            Y.assert(resultsWeight[2] > resultsWeight[1], '2 should come up more often than 1');
        },
        'test:020-aleaSeed': function () {
            var test = this;

            Y.use('gallery-alea', function () {
                test.resume(function () {
                    Y.Assert.isFunction(Y.Alea, 'Y.Alea should be a function.');

                    var i = 0,

                        randomValue0,
                        randomValue1,
                        randomValue2,

                        seed0 = Math.random(),
                        seed1 = Math.random(),
                        seed2 = Math.random(),

                        weightedList0 = new Y.WeightedList(seed0, seed1, seed2),
                        weightedList1 = new Y.WeightedList([
                            seed0,
                            seed1,
                            seed2
                        ]),
                        weightedList2 = new Y.WeightedList(seed0, seed1, seed2);

                    weightedList0.add('a', 1);
                    weightedList0.add('b', 2);
                    weightedList0.add('c', 3);
                    weightedList0.add('d', 4);
                    weightedList0.add('e', 5);
                    weightedList0.add('f', 6);
                    weightedList0.add('g', 7);

                    weightedList1.add('a', 1);
                    weightedList1.add('b', 2);
                    weightedList1.add('c', 3);
                    weightedList1.add('d', 4);
                    weightedList1.add('e', 5);
                    weightedList1.add('f', 6);
                    weightedList1.add('g', 7);

                    weightedList2.add('a', 1);
                    weightedList2.add('b', 2);
                    weightedList2.add('c', 3);
                    weightedList2.add('d', 4);
                    weightedList2.add('e', 5);
                    weightedList2.add('f', 6);
                    weightedList2.add('g', 7);

                    for (; i < 144; i += 1) {
                        randomValue0 = weightedList0.value();
                        randomValue1 = weightedList1.value();
                        randomValue2 = weightedList2.value();

                        Y.Assert.areSame(randomValue0, randomValue1, 'randomValue0 should be the same as randomValue1.');
                        Y.Assert.areSame(randomValue1, randomValue2, 'randomValue1 should be the same as randomValue2.');
                    }
                });
            });

            test.wait(6765);
        }
    }));

    Y.Test.Runner.add(suite);
}, '', {
    requires: [
        'gallery-weighted-list',
        'test'
    ]
});