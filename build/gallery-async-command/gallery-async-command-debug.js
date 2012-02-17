YUI.add('gallery-async-command', function(Y) {

/**
 * @module gallery-async-command
 */
(function (Y) {
    'use strict';
    
    var _createCompleteFunction,
        _isArray = Y.Lang.isArray,
    
        _class;
    
    /**
     * Asynchronous command class.
     * @class AsyncCommand
     * @extends Y.Base
     * @namespace Y
     * @param {Object} config Configuration Object.
     */
    _class = Y.extend(function (config) {
        _class.superclass.constructor.call(this, config);
    }, Y.Base, {
        initializer: function () {
            var me = this;
            
            /**
             * Fired when the command function completes.
             * @event complete
             * @fireonce
             * @param error Optional error value.
             * @param {Boolean} failed Indicates the failed status of the command.
             * @param value Optional return value from the command function.
             */
            me.publish('complete', {
                defaultFn: function () {
                    me._set('completed', true);
                },
                fireOnce: true
            });
            
            /**
             * Fired when the command function fails.
             * @event failure
             * @fireonce
             * @param error Optional error value.
             * @protected
             */
            me.publish('failure', {
                defaultFn: function (eventFacade) {
                    var error = eventFacade.error;
                    
                    me._set('error', error);
                    me._set('failed', true);
                    
                    me.fire('complete', {
                        error: error,
                        failed: true
                    });
                },
                fireOnce: true
            });
            
            /**
             * Fired when the command function starts.
             * @event start
             * @fireonce
             * @protected
             */
            me.publish('start', {
                defaultFn: function () {
                    me._set('started', true);
                    me.get('fn').apply(me.get('ctx'), me.get('args'));
                },
                fireOnce: true
            });
            
            /**
             * Fired when the command function succeeds.
             * @event success
             * @fireonce
             * @param value Optional return value from the command function.
             * @protected
             */
            me.publish('success', {
                defaultFn: function (eventFacade) {
                    var value = eventFacade.value;
                    
                    me._set('value', value);
                    
                    me.fire('complete', {
                        failed: false,
                        value: value
                    });
                },
                fireOnce: true
            });
            
            me.get('args').unshift(_createCompleteFunction(me));
        },
        /**
         * Execute the command function.
         * @method run
         * @chainable
         */
        run: function () {
            this.fire('start');
            return this;
        }
    }, {
        ATTRS: {
            /**
             * Array of arguments to be passed to the command function.
             * A special callback function is automatically added as the first argument.
             * @attribute args
             * @default []
             * @initonly
             * @type Array
             */
            args: {
                setter: function (args) {
                    if (!_isArray(args)) {
                        args = [
                            args
                        ];
                    }
                    
                    return args;
                },
                value: [],
                writeOnce: 'initOnly'
            },
            /**
             * Boolean value indicating the completed status of the command.
             * @attribute completed
             * @default false
             * @readonly
             * @type Boolean
             */
            completed: {
                readOnly: true,
                value: false
            },
            /**
             * Execution context for the command function.
             * @attribute ctx
             * @initonly
             */
            ctx: {
                writeOnce: 'initOnly'
            },
            /**
             * Error value passed to the failure event.
             * @attribute error
             * @readonly
             */
            error: {
                readOnly: true
            },
            /**
             * Boolean value indicating the failed status of the command.
             * @attribute failed
             * @default false
             * @readonly
             * @type Boolean
             */
            failed: {
                readOnly: true,
                value: false
            },
            /**
             * The command function to execute.  This function receives a special success callback function as
             * the first parameter.  The success callback function has a method parameter called fail.  One of 
             * these callback functions must be called in order to complete the command.
             * @attribute fn
             * @initonly
             * @type Function
             */
            fn: {
                value: function (success) {
                    success();
                },
                writeOnce: 'initOnly'
            },
            /**
             * Boolean value indicating the started status of the command.
             * @attribute started
             * @default false
             * @readonly
             * @type Boolean
             */
            started: {
                readOnly: true,
                value: false
            },
            /**
             * Value passed to the success event.
             * @attribute value
             * @readonly
             */
            value: {
                readOnly: true
            }
        },
        NAME: 'async-command'
    });
    
    _createCompleteFunction = function (asyncCommand) {
        var successFunction = function (value) {
            asyncCommand.fire('success', {
                value: value
            });
        };
        
        successFunction.fail = function (error) {
            asyncCommand.fire('failure', {
                error: error
            });
        };
        
        return successFunction;
    };
    
    Y.AsyncCommand = _class;
}(Y));


}, 'gallery-2012.01.11-21-03' ,{requires:['base'], skinnable:false});
