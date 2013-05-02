/**
Utility function that flattens nested arrays.
@module gallery-array-unnest
@author Steven Olmsted
 */
(function (Y) {
    'use strict';

    /**
    Utility function that flattens nested arrays.  The original array is not
    modified. The returned array items are a shallow copy of the original array
    items.
    @for Array
    @method unnest
    @param {Array} array
    @param {Number} [levels=1] If defined, must be a non-negative integer.
    @return {Array}
    @static
    */
    var _unnest = function (array, levels) {
        var empty = [];

        array = empty.concat.apply(empty, array);

        if (levels && levels - 1) {
            return _unnest(array, levels - 1);
        }

        return array;
    };

    Y.Array.unnest = _unnest;
}(Y));