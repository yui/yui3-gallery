/**
 * Draws rectangles
 */
 Y.Rect = Y.Base.create("rect", Y.Shape, [], {
    /**
     * Indicates the type of shape
     *
     * @property _type
     * @readOnly
     * @type String
     */
    _type: "rect",

    /**
     * @private
     */
    _draw: function()
    {
        var x = this.get("x"),
            y = this.get("y"),
            w = this.get("width"),
            h = this.get("height"),
            fill = this.get("fill"),
            stroke = this.get("stroke");
        this.drawRect(x, y, w, h);
        this._paint();
    }
 });
