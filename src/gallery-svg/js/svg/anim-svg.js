/** =======================================================================
 *  Vincent Hardy
 *  License terms: see svg-wow.org
 *  CC0 http://creativecommons.org/publicdomain/zero/1.0/
 *  ======================================================================= */

/**
 * Object with the names of the transform pseudo attributes.
 */
var PSEUDO_ATTRIBUTES_REGEXP = {
    tx: /#tx/g,
    ty: /#ty/g,
    sx: /#sx/g,
    sy: /#sy/g,
    r:  /#r/g
};

var PSEUDO_ATTRIBUTES_ARRAY = ["tx", "ty", "sx", "sy", "r"];
var N_PSEUDO_ATTRIBUTES = PSEUDO_ATTRIBUTES_ARRAY.length;

var colorBehavior = Y.Anim.behaviors.color;
var svgColors = Y.DOM.SVG_COLORS;

var svgColorBehavior = {
    set: function(anim, att, from, to, elapsed, duration, fn) {
        if (from in svgColors) {
            from = svgColors[from];
        }
        if (to in svgColors) {
            to = svgColors[to];
        }
        colorBehavior.set(anim, att, from, to, elapsed, duration, fn);
    },

    get: colorBehavior.get
};

Y.Anim.behaviors.transform = {
    set: function (anim, att, from, to, elapsed, duration, fun) {
        var txf = anim.get(att + "Template"), val, p,
            e = anim._node;

        if (txf) {
            for (p in to) {
                if (to.hasOwnProperty(p)) {
                    val = fun(elapsed, from[p], to[p] - from[p], duration);
                    txf = txf.replace(PSEUDO_ATTRIBUTES_REGEXP[p], val);
                    e[p] = val;
                }
            }
            
            e.setAttribute(att, txf);
        }
    },

    get: function (anim, att) {
        var result = {
            tx: 0,
            ty: 0,
            sx: 1,
            sy: 1,
            r: 0
        };
        var e = anim._node;
        for (var i = 0; i < N_PSEUDO_ATTRIBUTES; i++) {
            var a = PSEUDO_ATTRIBUTES_ARRAY[i];
            if (e[a] !== undefined) {
                result[a] = e[a];
            } else {
                e[a] = result[a];
            }
        }
        return result;
    }
};

Y.Anim.behaviors.stdDeviation = {
    set: function (anim, att, from, to, elapsed, duration, fun) {
        var val = [fun(elapsed, from[0], to[0] - from[0], duration),
                   fun(elapsed, from[1], to[1] - from[1], duration)];

        // NOTE: setStdDeviation is more efficient, so use it if available.
        // Firefox 3.6 and earlier doesn't have support for setStdDeviation,
        // so fallback to setAttribute.
        if (anim._node.setStdDeviation) {
            anim._node.setStdDeviation(val[0], val[1]);
        } else {
            anim._node.setAttribute(att, val[0] + " " + val[1]);
        }
    },

    get: function (anim, attr) {
        // NOTE: Got errors in {Firefox, Opera, Safari} about stdDeviationX 
        // not being defined in some cases, fallback to the default value [0,0].
        var result = [0, 0];
        if (anim._node.stdDeviationX !== null &&
            anim._node.stdDeviationY !== undefined) {
            result = [anim._node.stdDeviationX.baseVal,
                    anim._node.stdDeviationY.baseVal];
        }
        return result;
    }
};

var lengthBehavior = {
    set: function (anim, att, from, to, elapsed, duration, fun) {
        var val = fun(elapsed, Number(from), Number(to) - Number(from), duration);
        anim._node.set(att, val);
    },

    get: function (anim, attr) {
        return anim._node.get(attr);
    }
};

var pathCommands = {
    m: 'm',
    M: 'M',
    l: 'l',
    L: 'L',
    h: 'h',
    H: 'H',
    v: 'v',
    V: 'V',
    q: 'q',
    Q: 'Q',
    c: 'c',
    C: 'C',
    z: 'z',
    Z: 'Z',
    s: 's',
    S: 'S',
    t: 't',
    T: 'T',
    a: 'a',
    A: 'A'
};

function parsePath (d) {
    var n;

    if (typeof d === "string") {
        d = d.replace(/([^ ])([hHvVmMlLtTqQsScCaAzZ])/g, '$1 $2')
             .replace(/([hHvVmMlLtTqQsScCaAzZ])([^ ])/g, '$1 $2')
             .replace(/([^ ,])-/g, '$1,-')
             .replace(/[ ]{2,}/g, ' ')
             .replace(/[ ]+/g,',').split(',');
        n = d.length;
        for (var i = 0; i < n; i++) {
            if (pathCommands[d[i]] === undefined) {
                d[i] = Number(d[i]);
            }
        }
    }
    return d;
}

Y.Anim.behaviors.d = {
    set: function (anim, att, from, to, elapsed, duration, fun) {
        from = parsePath(from);
        to = parsePath(to);

        // As in the SVG specification, it is a requirement that the path
        // segment types match. So we only need to interpolate the coordinates.
        var n = to.length,
            c,
            v = [],
            nc,
            is,
            max;
            
        for (var i = 0; i < n;) {
            c = to[i]; // command
            v.push(c);
            nc = 0;
            is = i + 1;
            switch (c) {
                case 'h':
                case 'H':
                case 'v':
                case 'V':
                    i++;
                    do {
                        i++;
                        nc++;
                    } while (typeof to[i] === "number");
                    break;
                case 'm':
                case 'M':
                case 'l':
                case 'L':
                case 't':
                case 'T':
                    i++;
                    do {
                        i += 2;
                        nc += 2;
                   } while (typeof to[i] === "number");
                    break;
                case 'q':
                case 'Q':
                case 's':
                case 'S':
                    i++;
                    do {
                        i += 4;
                        nc += 4;
                   } while (typeof to[i] === "number");
                    break;
                case 'c':
                case 'C':
                    i++;
                    do {
                        i += 6;
                        nc += 6;
                   } while (typeof to[i] === "number");
                    break;
                case 'a':
                case 'A':
                    i++;
                    do {
                        i += 7;
                        nc += 7;
                   } while (typeof to[i] === "number");
                    break;
                // case 'z':
                // case 'Z':
                default:
                    // Includes 'z' and 'Z'
                    i += 1;
                    break;
            }
            max = is + nc;
            for (var j = is; j < max; j++) {
                v[j] = fun(elapsed, from[j], to[j] - from[j], duration);
                if (isNaN(v[j]) === true) {
                    Y.log('v[' + j + '] is NaN');
                }
            }
        }

        anim._node.setAttribute(att, v.join(' '));
    },

    get: function (anim, attr) {
        return parsePath(anim._node.getAttribute(attr));
    }
};

Y.Anim.behaviors.fill = svgColorBehavior;
Y.Anim.behaviors.stroke = svgColorBehavior;
Y.Anim.behaviors["stop-color"] = svgColorBehavior;
Y.Anim.behaviors["flood-color"] = svgColorBehavior;
Y.Anim.behaviors["lighting-color"] = svgColorBehavior;

Y.Anim.behaviors.dy = lengthBehavior;
Y.Anim.behaviors.y = lengthBehavior;
Y.Anim.behaviors.dx = lengthBehavior;
Y.Anim.behaviors.x = lengthBehavior;
Y.Anim.behaviors.rotate = lengthBehavior;
Y.Anim.behaviors.width = lengthBehavior;
Y.Anim.behaviors.height = lengthBehavior;
Y.Anim.behaviors.r = lengthBehavior;
Y.Anim.behaviors.rx = lengthBehavior;
Y.Anim.behaviors.ry = lengthBehavior;
Y.Anim.behaviors.cx = lengthBehavior;
Y.Anim.behaviors.cy = lengthBehavior;
Y.Anim.behaviors.x1 = lengthBehavior;
Y.Anim.behaviors.x2 = lengthBehavior;
Y.Anim.behaviors.y1 = lengthBehavior;
Y.Anim.behaviors.y2 = lengthBehavior;
Y.Anim.behaviors.offset = lengthBehavior;
