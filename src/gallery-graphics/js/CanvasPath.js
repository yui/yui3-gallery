/**
 * The Path class creates a graphic object with editable 
 * properties.
 *
 * @class Path
 * @extends Shape
 */
Y.Path = Y.Base.create("path", Y.Shape, [], {
    /**
     * Indicates the type of shape
     *
     * @property _type
     * @readOnly
     * @type String
     */
    _type: "path",

    /**
     * @private
     */
    _addListeners: function() {},

    /**
     * @private
     */
    _draw: function()
    {
        this._paint();
    },

    /**
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function()
    {
        this._draw();
    }
}, {
    ATTRS: {
        /**
         * 
         * @attribute width
         */
        width: {
            getter: function()
            {
                return this._width;
            },

            setter: function(val)
            {
                this._width = val;
                return val;
            }
        },

        /**
         * 
         * @attribute height
         */
        height: {
            getter: function()
            {
                return this._height;
            },

            setter: function(val)
            {
                this._height = val;
                return val;
            }
        },
        
        /**
         * Indicates the path used for the node.
         *
         * @attribute path
         * @type String
         */
        path: {
            getter: function()
            {
                return this._path;
            },

            setter: function(val)
            {
                this._path = val;
                return val;
            }
        }
    }
});
