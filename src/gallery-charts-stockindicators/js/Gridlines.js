/**
 * Gridlines draws gridlines on a Graph.
 *
 * @module gallery-charts-stockindicators
 * @class Gridlines
 * @constructor
 * @extends Base
 * @uses Renderer
 * @param {Object} config (optional) Configuration parameters.
 */
Y.Gridlines = Y.Base.create("gridlines", Y.Base, [Y.Renderer], {
    /**
     * Reference to the `Path` element used for drawing Gridlines.
     *
     * @property _path
     * @type Path
     * @private
     */
    _path: null,

    /**
     * Removes the Gridlines.
     *
     * @method remove
     * @private
     */
    remove: function()
    {
        var path = this._path;
        if(path)
        {
            path.destroy();
        }
    },

    /**
     * Draws the gridlines
     *
     * @method draw
     * @param {Number} width The width of the area in which the gridlines will be drawn.
     * @param {Number} height The height of the area in which the gridlines will be drawn.
     * @param {Number} startIndex The index in which to start drawing fills (if specified). The default
     * value is 0.
     * @param {Number} interval The number gaps between fills (if specified). The default value is 2. A value of 1
     * would result in a solid fill across the area.
     * @protected
     */
    draw: function()
    {
        if(this.get("axis") && this.get("graphic"))
        {
            this._drawGridlines.apply(this, arguments);
        }
    },

    /**
     * Algorithm for drawing gridlines
     *
     * @method _drawGridlines
     * @param {Number} width The width of the area in which the gridlines will be drawn.
     * @param {Number} height The height of the area in which the gridlines will be drawn.
     * @param {Number} startIndex The index in which to start drawing fills (if specified). The default
     * value is 0.
     * @param {Number} interval The number gaps between fills (if specified). The default value is 2. A value of 1
     * would result in a solid fill across the area.
     * @private
     */
    _drawGridlines: function(w, h, startIndex, interval)
    {
        var path = this._path,
            axis = this.get("axis"),
            axisPosition = axis.get("position"),
            points,
            direction = this.get("direction"),
            graphic = this.get("graphic"),
            fill = this.get("styles").fill,
            border = this.get("styles").border,
            line = this.get("styles").line,
            stroke = fill && border ? border : line,
            cfg,
            lineFunction;
        startIndex = startIndex || 0;
        interval = interval || 2;
        if(isFinite(w) && isFinite(h) && w > 0 && h > 0)
        {
            if(axisPosition !== "none" && axis && axis.get("tickPoints"))
            {
                points = axis.get("tickPoints");
            }
            else
            {
                points = this._getPoints(axis.get("styles").majorUnit.count, w, h);
            }
            if(path)
            {
                path.set("width", w);
                path.set("height", h);
                path.set("stroke", stroke);
                if(fill) {
                    path.set("fill", fill);
                }
            }
            else
            {
                cfg = {
                    type: "path",
                    width: w,
                    stroke: stroke,
                    height: h
                };
                if(fill) {
                    cfg.fill = fill;
                }
                path = graphic.addShape(cfg);
                path.addClass("yui3-gridlines");
                this._path = path;
            }
            if(direction === "vertical")
            {
                lineFunction = fill ? this._verticalFill : this._verticalLine;
                lineFunction(path, points, h, startIndex, interval, w);
            }
            else
            {
                lineFunction = fill ? this._horizontalFill : this._horizontalLine;
                lineFunction(path, points, w, startIndex, interval, h);
            }
            path.end();
        }
    },

    /**
     * Calculates the coordinates for the gridlines based on a count.
     *
     * @method _getPoints
     * @param {Number} count Number of gridlines
     * @return Array
     * @private
     */
    _getPoints: function(count, w, h)
    {
        var i,
            points = [],
            multiplier,
            divisor = count - 1;
        for(i = 0; i < count; i = i + 1)
        {
            multiplier = i/divisor;
            points[i] = {
                x: w * multiplier,
                y: h * multiplier
            };
        }
        return points;
    },

    /**
     * Algorithm for horizontal lines.
     *
     * @method _horizontalLine
     * @param {Path} path Reference to path element
     * @param {Object} pt Coordinates corresponding to a major unit of an axis.
     * @param {Number} w Width of the Graph
     * @private
     */
    _horizontalLine: function(path, points, width)
    {
        var i,
            len = points.length,
            y;
        for(i = 0; i < len; i = i + 1)
        {
            y = points[i].y;
            path.moveTo(0, y);
            path.lineTo(width, y);
        }
    },

    /**
     * Algorithm for vertical lines.
     *
     * @method _verticalLine
     * @param {Path} path Reference to path element
     * @param {Object} pt Coordinates corresponding to a major unit of an axis.
     * @param {Number} h Height of the Graph
     * @private
     */
    _verticalLine: function(path, points, height)
    {
        var i,
            len = points.length,
            x;
        for(i = 0; i < len; i = i + 1)
        {
            x = points[i].x;
            path.moveTo(x, 0);
            path.lineTo(x, height);
        }
    },

    /**
     * Algorithm for horizontal fills.
     *
     * @method _horizontalFill
     * @param {Path} path Reference to the path element
     * @param {Object} points Coordinates corresponding to a major unit of an axis.
     * @param {Number} width Width of the fill.
     * @param {Number} startIndex Indicates the index in which to start drawing fills.
     * @param {Number} interval Indicates the interval between fills.
     * @param {Number} height Height of the graph.
     * @private
     */
    _horizontalFill: function(path, points, width, startIndex, interval, height)
    {
        var i,
            y1,
            y2,
            len = points.length;
        for(i = startIndex; i < len; i = i + interval)
        {
            y1 = points[i].y;
            y2 = i < len - 1 ? points[i + 1].y : height;
            path.moveTo(0, y1);
            path.lineTo(0, y2);
            path.lineTo(width, y2);
            path.lineTo(width, y1);
            path.lineTo(0, y1);
            path.closePath();
        }
    },

    /**
     * Algorithm for vertical fills.
     *
     * @method _verticalFill
     * @param {Path} path Reference to the path element
     * @param {Object} points Coordinates corresponding to a major unit of an axis.
     * @param {Number} height Height of the fill.
     * @param {Number} startIndex Indicates the index in which to start drawing fills.
     * @param {Number} interval Indicates the interval between fills.
     * @param {Number} width Width of the graph.
     * @private
     */
    _verticalFill: function(path, points, height, startIndex, interval, width)
    {
        var i,
            x1,
            x2,
            len = points.length;
        for(i = startIndex; i < len; i = i + interval)
        {
            x1 = points[i].x;
            x2 = i < len - 1 ? points[i + 1].x : width;
            path.moveTo(x1, 0);
            path.lineTo(x2, 0);
            path.lineTo(x2, height);
            path.lineTo(x1, height);
            path.lineTo(x1, 0);
            path.closePath();
        }
    },

    /**
     * Gets the default value for the `styles` attribute. Overrides
     * base implementation.
     *
     * @method _getDefaultStyles
     * @return Object
     * @protected
     */
    _getDefaultStyles: function()
    {
        var defs = {
            line: {
                color:"#f0efe9",
                weight: 1,
                alpha: 1
            },
            fill: null
        };
        return defs;
    }
},
{
    ATTRS: {
        /**
         * Indicates the direction of the gridline.
         *
         * @attribute direction
         * @type String
         */
        direction: {},

        /**
         * Indicate the `Axis` in which to bind
         * the gridlines.
         *
         * @attribute axis
         * @type Axis
         */
        axis: {},

        /**
         * Indicates the `Graphic` in which the gridlines
         * are drawn.
         *
         * @attribute graphic
         * @type Graphic
         */
        graphic: {},

        /**
         * Indicates the number of gridlines to display. If no value is set, gridlines will equal the number of ticks in
         * the corresponding axis.
         *
         * @attribute count
         * @type Number
         */
        count: {}
    }
});
