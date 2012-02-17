/**
 * Draws an circle
 */
 Y.Circle = Y.Base.create("circle", Y.Shape, [], {
    /**
     * Indicates the type of shape
     *
     * @property _type
     * @readOnly
     * @type String
     */
    _type: "circle",

    /**
     * Adds change listeners to the shape.
     *
     * @private
     * @method _addListeners
     */
    _addListeners: function()
    {
        Y.Circle.superclass._addListeners.apply(this);
        this.after("radiusChange", this._updateHandler);
    },

    /**
     * Updates the shape.
     *
     * @method _draw
     * @private
     */
    _draw: function()
    {
        var node = this.get("node"),
            x = this.get("x"),
            y = this.get("y"),
            radius = this.get("radius"),
            cx = x + radius,
            cy = y + radius;
        node.setAttribute("r", radius);
        node.setAttribute("cx", cx);
        node.setAttribute("cy", cy);
        this._fillChangeHandler();
        this._strokeChangeHandler();
        this._updateTransform();
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
            value: 0
        }
    }
 });
