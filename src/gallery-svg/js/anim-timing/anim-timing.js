/** =======================================================================
 *  Vincent Hardy
 *  License terms: see svg-wow.org
 *  CC0 http://creativecommons.org/publicdomain/zero/1.0/
 *  ======================================================================= */

// =============================================================================
// Utility class used to manage animation time offsets.
// =============================================================================

var OffsetManager = {
    /**
     * List of pending offsets
     */
    _pendingOffsets: [],

    /**
     * The most recent timer identifier (used for cancellation
     */
    _lastTimerId: -1,

    /**
     * Adds a new offset client.
     *
     * @param p_offset {Number} the offset after which callback should be called.
     * @param p_callback the callback to invoke after offset expires. Should
     *        be a function or an animation instance (i.e., an object with a
     *        'run' method).
     */
    addOffsetListener : function (p_offset, p_callback) {
        p_offset = p_offset !== undefined ? p_offset : 0;

        if (p_offset === undefined || p_offset <= 0) {
            // Invoke callback immediately.
            this._invokeCallback(p_callback);
        } else {
            var currentTime = (new Date()).getTime(),
                offset = {
                    callback: p_callback,
                    offset: p_offset,
                    requestedAt: currentTime,
                    remainingOffset: p_offset * 1000
                };

            this._updatePendingOffsets(currentTime);

            if (this._insertPendingOffset(offset) === 0) {
                // the new offset is at index 0, i.e., it is our most immediate
                // new timer. Cancel the current timer if one was set.
                // In all cases, start a new timeout.
                if (this._lastTimerId !== -1) {
                    clearTimeout(this._lastTimerId);
                }

                this._startTimer();
            }
        }
    },

    /**
     * Implementation helper.
     * Starts the timer on the most immediate callback. This assumes the
     * callbacks have been sorted in time order and that there is at least
     * one.
     */
    _startTimer : function () {
        this._lastTimerId = setTimeout(function () {
                        OffsetManager._onTimeout();
                    }, this._pendingOffsets[0].remainingOffset);
    },

    /**
     * setTimeout callback
     *
     */
    _onTimeout : function () {
        this._timerId = -1;

        var po = this._pendingOffsets, o,
            currentTime = (new Date()).getTime();
        this._updatePendingOffsets(currentTime);

        o = po[0];
        while (o !== undefined && o.remainingOffset <= 0) {
            po.splice(0, 1);
            this._invokeCallback(o.callback);
            o = po[0];
        }

        if (po.length > 0) {
            this._startTimer();
        }
    },

    /**
     * Implementation helper.
     *
     * Updates the remainingOffset on the _pendingOffsets elements.
     *
     * @param p_currentTime the current time when this call is made
     */
    _updatePendingOffsets : function (p_currentTime) {
        var po = this._pendingOffsets, o;
        var n = po.length;
        for (var i = 0; i < n; i++) {
            o = po[i];
            o.remainingOffset = o.offset * 1000 - (p_currentTime - o.requestedAt);
        }
    },

    /**
     * Implementation helper.
     *
     * Inserts a new timing offset in the array managed by the offset manager.
     *
     * @param p_offset the new offset object to insert.
     * @return the index at which the new offset object was inserted.
     */
    _insertPendingOffset : function (p_offset) {
        var po = this._pendingOffsets, o;
        var n = po.length;
        for (var i = 0; i < n; i++) {
            o = po[i];
            if (o.remainingOffset > p_offset.remainingOffset) {
                po.splice(i, 0, p_offset);
                break;
            }
         }

         if (i === n) {
             po.push(p_offset);
         }

         return i;
    },

    /**
     * Invokes the callback.
     *
     * @param p_callback may be a function or an animation instance.
     */
    _invokeCallback : function (p_callback) {
        if (typeof p_callback === "function") {
            p_callback.call();
        } else if (typeof p_callback === "object" &&
                   p_callback !== null &&
                   typeof p_callback.run === "function") {
            p_callback.run();
        }
    }

};

/**
 * Simple extension of the YUI animation classes to handle SVG transforms.
 *
 * The extension handles the "r", "sx", "sy", "tx" and "ty" pseudo attributes
 * by manipulating the transform of the target element using a template.
 *
 * @param config the configuration
 *
 * @see http://developer.yahoo.com/yui/docs/YAHOO.util.Anim.html
 */
Y.Animate = function (config) {
    Y.Animate.superclass.constructor.apply(this, arguments);
};

Y.Animate.NAME = "Y.Animate";

Y.Animate.ATTRS = {
    transformTemplate: {
        value: "rotate(#r) scale(#sx, #sy) translate(#tx, #ty)"
    }
};

/**
 * Work around usage of regexp in YUI to detect which properties should have a
 * default unit.
 *
 * Unfortunately, the default regexp matches stop-opacity with 'top'
 */
Y.Anim.RE_DEFAULT_UNIT = /^width|^height|^top|^right|^bottom|^left|^margin.*|^padding.*|^border.*$/i;

Y.extend(Y.Animate, Y.Anim, {
    /**
     * Initializer.
     * @see Y.Base
     */
    initializer : function () {
        var _endCallbacks = [],
            _beginCallbacks = [];

        this._endCallbacks = _endCallbacks;
        this._beginCallbacks = _beginCallbacks;

        this.on("end", function () {
            for (var i = 0; i < _endCallbacks.length; i++) {
                OffsetManager.addOffsetListener(_endCallbacks[i].offset,
                                                _endCallbacks[i].callback);
            }
        });

        this.on("start", function () {
            for (var i = 0; i < _beginCallbacks.length; i++) {
                OffsetManager.addOffsetListener(_beginCallbacks[i].offset,
                                                _beginCallbacks[i].callback);
            }
        });

        // Override the run/stop methods. Since it is initialized in the animate
        // class' constructor, we need to do an override in the derived class'
        // constructor as well.
        this._superRun = Y.Animate.superclass.run;
        this._superStop = Y.Animate.superclass.stop;
    },

    /**
     * Override the base class' _runAttrs to fix a bug in reverse mode.
     */
    _runAttrs: function(t, d, reverse) {
        var attr = this._runtimeAttr,
            customAttr = Y.Anim.behaviors,
            easing = attr.easing,
            lastFrame = d,
            attribute,
            setter,
            i;

        if (reverse) {
            t = d - t;
            lastFrame = 0;
        }

        for (i in attr) {
            if (attr[i].to) {
                attribute = attr[i];
                setter = (i in customAttr && 'set' in customAttr[i]) ?
                        customAttr[i].set : Y.Anim.DEFAULT_SETTER;

                if (t < d && t > 0) {
                    setter(this, i, attribute.from, attribute.to, t, d, easing, attribute.unit);
                } else {
                    setter(this, i, attribute.from, attribute.to, lastFrame, d, easing, attribute.unit);
                }
            }
        }
    },

    /**
     * Applies the initial animation value.
     */
    applyStartFrame: function() {
        this._checkRuntimeAttr();

        var d = this._runtimeAttr.duration,
            t = 0,
            attr = this._runtimeAttr,
            customAttr = Y.Anim.behaviors,
            easing = attr.easing,
            attribute,
            setter,
            i,
            reverse = this.get("reverse");

        if (reverse) {
            t = d;
        }

        for (i in attr) {
            if (attr[i].to) {
                attribute = attr[i];
                setter = (i in customAttr && 'set' in customAttr[i]) ?
                         customAttr[i].set : Y.Anim.DEFAULT_SETTER;

                setter(this, i, attribute.from, attribute.to, t, d, easing, attribute.unit);                 
            }
        }
    },

    /**
     * Implementation helper: checks that the runtime attributes have been
     * initialized. If not, initialize them now.
     */
    _checkRuntimeAttr : function () {
        if (this._runtimeAttr === undefined) {
            this._initAnimAttr();
        }
    },

    /**
     * Returns a handler that will run this animation instance when invoked.
     */
    getRunHandler : function () {
        var that = this;
        if (this._runHandler === undefined) {
            this._runHandler = function () {
                that.run();
            };
        }

        return this._runHandler;
    },
    
    /**
     * Returns the handler that will stop this animation instance when invoked
     */
    getStopHandler : function () {
        var that = this;
        if (this._stopHandler === undefined) {
            this._stopHandler = function () {
                that.stop();
            };
        }
        return this._stopHandler;
    },

    /**
     * Adds a function of animation to call or play when this animation ends
     *
     * @param p_animOrCallback an animation or function to trigger when this
     *        animation ends
     * @param p_oOffset {Number} optional time offset to add before calling the
     *        end callback.
     */
    onEnd : function (p_animOrCallback, p_oOffset) {
        this._endCallbacks.push({
            callback: p_animOrCallback,
            offset: p_oOffset
        });
    },

    /**
     * Adds a function of animation to call or play when this animation begins
     *
     * @param p_animOrCallback an animation or function to trigger when this
     *        animation begins
     * @param p_oOffset {Number} optional time offset to add before calling the
     *        begin callback.
     */
    onBegin : function (p_animOrCallback, p_oOffset) {
        this._beginCallbacks.push({
            callback: p_animOrCallback,
            offset: p_oOffset
        });
    },

    /**
     * Starts the animation with the requseted offset. The offset is optional,
     * and defaults to zero if unspecified.
     *
     * @param p_oOffset {Number} optional time offset, in seconds, before
     *        starting the animation.
     */
    run : function (p_offset) {
        if (p_offset === undefined || p_offset === 0) {
            this._superRun.call(this);
            this.applyStartFrame(); // Applies the initial animation frame.
        } else {
            OffsetManager.addOffsetListener(p_offset, this);
        }
    },
    
    /**
     * Stops the animation with the requested offset. The offset is optional and
     * defaults to zero if unspecified.
     *
     * @param p_oOffset {Number} optional time offset, in seconds, before ending
     *        the animation.
     */
    stop : function (p_offset) {
        if (p_offset === undefined || p_offset === 0) {
            this._superStop.call(this);
        } else {
            OffsetManager.addOffsetListener(p_offset, this.getStopHandler());
        }
    },
     

    /**
     * Adds a start condition for this animation.
     *
     * @param p_evtTarget the event target (DOM object) or animation.
     * @param p_evtType the event type. If the target is an animation instance,
     *        should be "begin" or "end".
     * @param p_oOffset an offset after which the animation should begin. In
     *        seconds.
     */
    beginOn : function (p_evtTarget, p_evtType, p_oOffset) {
        var that = this;

        if (p_evtTarget.run !== undefined) {
            if (p_evtType === "begin") {
                p_evtTarget.onBegin(this, p_oOffset);
            } else if (p_evtType === "end") {
                p_evtTarget.onEnd(this, p_oOffset);
            }
        } else {
            p_evtTarget.on(p_evtType, function () {
                that.run(p_oOffset);
            });
        }
    },

    /**
     * Adds an end condition for this animation.
     *
     * @param p_evtTarget the event target
     * @param p_evtType the event type. If the target is an animation instance,
     *        should be "begin" or "end".
     * @param p_oOffset an offset after which the animation should begin In
     *        seconds.
     */
    endOn : function (p_evtTarget, p_evtType, p_oOffset) {
        var that = this;
        if (p_evtTarget.run !== undefined) {
            if (p_evtType === "begin") {
                p_evtTarget.onBegin(function () {
                    that.stop(false);
                }, p_oOffset);
            } else if (p_evtType === "end") {
                p_evtTarget.onEnd(function() {
                    that.stop(false);
                }, p_oOffset);
            }
        } else {
            p_evtTarget.on(p_evtType, function () {
                OffsetManager.addOffsetListener(p_oOffset, function () {
                    that.stop(false);
                });
            });
        }
    }
});