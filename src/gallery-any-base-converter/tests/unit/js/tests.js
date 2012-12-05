YUI.add('module-tests', function (Y) {
    'use strict';

    var suite = new Y.Test.Suite('gallery-any-base-converter');

    suite.add(new Y.Test.Case({
        name: 'Automated Tests',
        'test:001-apiExists': function () {
            Y.Assert.isFunction(Y.AnyBaseConverter, 'Y.AnyBaseConverter should be a function.');
            Y.Assert.isFunction(Y.AnyBaseConverter._reverse, 'Y.AnyBaseConverter._reverse should be a function.');

            var anyBaseConverter = new Y.AnyBaseConverter();

            Y.Assert.isObject(anyBaseConverter, 'anyBaseConverter should be an object.');
            Y.Assert.isInstanceOf(Y.AnyBaseConverter, anyBaseConverter, 'anyBaseConverter should be an instance of Y.AnyBaseConverter.');

            Y.Assert.isFunction(anyBaseConverter.from, 'anyBaseConverter.from should be a function.');
            Y.Assert.isFunction(anyBaseConverter.to, 'anyBaseConverter.to should be a function.');
        },
        'test:002-alphabetLookup': function () {
            var anyBaseConverter = new Y.AnyBaseConverter({
                    alphabet: 'abcdefghijklmnopqrstuvwxyz'
                }),

                alphabet = anyBaseConverter.get('alphabet'),
                lookup = anyBaseConverter.get('lookup');

            Y.Assert.areSame('abcdefghijklmnopqrstuvwxyz', alphabet, 'alphabet should be the same as the config parameter.');
            Y.Assert.isObject(lookup, 'lookup should be an object.');
            Y.Assert.areSame(0, lookup.a, 'lookup.a should be 0.');
            Y.Assert.areSame(1, lookup.b, 'lookup.b should be 1.');
            Y.Assert.areSame(2, lookup.c, 'lookup.c should be 2.');
            Y.Assert.areSame(3, lookup.d, 'lookup.d should be 3.');
            Y.Assert.areSame(4, lookup.e, 'lookup.e should be 4.');
            Y.Assert.areSame(5, lookup.f, 'lookup.f should be 5.');
            Y.Assert.areSame(6, lookup.g, 'lookup.g should be 6.');
            Y.Assert.areSame(7, lookup.h, 'lookup.h should be 7.');
            Y.Assert.areSame(8, lookup.i, 'lookup.i should be 8.');
            Y.Assert.areSame(9, lookup.j, 'lookup.j should be 9.');
            Y.Assert.areSame(10, lookup.k, 'lookup.k should be 10.');
            Y.Assert.areSame(11, lookup.l, 'lookup.l should be 11.');
            Y.Assert.areSame(12, lookup.m, 'lookup.m should be 12.');
            Y.Assert.areSame(13, lookup.n, 'lookup.n should be 13.');
            Y.Assert.areSame(14, lookup.o, 'lookup.o should be 14.');
            Y.Assert.areSame(15, lookup.p, 'lookup.p should be 15.');
            Y.Assert.areSame(16, lookup.q, 'lookup.q should be 16.');
            Y.Assert.areSame(17, lookup.r, 'lookup.r should be 17.');
            Y.Assert.areSame(18, lookup.s, 'lookup.s should be 18.');
            Y.Assert.areSame(19, lookup.t, 'lookup.t should be 19.');
            Y.Assert.areSame(20, lookup.u, 'lookup.u should be 20.');
            Y.Assert.areSame(21, lookup.v, 'lookup.v should be 21.');
            Y.Assert.areSame(22, lookup.w, 'lookup.w should be 22.');
            Y.Assert.areSame(23, lookup.x, 'lookup.x should be 23.');
            Y.Assert.areSame(24, lookup.y, 'lookup.y should be 24.');
            Y.Assert.areSame(25, lookup.z, 'lookup.z should be 25.');
        },
        'test:003-reverse': function () {
            Y.Assert.areSame('zyxwvutsrqponmlkjihgfedcba', Y.AnyBaseConverter._reverse('abcdefghijklmnopqrstuvwxyz'), 'Y.AnyBaseConverter._reverse(\'abcdefghijklmnopqrstuvwxyz\') should be \'zyxwvutsrqponmlkjihgfedcba\'');
        },
        'test:004-defaultAlphabet': function () {
            var anyBaseConverter = new Y.AnyBaseConverter();

            Y.Assert.areSame('4iQ7', anyBaseConverter.to(1234567), 'anyBaseConverter.to(1234567) should be \'4iQ7\'');
            Y.Assert.areSame(1234567, anyBaseConverter.from('4iQ7'), 'anyBaseConverter.to(\'4iQ7\') should be 1234567');
            Y.Assert.areSame('-4iQ7', anyBaseConverter.to(-1234567), 'anyBaseConverter.to(-1234567) should be \'-4iQ7\'');
            Y.Assert.areSame(-1234567, anyBaseConverter.from('-4iQ7'), 'anyBaseConverter.to(\'-4iQ7\') should be -1234567');
            Y.Assert.areSame('1w.1sb', anyBaseConverter.to(123.4567), 'anyBaseConverter.to(1234567) should be \'1w.1sb\'');
            Y.Assert.areSame(123.4567, anyBaseConverter.from('1w.1sb'), 'anyBaseConverter.to(\'1w.1sb\') should be 123.4567');
            Y.Assert.areSame('-1w.1sb', anyBaseConverter.to(-123.4567), 'anyBaseConverter.to(-1234567) should be \'-1w.1sb\'');
            Y.Assert.areSame(-123.4567, anyBaseConverter.from('-1w.1sb'), 'anyBaseConverter.to(\'-1w.1sb\') should be -123.4567');
        },
        'test:005-binaryAlphabet': function () {
            var anyBaseConverter = new Y.AnyBaseConverter({
                alphabet: '01'
            });

            Y.Assert.areSame('100101101011010000111', anyBaseConverter.to(1234567), 'anyBaseConverter.to(1234567) should be \'100101101011010000111\'');
            Y.Assert.areSame(1234567, anyBaseConverter.from('100101101011010000111'), 'anyBaseConverter.to(\'100101101011010000111\') should be 1234567');
            Y.Assert.areSame('-100101101011010000111', anyBaseConverter.to(-1234567), 'anyBaseConverter.to(-1234567) should be \'-100101101011010000111\'');
            Y.Assert.areSame(-1234567, anyBaseConverter.from('-100101101011010000111'), 'anyBaseConverter.to(\'-100101101011010000111\') should be -1234567');
            Y.Assert.areSame('1111011.1110111100110', anyBaseConverter.to(123.4567), 'anyBaseConverter.to(1234567) should be \'1111011.1110111100110\'');
            Y.Assert.areSame(123.4567, anyBaseConverter.from('1111011.1110111100110'), 'anyBaseConverter.to(\'1111011.1110111100110\') should be 123.4567');
            Y.Assert.areSame('-1111011.1110111100110', anyBaseConverter.to(-123.4567), 'anyBaseConverter.to(-1234567) should be \'-1111011.1110111100110\'');
            Y.Assert.areSame(-123.4567, anyBaseConverter.from('-1111011.1110111100110'), 'anyBaseConverter.to(\'-1111011.1110111100110\') should be -123.4567');
        },
        'test:006-longAlphabet': function () {
            var anyBaseConverter = new Y.AnyBaseConverter({
                alphabet: ' !"#$%&\'()*+,/0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ'
            });

            Y.Assert.areSame('!!Ù¼_', anyBaseConverter.to(1234567890), 'anyBaseConverter.to(1234567890) should be \'!!Ù¼_\'');
            Y.Assert.areSame(1234567890, anyBaseConverter.from('!!Ù¼_'), 'anyBaseConverter.to(\'!!Ù¼_\') should be 1234567890');
            Y.Assert.areSame('-!!Ù¼_', anyBaseConverter.to(-1234567890), 'anyBaseConverter.to(-1234567890) should be \'-!!Ù¼_\'');
            Y.Assert.areSame(-1234567890, anyBaseConverter.from('-!!Ù¼_'), 'anyBaseConverter.to(\'-!!Ù¼_\') should be -1234567890');
            Y.Assert.areSame('d#.VÝ', anyBaseConverter.to(12345.6789), 'anyBaseConverter.to(12345.6789) should be \'d#.VÝ\'');
            Y.Assert.areSame(12345.6789, anyBaseConverter.from('d#.VÝ'), 'anyBaseConverter.to(\'d#.VÝ\') should be 12345.6789');
            Y.Assert.areSame('-d#.VÝ', anyBaseConverter.to(-12345.6789), 'anyBaseConverter.to(-12345.6789) should be \'-d#.VÝ\'');
            Y.Assert.areSame(-12345.6789, anyBaseConverter.from('-d#.VÝ'), 'anyBaseConverter.to(\'-d#.VÝ\') should be -12345.6789');
        },
        'test:006-confusingAlphabet': function () {
            var anyBaseConverter = new Y.AnyBaseConverter({
                alphabet: '8641359207',
                minusSign: '.',
                radixPoint: '-'
            });

            Y.Assert.areSame('6413592', anyBaseConverter.to(1234567), 'anyBaseConverter.to(1234567) should be \'6413592\'');
            Y.Assert.areSame(1234567, anyBaseConverter.from('6413592'), 'anyBaseConverter.to(\'6413592\') should be 1234567');
            Y.Assert.areSame('.6413592', anyBaseConverter.to(-1234567), 'anyBaseConverter.to(-1234567) should be \'.6413592\'');
            Y.Assert.areSame(-1234567, anyBaseConverter.from('.6413592'), 'anyBaseConverter.to(\'.6413592\') should be -1234567');
            Y.Assert.areSame('641-2953', anyBaseConverter.to(123.4567), 'anyBaseConverter.to(123.4567) should be \'641-2953\'');
            Y.Assert.areSame(123.4567, anyBaseConverter.from('641-2953'), 'anyBaseConverter.to(\'641-2953\') should be 123.4567');
            Y.Assert.areSame('.641-2953', anyBaseConverter.to(-123.4567), 'anyBaseConverter.to(-123.4567) should be \'.641-2953\'');
            Y.Assert.areSame(-123.4567, anyBaseConverter.from('.641-2953'), 'anyBaseConverter.to(\'.641-2953\') should be -123.4567');
        }
    }));

    Y.Test.Runner.add(suite);
}, '', {
    requires: [
        'gallery-any-base-converter',
        'test'
    ]
});