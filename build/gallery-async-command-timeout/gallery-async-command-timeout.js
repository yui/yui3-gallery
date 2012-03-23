YUI.add('gallery-async-command-timeout', function(Y) {

/**
 * @module gallery-async-command-timeout
 */
(function (Y) {
    'use strict';
    
    var _invoke = Y.Array.invoke,
        _later = Y.later,
        
        _class;

    /**
     * Asynchronous command timeout plugin.
     * @class AsyncCommandTimeout
     * @extends Y.Plugin.Base
     * @namespace Y.Plugin
     * @param {Object} config Configuration Object.
     */
    _class = Y.extend(function (config) {
        _class.superclass.constructor.call(this, config);
    }, Y.Plugin.Base, {
        destructor: function () {
            _invoke(this._subscriptions, 'detach');
            
            if (this._timer) {
                this._timer.cancel();
                delete this._timer;
            }
        },
        initializer: function () {
            var me = this,
                host = me.get('host'),
                timeout = me.get('timeout');
            
            if (!timeout) {
                return;
            }
            
            me._subscriptions = [
                host.on('start', function () {
                    me._timer = _later(timeout, host, host.fire, [
                        'failure',
                        {
                            error: 'timeout'
                        }
                    ]);
                }),
                host.on('success', function (eventFacade) {
                    if (host.get('completed')) {
                        eventFacade.preventDefault();
                    } else if (me._timer) {
                        me._timer.cancel();
                    }

                    delete me._timer;
                })
            ];
        }
    }, {
        ATTRS: {
            /**
             * Approximate timeout in milliseconds to wait for success before
             * the command automatically fails.  Must be a non-negative integer.
             * A value of 0 disables the timeout.
             * @attribute timeout
             * @default 0
             * @initonly
             * @type Number
             */
            timeout: {
                value: 0,
                writeOnce: 'initOnly'
            }
        },
        NAME: 'async-command-timeout',
        NS: 'timeout'
    });

    Y.Plugin.AsyncCommandTimeout = _class;
}(Y));


}, 'gallery-2012.03.23-18-00' ,{requires:['array-invoke', 'gallery-async-command', 'plugin'], skinnable:false});
