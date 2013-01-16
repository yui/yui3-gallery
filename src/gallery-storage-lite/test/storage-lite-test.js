YUI.add('storage-lite-test', function (Y) {

Y.StorageLiteTest = new Y.Test.Suite('storage-lite');

Y.StorageLiteTest.add(new Y.Test.Case({
    name: 'General',

    setUp: function () {
        Y.StorageLite.clear();
    },

    tearDown: function () {
        Y.StorageLite.clear();
    },

    testSetGetString: function () {
        Y.Assert.isNull(Y.StorageLite.getItem('foo'));
        Y.StorageLite.setItem('foo', 'bar');
        Y.Assert.areSame(Y.StorageLite.getItem('foo'), 'bar');
    },

    testSetGetObject: function () {
        var foo = {bar: 'baz'}, item;

        Y.Assert.isNull(Y.StorageLite.getItem('foo'));

        Y.StorageLite.setItem('foo', foo, true);
        item = Y.StorageLite.getItem('foo', true);

        Y.Assert.isObject(item);
        Y.Assert.areSame(item.bar, foo.bar);
    },

    testLength: function () {
        Y.Assert.areSame(Y.StorageLite.length(), 0);
        Y.StorageLite.setItem('foo', 'bar');
        Y.Assert.areSame(Y.StorageLite.length(), 1);
        Y.StorageLite.setItem('baz', 'quux');
        Y.Assert.areSame(Y.StorageLite.length(), 2);
    },

    testClear: function () {
        Y.Assert.areSame(Y.StorageLite.length(), 0);
        Y.StorageLite.setItem('foo', 'bar');
        Y.StorageLite.setItem('baz', 'qux');
        Y.Assert.areSame(Y.StorageLite.length(), 2);
        Y.StorageLite.clear();
        Y.Assert.areSame(Y.StorageLite.length(), 0);
    },

    testRemoveItem: function () {
        Y.Assert.areSame(Y.StorageLite.length(), 0);
        Y.StorageLite.setItem('foo', 'bar');
        Y.Assert.areSame(Y.StorageLite.length(), 1);
        Y.StorageLite.removeItem('foo');
        Y.Assert.areSame(Y.StorageLite.length(), 0);
    }
}));

}, '0.0.0', {
    requires: ['gallery-storage-lite', 'test']
});
