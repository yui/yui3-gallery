YUI.add('gallery-alea', function(Y) {

/*!
 * based on Alea.js and Mash.js. http://baagoe.com/en/RandomMusings/javascript/
 * Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * Y.Alea is a better pseudorandom number generator than Math.random.
 * 
 * based on Alea.js and Mash.js. http://baagoe.com/en/RandomMusings/javascript/
 * Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>
 * @module gallery-alea
 */
(function (Y) {
    'use strict';

    var _Array = Y.Array,

        _each = _Array.each,
        _mash = function () {
            var n = 0xefc8249d;

            return function (data) {
                data = data.toString();

                var h,
                    i = 0,
                    length = data.length;

                for (; i < length; i += 1) {
                    n += data.charCodeAt(i);
                    h = 0.02519603282416938 * n;
                    n = h >>> 0;
                    h -= n;
                    h *= n;
                    n = h >>> 0;
                    h -= n;
                    n += h * 0x100000000; // 2^32
                }

                return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
            };
        },
        _now = Y.Lang.now,

        /**
         * @class Alea
         * @constructor
         * @param [seedValues*] Optional.  Any number of seed values.  If left
         * undefined, Y.Lang.now() is used.
         */
        _class = function () {
            var args = _Array(arguments),
                c = 1,
                mash = _mash(),
                s0 = mash(' '),
                s1 = mash(' '),
                s2 = mash(' ');

            if (!args.length) {
                args.push(_now());
            }

            _each(args, function (arg) {
                s0 -= mash(arg);

                if (s0 < 0) {
                    s0 += 1;
                }

                s1 -= mash(arg);

                if (s1 < 0) {
                    s1 += 1;
                }

                s2 -= mash(arg);

                if (s2 < 0) {
                    s2 += 1;
                }
            });

            /**
             * Generates a random number that is greater than or equal to zero
             * and less than one.  The number will be a 32-bit fraction.
             * @method random
             * @return Number
             */
            this.random = function () {
                var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32

                c = t | 0;
                s0 = s1;
                s1 = s2;
                s2 = t - c;

                return s2;
            };
        };

    _class.prototype = {
        /**
        * Generates a random number that is greater than or equal to zero
        * and less than one.  The number will be a 53-bit fraction.
        * @method fract53
        * @return Number
        */
        fract53: function () {
            var random = this.random;
            return random() + (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
        },
        /**
        * Generates a random 32-bit unsigned integer.
        * @method uint32
        * @return Number
        */
        uint32: function () {
            return this.random() * 0x100000000; // 2^32
        }
    };

    Y.Alea = _class;
}(Y));


}, 'gallery-2012.07.18-13-22' ,{requires:['yui-base'], skinnable:false});
