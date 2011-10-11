/** =======================================================================
 *  Vincent Hardy
 *  License terms: see svg-wow.org
 *  CC0 http://creativecommons.org/publicdomain/zero/1.0/
 *  ======================================================================= */

// Namespace constants
Y.svgNS = "http://www.w3.org/2000/svg";
Y.xlinkNS = "http://www.w3.org/1999/xlink";
Y.wowNS = "http://www.svgopen.org/2004/svgWow";
Y.xhtmlNS = "http://www.w3.org/1999/xhtml";

// Default namespace prefixes
var defaultNamespacePrefixes = {
    svg: Y.svgNS,
    xlink: Y.xlinkNS,
    sw: Y.wowNS,
    xhtml: Y.xhtmlNS
};

//
// Used tfor properties on which a default CSS unit (px) in enforced.
// See Y.DOM.setStyle
//
var FORCE_UNIT = {
    width: 'width',
    height: 'height',
    top: 'top',
    left: 'left',
    right: 'right',
    bottom: 'bottom',
    margin: 'margin',
    padding: 'padding'
};
    
var defaultSVG = document.createElementNS(Y.svgNS, 'svg'),
superHasClass = Y.DOM.hasClass,
hasClass, removeClass, addClass,
MATRIX_EXTENSIONS;

Y.mix(Y.DOM, {
    /**
         * Creates a new SVG Matrix instance. Note that it is not set on the
         * node this is called on.
         *
         * @param {SVGElement} element The DOM element.
         * @return an new <code>SVGMatrix</code> instance.
         */
    createMatrix : function (element) {
        var svg = element.ownerSVGElement, matrix;
        if (svg === null || svg === undefined) {
            svg = defaultSVG;
        }

        matrix = svg.createSVGMatrix();
        Y.mix(matrix, MATRIX_EXTENSIONS);
        return matrix;
    },

    /**
         * @param {SVGElement} element The DOM element.
         * @return the first child of type element.
         */
    firstElement : function (element) {
        var c = element.firstChild;
        var result = null;

        while (c !== null) {
            if (c.nodeType === Node.ELEMENT_NODE) {
                result = c;
                break;
            }
            c = c.nextSibling;
        }

        return result;
    },

    /**
         * @param {SVGElement} element The DOM element.
         * @return the next child of type element.
         */
    nextElement : function (element) {
        var s = element.nextSibling;
        var result = null;

        while (s !== null) {
            if (s.nodeType === Node.ELEMENT_NODE) {
                result = s;
                break;
            }
            s = s.nextSibling;
        }

        return result;
    },

    /**
         * @param {SVGElement} element The DOM element.
         * @return the previous child of type element.
         */
    prevElement : function (element) {
        var s = element.prevSibling;
        var result = null;

        while (s !== null) {
            if (s.nodeType === Node.ELEMENT_NODE) {
                result = s;
                break;
            }
            s = s.prevSibling;
        }

        return result;
    },

    /**
         * Removes all children from this node.
         * @param {SVGElement} element The DOM element.
         */
    removeAllChildren : function (element) {
        var c = element.firstChild;
        while (c !== null) {
            element.removeChild(c);
            c = element.firstChild;
        }
    },

    /**
         * Consolidate this node's transform and returns its base value matrix.
         *
         * @param {SVGElement} element The DOM element.
         * @return an <code>SVGMatrix</code> instance representing the node's
         *         current transform.
         */
    getMatrix : function (element) {
        var m, txf, svg;
        if (element.transform !== undefined) {
            txf = element.transform.baseVal.consolidate();
            if (txf === null) {
                svg = element.ownerSVGElement;
                m = svg.createSVGMatrix();
                txf = element.transform.baseVal.createSVGTransformFromMatrix(m);
                element.transform.baseVal.initialize(txf);
            } else {
                m = txf.matrix;
            }
        }
        return new Y.DOM.Matrix(m);
    },

    /**
         * Sets the node's transform base value to the desired matrix.
         *
         * @param {SVGElement} element The DOM element.
         * @param an <code>Y.DOM.Matrix</code> instance representing the transform
         *        new base value.
         */
    setMatrix : function (element, m) {
        var txf;
        if (element.transform !== undefined) {
            txf = element.transform.baseVal.createSVGTransformFromMatrix(m._m);
            element.transform.baseVal.initialize(txf);
        }
        return element;
    },

    /**
         * This method automatically loads and creates DOM nodes.
         *
         * The symtax for the object is as follows;
         * - the tag property gives the object's tag name
         * - the ns property gives the object's namespace. Optional, defaults to the
         *   SVG namespace.
         * - the children property is a set of sub-objects with the same syntax.
         *
         * @param element {SVGElement} the DOM element.
         * @param p_desc the object describing the element to create and initialize.
         * @param p_oInsertBefore Optional. the child before which the loaded content
         *        should be inserted
         * @return the element that was created.
         */
    loadContent : function (element, p_desc, p_oInsertBefore) {
        var content;

        if (typeof p_desc === "string") {
            content = document.createTextNode(p_desc);
        } else if (typeof p_desc === "object") {
            // Save the reserved values first.
            var tagOrig = p_desc.tag;
            var nsOrig = p_desc.ns;
            var childrenOrig = p_desc.children;

            // Now, process the element.
            var tag = p_desc.tag;

            if (tag === undefined) {
                throw new Error(
                    "the element description requires a 'tag' property");
            }

            var ns = Y.svgNS;

            if (p_desc.ns !== undefined) {
                ns = p_desc.ns;
            }

            content = document.createElementNS(ns, tag);

            if (content === null || content === undefined) {
                throw new Error("was not able to create an element with tag " +
                    tag + " in namespace " + ns);
            }


            var children = p_desc.children;

            delete p_desc.children;
            delete p_desc.tag;
            delete p_desc.ns;

            Y.DOM.setAttributes(content, p_desc);

            if (children !== undefined && children !== null) {
                var nChildren = children.length;
                if (typeof nChildren === "number") {
                    for (var i = 0; i < nChildren; i++) {
                        Y.DOM.loadContent(content, children[i]);
                    }
                }
            }

            // Restore
            p_desc.children = childrenOrig;
            p_desc.tag = tagOrig;
            p_desc.ns = nsOrig;
        } else {
            throw new Error("loadContent requires an object or string parameter");
        }

        if (element !== null && element !== undefined) {
            if (p_oInsertBefore === undefined) {
                p_oInsertBefore = null;
            }

            if (element.insertBefore !== undefined) {
                element.insertBefore(content, p_oInsertBefore);
            }
        }

        return content;
    },

    /**
         * The setAttributes method to be installed on all element classes.
         *
         * @param {SVGElement} element The DOM element.
         * @param attributes an object with the attributes to set on the object this
         *        method is called on.
         */
    setAttributes : function (element, attributes) {
        for (var p in attributes) {
            if (attributes.hasOwnProperty(p) === true) {
                element.setAttributeNS(
                    Y.DOM.getAttributeNamespace(element, p),
                    p,
                    attributes[p]);
            }
        }
    },

    /**
         * Implementation helper: get the namespace for the given
         * attribute on the given element.
         *
         * The method first extracts the namespace prefix from the attribute
         * name, looking for a semi color (e.g., 'xlink:href'). Then, if a
         * namespace prefix is found, the following namespace lookup happens.
         *
         * The method first looks up on the element. If no namespace is found,
         * then the document's root element is looked up. Then, the
         * <code>defaultNamespacePrefixes</code> map is used. If all fails,
         * null is returned.
         *
         * @param element the element to lookup.
         * @param attribute the attribute to lookup.
         * @return the namespace with <code>nsPrefix</code> on
         *         <code>element</code> or null if no namespace mapping to the
         *         prefix is found.
         */
    getAttributeNamespace : function (element, attribute) {
        var nsIndex = attribute.indexOf(":"),
        nsPrefix,
        ns = null;
                
        if (nsIndex !== -1) {
            nsPrefix = attribute.substring(0, nsIndex);
            ns = element.lookupNamespaceURI(nsPrefix);
            if (ns === null) {
                // No namespace declaration was found on the node.
                // This may be because the node is not in the tree
                // yet. The best thing which can be done here is to
                // check if we can find the namespace definition on the
                // document element.
                ns = document.documentElement.lookupNamespaceURI(nsPrefix);

                // If the namespace is still not found, check the
                // default list of known namespaces
                if (defaultNamespacePrefixes[nsPrefix] !== undefined) {
                    ns = defaultNamespacePrefixes[nsPrefix];
                }
            }
        }
        return ns;
    },

    /**
         * Get a number of attributes on this element and return them in an object.
         *
         * @param {SVGElement} element The DOM element.
         * @param attr1, ... attrN a variable length list of attributes to retrieve
         *        from this element.
         * @return an object whose properties are the requested attribute values
         */
    getAttributes : function (element) {
        var result = {};
        var attribute;

        for (var i = 0; i < arguments.length; i++) {
            attribute = arguments[i];
            result[attribute] =
            element.getAttributeNS(
                Y.DOM.getAttributeNamespace(element, attribute), attribute);
        }

        return result;
    },

    /**
         * Wraps the DOM call to getBBox
         *
         */
    getBBox : function (element) {
        return element.getBBox();
    },

    /**
         * Utility to get the bounds of an object in the nearest viewport space.
         * @param {SVGElement} element The DOM element.
         */
    getViewportBBox : function (element) {
        var bbox = element.getBBox();
        var vBbox = null;
        var viewport = element.nearestViewportElement;
        var ctm = element.getTransformToElement(viewport);
        if (bbox !== null) {
            // This is one of the short-comings of SVG: there is no way to get
            // the bbox in the desired coordinate space. So we have to transform
            // the bounds and compute the box from that, which leads to
            // boxes which might be larger than needed (e.g., where there are
            // rotations). However, for common cases, this is doing the job.
            var points = [
            {
                x: bbox.x,
                y: bbox.y
            },

            {
                x: bbox.x + bbox.width,
                y: bbox.y
            },

            {
                x: bbox.x,
                y: bbox.y + bbox.height
            },

            {
                x: bbox.x + bbox.width,
                y: bbox.y + bbox.height
            }
            ];

            var tPoints = [
            {}, {}, {}, {}
            ];

            for (var i = 0; i < 4; i++) {
                ctm.transformPoint(points[i], tPoints[i]);
            }

            var minX = tPoints[0].x;
            var minY = tPoints[0].y;
            var maxX = tPoints[0].x;
            var maxY = tPoints[0].y;

            for (i = 1; i < 4; i++) {
                if (tPoints[i].x < minX) {
                    minX = tPoints[i].x;
                } else if (tPoints[i].x > maxX) {
                    maxX = tPoints[i].x;
                }

                if (tPoints[i].y < minY) {
                    minY = tPoints[i].y;
                } else if (tPoints[i].y > maxY) {
                    maxY = tPoints[i].y;
                }
            }

            vBbox = {
                x: minX,
                y: minY,
                width: maxX - minX,
                height: maxY - minY
            };
        }
        return vBbox;
    },

    /**
         * Determines whether a DOM element has the given className.
         * @method hasClass
         * @param {HTMLElement} element The DOM element.
         * @param {String} className the class name to search for
         * @return {Boolean} Whether or not the element has the given class.
         */
    hasClass: function(node, className) {
        var result = false;
        if (!className || className.baseVal === undefined) {
            result = superHasClass(node, className);
        } else {
            var re = Y.DOM._getRegExp('(?:^|\\s+)' +
                className + '(?:\\s+|$)');
            result = re.test(node.className.baseVal);
        }
        return result;
    },

    /**
         * Adds a class name to a given DOM element.
         * @method addClass
         * @param {HTMLElement} element The DOM element.
         * @param {String} className the class name to add to the class attribute
         */
    addClass: function(node, className) {
        if (!hasClass(node, className)) { // skip if already present
            var val = Y.Lang.trim([node.className, className].join(' '));
            if (!node.className || node.className.baseVal === undefined) {
                node.className = val;
            } else {
                node.className.baseVal = val;
            }
        }
    },

    /**
         * Removes a class name from a given element.
         * @method removeClass
         * @param {HTMLElement} element The DOM element.
         * @param {String} className the class name to remove from the class attribute
         */
    removeClass: function(node, className) {
        if (className && hasClass(node, className)) {

            if (node.className.baseVal === undefined) {
                node.className = Y.Lang.trim(node.className.replace(Y.DOM._getRegExp('(?:^|\\s+)' +
                    className + '(?:\\s+|$)'), ' '));
            } else {
                node.className.baseVal = Y.Lang.trim(node.className.baseVal.replace(Y.DOM._getRegExp('(?:^|\\s+)' +
                    className + '(?:\\s+|$)'), ' '));
            }

            if (hasClass(node, className) ) { // in case of multiple adjacent
                removeClass(node, className);
            }
        }
    },

    // =========================================================================
    // IMPORTANT: Need to override the following two methods because they use
    // in-scope references to removeClass and addClass
    // =========================================================================
    
    /**
         * Replace a class with another class for a given element.
         * If no oldClassName is present, the newClassName is simply added.
         * @method replaceClass
         * @param {HTMLElement} element The DOM element
         * @param {String} oldClassName the class name to be replaced
         * @param {String} newClassName the class name that will be replacing the old class name
         */
    replaceClass: function(node, oldC, newC) {
        //Y.log('replaceClass replacing ' + oldC + ' with ' + newC, 'info', 'Node');
        removeClass(node, oldC); // remove first in case oldC === newC
        addClass(node, newC);
    },

    /**
         * If the className exists on the node it is removed, if it doesn't exist it is added.
         * @method toggleClass
         * @param {HTMLElement} element The DOM element
         * @param {String} className the class name to be toggled
         * @param {Boolean} addClass optional boolean to indicate whether class
         * should be added or removed regardless of current state
         */
    toggleClass: function(node, className, force) {
        var add = (force !== undefined) ? force :
        !(hasClass(node, className));

        if (add) {
            addClass(node, className);
        } else {
            removeClass(node, className);
        }
    },

    /**
         * Wraps the play method call
         */
    play: function (element) {
        element.play();
    } ,

    /**
         * Sets a style property for a given element. This overrides the default
         * to allow custom properties to define their default unit (which can
         * be none, i.e., an empty string).
         *
         * @method setStyle
         * @param {HTMLElement} An HTMLElement to apply the style to.
         * @param {String} att The style property to set.
         * @param {String|Number} val The value.
         */
    setStyle: function(node, att, val, style) {
        style = style || node.style;
        var CUSTOM_STYLES = Y.DOM.CUSTOM_STYLES;

        if (style) {
            if (val === null || val === '') { // normalize unsetting
                val = '';
            } else if (!isNaN(Number(val)) &&
                (att.toLowerCase() in FORCE_UNIT)) {
                val += Y.DOM.DEFAULT_UNIT;
            }

            if (att in CUSTOM_STYLES) {
                if (CUSTOM_STYLES[att].set) {
                    CUSTOM_STYLES[att].set(node, val, style);
                    return; // NOTE: return
                } else if (typeof CUSTOM_STYLES[att] === 'string') {
                    att = CUSTOM_STYLES[att];
                }
            }
            style[att] = val;
        }
    }
        
}, true);

hasClass = Y.DOM.hasClass;
removeClass = Y.DOM.removeClass;
addClass = Y.DOM.addClass;


    /**
     * Matrix class.
     *
     * SVG has support for a matrix class, but it has a main issues:
     * its methods do not mutate the matrix and there is no option to
     * have methods which would mutate it. Also, the class has no support for
     * transforming points.
     *
     * Since it is bad practice to modify the prototype of DOM classes directly
     * the SVGMatrix class here provides a wrapper which will intercept calls
     * to the platform's matrix implementation and provide additional utility
     * methods such as <code>transformPoint</code>.
     */

    /**
     * @param m the wrapped SVGMatrix instance
     */
    Y.DOM.Matrix = function (m) {
        if (m === undefined || m === null) {
            m = defaultSVG.createSVGMatrix();
        }
        this._m = m;
    };
    
    Y.DOM.Matrix.prototype.transformPoint = function (p_pt, p_oResult) {
        var result = p_oResult, m = this._m;
        if (p_oResult === undefined) {
            result = {};
        }

        result.x = m.a * p_pt.x + m.c * p_pt.y + m.e;
        result.y = m.b * p_pt.x + m.d * p_pt.y + m.f;

        return result;
    };

    /**
     * Sets the matrix to identity
     */
    Y.DOM.Matrix.prototype.toIdentity = function () {
        var m = this._m;
        m.a = 1;
        m.b = 0;
        m.c = 0;
        m.d = 1;
        m.e = 0;
        m.f = 0;
        return this;
    };

var matrixMethods = [
"multiply",
"inverse",
"translate",
"scale",
"scaleNonUniform",
"rotate",
"rotateFromVector",
"flipX",
"flipY",
"skewX",
"skewY"
];

function getMatrixWrapper (fName) {
    return function () {
        var r = this._m[fName].apply(this._m, arguments),
        m = this._m;
        // Now, copy the result into this matrix to mutate it
        m.a = r.a;
        m.b = r.b;
        m.c = r.c;
        m.d = r.d;
        m.e = r.e;
        m.f = r.f;

        return this;
    };
}

for (var i = 0; i < matrixMethods.length; i++) {
    var fName = matrixMethods[i];
        Y.DOM.Matrix.prototype[fName] = getMatrixWrapper(fName);
}

/**
     * Wrap a/b/c/d/e/f access a function access to get the values.
     */
Y.each(['a', 'b', 'c', 'd', 'e', 'f'], function (member) {
    Y.DOM.Matrix.prototype[member] = function () {
        return this._m[member];
    };

    Y.DOM.Matrix.prototype['set' + member.toUpperCase()] = function (val) {
        this._m[member] = Number(val);
    };
});
