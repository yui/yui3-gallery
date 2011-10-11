YUI.add('gallery-asynchronouscommand', function(Y) {

'use strict';

var _class;

_class = function (config) {
    _class.superclass.constructor.call(this, config);
};

_class.ATTRS = {
    args: {
        value: [],
        writeOnce: 'initOnly'
    },
    completed: {
        readOnly: true,
        value: false
    },
    context: {
        value: Y.config.win,
        writeOnce: 'initOnly'
    },
    delay: {
        readOnly: true,
        value: 0
    },
    fn: {
        value: function (asynchronousCommand) {
            asynchronousCommand.fire('complete');
        },
        writeOnce: 'initOnly'
    },
    started: {
        readOnly: true,
        value: false
    }
};
_class.NAME = 'AsynchronousCommand';

Y.extend(_class, Y.Base, {
    execute: function () {
        Y.later(this.get('delay'), this, function () {
            this.fire('start');
            this.get('fn').apply(this.get('context'), this.get('args'));
        });
        return this;
    },
    initializer: function () {
        this.publish('complete', {
            fireOnce: true
        });
        this.publish('start', {
            fireOnce: true
        });

        var args = this.get('args');

        if (!Y.Lang.isArray(args)) {
            args = [args];
        }

        args.unshift(this);
        this._set('args', args);

        this.on('complete', function () {
            this._set('completed', true);
        }, this);

        this.on('start', function () {
            this._set('started', true);
        }, this);
    }
});

Y.AsynchronousCommand = _class;


}, '@VERSION@' ,{requires:['base'], skinnable:false});
