/**
 * @module gallery-async-progress
 */
(function (Y) {
    'use strict';
    
    var _invoke = Y.Array.invoke,
        
        _class;

    /**
     * Asynchronous command runner progress plugin.
     * @class Y.Plugin.AsyncProgress
     * @extends Y.Plugin.Base
     * @param {Object} config Configuration Object.
     */
    _class = Y.extend(function (config) {
        _class.superclass.constructor.call(this, config);
    }, Y.Plugin.Base, {
        destructor: function () {
            _invoke(this._subscriptions, 'detach');
        },
        initializer: function () {
            var completed = 0,
                host = this.get('host'),
                run = host.get('run'),
                total = run.length;
                
            this._subscriptions = _invoke(run, 'on', 'complete', function () {
                completed += 1;
                
                /**
                 * @event progress
                 * @for Y.Async
                 * @param {Number} completed
                 * @param {Number} total
                 */
                host.fire('progress', {
                    completed: completed,
                    total: total
                });
            });
        }
    }, {
        NAME: 'async-progress',
        NS: 'progress'
    });

    Y.Plugin.AsyncProgress = _class;
}(Y));