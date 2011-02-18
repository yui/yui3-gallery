/**
 * Base class for creating shapes.
 *
 * @class Shape
 */
 Y.Shape = Y.Base.create("shape", Y.Base, [], {
    /**
     * Initializes the shape
     *
     * @private
     * @method _initialize
     */
    initializer: function()
    {
        this.publish("shapeUpdate");
        this._addListeners();
    },
   
    /**
     * Creates the dom node for the shape.
     *
     * @private
     * @return HTMLElement
     */
    _getNode: function()
    {
        var node = document.createElementNS("http://www.w3.org/2000/svg", "svg:" + this._type),
            v = this.get("pointerEvents") || "none";
        node.setAttribute("pointer-events", v);
        node.setAttribute("class", "yui3-" + this.name);
        node.setAttribute("id", this.get("id"));
        return node;
    },

    /**
     * Adds change listeners to the shape.
     *
     * @private
     * @method _addListeners
     */
    _addListeners: function()
    {
        this.after("initializedChange", this._updateHandler);
        this.after("strokeChange", this._updateHandler);
        this.after("fillChange", this._updateHandler);
        this.after("widthChange", this._updateHandler);
        this.after("heightChange", this._updateHandler);
        this.after("xChange", this._updateHandler);
        this.after("yChange", this._updateHandler);
    },
    
    /**
     * Adds a stroke to the shape node.
     *
     * @method _strokeChangeHandler
     * @private
     */
    _strokeChangeHandler: function(e)
    {
        var node = this.get("node"),
            stroke = this.get("stroke"),
            strokeAlpha,
            dashstyle,
            dash,
            i, 
            len,
            space;
        if(stroke && stroke.weight && stroke.weight > 0)
        {
            strokeAlpha = stroke.alpha;
            dashstyle = stroke.dashstyle || "none";
            dash = Y.Lang.isArray(dashstyle) ? dashstyle.toString() : dashstyle;
            stroke.color = stroke.color || "#000000";
            stroke.weight = stroke.weight || 1;
            stroke.alpha = Y.Lang.isNumber(strokeAlpha) ? strokeAlpha : 1;
            stroke.linecap = stroke.linecap || "butt";
            node.setAttribute("stroke-dasharray", dash);
            node.setAttribute("stroke", stroke.color);
            node.setAttribute("stroke-linecap", stroke.linecap);
            node.setAttribute("stroke-width",  stroke.weight);
            node.setAttribute("stroke-opacity", stroke.alpha);
        }
        else
        {
            node.setAttribute("stroke", "none");
        }
    },
    
    /**
     * Adds a fill to the shape node.
     *
     * @method _fillChangeHandler
     * @private
     */
    _fillChangeHandler: function(e)
    {
        var node = this.get("node"),
            fill = this.get("fill"),
            fillAlpha;
        if(fill)
        {
            if(fill.type === "linear" || fill.type === "radial")
            {
                this.beginGradientFill(fill);
                //node.appendChild(this._getFill());
            }
            else if(fill.type === "bitmap")
            {
                this.beginBitmapFill(fill);
                //node.appendChild(this._getFill());
            }
            else
            {
                if(!fill.color)
                {
                    node.setAttribute("fill", "none");
                }
                else
                {
                    fillAlpha = fill.alpha; 
                    fill.alpha = Y.Lang.isNumber(fillAlpha) ? fillAlpha : 1;
                    node.setAttribute("fill", fill.color);
                    node.setAttribute("fill-opacity", fillAlpha);
                }
            }
        }
        else
        {
            node.setAttribute("fill", "none");
        }
    },

    /**
     * Applies translate transformation.
     *
     * @method translate
     * @param {Number} x The x-coordinate
     * @param {Number} y The y-coordinate
     */
    translate: function(x, y)
    {
        this._translateX = x;
        this._translateY = y;
        this._translate.apply(this, arguments);
    },

    /**
     * Applies translate transformation.
     *
     * @method translate
     * @param {Number} x The x-coordinate
     * @param {Number} y The y-coordinate
     * @protected
     */
    _translate: function(x, y)
    {
        var node = this.get("node"),
            translate = "translate(" + x + ", " + y + ")",
            transform = node.getAttribute("transform");
        this._updateTransform("translate", /translate\(.*\)/, translate);
    },

    /**
     * Applies a skew to the x-coordinate
     *
     * @method skewX:q
     * @param {Number} x x-coordinate
     */
     skewX: function(x)
     {
        var skewX= "skewX(" + x + ")";
        this._updateTransform("skewX", /skewX\(.*\)/, skewX);
     },

    /**
     * Applies a skew to the x-coordinate
     *
     * @method skewX:q
     * @param {Number} x x-coordinate
     */
     skewY: function(y)
     {
        var skewY = "skewY(" + y + ")";
        this._updateTransform("skewY", /skewY\(.*\)/, skewY);
     },

     /**
      * Applies a rotation.
      *
      * @method rotate
      * @param
      */
     rotate: function(deg, translate)
     {
        var w = this.get("width") * 0.5,
            h = this.get("height") * 0.5;
        translate = translate || w + "," + h;
        var rotate = "rotate(" + deg + "," + translate + ")";
        this._updateTransform("rotate", /rotate\(.*\)/, rotate);
     },

    /**
     * Applies a scale transform
     *
     * @method scale
     * @param {Number} val
     */
    scale: function(val)
    {
        var scale = "scale(" + val + ")";
        this._updateTransform("scale", /scale\(.*\)/, scale);
    },

    /**
     * Applies a matrix transformation
     *
     * @method matrix
     */
    matrix: function(a, b, c, d, e, f)
    {
        var matrix = "matrix(" + a + ", " + b + ", " + c + ", " + d + ", " + e + ", " + f + ")";
        this._updateTransform("matrix", /matrix\(.*\)/, matrix);
    },

    /**
     * @private
     */
    _updateTransform: function(type, test, val)
    {
        var node = this.get("node"),
            transform = node.getAttribute("transform");
        if(transform && transform.length > 0)
        {
            if(transform.indexOf(type) > -1)
            {
                transform = transform.replace(test, val);
            }
            else
            {
                transform += " " + val;
            }
        }
        else
        {
            transform = val;
        }
        node.setAttribute("transform", transform);
        this.fire("shapeUpdate");
    },

    /**
     * Updates the shape.
     *
     * @method _draw
     * @private
     */
    _draw: function()
    {
        var node = this.get("node");
        node.setAttribute("width", this.get("width"));
        node.setAttribute("height", this.get("height"));
        node.setAttribute("x", this.get("x"));
        node.setAttribute("y", this.get("y"));
        node.style.left = this.get("x") + "px";
        node.style.top = this.get("y") + "px";
        this._fillChangeHandler();
        this._strokeChangeHandler();
    },

    /**
     * Change event listener
     *
     * @private
     * @method _updateHandler
     */
    _updateHandler: function(e)
    {
        this._draw();
        this.fire("shapeUpdate");
    },
    
    /**
     * Storage for translateX
     *
     * @private
     */
    _translateX: 0,

    /**
     * Storage for translateY
     *
     * @private
     */
    _translateY: 0,

    /**
     * Returns the bounds for a shape.
     *
     * @method getBounds
     * @return Object
     */
    getBounds: function()
    {
        var w = this.get("width"),
            h = this.get("height"),
            stroke = this.get("stroke"),
            x = this.get("x"),
            y = this.get("y"),
            wt = 0,
            tx = this.get("translateX"),
            ty = this.get("translateY"),
            bounds = {};
        if(stroke && stroke.weight)
        {
            wt = stroke.weight;
        }
        bounds.left = x - wt + tx;
        bounds.top = y - wt + ty;
        bounds.right = x + w + wt + tx;
        bounds.bottom = y + h + wt + ty;
        return bounds;
    }
 }, {
    ATTRS: {
        /**
         * Dom node of the shape
         *
         * @attribute node
         * @type HTMLElement
         * @readOnly
         */
        node: {
            readOnly: true,

            valueFn: "_getNode" 
        },

        /**
         * Unique id for class instance.
         *
         * @attribute id
         * @type String
         */
        id: {
            valueFn: function()
            {
                return Y.guid();
            },

            setter: function(val)
            {
                var node = this.get("node");
                node.setAttribute("id", val);
                return val;
            }
        },

        /**
         * Indicates the x position of shape.
         *
         * @attribute x
         * @type Number
         */
        x: {
            value: 0
        },

        /**
         * Indicates the y position of shape.
         *
         * @attribute y
         * @type Number
         */
        y: {
            value: 0
        },

        /**
         * 
         * @attribute width
         */
        width: {},

        /**
         * 
         * @attribute height
         */
        height: {},

        /**
         * Indicates whether the shape is visible.
         *
         * @attribute visible
         * @type Boolean
         */
        visible: {
            value: true,

            setter: function(val){
                var visibility = val ? "visible" : "hidden";
                this.get("node").style.visibility = visibility;
                return val;
            }
        },

        /**
         * Contains information about the fill of the shape. 
         *  <dl>
         *      <dt>color</dt><dd>The color of the fill.</dd>
         *      <dt>alpha</dt><dd>Number between 0 and 1 that indicates the opacity of the fill. The default value is 1.</dd>
         *  </dl>
         *
         * @attribute fill
         * @type Object 
         */
        fill: {
            setter: function(val)
            {
                var tmpl = this.get("fill") || this._getAttrCfg("fill").defaultValue;
                return (val) ? Y.merge(tmpl, val) : null;
            }
        },

        /**
         * Contains information about the stroke of the shape.
         *  <dl>
         *      <dt>color</dt><dd>The color of the stroke.</dd>
         *      <dt>weight</dt><dd>Number that indicates the width of the stroke.</dd>
         *      <dt>alpha</dt><dd>Number between 0 and 1 that indicates the opacity of the stroke. The default value is 1.</dd>
         *      <dt>dashstyle</dt>Indicates whether to draw a dashed stroke. When set to "none", a solid stroke is drawn. When set to an array, the first index indicates the
         *      length of the dash. The second index indicates the length of gap.
         *  </dl>
         *
         * @attribute stroke
         * @type Object
         */
        stroke: {
            valueFn: function() {
                return {
                    weight: 1,
                    dashstyle: null,
                    color: "#000",
                    alpha: 1.0
                };
            },

            setter: function(val)
            {
                var tmpl = this.get("stroke") || this._getAttrCfg("stroke").defaultValue;
                return (val) ? Y.merge(tmpl, val) : null;
            }
        },
        
        /**
         * Indicates whether or not the instance will size itself based on its contents.
         *
         * @attribute autoSize 
         * @type Boolean
         */
        autoSize: {
            value: false
        },

        /**
         * Determines whether the instance will receive mouse events.
         * 
         * @attribute pointerEvents
         * @type string
         */
        pointerEvents: {
            value: "visiblePainted"
        },

        /**
         * Performs a translate on the x-coordinate. When translating x and y coordinates,
         * use the <code>translate</code> method.
         *
         * @attribute translateX
         * @type Number
         */
        translateX: {
            getter: function()
            {
                return this._translateX;
            },

            setter: function(val)
            {
                this._translateX = val;
                this._transform(val, this._translateY);
                return val;
            }
        },
        
        /**
         * Performs a translate on the y-coordinate. When translating x and y coordinates,
         * use the <code>translate</code> method.
         *
         * @attribute translateX
         * @type Number
         */
        translateY: {
            getter: function()
            {
                return this._translateY;
            },

            setter: function(val)
            {
                this._translateY = val;
                this._transform(this._translateX, val);
                return val;
            }
        },

        /**
         * Reference to the container Graphic.
         *
         * @attribute graphic
         * @type Graphic
         */
        graphic: {
            setter: function(val){
                this.after("shapeUpdate", Y.bind(val.updateCoordSpace, val));
                return val;
            }
        }
    }
});

