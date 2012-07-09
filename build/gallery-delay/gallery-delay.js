YUI.add('gallery-delay', function(Y) {

/**
 * Create a function that doesn't execute immediately when it is called.
 * @module gallery-delay
 */
(function (Y) {
    'use strict';
    
    var _Array = Y.Array,
        
        _bind = Y.bind,
        _later = Y.later,
        _soon = Y.soon;
    
    /**
     * Pass in a callback function and the amount of time to delay.  Y.delay
     * will return a function that will wait an amount of time, then call your
     * callback function.  The arguments and execution context of this function
     * will be passed to the callback function.  This function returns an object
     * with a cancel method which will prevent the execution of the callback
     * function once the delay timer has begun.  If the amount of time to delay
     * is less than 0, the original callback function is returned.  If the
     * amount of time to delay is 0 and the gallery-soon module is available,
     * the delay will be as small as possible but your callback function will be
     * guaranteed to be called in a future turn of the javascript event loop.
     * @for YUI
     * @method delay
     * @param {Function} callbackFunction The function to delay.
     * @param {Number} delayAmount The approximate amount of time to delay in
     * milliseconds.
     * @return {Function}
     */
    Y.delay = function (callbackFunction, delayAmount) {
        if (!delayAmount && _soon) {
            return function () {
                var args = new _Array(arguments);
                
                args.shift(this, callbackFunction);
                
                return _soon(_bind.apply(args));
            };
        }
        
        if (delayAmount >= 0) {
            return function () {
                return _later(delayAmount, this, callbackFunction, arguments);
            };
        }
        
        return callbackFunction;
    };
}(Y));


}, 'gallery-2012.06.20-20-07' ,{requires:['yui-later'], skinnable:false, optional:['gallery-soon']});
