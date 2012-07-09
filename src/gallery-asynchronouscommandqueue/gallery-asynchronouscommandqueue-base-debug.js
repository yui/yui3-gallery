YUI.add('gallery-asynchronouscommandqueue-base', function(Y) {

'use strict';

var _class;

_class = function (config) {
    _class.superclass.constructor.call(this, config);
};

_class.ATTRS = {
    completed: {
        readOnly: true,
        value: false
    },
    paused: {
        value: false
    },
    started: {
        readOnly: true,
        value: false
    },
    queue: {
        value: [],
        writeOnce: 'initOnly'
    }
};
_class.NAME = 'AsynchronousCommandQueue';

Y.extend(_class, Y.Base, {
    addCommand: function (asynchronousCommand) {
        this.get('queue').push(asynchronousCommand);
        return this;
    },
    getCommandCount: function () {
        return this.get('queue.length');
    },
    initializer: function () {
        this.publish('complete', {
            fireOnce: true
        });
        this.publish('pause');
        this.publish('resume');
        this.publish('start', {
            fireOnce: true
        });

        this.on('complete', function (eventFacade, response, args) {
            this._set('completed', true);
        }, this);

        this.on('start', function (eventFacade, response, args) {
            this._set('started', true);
        }, this);
    },
    pauseQueue: function () {
        this.set('paused', true);
        this.fire('pause');
        return this;
    },
    resumeQueue: function () {
        this.set('paused', false);
        this.fire('resume');
        return this.startQueue();
    },
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

        return this;
    },
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


}, '@VERSION@' ,{requires:['base'], skinnable:false});
