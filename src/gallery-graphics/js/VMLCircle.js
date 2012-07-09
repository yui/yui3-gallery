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
    _type: "oval"
 }, {
    ATTRS: {
        /**
         * Horizontal radius for the circle.
         *
         * @attribute radius
         * @type Number
         */
        radius: {
            lazyAdd: false,

            value: 0,

            setter: function(val)
            {
                var node = this.get("node"),
                    size = val * 2;
                node.style.width = size + "px";
                node.style.height = size + "px";
                return val;
            }
        },

        /**
         * Width of the circle
         *
         * @attribute width
         * @readOnly
         * @type Number
         */
        width: {
            readOnly: true,

            getter: function()
            {   
                var radius = this.get("radius"),
                val = radius && radius > 0 ? radius * 2 : 0;
                return val;
            }
        },

        /**
         * Width of the circle
         *
         * @attribute width
         * @readOnly
         * @type Number
         */
        height: {
            readOnly: true,

            getter: function()
            {   
                var radius = this.get("radius"),
                val = radius && radius > 0 ? radius * 2 : 0;
                return val;
            }
        }
    }
 });
