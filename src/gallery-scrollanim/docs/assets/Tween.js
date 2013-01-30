/*jslint sloppy: true */
/*globals setInterval, clearInterval */

/**
 * Copyright (c) 2010-2012 Tween.js authors.
 * Easing equations Copyright (c) 2001 Robert Penner http://robertpenner.com/easing/
 * @author sole / http://soledadpenades.com
 * @author mr.doob / http://mrdoob.com
 * @author Robert Eisele / http://www.xarg.org
 * @author Philippe / http://philippe.elsass.me
 * @author Robert Penner / http://www.robertpenner.com/easing_terms_of_use.html
 * @author Paul Lewis / http://www.aerotwist.com/
 * @author lechecacharro
 * @author Josh Faul / http://jocafa.com/
 * Licensed under the MIT (https://github.com/sole/tween.js/blob/master/LICENSE) license.
 */

var TWEEN = TWEEN || (function () {

    var i, interval, fps = 60, autostart = false, tweens = [];

    return {

        setFPS: function (f) {

            fps = f || 60;

        },

        start: function (f) {

            if (arguments.length !== 0) {
                this.setFPS(f);
            }

            interval = setInterval(this.update, 1000 / fps);

        },

        stop: function () {

            clearInterval(interval);

        },

        setAutostart: function (value) {

            autostart = value;

            if (autostart && !interval) {
                this.start();
            }

        },

        add: function (tween) {

            tweens.push(tween);

            if (autostart && !interval) {

                this.start();

            }

        },

        getAll: function () {

            return tweens;

        },

        removeAll: function () {

            tweens = [];

        },

        remove: function (tween) {

            i = tweens.indexOf(tween);

            if (i !== -1) {

                tweens.splice(i, 1);

            }

        },

        update: function (a_time) {

            var i = 0, num_tweens = tweens.length,
                time = a_time || new Date().getTime();

            while (i < num_tweens) {

                if (tweens[i].update(time)) {

                    i += 1;

                } else {

                    tweens.splice(i, 1);
                    num_tweens -= 1;

                }

            }

            if (num_tweens === 0 && autostart === true) {

                this.stop();

            }

        }

    };

}());

TWEEN.Tween = function (object) {

    var a_object = object,
        a_valuesStart = {},
        a_valuesDelta = {},
        a_valuesEnd = {},
        a_duration = 1000,
        a_delayTime = 0,
        a_startTime = null,
        a_easingFunction = TWEEN.Easing.Linear.EaseNone,
        a_chainedTween = null,
        a_onUpdateCallback = null,
        a_onCompleteCallback = null;

    this.to = function (properties, duration) {
        var property;

        if (duration !== null) {

            a_duration = duration;

        }

        for (property in properties) {
            if (properties.hasOwnProperty(property)) {

                // This prevents the engine from interpolating null values
                if (a_object[property] !== null) {

                    // The current values are read when the tween starts;
                    // here we only store the final desired values
                    a_valuesEnd[property] = properties[property];

                }
            }
        }

        return this;

    };

    this.start = function (a_time) {
        var property;

        TWEEN.add(this);

        a_startTime = a_time ? a_time + a_delayTime : new Date().getTime() + a_delayTime;

        for (property in a_valuesEnd) {
            if (a_valuesEnd.hasOwnProperty(property)) {
                // Again, prevent dealing with null values
                if (a_object[property] !== null) {

                    a_valuesStart[property] = a_object[property];
                    a_valuesDelta[property] = a_valuesEnd[property] - a_object[property];

                }

            }
        }

        return this;
    };

    this.stop = function () {

        TWEEN.remove(this);
        return this;

    };

    this.delay = function (amount) {

        a_delayTime = amount;
        return this;

    };

    this.easing = function (easing) {

        a_easingFunction = easing;
        return this;

    };

    this.chain = function (chainedTween) {

        a_chainedTween = chainedTween;
        return this;

    };

    this.onUpdate = function (onUpdateCallback) {

        a_onUpdateCallback = onUpdateCallback;
        return this;

    };

    this.onComplete = function (onCompleteCallback) {

        a_onCompleteCallback = onCompleteCallback;
        return this;

    };

    this.update = function (time) {

        var property, elapsed, value;

        if (time < a_startTime) {

            return true;

        }

        elapsed = (time - a_startTime) / a_duration;
        elapsed = elapsed > 1 ? 1 : elapsed;

        value = a_easingFunction(elapsed);

        for (property in a_valuesDelta) {
            if (a_valuesDelta.hasOwnProperty(property)) {
                a_object[property] = a_valuesStart[property] + a_valuesDelta[property] * value;
            }
        }

        if (a_onUpdateCallback !== null) {

            a_onUpdateCallback.call(a_object, value);

        }

        if (elapsed === 1) {

            if (a_onCompleteCallback !== null) {

                a_onCompleteCallback.call(a_object);

            }

            if (a_chainedTween !== null) {

                a_chainedTween.start();

            }

            return false;

        }

        return true;

    };

    /*
     this.destroy = function () {

     TWEEN.remove( this );

     };
     */
};

TWEEN.Easing = { Linear: {}, Quadratic: {}, Cubic: {}, Quartic: {}, Quintic: {}, Sinusoidal: {}, Exponential: {}, Circular: {}, Elastic: {}, Back: {}, Bounce: {} };


TWEEN.Easing.Linear.EaseNone = function (k) {

    return k;

};

//

TWEEN.Easing.Quadratic.EaseIn = function (k) {

    return k * k;

};

TWEEN.Easing.Quadratic.EaseOut = function (k) {

    return -k * (k - 2);

};

TWEEN.Easing.Quadratic.EaseInOut = function (k) {

    if ((k *= 2) < 1) {
        return 0.5 * k * k;
    }
    return -0.5 * ((k -= 1) * (k - 2) - 1);

};

//

TWEEN.Easing.Cubic.EaseIn = function (k) {

    return k * k * k;

};

TWEEN.Easing.Cubic.EaseOut = function (k) {

    return (k -= 1) * k * k + 1;

};

TWEEN.Easing.Cubic.EaseInOut = function (k) {

    if ((k *= 2) < 1) {
        return 0.5 * k * k * k;
    }
    return 0.5 * ((k -= 2) * k * k + 2);

};

//

TWEEN.Easing.Quartic.EaseIn = function (k) {

    return k * k * k * k;

};

TWEEN.Easing.Quartic.EaseOut = function (k) {

    return -((k -= 1) * k * k * k - 1);

};

TWEEN.Easing.Quartic.EaseInOut = function (k) {

    if ((k *= 2) < 1) {
        return 0.5 * k * k * k * k;
    }
    return -0.5 * ((k -= 2) * k * k * k - 2);

};

//

TWEEN.Easing.Quintic.EaseIn = function (k) {

    return k * k * k * k * k;

};

TWEEN.Easing.Quintic.EaseOut = function (k) {

    return (k = k - 1) * k * k * k * k + 1;

};

TWEEN.Easing.Quintic.EaseInOut = function (k) {

    if ((k *= 2) < 1) {
        return 0.5 * k * k * k * k * k;
    }
    return 0.5 * ((k -= 2) * k * k * k * k + 2);

};

// 

TWEEN.Easing.Sinusoidal.EaseIn = function (k) {

    return -Math.cos(k * Math.PI / 2) + 1;

};

TWEEN.Easing.Sinusoidal.EaseOut = function (k) {

    return Math.sin(k * Math.PI / 2);

};

TWEEN.Easing.Sinusoidal.EaseInOut = function (k) {

    return -0.5 * (Math.cos(Math.PI * k) - 1);

};

//

TWEEN.Easing.Exponential.EaseIn = function (k) {

    return k === 0 ? 0 : Math.pow(2, 10 * (k - 1));

};

TWEEN.Easing.Exponential.EaseOut = function (k) {

    return k === 1 ? 1 : -Math.pow(2, -10 * k) + 1;

};

TWEEN.Easing.Exponential.EaseInOut = function (k) {

    if (k === 0) {
        return 0;
    }

    if (k === 1) {
        return 1;
    }

    if ((k *= 2) < 1) {
        return 0.5 * Math.pow(2, 10 * (k - 1));
    }

    return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);

};

// 

TWEEN.Easing.Circular.EaseIn = function (k) {

    return -(Math.sqrt(1 - k * k) - 1);

};

TWEEN.Easing.Circular.EaseOut = function (k) {

    return Math.sqrt(1 - (k - 1) * k);

};

TWEEN.Easing.Circular.EaseInOut = function (k) {

    if ((k /= 0.5) < 1) {
        return -0.5 * (Math.sqrt(1 - k * k) - 1);
    }
    return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);

};

//

TWEEN.Easing.Elastic.EaseIn = function (k) {

    var s, a = 0.1, p = 0.4;
    if (k === 0) {
        return 0;
    }

    if (k === 1) {
        return 1;
    }

    if (!p) {
        p = 0.3;
    }

    if (!a || a < 1) {
        a = 1;
        s = p / 4;
    } else {
        s = p / (2 * Math.PI) * Math.asin(1 / a);
    }

    return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
};

TWEEN.Easing.Elastic.EaseOut = function (k) {

    var s, a = 0.1, p = 0.4;
    if (k === 0) {
        return 0;
    }

    if (k === 1) {
        return 1;
    }

    if (!p) {
        p = 0.3;
    }

    if (!a || a < 1) {
        a = 1;
        s = p / 4;
    } else {
        s = p / (2 * Math.PI) * Math.asin(1 / a);
    }

    return (a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);
};

TWEEN.Easing.Elastic.EaseInOut = function (k) {

    var s, a = 0.1, p = 0.4;
    if (k === 0) {
        return 0;
    }

    if (k === 1) {
        return 1;
    }

    if (!p) {
        p = 0.3;
    }

    if (!a || a < 1) {
        a = 1;
        s = p / 4;
    } else {
        s = p / (2 * Math.PI) * Math.asin(1 / a);
    }

    if ((k *= 2) < 1) {
        return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
    }

    return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
};

//

TWEEN.Easing.Back.EaseIn = function (k) {

    var s = 1.70158;
    return k * k * ((s + 1) * k - s);

};

TWEEN.Easing.Back.EaseOut = function (k) {

    var s = 1.70158;
    return (k = k - 1) * k * ((s + 1) * k + s) + 1;

};

TWEEN.Easing.Back.EaseInOut = function (k) {

    var s = 1.70158 * 1.525;
    if ((k *= 2) < 1) {
        return 0.5 * (k * k * ((s + 1) * k - s));
    }
    return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);

};

// 

TWEEN.Easing.Bounce.EaseIn = function (k) {

    return 1 - TWEEN.Easing.Bounce.EaseOut(1 - k);

};

TWEEN.Easing.Bounce.EaseOut = function (k) {

    if ((k /= 1) < (1 / 2.75)) {
        return 7.5625 * k * k;
    }

    if (k < (2 / 2.75)) {
        return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
    }

    if (k < (2.5 / 2.75)) {
        return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
    }

    return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
};

TWEEN.Easing.Bounce.EaseInOut = function (k) {

    if (k < 0.5) {
        return TWEEN.Easing.Bounce.EaseIn(k * 2) * 0.5;
    }
    return TWEEN.Easing.Bounce.EaseOut(k * 2 - 1) * 0.5 + 0.5;

};