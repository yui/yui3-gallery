    if(Y.ColumnSeries) {
        Y.ColumnSeries.prototype._copyObject = COPYOBJECT;
        Y.ColumnSeries.prototype._createMarker = CREATEMARKER;
        Y.ColumnSeries.prototype.drawSeries = function()
        {
            if(this.get("xcoords").length < 1)
            {
                return;
            }
            var style = this._copyObject(this.get("styles").marker),
                graphic = this.get("graphic"),
                setSize,
                calculatedSize,
                xcoords = this.get("xcoords"),
                ycoords = this.get("ycoords"),
                i = 0,
                len = xcoords.length,
                top = ycoords[0],
                seriesTypeCollection = this.get("seriesTypeCollection"),
                seriesLen = seriesTypeCollection ? seriesTypeCollection.length : 0,
                seriesSize = 0,
                totalSize = 0,
                offset = 0,
                ratio,
                renderer,
                order = this.get("order"),
                graphOrder = this.get("graphOrder"),
                left,
                marker,
                setSizeKey,
                calculatedSizeKey,
                config,
                fillColors = null,
                borderColors = null,
                xMarkerPlane = [],
                yMarkerPlane = [],
                xMarkerPlaneLeft,
                xMarkerPlaneRight,
                yMarkerPlaneTop,
                yMarkerPlaneBottom,
                dimensions = {
                    width: [],
                    height: []
                },
                xvalues = [],
                yvalues = [],
                groupMarkers = this.get("groupMarkers");
            if(Y.Lang.isArray(style.fill.color))
            {
                fillColors = style.fill.color.concat();
            }
            if(Y.Lang.isArray(style.border.color))
            {
                borderColors = style.border.color.concat();
            }
            if(this.get("direction") === "vertical")
            {
                setSizeKey = "height";
                calculatedSizeKey = "width";
            }
            else
            {
                setSizeKey = "width";
                calculatedSizeKey = "height";
            }
            setSize = style[setSizeKey];
            calculatedSize = style[calculatedSizeKey];
            this._createMarkerCache();
            this._maxSize = graphic.get(setSizeKey);
            if(seriesTypeCollection && seriesLen > 1)
            {
                for(; i < seriesLen; ++i)
                {
                    renderer = seriesTypeCollection[i];
                    seriesSize += renderer.get("styles").marker[setSizeKey];
                    if(order > i)
                    {
                        offset = seriesSize;
                    }
                }
                totalSize = len * seriesSize;
                if(totalSize > this._maxSize)
                {
                    ratio = graphic.get(setSizeKey)/totalSize;
                    seriesSize *= ratio;
                    offset *= ratio;
                    setSize *= ratio;
                    setSize = Math.max(setSize, 1);
                    this._maxSize = setSize;
                }
            }
            else
            {
                seriesSize = style[setSizeKey];
                totalSize = len * seriesSize;
                if(totalSize > this._maxSize)
                {
                    seriesSize = this._maxSize/len;
                    this._maxSize = seriesSize;
                }
            }
            offset -= seriesSize/2;
            for(i = 0; i < len; ++i)
            {
                xMarkerPlaneLeft = xcoords[i] - seriesSize/2;
                xMarkerPlaneRight = xMarkerPlaneLeft + seriesSize;
                yMarkerPlaneTop = ycoords[i] - seriesSize/2;
                yMarkerPlaneBottom = yMarkerPlaneTop + seriesSize;
                xMarkerPlane.push({start: xMarkerPlaneLeft, end: xMarkerPlaneRight});
                yMarkerPlane.push({start: yMarkerPlaneTop, end: yMarkerPlaneBottom});
                if(!groupMarkers && (isNaN(xcoords[i]) || isNaN(ycoords[i])))
                {
                    this._markers.push(null);
                    continue;
                }
                config = this._getMarkerDimensions(xcoords[i], ycoords[i], calculatedSize, offset);
                if(!isNaN(config.calculatedSize) && config.calculatedSize > 0)
                {
                    top = config.top;
                    left = config.left;

                    if(groupMarkers)
                    {
                        dimensions[setSizeKey][i] = setSize;
                        dimensions[calculatedSizeKey][i] = config.calculatedSize;
                        xvalues.push(left);
                        yvalues.push(top);
                    }
                    else
                    {
                        style[setSizeKey] = setSize;
                        style[calculatedSizeKey] = config.calculatedSize;
                        style.x = left;
                        style.y = top;
                        if(fillColors)
                        {
                            style.fill.color = fillColors[i % fillColors.length];
                        }
                        if(borderColors)
                        {
                            style.border.color = borderColors[i % borderColors.length];
                        }
                        marker = this.getMarker(style, graphOrder, i);
                    }

                }
                else if(!groupMarkers)
                {
                    this._markers.push(null);
                }
            }
            this.set("xMarkerPlane", xMarkerPlane);
            this.set("yMarkerPlane", yMarkerPlane);
            if(groupMarkers)
            {
                this._createGroupMarker({
                    fill: style.fill,
                    border: style.border,
                    dimensions: dimensions,
                    xvalues: xvalues,
                    yvalues: yvalues,
                    shape: style.shape
                });
            }
            else
            {
                this._clearMarkerCache();
            }
        };
 
        Y.ColumnSeries.prototype.updateMarkerState = function(type, i)
        {
            if(this._markers && this._markers[i])
            {
                var styles = this._copyObject(this.get("styles").marker),
                    markerStyles,
                    state = this._getState(type),
                    xcoords = this.get("xcoords"),
                    ycoords = this.get("ycoords"),
                    marker = this._markers[i],
                    markers,
                    seriesStyles,
                    seriesCollection = this.get("seriesTypeCollection"),
                    seriesLen = seriesCollection ? seriesCollection.length : 0,
                    seriesSize = 0,
                    offset = 0,
                    renderer,
                    n = 0,
                    xs = [],
                    order = this.get("order"),
                    config;
                markerStyles = state === "off" || !styles[state] ? this._copyObject(styles) : this._copyObject(styles[state]);
                markerStyles.fill.color = this._getItemColor(markerStyles.fill.color, i);
                markerStyles.border.color = this._getItemColor(markerStyles.border.color, i);
                config = this._getMarkerDimensions(xcoords[i], ycoords[i], styles.width, offset);
                markerStyles.height = config.calculatedSize;
                markerStyles.width = Math.min(this._maxSize, markerStyles.width);
                marker.set(markerStyles);
                for(; n < seriesLen; ++n)
                {
                    xs[n] = xcoords[i] + seriesSize;
                    seriesStyles = seriesCollection[n].get("styles").marker;
                    seriesSize += Math.min(this._maxSize, seriesStyles.width);
                    if(order > n)
                    {
                        offset = seriesSize;
                    }
                    offset -= seriesSize/2;
                }
                for(n = 0; n < seriesLen; ++n)
                {
                    markers = seriesCollection[n].get("markers");
                    if(markers)
                    {
                        renderer = markers[i];
                        if(renderer && renderer !== undefined)
                        {
                            renderer.set("x", (xs[n] - seriesSize/2));
                        }
                    }
                }
                marker.get("graphic")._redraw();
            }
        };
    }

