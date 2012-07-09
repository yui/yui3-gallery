/**
 * Draws circles
 */
 Y.Circle = Y.Base.create("circle", Y.Base, [Y.Shape], {
    /**
     * Indicates the type of shape
     *
     * @property _type
     * @readOnly
     * @type String
     */
    _type: "circle",

    /**
     * @private
     */
    _draw: function()
    {
        var radius = this.get("radius"),
            fill = this.get("fill"),
            stroke = this.get("stroke");
        if(radius)
        {
            this.drawCircle(0, 0, radius);
            this._paint();
        }
    },

    /**
     * @private
     */
    _addListeners: function()
    {
        this.after("radiusChange", this._updateHandler);
        Y.Shape.prototype._addListeners.apply(this, arguments);
    }
 }, {
    ATTRS: {
        /**
         * 
         * @attribute width
         * @readOnly
         */
        width: {
            readOnly:true,

            getter: function()
            {
                return this.get("radius") * 2;
            }
        },

        /**
         * 
         * @attribute height
         * @readOnly
         */
        height: {
            readOnly:true,

            getter: function()
            {
                return this.get("radius") * 2;
            }
        },

        /**
         * Radius of the circle
         *
         * @attribute radius
         */
        radius: {
            lazyAdd: false,

            setter: function(val)
            {
                var node = this.get("node"),
                    circum = val * 2;
                node.setAttribute("width", circum);
                node.setAttribute("height", circum);
                return val;
            }
        }
    }
 });
