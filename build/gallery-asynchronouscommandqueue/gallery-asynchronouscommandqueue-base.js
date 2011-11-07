YUI.add('gallery-asynchronouscommandqueue-base', function(Y) {

/**
 * @module gallery-asynchronouscommandqueue
 */

'use strict';

var _class;

/**
 * Asynchronous Command Queue.
 * @class AsynchronousCommandQueue
 * @constructor
 * @extends Y.Base
 * @namespace Y
 * @param {Object} config Configuration Object.
 */
_class = function (config) {
    _class.superclass.constructor.call(this, config);
};

_class.ATTRS = {
    /**
     * @attribute completed
     * @final
     * @type Boolean
     */
    completed: {
        readOnly: true,
        value: false
    },
    /**
     * @attribute paused
     * @type Boolean
     */
    paused: {
        value: false
    },
    /**
     * @attribute started
     * @final
     * @type Boolean
     */
    started: {
        readOnly: true,
        value: false
    },
    /**
     * @attribute queue
     * @type Array
     * @writeOnce
     */
    queue: {
        value: [],
        writeOnce: 'initOnly'
    }
};

_class.NAME = 'AsynchronousCommandQueue';

Y.extend(_class, Y.Base, {
    /**
     * Adds a command to the end of the queue.  This method is chainable.
     * @method addCommand
     * @param {Object} asynchronousCommand
     * @return {Object} this
     */
    addCommand: function (asynchronousCommand) {
        this.get('queue').push(asynchronousCommand);
        return this;
    },
    /**
     * @method getCommandCount
     * @return {Number}
     */
    getCommandCount: function () {
        return this.get('queue.length');
    },
    initializer: function () {
        this.publish('complete', {
            fireOnce: true
        });
        this.publish('start', {
            fireOnce: true
        });

        this.after('pausedChange', function (eventFacade) {
            if (!eventFacade.newVal) {
                this.startQueue();
            }
        }, this);

        this.on('complete', function (eventFacade, response, args) {
            this._set('completed', true);
        }, this);

        this.on('start', function (eventFacade, response, args) {
            this._set('started', true);
        }, this);
    },
    /**
     * @method startAll
     * @return {Object} this
     */
    startAll: function () {
        var commandCount,
            completeCount = 0,
            i,
            startCommand,
            queue = this.get('queue');

        startCommand = function (asynchronousCommand) {
            asynchronousCommand.execute().on('complete', function () {
                completeCount += 1;
                if (completeCount === commandCount) {
                    this._set('queue', queue.slice(commandCount));
                    if (this.get('queue.length')) {
                        this.startAll();
                    } else {
                        this.fire('complete');
                    }
                }
            }, this);
        };

        this.fire('start');

        for (i = 0, commandCount = queue.length; i < commandCount; i += 1) {
            startCommand.call(this, queue[i]);
        }

        if (!commandCount) {
            this.fire('complete');
        }

        return this;
    },
    /**
     * @method startQueue
     * @return {Object} this
     */
    startQueue: function () {
        if (this.get('paused')) {
            return this;
        } else if (!this.get('queue.length')) {
            this.fire('complete');
            return this;
        }

        this.fire('start');
        this.get('queue').shift().execute().on('complete', function () {
            this.startQueue();
        }, this);

        return this;
    }
});

Y.AsynchronousCommandQueue = _class;


}, 'gallery-2011.04.13-22-38' ,{requires:['base'], skinnable:false});
