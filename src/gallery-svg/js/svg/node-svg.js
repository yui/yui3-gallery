/** =======================================================================
 *  Vincent Hardy
 *  License terms: see svg-wow.org
 *  CC0 http://creativecommons.org/publicdomain/zero/1.0/
 *  ======================================================================= */

var UID = '_yuid',
    NODE_NAME = 'nodeName';

Y.Node.prototype.toString = function () {
    var str = '',
        errorMsg = this[UID] + ': not bound to a node',
        node = this._node,
        id = node.getAttribute('id'); // form.id may be a field name

    if (node) {
        str += node[NODE_NAME];
        if (id) {
            str += '#' + id;
        }

        if (node.className) {
            if (node.className.baseVal === undefined) {
                str += '.' + node.className.replace(' ', '.');
            } else if (node.className.baseVal !== "") {
                str += '.' + node.className.baseVal.replace(' ', '.');
            }
        }

        // TODO: add yuid?
        str += ' ' + this[UID];
    }
    return str || errorMsg;
};

// =============================================================================
// Override the default setting for SVG to use setAttribute instead of setting
// the property on the object.
// =============================================================================
Y.Node.DEFAULT_SETTER = function(name, val) {
    var node = this._stateProxy;

    if (name.indexOf('.') > -1) {
        name = name.split('.');
        // only allow when defined on node
        Y.Object.setValue(node, name, val);
    } else if (node[name] !== undefined) { // pass thru DOM properties
        if (name !== 'textContent' && node.setAttribute !== undefined) {
            node.setAttribute(name, val);
        } else {
            node[name] = val;
        }
    } else {
        node.setAttribute(name, val);
    }

    return val;
};

// =============================================================================
// See dom-svg
//
// We override the different class attribute manipulation method to account for
// the SVG baseVal and animVal on that attribute.
// =============================================================================
Y.Node.importMethod(Y.DOM, [
    'createMatrix',
    'firstElement',
    'nextElement',
    'prevElement',
    'removeAllChildren',
    'getMatrix',
    'setMatrix',
    'loadContent',
    'getAttributes',
    'setAttributes',
    'getBBox',
    'getViewportBBox',
    'addClass',
    'removeClass',
    'replaceClass',
    'toggleClass',
    'play',
    'setStyle'
]);


// =============================================================================
// Provide special handlers for SVG attributes to account for their
// animated nature, i.e., the presence of a baseVal and animVal on the
// attribute value. To work with YUI, the following returns the baseVal and
// sets the baseVal on get and set accesses.
// =============================================================================

var svgLengthAttributeHandler = {
    getGetter: function(attr) {
        return function () {
            var attrVal = this._node[attr], result = NaN;
            if (attrVal !== null && attrVal !== undefined) {
                if (typeof attrVal === "number") {
                    result = attrVal;
                } else if (attrVal.baseVal.getItem !== undefined) {
                    if (attrVal.baseVal.numberOfItems > 0) {
                        // x attribute on text, for example, is a list
                        // we use the first value.
                        result = attrVal.baseVal.getItem(0).value;
                    } else {
                        result = 0; // Default to zero
                    }
                } else {
                    result = attrVal.baseVal.value;
                }
            }
            return result;
        };
    },

    getSetter : function (attr) {
        return function(val) {
            if (typeof val === 'number') {
                var attrVal = this._node[attr];
                if (attrVal.baseVal !== undefined) {
                    if (attrVal.baseVal.getItem !== undefined) {
                        if (attrVal.baseVal.numberOfItems > 0) {
                            attrVal.baseVal.getItem(0).value = val;
                        } else {
                            this._node.setAttribute(attr, val);
                        }
                    } else {
                        attrVal.baseVal.value = val;
                    }
                } else {
                    this._node[attr] = val;
                }
            } else {
                this._node.setAttribute(attr, val);
            }
        };
    }
};

var svgNumberAttributeHandler = {
    getGetter: function(attr) {
        return function () {
            return this._node[attr].baseVal;
        };
    },

    getSetter : function (attr) {
        return function(val) {
            this._node[attr].baseVal = Number(val);
        };
    }
};

var svgAttributes = {
    x: svgLengthAttributeHandler,
    y: svgLengthAttributeHandler,
    x1: svgLengthAttributeHandler,
    y1: svgLengthAttributeHandler,
    x2: svgLengthAttributeHandler,
    y2: svgLengthAttributeHandler,
    width: svgLengthAttributeHandler,
    height: svgLengthAttributeHandler,
    dx: svgLengthAttributeHandler,
    dy: svgLengthAttributeHandler,
    rx: svgLengthAttributeHandler,
    ry: svgLengthAttributeHandler,
    r: svgLengthAttributeHandler,
    rotate: svgLengthAttributeHandler,
    offset: svgNumberAttributeHandler
};

for (var p in svgAttributes) {
    if (svgAttributes.hasOwnProperty(p) === true) {
        Y.Node.ATTRS[p] = {
            getter: svgAttributes[p].getGetter(p),
            setter: svgAttributes[p].getSetter(p)
        };
    }
}
