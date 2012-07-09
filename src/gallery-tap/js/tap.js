/*
   Copyright (c) 2012, Yahoo! Inc. All rights reserved.

   Redistribution and use of this software in source and binary forms, 
   with or without modification, are permitted provided that the following 
   conditions are met:

   Redistributions of source code must retain the above
   copyright notice, this list of conditions and the
   following disclaimer.

   Redistributions in binary form must reproduce the above
   copyright notice, this list of conditions and the
   following disclaimer in the documentation and/or other
   materials provided with the distribution.

   Neither the name of Yahoo! Inc. nor the names of its
   contributors may be used to endorse or promote products
   derived from this software without specific prior
   written permission of Yahoo! Inc.

   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS 
   IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED 
   TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A 
   PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT 
   OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, 
   SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT 
   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, 
   DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY 
   THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT 
   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE 
   OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * Provides 'tap' functionality for touchscreen devices.  'tap' is like a touchscreen 'click', 
 * only it requires much less finger-down time.
 * 'tap' enables high-usability mobile applications, and more.  Code by Yahoo Engineering.
 */

/**
    * The tap module provides a gesture events, "tap", which normalizes user interactions
    * across touch and mouse or pointer based input devices.  This can be used by application developers
    * to build input device agnostic components which behave the same in response to either touch or mouse based
    * interaction.
    *
    */
var SUPPORTS_TOUCHES = ("createTouch" in document),
    EVENTS = {
        START: SUPPORTS_TOUCHES ? 'touchstart' : 'mousedown',
        MOVE: SUPPORTS_TOUCHES ? 'touchmove' : 'mousemove',
        END: SUPPORTS_TOUCHES ? 'touchend' : 'mouseup',
        CANCEL: SUPPORTS_TOUCHES ? 'touchcancel' : 'mousecancel',
        TAP: 'tap'
    },
    HANDLES = {
        ON: {
            START: 'Y_TAP_ON_START_HANDLE',
            MOVE: 'Y_TAP_ON_MOVE_HANDLE',
            END: 'Y_TAP_ON_END_HANDLE',
            CANCEL: 'Y_TAP_ON_CANCEL_HANDLE'
        },
        DELEGATE: {
            START: 'Y_TAP_DELEGATE_START_HANDLE',
            MOVE: 'Y_TAP_DELEGATE_MOVE_HANDLE',
            END: 'Y_TAP_DELEGATE_END_HANDLE',
            CANCEL: 'Y_TAP_DELEGATE_CANCEL_HANDLE'
        }
    };

function detachHelper(subscription, handles, subset, context) {

    handles = subset ? handles : [ handles.START, handles.MOVE, handles.END, handles.CANCEL ];

    Y.each(handles, function (name) {
        var handle = subscription[name];
        if (handle) {
            handle.detach();
            subscription[name] = null;
        }
    });

}


/**
    * Sets up a "tap" event, that is fired on touch devices in response to a tap event (finger down, finder up).
    * This event can be used instead of listening for click events which have a 500ms delay on most touch devices.
    * This event can also be listened for using node.delegate().
    *
    * @event tap
    * @param type {string} "tap"
    * @param fn {function} The method the event invokes. It receives the event facade of the underlying DOM event.
    *
    * @return {EventHandle} the detach handle
    */
Y.Event.define(EVENTS.TAP, {

    on: function (node, subscription, notifier) {
        subscription[HANDLES.ON.START] = node.on(EVENTS.START, this.touchStart, this, node, subscription, notifier);
    },

    detach: function (node, subscription, notifier) {
        detachHelper(subscription, HANDLES.ON);
    },

    delegate: function (node, subscription, notifier, filter) {
        subscription[HANDLES.DELEGATE.START] = node.delegate(EVENTS.START, function (e) {
            this.touchStart(e, node, subscription, notifier, true);
        }, filter, this);
    },

    detachDelegate: function (node, subscription, notifier) {
        detachHelper(subscription, HANDLES.DELEGATE);
    },

    touchStart: function (event, node, subscription, notifier, delegate) {
        var curr_handles = delegate ? HANDLES.DELEGATE : HANDLES.ON,
            context = {
                cancelled: false
            };

        // no right clicks
        if (event.button && event.button === 3) {
            return;
        }

        context.node = delegate ? event.currentTarget : node;
        context.startXY = SUPPORTS_TOUCHES ? [ event.touches[0].pageX, event.touches[0].pageY ] : [ event.pageX, event.pageY ];

        // for now just support a 1 finger count (later enhance via config)
        if (event.touches && event.touches.length !== 1) {
            return;
        }

        // something is off with the move that it attaches it but never triggers the handler
        subscription[curr_handles.MOVE] = node.once(EVENTS.MOVE, this.touchMove, this, node, subscription, notifier, delegate, context);
        subscription[curr_handles.END] = node.once(EVENTS.END, this.touchEnd, this, node, subscription, notifier, delegate, context);
        subscription[curr_handles.CANCEL] = node.once(EVENTS.CANCEL, this.touchMove, this, node, subscription, notifier, delegate, context);
    },

    touchMove: function (event, node, subscription, notifier, delegate, context) {
        var handles = delegate ? HANDLES.DELEGATE : HANDLES.ON;

        detachHelper(subscription, [ handles.MOVE, handles.END, handles.CANCEL ], true, context);
        context.cancelled = true;

    },

    touchEnd: function (event, node, subscription, notifier, delegate, context) {
        var startXY = context.startXY,
            endXY = SUPPORTS_TOUCHES ? [ event.changedTouches[0].pageX, event.changedTouches[0].pageY ] : [event.pageX, event.pageY],
            handles = delegate ? HANDLES.DELEGATE : HANDLES.ON;

        detachHelper(subscription, [ handles.MOVE, handles.END, handles.CANCEL ], true, context);

        // make sure mouse didn't move
        if (Math.abs(endXY[0] - startXY[0]) < 1 && Math.abs(endXY[1] - startXY[1]) < 1) {

            event.type = EVENTS.TAP;
            event.pageX = endXY[0];
            event.pageY = endXY[1];
            event.clientX = SUPPORTS_TOUCHES ? event.changedTouches[0].clientX : event.clientX;
            event.clientY = SUPPORTS_TOUCHES ? event.changedTouches[0].clientY : event.clientY;
            event.currentTarget = context.node;

            setTimeout(function () {
                notifier.fire(event);
            }, 0);
        }
    }

});
