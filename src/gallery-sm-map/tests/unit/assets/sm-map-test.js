YUI.add('gallery-sm-map-test', function (Y) {

var Assert       = Y.Assert,
    ArrayAssert  = Y.ArrayAssert,
    ObjectAssert = Y.ObjectAssert,
    YMap         = Y.Map;

var suite = Y.MapTestSuite = new Y.Test.Suite('Map');

// -- Lifecycle ----------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Lifecycle',

    'constructor should construct a Map instance': function () {
        var map = new YMap();

        Assert.isInstanceOf(YMap, map);
        Assert.areSame(0, map.size, 'map size should be zero');
    },

    'constructor should accept an optional array of entries': function () {
        var c   = {},
            map = new YMap([['a', 'one'], ['b', 'two'], [c, 'three']]);

        Assert.areSame(3, map.size, 'map size should be correct');

        ArrayAssert.itemsAreSame(['a', 'b', c], map.keys(),
            '"a", "b", and the object c should be keys');

        ArrayAssert.itemsAreSame(['one', 'two', 'three'], map.values(),
            '"one", "two", and "three" should be values');
    },

    'constructor should accept an array-like entries object': function () {
        var map = (function () {
            return new YMap(arguments);
        }(['a', 'one'], ['b', 'two']));

        Assert.areSame(2, map.size, 'map should have two entries');
        Assert.areSame('one', map.get('a'), '"a" entry should be set');
        Assert.areSame('two', map.get('b'), '"b" entry should be set');
    },

    'constructor should accept another Y.Map instance': function () {
        var firstMap  = new YMap([['a', 'one'], ['b', 'two']]),
            secondMap = new YMap(firstMap);

        Assert.areSame(2, secondMap.size, 'map should have two entries');
        Assert.areSame('one', secondMap.get('a'), '"a" entry should be set');
        Assert.areSame('two', secondMap.get('b'), '"b" entry should be set');
    },

    'constructor should accept an options object as the second argument': function () {
        var map = new YMap([['a', 'one']], {foo: 'bar'});

        Assert.areSame('one', map.get('a'), '"a" entry should be set');
        Assert.areSame('bar', map._mapOptions.foo, '"foo" option should be set');
    },

    'constructor should accept an options object as the only argument': function () {
        var map = new YMap({foo: 'bar'});

        Assert.areSame(0, map.size, 'map should be empty');
        Assert.areSame('bar', map._mapOptions.foo, '"foo" option should be set');
    }
}));

// -- Properties  --------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Properties',

    _should: {
        ignore: {
            '`size` should be non-writable and non-enumerable in good browsers': !Y.Lang._isNative(Object.defineProperty) || Y.UA.ie === 8
        }
    },

    '`size` should reflect the size of the map': function () {
        var map = new YMap();

        Assert.isNumber(map.size, 'size should be a number');
        Assert.areSame(0, map.size, 'size should be 0 by default');

        map.set('foo', 'bar');
        map.set('baz', 'quux');
        Assert.areSame(2, map.size, 'size should increment when a new entry is created');

        map.set('foo', 'baz');
        Assert.areSame(2, map.size, 'size should not increment when an entry is replaced');

        map.remove('foo');
        Assert.areSame(1, map.size, 'size should decrement when an entry is removed');

        map.clear();
        Assert.areSame(0, map.size, 'size should be 0 after the map is cleared');
    },

    '`size` should be non-writable and non-enumerable in good browsers': function () {
        var map = new YMap();

        Assert.isFalse(Object.propertyIsEnumerable(map.size), 'size should not be enumerable');

        try {
            map.size = 5;
        } catch (ex) {}

        Assert.areSame(0, map.size, 'size should not be writable');
    }
}));

// -- Methods ------------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Methods',

    setUp: function () {
        this.array  = [];
        this.fn     = function () {};
        this.object = {};
        this.regex  = /hello!/;

        this.entries = [
            ['a', 'one'],
            [this.array, 'array'],
            [this.fn, 'function'],
            [this.object, 'object'],
            [this.regex, 'regex'],
            [null, 'null'],
            [0, '0'],
            [3.14, 'pi'],
            [false, 'false']
        ];

        this.keys   = [];
        this.values = [];

        for (var i = 0, len = this.entries.length; i < len; ++i) {
            this.keys[i]   = this.entries[i][0];
            this.values[i] = this.entries[i][1];
        }

        this.map        = new YMap(this.entries);
        this.stampedMap = new YMap(this.entries, {autoStamp: true});
    },

    'clear() should delete all entries from the map': function () {
        this.map.clear();

        Assert.areSame(0, this.map.size, 'size should be 0');
        Assert.isUndefined(this.map.get('a'), 'get("a") should return undefined');
        ArrayAssert.isEmpty(this.map.keys(), 'keys array should be empty');
        ArrayAssert.isEmpty(this.map.entries(), 'entries array should be empty');
        ArrayAssert.isEmpty(this.map.values(), 'values array should be empty');
    },

    'clear() should be chainable': function () {
        Assert.areSame(this.map, this.map.clear());
    },

    'delete() should be an alias for remove()': function () {
        Assert.areSame(this.map.remove, this.map['delete']);
    },

    'each() should pass each entry in the map to the given callback': function () {
        var count  = 0,
            global = (function () { return this; }()),
            keys   = [],
            test   = this,
            values = [];

        this.map.each(function (value, key, map) {
            count += 1;

            keys.push(key);
            values.push(value);

            Assert.areSame(global, this, '`this` should be the global object');
            Assert.areSame(test.map, map, 'third argument should be the map');
        });

        Assert.areSame(this.map.size, count, 'should iterate through every entry in the map');
        ArrayAssert.itemsAreSame(this.map.keys(), keys, 'all keys should be visited');
        ArrayAssert.itemsAreSame(this.map.values(), values, 'all values should be visited');
    },

    'each() should not lose its shit if the map is modified during iteration': function () {
        var count          = 0,
            expectedCount  = this.map.size,
            expectedKeys   = this.map.keys(),
            expectedValues = this.map.values(),
            keys           = [],
            values         = [];

        this.map.each(function (value, key, map) {
            count += 1;

            keys.push(key);
            values.push(value);

            map.remove(key);
            map.set('foo' + count, Math.random());
        });

        Assert.areSame(expectedCount, count, 'should iterate through every entry in the original map');
        ArrayAssert.itemsAreSame(expectedKeys, keys, 'all keys should be visited');
        ArrayAssert.itemsAreSame(expectedValues, values, 'all values should be visited');
    },

    'each() should execute the callback with the supplied `this` object': function () {
        var thisObj = {};

        this.map.each(function () {
            Assert.areSame(thisObj, this);
        }, thisObj);
    },

    'each() should halt iteration if the callback returns `false`': function () {
        var count = 0;

        this.map.each(function () {
            count += 1;
            return count !== 3;
        });

        Assert.areSame(3, count, 'iteration should halt early');

        count = 0

        this.map.each(function () {
            count += 1;
            return 0;
        });

        Assert.areSame(this.map.size, count, "iteration should not halt on a falsy value that isn't `false`");
    },

    'each() should be chainable': function () {
        Assert.areSame(this.map, this.map.each(function () {}));
    },

    'entries() should return an array of all entries in the map': function () {
        var entries = this.map.entries();

        Assert.areSame(this.entries.length, entries.length, 'entries should have the expected length');

        for (var i = 0, len = entries.length; i < len; ++i) {
            Assert.areSame(this.entries[i][0], entries[i][0], 'keys for entry ' + i + ' should be the same');
            Assert.areSame(this.entries[i][1], entries[i][1], 'values for entry ' + i + ' should be the same');
        }
    },

    'entries() should return a copy, not a reference to an internal array': function () {
        var entries = this.map.entries();

        Assert.areSame('a', entries[0][0], 'key sanity check');
        Assert.areSame('one', entries[0][1], 'value sanity check');

        entries[0][1] = 'changed';
        Assert.areSame('one', this.map.get('a'), 'value should not be changed');

        entries[0][0] = 'changed';
        Assert.areSame('one', this.map.get('a'), 'key should not be changed');
        Assert.isUndefined(this.map.get('changed'), 'new entry should not be created');
    },

    'forEach() should be an alias for each()': function () {
        Assert.areSame(this.map.each, this.map.forEach);
    },

    'get() should return the value of the given key': function () {
        Assert.isUndefined(this.map.get('bogus'), 'should return undefined by default for a missing key');
        Assert.areSame('one', this.map.get('a'), 'should support string keys');
        Assert.areSame('array', this.map.get(this.array), 'should support array keys');
        Assert.areSame('function', this.map.get(this.fn), 'should support function keys');
        Assert.areSame('object', this.map.get(this.object), 'should support object keys');
        Assert.areSame('regex', this.map.get(this.regex), 'should support regex keys');
        Assert.areSame('null', this.map.get(null), 'should support null keys');
        Assert.areSame('0', this.map.get(0), 'should support numeric keys');
        Assert.areSame('0', this.map.get(-0), 'should treat 0 and -0 as the same key');
        Assert.areSame('pi', this.map.get(3.14), 'should support float keys');
        Assert.areSame('false', this.map.get(false), 'should support boolean keys');

        this.map.set(NaN, 'NaN');
        Assert.areSame('NaN', this.map.get(NaN), 'should support NaN keys');

        if (Y.config.doc) {
            var el = Y.config.doc.createElement('div');

            this.map.set(el, 'DOM element');
            Assert.areSame('DOM element', this.map.get(el), 'should support DOM element keys');
        }
    },

    'get() should return the value of the given stamped object key': function () {
        Assert.isUndefined(this.stampedMap.get('bogus'), 'should return undefined by default for a missing key');
        Assert.areSame('one', this.stampedMap.get('a'), 'should support string keys');
        Assert.areSame('array', this.stampedMap.get(this.array), 'should support array keys');
        Assert.areSame('function', this.stampedMap.get(this.fn), 'should support function keys');
        Assert.areSame('object', this.stampedMap.get(this.object), 'should support object keys');
        Assert.areSame('regex', this.stampedMap.get(this.regex), 'should support regex keys');
        Assert.areSame('null', this.stampedMap.get(null), 'should support null keys');
        Assert.areSame('0', this.stampedMap.get(0), 'should support numeric keys');
        Assert.areSame('0', this.stampedMap.get(-0), 'should treat 0 and -0 as the same key');
        Assert.areSame('pi', this.stampedMap.get(3.14), 'should support float keys');
        Assert.areSame('false', this.stampedMap.get(false), 'should support boolean keys');

        this.stampedMap.set(NaN, 'NaN');
        Assert.areSame('NaN', this.stampedMap.get(NaN), 'should support NaN keys');

        if (Y.config.doc) {
            var el = Y.config.doc.createElement('div');

            this.stampedMap.set(el, 'DOM element');
            Assert.areSame('DOM element', this.stampedMap.get(el), 'should support DOM element keys');
        }
    },

    'get() should return the defaultValue if provided and the key is not found': function () {
        var obj = {};
        Assert.areSame(obj, this.map.get('bogus', obj));
    },

    'has() should return `true` if a key exists, `false` otherwise': function () {
        Assert.isFalse(this.map.has('bogus'), 'should not have bogus key');
        Assert.isTrue(this.map.has('a'), 'should have string key');
        Assert.isTrue(this.map.has(this.array), 'should have array key');
        Assert.isTrue(this.map.has(this.fn), 'should have function key');
        Assert.isTrue(this.map.has(this.object), 'should have object key');
        Assert.isTrue(this.map.has(this.regex), 'should have regex key');
        Assert.isTrue(this.map.has(null), 'should have null key');
        Assert.isTrue(this.map.has(0), 'should have numeric key');
        Assert.isTrue(this.map.has(3.14), 'should have float key');
        Assert.isTrue(this.map.has(false), 'should have boolean key');

        this.map.set(NaN, 'NaN');
        Assert.isTrue(this.map.has(NaN), 'should have NaN key');

        if (Y.config.doc) {
            var el = Y.config.doc.createElement('div');

            this.map.set(el, 'DOM element');
            Assert.isTrue(this.map.has(el), 'should have DOM element key');
        }
    },

    'has() should return `true` if a key exists in a stamped map': function () {
        Assert.isFalse(this.stampedMap.has('bogus'), 'should not have bogus key');
        Assert.isTrue(this.stampedMap.has('a'), 'should have string key');
        Assert.isTrue(this.stampedMap.has(this.array), 'should have array key');
        Assert.isTrue(this.stampedMap.has(this.fn), 'should have function key');
        Assert.isTrue(this.stampedMap.has(this.object), 'should have object key');
        Assert.isTrue(this.stampedMap.has(this.regex), 'should have regex key');
        Assert.isTrue(this.stampedMap.has(null), 'should have null key');
        Assert.isTrue(this.stampedMap.has(0), 'should have numeric key');
        Assert.isTrue(this.stampedMap.has(3.14), 'should have float key');
        Assert.isTrue(this.stampedMap.has(false), 'should have boolean key');

        this.stampedMap.set(NaN, 'NaN');
        Assert.isTrue(this.stampedMap.has(NaN), 'should have NaN key');

        if (Y.config.doc) {
            var el = Y.config.doc.createElement('div');

            this.stampedMap.set(el, 'DOM element');
            Assert.isTrue(this.stampedMap.has(el), 'should have DOM element key');
        }
    },

    'keys() should return an array of all the keys in the map': function () {
        ArrayAssert.itemsAreSame(this.keys, this.map.keys(), 'expected keys should be returned');
    },

    'keys() should return a copy, not a reference to an internal array': function () {
        var keys = this.map.keys();

        Assert.areSame(null, keys[5], 'sanity check');

        keys[5] = true;
        Assert.areSame('null', this.map.get(null), 'key should not be changed');
        Assert.isUndefined(this.map.get(true), 'new entry should not be created');
    },

    'merge() should merge one or more other maps into the host map': function () {
        var mapZero = new Y.Map([['k', 'kittens'], ['p', 'puppies']]);

        this.map.merge(mapZero);

        Assert.areSame('kittens', this.map.get('k'), 'should have kittens');
        Assert.areSame('puppies', this.map.get('p'), 'should have puppies');

        var mapOne = new Y.Map([['foo', 'bar'], ['a', 'map one'], [this.fn, 'map one fn']]),
            mapTwo = new Y.Map([['baz', 'quux'], ['a', 'map two'], [this.object, 'map two object']]);

        this.map.merge(mapOne, mapTwo);

        Assert.areSame('kittens', this.map.get('k'), 'should still have kittens');
        Assert.areSame('puppies', this.map.get('p'), 'should still have puppies');
        Assert.areSame('bar', this.map.get('foo'), 'should have foo');
        Assert.areSame('map two', this.map.get('a'), 'should have "a"');
        Assert.areSame('map one fn', this.map.get(this.fn), 'should have function');
        Assert.areSame('quux', this.map.get('baz'), 'should have baz');
        Assert.areSame('map two object', this.map.get(this.object), 'should have map two object');
    },

    'merge() should accept arrays of entries': function () {
        var mapZero = [['k', 'kittens'], ['p', 'puppies']];

        this.map.merge(mapZero);

        Assert.areSame('kittens', this.map.get('k'), 'should have kittens');
        Assert.areSame('puppies', this.map.get('p'), 'should have puppies');

        var mapOne = [['foo', 'bar'], ['a', 'map one'], [this.fn, 'map one fn']],
            mapTwo = [['baz', 'quux'], ['a', 'map two'], [this.object, 'map two object']];

        this.map.merge(mapOne, mapTwo);

        Assert.areSame('kittens', this.map.get('k'), 'should still have kittens');
        Assert.areSame('puppies', this.map.get('p'), 'should still have puppies');
        Assert.areSame('bar', this.map.get('foo'), 'should have foo');
        Assert.areSame('map two', this.map.get('a'), 'should have "a"');
        Assert.areSame('map one fn', this.map.get(this.fn), 'should have function');
        Assert.areSame('quux', this.map.get('baz'), 'should have baz');
        Assert.areSame('map two object', this.map.get(this.object), 'should have map two object');
    },

    'merge() should be chainable': function () {
        Assert.areSame(this.map, this.map.merge());
    },

    'remove() should delete the entry with the given key': function () {
        var marker      = 'marker',
            markerValue = 'markerValue';

        this.map.set(marker, markerValue);

        var size = this.map.size;

        Assert.isFalse(this.map.remove('bogus'), 'should return false if the key is not found');
        Assert.isTrue(this.map.remove('a'), 'should return true if the key is found');
        Assert.isFalse(this.map.has('a'), 'entry should be removed');
        Assert.areSame(size - 1, this.map.size, 'size should be -1');
        Assert.areSame(markerValue, this.map.get(marker), 'entries should be properly indexed');

        Assert.isTrue(this.map.remove(0), 'should remove 0 key');
        Assert.isFalse(this.map.has(0), '0 entry should be removed');
        Assert.areSame(size - 2, this.map.size, 'size should be -2');
        Assert.areSame(markerValue, this.map.get(marker), 'entries should be properly indexed (2)');

        this.map.set(NaN, 'NaN');
        Assert.isTrue(this.map.has(NaN), 'NaN key should be created');
        Assert.isTrue(this.map.remove(NaN), 'should remove NaN key');
        Assert.isFalse(this.map.has(NaN), 'NaN key entry should be removed');
        Assert.areSame(size - 2, this.map.size, 'size should be -2 after removing NaN');
        Assert.areSame(markerValue, this.map.get(marker), 'entries should be properly indexed (3)');
    },

    'remove() should delete the entry with the given key from a stamped map': function () {
        var marker      = {},
            markerValue = {};

        this.stampedMap.set(marker, markerValue);

        var size = this.stampedMap.size;

        Assert.isFalse(this.stampedMap.remove('bogus'), 'should return false if the key is not found');
        Assert.isTrue(this.stampedMap.remove('a'), 'should return true if the key is found');
        Assert.isFalse(this.stampedMap.has('a'), 'entry should be removed');
        Assert.areSame(size - 1, this.stampedMap.size, 'size should be -1');
        Assert.areSame(markerValue, this.stampedMap.get(marker), 'entries should be properly indexed');

        Assert.isTrue(this.stampedMap.remove(0), 'should remove 0 key');
        Assert.isFalse(this.stampedMap.has(0), '0 entry should be removed');
        Assert.areSame(size - 2, this.stampedMap.size, 'size should be -2');
        Assert.areSame(markerValue, this.stampedMap.get(marker), 'entries should be properly indexed (2)');

        this.stampedMap.set(NaN, 'NaN');
        Assert.isTrue(this.stampedMap.has(NaN), 'NaN key should be created');
        Assert.isTrue(this.stampedMap.remove(NaN), 'should remove NaN key');
        Assert.isFalse(this.stampedMap.has(NaN), 'NaN key entry should be removed');
        Assert.areSame(size - 2, this.stampedMap.size, 'size should be -2 after removing NaN');
        Assert.areSame(markerValue, this.stampedMap.get(marker), 'entries should be properly indexed (3)');
    },

    "set() should create an entry if one doesn't exist": function () {
        Assert.isFalse(this.map.has('bogus'), 'bogus key should not exist');
        Assert.isFalse(this.map.has(NaN), 'NaN key should not exist');

        this.map.set('bogus', 'i live!');
        this.map.set(NaN, 'i am not a number!');

        Assert.areSame('i live!', this.map.get('bogus'), 'bogus entry should be created');
        Assert.areSame('i am not a number!', this.map.get(NaN), 'NaN entry should be created');
    },

    'set() should replace an entry if the given key exists': function () {
        this.map.set(NaN, 'NaN');

        var expectedSize = this.map.size;

        Assert.isTrue(this.map.has('a'), '"a" key should exist');
        Assert.isTrue(this.map.has(0), '0 key should exist');
        Assert.isTrue(this.map.has(NaN), 'NaN key should exist');

        this.map.set('a', 'replaced a');
        this.map.set(0, 'replaced 0');
        this.map.set(NaN, 'replaced NaN');

        Assert.areSame(expectedSize, this.map.size, 'map size should not change');
        Assert.areSame('replaced a', this.map.get('a'), '"a" entry should be replaced');
        Assert.areSame('replaced 0', this.map.get(0), '0 entry should be replaced');
        Assert.areSame('replaced NaN', this.map.get(NaN), 'NaN entry should be replaced');
    },

    'set() should handle potentially unsafe string keys safely': function () {
        this.map.set('prototype', 'foo');
        this.map.set('constructor', 'foo');
        this.map.set('hasOwnProperty', 'foo');

        Assert.areSame('foo', this.map.get('prototype'), '"prototype" should not break');
        Assert.areSame('foo', this.map.get('constructor'), '"constructor" should not break');
        Assert.areSame('foo', this.map.get('hasOwnProperty'), '"hasOwnProperty" should not break');
    },

    'set() should stamp object keys when the `autoStamp` option is truthy': function () {
        var map = new YMap({autoStamp: true}),
            key = {};

        map.set(key, 'value');
        ObjectAssert.ownsKey('_yuid', key, 'key should be stamped');

        key = {_yuid: 'fake id'};
        map.set(key, 'value');
        Assert.areSame('fake id', key._yuid, 'existing id should not be overwritten');

        key = {};
        map = new YMap({
            autoStamp   : true,
            objectIdName: 'id'
        });

        map.set(key, 'value');
        ObjectAssert.ownsKey('id', key, 'should stamp custom id property');
    },

    'set() should be chainable': function () {
        Assert.areSame(this.map, this.map.set('foo', 'bar'));
    },

    'values() should return an array of all the values in the map': function () {
        ArrayAssert.itemsAreSame(this.values, this.map.values(), 'expected values should be returned');
    },

    'values() should return a copy, not a reference to an internal array': function () {
        var values = this.map.values();

        Assert.areSame('one', values[0], 'sanity check');

        values[0] = 'changed';
        Assert.areSame('one', this.map.get('a'), 'value should not be changed');
        Assert.areSame('one', this.map.values()[0], 'value should not be changed in values() output');
    }
}));

}, '@VERSION@', {
    requires: ['gallery-sm-map', 'test']
});
