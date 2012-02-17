YUI.add('gallery-async', function(Y) {

/**
 * @module gallery-async
 */
(function (Y) {
    'use strict';
    
    var _lang = Y.Lang,
        _run = {
            all: '_runAll',
            queue: '_runQueue'
        },
        _unnest = Y.Array.unnest,
        
        _createAndRun,
        _isArray = _lang.isArray,
        _isFunction = _lang.isFunction,
        
        _class;
    
    /**
     * Asynchronous command runner class.
     * @class Async
     * @extends Y.AsyncCommand
     * @namespace Y
     * @param {Object} config Configuration Object.
     */
    _class = Y.extend(function (config) {
        _class.superclass.constructor.call(this, config);
    }, Y.AsyncCommand, {
        initializer: function () {
            var me = this,
                run = _run[me.get('mode')];
            
            if (run) {
                me._set('fn', function (success) {
                    me[run].call(me, success, me.get('run'));
                });
            }
            
            _class.superclass.initializer.apply(this, arguments);
        },
        /**
         * Command function for all mode.
         * @method _runAll
         * @param {Function} success
         * @param {[AsyncCommand]} run
         * @protected
         */
        _runAll: function (success, run) {
            var commandCount = run.length,
                completeCount = 0,
                value = [];

            Y.each(run, function (asyncCommand, index) {
                asyncCommand.run().after('complete', function (eventFacade) {
                    if (eventFacade.failed) {
                        success.fail(eventFacade.error);
                        return;
                    }

                    completeCount += 1;
                    value[index] = eventFacade.value;

                    if (completeCount === commandCount) {
                        success(value);
                    }
                });
            });

            if (!commandCount) {
                success(value);
            }
        },
        /**
         * Command function for queue mode.
         * @method _runAll
         * @param {Function} success
         * @param {[AsyncCommand]} run
         * @param {Number} index
         * @param {Array} value
         * @protected
         */
        _runQueue: function (success, run, index, value) {
            index = index || 0;
            value = value || [];

            if (index >= run.length) {
                success(value);
                return;
            }

            run[index].run().after('complete', function (eventFacade) {
                if (eventFacade.failed) {
                    success.fail(eventFacade.error);
                    return;
                }

                value[index] = eventFacade.value;

                this._runQueue(success, run, index + 1, value);
            }, this);
        }
    }, {
        ATTRS: {
            /**
             * The inherited args attribute is protected.
             * @attribute args
             * @default []
             * @initonly
             * @protected
             * @type Array
             */
            /**
             * The inherited ctx attribute is protected.
             * @attribute ctx
             * @initonly
             * @protected
             */
            /**
             * The inherited fn attribute is protected.
             * @attribute fn
             * @initonly
             * @protected
             * @type Function
             */
            /**
             * Value indicating the run mode.  Possible modes are:
             * <dl>
             *     <dt>
             *         all
             *     </dt>
             *     <dd>
             *         This mode runs all commands.  The commands might be completed out of order.
             *         The run completes once all commands have completed.  The run fails if any
             *         command fails.
             *     </dd>
             *     <dt>
             *         queue
             *     </dt>
             *     <dd>
             *         This mode runs one command at a time.  It waits for the first command to complete
             *         before moving on to the next one.  The run completes when the last command has completed.
             *         The run fails if a command fails and the remaining commands are not run.
             *     </dd>
             * </dl>
             * @attribute mode
             * @default 'queue'
             * @initonly
             * @type String
             */
            mode: {
                value: 'queue',
                writeOnce: 'initOnly'
            },
            /**
             * An array of AsyncCommands to run.  Functions will get converted to instances of AsyncCommand.
             * @attribute run
             * @default []
             * @initonly
             * @type [AsyncCommand]
             */
            run: {
                setter: function (run) {
                    if (!_isArray(run)) {
                        run = [
                            run
                        ];
                    }
                    
                    Y.each(run, function (item, index, run) {
                        if (_isFunction(item)) {
                            run[index] = new Y.AsyncCommand({
                                fn: item
                            });
                        }
                    });
                    
                    return run;
                },
                value: [],
                writeOnce: 'initOnly'
            }
        },
        NAME: 'async',
        /**
         * Creates and runs an instance of Async in 'all' mode.  This method accepts an unlimited number of parameters.
         * Parameters can be command functions, instances of AsyncCommand, instances of Async, or arrays of any of the above.
         * @method runAll
         * @return {Async}
         * @static
         */
        runAll: function () {
            return _createAndRun('all', _unnest(arguments));
        },
        /**
         * Creates and runs an instance of Async in 'queue' mode.  This method accepts an unlimited number of parameters.
         * Parameters can be command functions, instances of AsyncCommand, instances of Async, or arrays of any of the above.
         * @method runQueue
         * @return {Async}
         * @static
         */
        runQueue: function () {
            return _createAndRun('queue', _unnest(arguments));
        }
    });
    
    _createAndRun = function (mode, run) {
        return new _class({
            mode: mode,
            run: run
        }).run();
    };
    
    Y.Async = _class;
}(Y));


}, 'gallery-2012.01.11-21-03' ,{requires:['gallery-array-unnest', 'gallery-async-command'], skinnable:false});
