    if(Y.CandlestickSeries) {
        Y.RangeSeries.prototype._getDefaultStyles = function()
        {
            var styles = {
                spacing: 3
            };
            return this._mergeStyles(styles, Y.RangeSeries.superclass._getDefaultStyles());
        };
        Y.CandlestickSeries.prototype._calculateMarkerWidth = function(width, count, spacing)
        {
            var val = 0;
            while(val < 3 && spacing > -1)
            {
                spacing = spacing - 1;
                val = Math.round(width/count - spacing);
                if(val % 2 === 0) {
                    val = val - 1;
                }
            }
            return Math.max(1, val);
        };
        Y.CandlestickSeries.prototype.drawSeries = function()
        {
            var xcoords = this.get("xcoords"),
                ycoords = this.get("ycoords"),
                styles = this.get("styles"),
                padding = styles.padding,
                len = xcoords.length,
                dataWidth = this.get("width") - (padding.left + padding.right),
                keys = this.get("ohlckeys"),
                opencoords = ycoords[keys.open],
                highcoords = ycoords[keys.high],
                lowcoords = ycoords[keys.low],
                closecoords = ycoords[keys.close],
                width = this._calculateMarkerWidth(dataWidth, len, styles.spacing),
                halfwidth = width/2;
            this._drawMarkers(xcoords, opencoords, highcoords, lowcoords, closecoords, len, width, halfwidth, styles);
        };
        Y.CandlestickSeries.prototype._drawMarkers = function(xcoords, opencoords, highcoords, lowcoords, closecoords, len, width, halfwidth, styles)
        {
            var upcandle = this.get("upcandle"),
                downcandle = this.get("downcandle"),
                candle,
                wick = this.get("wick"),
                wickStyles = styles.wick,
                wickWidth = wickStyles.width,
                cx,
                opencoord,
                highcoord,
                lowcoord,
                closecoord,
                left,
                right,
                top,
                bottom,
                height,
                leftPadding = styles.padding.left,
                up,
                i,
                isNumber = Y.Lang.isNumber;
            upcandle.set(styles.upcandle);
            downcandle.set(styles.downcandle);
            wick.set({
                fill: wickStyles.fill,
                stroke: wickStyles.stroke,
                shapeRendering: wickStyles.shapeRendering
            });
            upcandle.clear();
            downcandle.clear();
            wick.clear();
            for(i = 0; i < len; i = i + 1)
            {
                cx = Math.round(xcoords[i] + leftPadding);
                left = cx - halfwidth;
                right = cx + halfwidth;
                opencoord = Math.round(opencoords[i]);
                highcoord = Math.round(highcoords[i]);
                lowcoord = Math.round(lowcoords[i]);
                closecoord = Math.round(closecoords[i]);
                up = opencoord > closecoord;
                top = up ? closecoord : opencoord;
                bottom = up ? opencoord : closecoord;
                height = bottom - top;
                candle = up ? upcandle : downcandle;
                if(candle && isNumber(left) && isNumber(top) && isNumber(width) && isNumber(height))
                {
                    candle.drawRect(left, top, width, height);
                }
                if(isNumber(cx) && isNumber(highcoord) && isNumber(lowcoord))
                {
                    wick.drawRect(cx - wickWidth/2, highcoord, wickWidth, lowcoord - highcoord);
                }
            }
            upcandle.end();
            downcandle.end();
            wick.end();
            wick.toBack();
        };
        Y.CandlestickSeries.prototype._getDefaultStyles = function()
        {
            var styles = {
                upcandle: {
                    shapeRendering: "crispEdges",
                    fill: {
                        color: "#00aa00",
                        alpha: 1
                    },
                    stroke: {
                        color: "#000000",
                        alpha: 1,
                        weight: 0
                    }
                },
                downcandle: {
                    shapeRendering: "crispEdges",
                    fill: {
                        color: "#aa0000",
                        alpha: 1
                    },
                    stroke: {
                        color: "#000000",
                        alpha: 1,
                        weight: 0
                    }
                },
                wick: {
                    shapeRendering: "crispEdges",
                    width: 1,
                    fill: {
                        color: "#000000",
                        alpha: 1
                    },
                    stroke: {
                        color: "#000000",
                        alpha: 1,
                        weight: 0
                    }
                }
            };
            return this._mergeStyles(styles, Y.CandlestickSeries.superclass._getDefaultStyles());
        };
    }

