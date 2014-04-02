/*
Copyright 2013 Yahoo! Inc.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

'use strict';
var HAMMER_GESTURES = [
    'hold',
    'tap',
    'doubletap',
    'drag',
    'dragstart',
    'dragend',
    'dragup',
    'dragdown',
    'dragleft',
    'dragright',
    'swipe',
    'swipeup',
    'swipedown',
    'swipeleft',
    'swiperight',
    'transform',
    'transformstart',
    'transformend',
    'rotate',
    'pinch',
    'pinchin',
    'pinchout',
    'touch',
    'release'
];

Y.Array.each(HAMMER_GESTURES, function (gesture) {
    Y.Event.define(gesture, {
        _hammer: undefined,
        processArgs: function (args, isDelegate) {
            // The args list will look like this coming in:
            // [ type, callback, node, (extras...), [filter,] thisObj, arg0...argN ]
            return args.splice(3,1)[0];
        },
        on: function (node, subscription, notifier) {
            var params = subscription._extra,
                self = this;

            // Delegate the gesture event to HammerJS.
            this._hammer = Hammer(node.getDOMNode(), params).on(gesture, function (ev) {
                self.handleHammerEvent(ev, node, subscription, notifier);
            });
        },

        handleHammerEvent: function (ev, node, subscription, notifier) {
            //event facade normalization
            notifier.fire(ev);
        },

        _off: function () {
            this._hammer.off(this.type, this.handleHammerEvent);
        },

        detach: function () {
            this._off();
        }
    });
});
