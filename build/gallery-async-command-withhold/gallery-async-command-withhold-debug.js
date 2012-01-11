YUI.add('gallery-async-command-withhold', function(Y) {

/**
 * @module gallery-async-command-withhold
 */
(function (Y) {
    'use strict';
    
    var _delay = Y.delay,
        
        _class;

    /**
     * Asynchronous command withhold plugin.
     * @class AsyncCommandWithhold
     * @extends Y.Plugin.Base
     * @namespace Y.Plugin
     * @param {Object} config Configuration Object.
     */
    _class = Y.extend(function (config) {
        _class.superclass.constructor.call(this, config);
    }, Y.Plugin.Base, {
        initializer: function () {
            this.onHostEvent([
                'failure',
                'success'
            ], function (eventFacade) {
                eventFacade.preventDefault();
                
                var args = arguments,
                    target = eventFacade.target,
                    targetEvent = target.getEvent(eventFacade.type);
                
                _delay(targetEvent.defaultFn, this.get('withhold')).apply(targetEvent, args);
            }, this);
        }
    }, {
        ATTRS: {
            /**
             * Approximate delay in milliseconds to wait between the time the command function
             * reports completion and when the completed status is updated.
             * @attribute withhold
             * @default 0
             * @initonly
             * @type Number
             */
            withhold: {
                value: 0,
                writeOnce: 'initOnly'
            }
        },
        NAME: 'async-command-withhold',
        NS: 'withhold'
    });

    Y.Plugin.AsyncCommandWithhold = _class;
}(Y));


}, 'gallery-2012.01.11-21-03' ,{requires:['gallery-async-command', 'gallery-delay', 'plugin'], skinnable:false});
