YUI.add('gallery-delay', function(Y) {

/**
 * @module gallery-delay
 */
(function (Y) {
    'use strict';
    
    var _later = Y.later;
    
    /**
     * Pass in a callback function and the amount of time to delay.  Y.delay will return a function that will wait an
     * amount of time, then call your callback function.  The arguments and execution context of this function will
     * be passed to the callback function.  This function returns an object with a cancel method which will prevent
     * the execution of the callback function once the delay timer has begun.  If the amount of time to delay is not
     * greater than 0, the original callback function is returned.
     * @method dalay
     * @param {Function} callbackFunction The function to delay.
     * @param {Number} delayAmount The approximate amount of time to delay in milliseconds.
     * @return {Function}
     * @static
     */
    Y.delay = function (callbackFunction, delayAmount) {
        if (delayAmount > 0) {
            return function () {
                return _later(delayAmount, this, callbackFunction, arguments);
            };
        }
        
        return callbackFunction;
    };
}(Y));


}, 'gallery-2011.12.14-21-12' ,{requires:['yui-later'], skinnable:false});
