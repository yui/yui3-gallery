YUI.add('gallery-any-base-converter', function(Y) {

/**
 * @module gallery-any-base-converter
 */
(function (Y, moduleName) {
    'use strict';
    
    var _string__empty = '',
        _string__fullStop = '.',
        _string_alphabet = 'alphabet',
        _string_lookup = 'lookup',
        _string_minusSign = 'minusSign',
        _string_radixPoint = 'radixPoint',
        
        _Base = Y.Base,
    
        _each = Y.each,
        _floor = Math.floor,
        _pow = Math.pow;

    /**
     * AnyBaseConverter is an object that will convert numbers to and from a positional notation with a custom alphabet and base.
     * @class AnyBaseConverter
     * @extends Base
     * @param {Object} config Configuration Object.
     */
    Y.AnyBaseConverter = _Base.create(moduleName, _Base, [], {
        /**
         * Converts a string from a custom base and returns a number.
         * @method from
         * @param {String} any
         * @returns {Number} value
         */
        from: function (any) {
            any = any.split(this.get(_string_radixPoint));
            
            var base = this.get(_string_alphabet).length,
                fractionalPart = any[1],
                integerPart = any[0].split(_string__empty),
                lookup = this.get(_string_lookup),
                negative = false,
                value = 0;
                
            if (integerPart[0] === this.get(_string_minusSign)) {
                negative = true;
                integerPart.shift();
            }
            
            _each(integerPart.reverse(), function (character, index) {
                value += _pow(base, index) * lookup[character];
            });
            
            if (fractionalPart) {
                value = parseFloat(String(value) + _string__fullStop + String(this.from(fractionalPart)).split(_string__empty).reverse().join(_string__empty));
            }
            
            if (negative) {
                value = -value;
            }
            
            return value;
        },
        /**
         * Converts a number to a custom base and returns a string.
         * @method to
         * @param {Number} value
         * @returns {String} any
         */
        to: function (value) {
            value = +value;
            
            var alphabet = this.get(_string_alphabet),
                base = alphabet.length,
                fractionalPart,
                integerPart,
                any = _string__empty,
                negative = false;
                
            if (value < 0) {
                negative = true;
                value = -value;
            }
            
            integerPart = _floor(value);
            fractionalPart = String(value).split(_string__fullStop)[1];
            
            do {
                any = alphabet.charAt(integerPart % base) + any;
                integerPart = _floor(integerPart / base);
            } while (integerPart);
            
            if (fractionalPart) {
                any += this.get(_string_radixPoint) + this.to(fractionalPart.split(_string__empty).reverse().join(_string__empty));
            }
            
            if (negative) {
                any = this.get(_string_minusSign) + any;
            }
                
            return any;
        }
    }, {
        ATTRS: {
            /**
             * The string of characters to use as single-digit numbers. The length of this string determines
             * the base of the result. Each character should be unique within the string or else it will be
             * impossible to correctly convert a string back into a number. Currently, non-BMP characters are
             * not supported.
             * @attribute alphabet
             * @default '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~'
             * @type String
             */
            alphabet: {
                setter: function (value) {
                    var lookup = {},
                        i,
                        length = value.length;

                    for (i = 0; i < length; i += 1) {
                        lookup[value.charAt(i)] = i;
                    }

                    this._set(_string_lookup, lookup);
                },
                value: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~'
            },
            /**
             * Used as a reverse lookup for a character index in alphabet.
             * @attribute lookup
             * @protected
             * @readOnly
             * @type Object
             */
            lookup: {
                readOnly: true,
                value: null
            },
            /**
             * A single character string to prepend to negative values. This character should not be in the alphabet.
             * Currently, non-BMP characters are not supported.
             * @attribute minusSign
             * @default '-'
             * @type String
             */
            minusSign: {
                value: '-'
            },
            /**
             * A single character string to insert between the integer and fractional parts of the number.
             * This character should not be in the alphabet.  Currently, non-BMP characters are not supported.
             * @attribute radixPoint
             * @default '.'
             * @type String
             */
            radixPoint: {
                value: _string__fullStop
            }
        }
    });
}(Y, arguments[1]));


}, 'gallery-2012.03.23-18-00' ,{requires:['base'], skinnable:false});
