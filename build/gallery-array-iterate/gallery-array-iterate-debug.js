YUI.add('gallery-array-iterate', function(Y) {

/**
 * Iterate through an array.
 * @module gallery-async-pause
 */
(function (Y) {
    'use strict';
    
    var _isFunction = Y.Lang.isFunction,
        
        /**
         * @method iterate
         * @for Array
         * @param {Array} array the array to iterate
         * @param {Number} startIndex (Optional) The first index to iterate.
         * If left undefined, iteration will either start at the beginning of the array if incrementBy
         * is positive or at the end of the array if incrementBy is negative.
         * @param {Number} incrementBy the interval by which the array will be iterated. Must be a non-zero integer.
         * Negative values cause the array to be iterated backwards.
         * @param {Function} iterationFunction the function to call on each iteration. This function will receive three
         * arguments: value, index, and array. If this function returns a truthy value, iteration will be terminated.
         * @param {Object} contextObject (Optional) the context that will become this in the iterationFunction
         * @returns {Boolean} will return true if iteration was terminated early, otherwise it will return false.
         * @static
         */
        iterate = function (array, startIndex, incrementBy, iterationFunction, contextObject) {
            if (_isFunction(incrementBy)) {
                return iterate(array, startIndex < 0 ? array.length - 1 : 0, startIndex, incrementBy, iterationFunction);
            }

            var i = startIndex,
                length = array.length;

            for (; i >= 0 && i < length; i += incrementBy) {
                if (i in array && iterationFunction.call(contextObject, array[i], i, array)) {
                    return true;
                }
            }
            
            return false;
        };
        
    Y.Array.iterate = iterate;
}(Y));


}, 'gallery-2012.03.23-18-00' ,{requires:['yui'], skinnable:false});
