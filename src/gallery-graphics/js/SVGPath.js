/**
 * The Path class creates a shape through the use of drawing methods.
 *
 * @class Path
 * @extends Shape
 */
Y.Path = Y.Base.create("path", Y.Shape, [Y.Drawing], {
    /**
     * Left edge of the path
     *
     * @private
     */
    _left: 0,

    /**
     * Right edge of the path
     *
     * @private
     */
    _right: 0,
    
    /**
     * Top edge of the path
     *
     * @private
     */
    _top: 0, 
    
    /**
     * Bottom edge of the path
     *
     * @private
     */
    _bottom: 0,

    /**
     * Indicates the type of shape
     *
     * @property _type
     * @readOnly
     * @type String
     */
    _type: "path",

    /**
     * Draws the path.
     *
     * @method _draw
     * @private
     */
    _draw: function()
    {
        var pathArray = this._pathArray,
            segmentArray,
            pathType,
            len,
            val,
            val2,
            i,
            path = this.get("path"),
            node = this.get("node"),
            tx = this.get("translateX"),
            ty = this.get("translateY"),
            left = this._left,
            top = this._top;
        while(pathArray && pathArray.length > 0)
        {
            segmentArray = pathArray.shift();
            len = segmentArray.length;
            pathType = segmentArray[0];
            path += " " + pathType + (segmentArray[1] - left);
            switch(pathType)
            {
                case "L" :
                case "M" :
                    for(i = 2; i < len; ++i)
                    {
                        val = (i % 2 === 0) ? top : left;
                        val = segmentArray[i] - val;
                        path += ", " + val;
                    }
                break;
                case "Q" :
                case "C" :
                    for(i = 2; i < len; ++i)
                    {
                        val = (i % 2 === 0) ? top : left;
                        val2 = segmentArray[i];
                        val2 -= val;
                        path += " " + val2;
                    }
                break;

            }
        }
        if(this._fill)
        {
            path += 'z';
        }
        node.setAttribute("d", path);
        this._translate(left + tx, top + ty);
        this.set("path", path);
        this._fillChangeHandler();
        this._strokeChangeHandler();
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
        var node = this.get("node");
        this._translateX = x;
        this._translateY = y;
        this._translate(x, y);
        this._translate(this._left + x, this._top + y);
    },
    
    /**
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function()
    {
        this._draw();
        this.fire("shapeUpdate");
    },

    /**
     * Clears the path.
     *
     * @method clear
     */
    clear: function()
    {
        this._left = 0;
        this._right = 0;
        this._top = 0;
        this._bottom = 0;
        this.set("path", "");
    },

    /**
     * Returns the bounds for a shape.
     *
     * @method getBounds
     * @return Object
     */
    getBounds: function()
    {
        var wt = 0,
            bounds = {},
            stroke = this.get("stroke"),
            tx = this.get("translateX"),
            ty = this.get("translateY");
        if(stroke && stroke.weight)
        {
            wt = stroke.weight;
        }
        bounds.left = this._left - wt - tx;
        bounds.top = this._top - wt - ty;
        bounds.right = (this._right - this._left) + wt - tx;
        bounds.bottom = (this._bottom - this._top) + wt - ty;
        return bounds;
    }
}, {
    ATTRS: {
        path: {
            value: ""
        },

        width: {
            getter: function()
            {
                var rt = this._right,
                    lft = this._left,
                    val = Math.max(this._right - this._left, 0);
                return val;
            }
        },

        height: {
            getter: function()
            {
                return Math.max(this._bottom - this._top, 0);
            }
        }
    }
});
