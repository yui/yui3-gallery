/**
 * @module gallery-async-command-delay
 */
(function (Y) {
    'use strict';
    
    var _delay = Y.delay,
        _do = Y.Do,
        _DoAlterReturn = _do.AlterReturn,
        _DoPrevent = _do.Prevent,
        
        _class;

    /**
     * Asynchronous command delay plugin.
     * @class AsyncCommandDelay
     * @extends Y.Plugin.Base
     * @namespace Y.Plugin
     * @param {Object} config Configuration Object.
     */
    _class = Y.extend(function (config) {
        _class.superclass.constructor.call(this, config);
    }, Y.Plugin.Base, {
        initializer: function () {
            var me = this,
                host = this.get('host'),
                run = host.run;
            
            me.afterHostMethod('run', function () {
                return new _DoAlterReturn('delayed', host);
            });
            
            me.beforeHostMethod('run', function () {
                _delay(run, me.get('delay')).call(host);
                return new _DoPrevent('delayed');
            });
        }
    }, {
        ATTRS: {
            /**
             * Approximate delay in milliseconds to wait between the time run is called
             * and when the command function is executed.
             * @attribute delay
             * @default 0
             * @initonly
             * @type Number
             */
            delay: {
                value: 0,
                writeOnce: 'initOnly'
            }
        },
        NAME: 'async-command-delay',
        NS: 'delay'
    });

    Y.Plugin.AsyncCommandDelay = _class;
}(Y));