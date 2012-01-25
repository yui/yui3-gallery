YUI.add('gallery-uuid-test', function (Y) {
    var Assert = Y.Assert,
        suite;

    // -- Suite -----------
    suite = new Y.Test.Suite({
        name: 'gallery-uuid'
    });

    // -- Formatting -------
    suite.add(new Y.Test.Case({
        name: 'Formatting',
        'uuid matches should have expected value': function() {
            var expected = 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
                actual = Y.Crypto.UUID._formatUUIDString('f81d4fae7dec11d0a76500a0c91e6bf6');
            Assert.areEqual(expected, actual);
        }
    }));

    // -- Generation -------
    suite.add(new Y.Test.Case({
        name: 'Generation',
        'raw uuid should be correctly formatted': function() {
            var uuid = Y.Crypto.UUID();

            Assert.areEqual(32, uuid.length);
            Assert.isFalse(/[^0-9a-f]/.test(uuid));
        },
        'formatted uuid should have correct length': function() {
            var uuid = Y.Crypto.UUID(true);

            Assert.areEqual(36, uuid.length);
            Assert.isFalse(/[^0-9a-f\-]/.test(uuid));
        }
    }));

    // -- Integer to Hex Conversion
    suite.add(new Y.Test.Case({
        name: 'Hex Conversion',
        '32-bit digit with all bits set should be formatted correctly': function() {
            var num = 0xffffffff,
                expected = 'ffffffff',
                actual = Y.Crypto.UUID._intToHex(num);

            Assert.areEqual(expected, actual);
        },
        '32-bit digit with no bits set should be formatted correctly': function() {
            var num = 0x0,
                expected = '00000000',
                actual = Y.Crypto.UUID._intToHex(num);

            Assert.areEqual(expected, actual);
        }
    }));

    Y.Test.Runner.add(suite);
}, '@VERSION@', {
    requires: ['gallery-uuid', 'test']
});
