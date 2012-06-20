YUI.add('gallery-array-unnest', function(Y) {

/**
 * Utility function that flattens nested arrays.
 * @module gallery-array-unnest
 */
(function (Y) {
    'use strict';
    
    /**
     * Utility function that flattens nested arrays.
     * The original array is not modified. The returned array items are a
     * shallow copy of the original array items.
     * @for Array
     * @method unnest
     * @param {Array} array
     * @param {Number} levels Optional.  If defined, must be a non-negative
     * integer.  Defaults to 1.
     * @returns {Array}
     * @static
     */
    var unnest = function (array, levels) {
        var empty = [];
        
        array = empty.concat.apply(empty, array);
        
        if (levels && levels - 1) {
            return unnest(array, levels - 1);
        }
        
        return array;
    };
    
    Y.Array.unnest = unnest;
}(Y));


}, 'gallery-2012.06.20-20-07' ,{requires:['yui'], skinnable:false});
