/**
 * Utility class used for drawing lines.
 *
 * @class Lines
 * @constructor
 */
function Lines(){}

Lines.prototype = {
    /**
     * @private
     */
    _lineDefaults: null,
    
    /**
     * Creates a graphic in which to draw a series.
     *
     * @method _getGraphic
     * @return Graphic
     * @private
     */
    _getGraphic: function()
    {
        var graph = this.get("graph");
        if(!this._lineGraphic)
        {
            this._lineGraphic = new Y.Graphic();
            this._lineGraphic.render(graph.get("contentBox"));
        }
        this._lineGraphic.clear();
        this._lineGraphic.setSize(graph.get("width"), graph.get("height"));
        this.autoSize = false;
        return this._lineGraphic;
    },

    /**
     * Draws lines for the series.
     *
     * @method drawLines
     * @protected
     */
    drawLines: function()
    {
        if(this.get("xcoords").length < 1) 
        {
            return;
        }
        var xcoords = this.get("xcoords").concat(),
            ycoords = this.get("ycoords").concat(),
            direction = this.get("direction"),
            len = direction === "vertical" ? ycoords.length : xcoords.length,
            lastX,
            lastY,
            lastValidX = lastX,
            lastValidY = lastY,
            nextX,
            nextY,
            i,
            styles = this.get("styles").line,
            lineType = styles.lineType,
            lc = styles.color || this._getDefaultColor(this.get("graphOrder"), "line"),
            lineAlpha = styles.alpha,
            dashLength = styles.dashLength,
            gapSpace = styles.gapSpace,
            connectDiscontinuousPoints = styles.connectDiscontinuousPoints,
            discontinuousType = styles.discontinuousType,
            discontinuousDashLength = styles.discontinuousDashLength,
            discontinuousGapSpace = styles.discontinuousGapSpace,
            graphic = this._getGraphic();
        lastX = lastValidX = xcoords[0];
        lastY = lastValidY = ycoords[0];
        graphic.lineStyle(styles.weight, lc, lineAlpha);
        graphic.moveTo(lastX, lastY);
        for(i = 1; i < len; i = ++i)
        {
            nextX = xcoords[i];
            nextY = ycoords[i];
            if(isNaN(nextY))
            {
                lastValidX = nextX;
                lastValidY = nextY;
                continue;
            }
            if(lastValidX == lastX)
            {
                if(lineType != "dashed")
                {
                    graphic.lineTo(nextX, nextY);
                }
                else
                {
                    this.drawDashedLine(lastValidX, lastValidY, nextX, nextY, 
                                                dashLength, 
                                                gapSpace);
                }
            }
            else if(!connectDiscontinuousPoints)
            {
                graphic.moveTo(nextX, nextY);
            }
            else
            {
                if(discontinuousType != "solid")
                {
                    this.drawDashedLine(lastValidX, lastValidY, nextX, nextY, 
                                                discontinuousDashLength, 
                                                discontinuousGapSpace);
                }
                else
                {
                    graphic.lineTo(nextX, nextY);
                }
            }
        
            lastX = lastValidX = nextX;
            lastY = lastValidY = nextY;
        }
        graphic.end();
    },
    
    /**
     * Connects data points with a consistent curve for a series.
     * 
     * @method drawSpline
     * @protected
     */
    drawSpline: function()
    {
        if(this.get("xcoords").length < 1) 
        {
            return;
        }
        var xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            curvecoords = this.getCurveControlPoints(xcoords, ycoords),
            len = curvecoords.length,
            cx1,
            cx2,
            cy1,
            cy2,
            x,
            y,
            i = 0,
            styles = this.get("styles").line,
            graphic = this._getGraphic(),
            lineAlpha = styles.alpha,
            color = styles.color || this._getDefaultColor(this.get("graphOrder"), "line");
        graphic.lineStyle(styles.weight, color, lineAlpha);
        graphic.moveTo(xcoords[0], ycoords[0]);
        for(; i < len; i = ++i)
        {
            x = curvecoords[i].endx;
            y = curvecoords[i].endy;
            cx1 = curvecoords[i].ctrlx1;
            cx2 = curvecoords[i].ctrlx2;
            cy1 = curvecoords[i].ctrly1;
            cy2 = curvecoords[i].ctrly2;
            graphic.curveTo(cx1, cy1, cx2, cy2, x, y);
        }
        graphic.end();
    },

    /**
     * Draws a dashed line between two points.
     * 
     * @method drawDashedLine
     * @param {Number} xStart	The x position of the start of the line
     * @param {Number} yStart	The y position of the start of the line
     * @param {Number} xEnd		The x position of the end of the line
     * @param {Number} yEnd		The y position of the end of the line
     * @param {Number} dashSize	the size of dashes, in pixels
     * @param {Number} gapSize	the size of gaps between dashes, in pixels
     * @private
     */
    drawDashedLine: function(xStart, yStart, xEnd, yEnd, dashSize, gapSize)
    {
        dashSize = dashSize || 10;
        gapSize = gapSize || 10;
        var segmentLength = dashSize + gapSize,
            xDelta = xEnd - xStart,
            yDelta = yEnd - yStart,
            delta = Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta, 2)),
            segmentCount = Math.floor(Math.abs(delta / segmentLength)),
            radians = Math.atan2(yDelta, xDelta),
            xCurrent = xStart,
            yCurrent = yStart,
            i,
            graphic = this._getGraphic();
        xDelta = Math.cos(radians) * segmentLength;
        yDelta = Math.sin(radians) * segmentLength;
        
        for(i = 0; i < segmentCount; ++i)
        {
            graphic.moveTo(xCurrent, yCurrent);
            graphic.lineTo(xCurrent + Math.cos(radians) * dashSize, yCurrent + Math.sin(radians) * dashSize);
            xCurrent += xDelta;
            yCurrent += yDelta;
        }
        
        graphic.moveTo(xCurrent, yCurrent);
        delta = Math.sqrt((xEnd - xCurrent) * (xEnd - xCurrent) + (yEnd - yCurrent) * (yEnd - yCurrent));
        
        if(delta > dashSize)
        {
            graphic.lineTo(xCurrent + Math.cos(radians) * dashSize, yCurrent + Math.sin(radians) * dashSize);
        }
        else if(delta > 0)
        {
            graphic.lineTo(xCurrent + Math.cos(radians) * delta, yCurrent + Math.sin(radians) * delta);
        }
        
        graphic.moveTo(xEnd, yEnd);
    },

    /**
     * Default values for <code>styles</code> attribute.
     *
     * @method _getLineDefaults
     * @return Object
     * @protected
     */
    _getLineDefaults: function()
    {
        return {
            alpha: 1,
            weight: 6,
            lineType:"solid", 
            dashLength:10, 
            gapSpace:10, 
            connectDiscontinuousPoints:true, 
            discontinuousType:"solid", 
            discontinuousDashLength:10, 
            discontinuousGapSpace:10
        };
    }
};
Y.augment(Lines, Y.Attribute);
Y.Lines = Lines;
