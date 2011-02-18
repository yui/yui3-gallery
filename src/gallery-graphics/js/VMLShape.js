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
        this._addListeners();
        this._draw();
    },
   
    /**
     * Creates the dom node for the shape.
     *
     * @private
     * @return HTMLElement
     */
    _getNode: function()
    {
        var node = this._createGraphicNode();
        node.setAttribute("id", this.get("id"));
        Y.one(node).addClass("yui3-" + this.name);
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
        this.after("strokeChange", this._strokeChangeHandler);
        this.after("fillChange", this._fillChangeHandler);
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
            dash = "",
            val,
            endcap,
            i = 0,
            len;
        if(stroke && stroke.weight && stroke.weight > 0)
        {
            strokeAlpha = stroke.alpha;
            dashstyle = stroke.dashstyle || "none";
            endcap = stroke.endcap || "flat";
            stroke.color = stroke.color || "#000000";
            stroke.weight = stroke.weight || 1;
            stroke.alpha = Y.Lang.isNumber(strokeAlpha) ? strokeAlpha : 1;
            node.stroked = true;
            node.endcap = endcap; 
            node.strokeColor = stroke.color;
            node.strokeWeight = stroke.weight + "px";
            if(!this._strokeNode)
            {
                this._strokeNode = this._createGraphicNode("stroke");
                node.appendChild(this._strokeNode);
            }
            this._strokeNode.opacity = stroke.alpha;
            if(Y.Lang.isArray(dashstyle))
            {
                dash = [];
                len = dashstyle.length;
                for(i = 0; i < len; ++i)
                {
                    val = dashstyle[i];
                    dash[i] = val / stroke.weight;
                }
            }
            this._strokeNode.dashstyle = dash;
        }
        else
        {
            node.stroked = false;
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
            fillNode,
            fillAlpha;
        if(fill)
        {
            fillAlpha = fill.alpha;
            if(!fill.color)
            {
                node.filled = false;
            }
            else if(Y.Lang.isNumber(fillAlpha))
            {
                fillAlpha = Math.max(Math.min(fillAlpha, 1), 0);
                if(!this._fillNode)
                {
                    this._fillNode = this._createGraphicNode("fill");
                    node.appendChild(this._fillNode);
                }
                fill.alpha = fillAlpha;
                this._fillNode.opacity = fillAlpha;
                this._fillNode.color = fill.color;
            }
            else
            {
                if(this._fillNode)
                {   
                    node.removeChild(this._fillNode);
                    this._fillNode = null;
                }
                node.fillColor = fill.color;
            }
        }
        else
        {
            node.filled = false;
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
        var node = this.get("node"),
            w = this.get("width"),
            h = this.get("height"),
            coordSize = node.coordSize;
        x = 0 - (coordSize.x/w * x);
        y = 0 - (coordSize.y/h * y);
        node.coordOrigin = x + "," + y;
    },

    /**
     * Applies a skew to the x-coordinate
     *
     * @method skewX:q
     * @param {Number} x x-coordinate
     */
     skewX: function(x)
     {
        //var node = this.get("node");
     },

    /**
     * Applies a skew to the x-coordinate
     *
     * @method skewX:q
     * @param {Number} x x-coordinate
     */
     skewY: function(y)
     {
        //var node = this.get("node");
     },

     /**
      * Applies a rotation.
      *
      * @method rotate
      * @param
      */
     rotate: function(deg, translate)
     {
        var node = this.get("node");
            node.style.rotation = deg;
     },
    
    /**
     * Applies a scale transform
     *
     * @method scale
     * @param {Number} val
     */
    scale: function(val)
    {
        //var node = this.get("node");
    },

    /**
     * Applies a matrix transformation
     *
     * @method matrix
     */
    matrix: function(a, b, c, d, e, f)
    {
        //var node = this.get("node");
    },

    /**
     * @private
     */
    _draw: function()
    {
        var node = this.get("node"),
            x = this.get("x"),
            y = this.get("y"),
            w = this.get("width"),
            h = this.get("height");
        node.style.position = "absolute";
        node.style.left = x + "px";
        node.style.top = y + "px";
        node.style.width = w + "px";
        node.style.height = h + "px";
        this._fillChangeHandler();
        this._strokeChangeHandler();
    },

    /**
     * Creates a graphic node
     *
     * @method _createGraphicNode
     * @param {String} type node type to create
     * @param {String} pe specified pointer-events value
     * @return HTMLElement
     * @private
     */
    _createGraphicNode: function(type)
    {
        type = type || this._type;
        return document.createElement('<' + type + ' xmlns="urn:schemas-microsft.com:vml" class="vml' + type + '"/>');
    }
 }, {
    ATTRS: {
        /**
         * Indicates the x position of shape.
         *
         * @attribute x
         * @type Number
         */
        x: {
            value: 0,

            setter: function(val)
            {
                var node = this.get("node");
                node.style.left = val + "px";
                return val;
            }
        },

        /**
         * Indicates the y position of shape.
         *
         * @attribute y
         * @type Number
         */
        y: {
            value: 0,

            setter: function(val)
            {
                var node = this.get("node");
                node.style.top = val + "px";
                return val;
            }
        },

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
         * 
         * @attribute width
         */
        width: {
            value: 0,

            setter: function(val)
            {
                var node = this.get("node");
                node.setAttribute("width", val);
                node.style.width = val + "px";
                return val;
            }
        },

        /**
         * 
         * @attribute height
         */
        height: {
            value: 0,

            setter: function(val)
            {
                var node = this.get("node");
                node.setAttribute("height", val);
                node.style.height = val + "px";
                return val;
            }
        },

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
                    dashstyle: "none",
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
        }
    }
});

