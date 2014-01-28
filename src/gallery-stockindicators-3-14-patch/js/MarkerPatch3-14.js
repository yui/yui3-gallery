    if(Y.MarkerSeries) {
        Y.MarkerSeries.prototype._copyObject = COPYOBJECT;
        Y.MarkerSeries.prototype._createMarker = CREATEMARKER;
       
        Y.MarkerSeries.prototype.drawPlots = function()
        {
            if(!this.get("xcoords") || this.get("xcoords").length < 1)
            {
                return;
            }
            var isNumber = Y.Lang.isNumber,
                style = this._copyObject(this.get("styles").marker),
                w = style.width,
                h = style.height,
                xcoords = this.get("xcoords"),
                ycoords = this.get("ycoords"),
                i = 0,
                len = xcoords.length,
                top = ycoords[0],
                left,
                marker,
                offsetWidth = w/2,
                offsetHeight = h/2,
                xvalues,
                yvalues,
                fillColors = null,
                borderColors = null,
                graphOrder = this.get("graphOrder"),
                groupMarkers = this.get("groupMarkers");
            if(groupMarkers)
            {
                xvalues = [];
                yvalues = [];
                for(; i < len; ++i)
                {
                    xvalues.push(parseFloat(xcoords[i] - offsetWidth));
                    yvalues.push(parseFloat(ycoords[i] - offsetHeight));
                }
                this._createGroupMarker({
                    xvalues: xvalues,
                    yvalues: yvalues,
                    fill: style.fill,
                    border: style.border,
                    dimensions: {
                        width: w,
                        height: h
                    },
                    graphOrder: graphOrder,
                    shape: style.shape
                });
                return;
            }
            if(ISARRAY(style.fill.color))
            {
                fillColors = style.fill.color.concat();
            }
            if(ISARRAY(style.border.color))
            {
                borderColors = style.border.color.concat();
            }
            this._createMarkerCache();
            for(; i < len; ++i)
            {
                top = parseFloat(ycoords[i] - offsetHeight);
                left = parseFloat(xcoords[i] - offsetWidth);
                if(!isNumber(left) || !isNumber(top))
                {
                    this._markers.push(null);
                    continue;
                }
                if(fillColors)
                {
                    style.fill.color = fillColors[i % fillColors.length];
                }
                if(borderColors)
                {
                    style.border.color = borderColors[i % borderColors.length];
                }

                style.x = left;
                style.y = top;
                marker = this.getMarker(style, graphOrder, i);
            }
            this._clearMarkerCache();
        };
       
        Y.MarkerSeries.prototype.updateMarkerState = function(type, i)
        {
            if(this._markers && this._markers[i])
            {
                var w,
                    h,
                    styles = this._copyObject(this.get("styles").marker),
                    state = this._getState(type),
                    xcoords = this.get("xcoords"),
                    ycoords = this.get("ycoords"),
                    marker = this._markers[i],
                    markerStyles = state === "off" || !styles[state] ? styles : styles[state];
                    markerStyles.fill.color = this._getItemColor(markerStyles.fill.color, i);
                    markerStyles.border.color = this._getItemColor(markerStyles.border.color, i);
                    markerStyles.stroke = markerStyles.border;
                    marker.set(markerStyles);
                    w = markerStyles.width;
                    h = markerStyles.height;
                    marker.set("x", (xcoords[i] - w/2));
                    marker.set("y",  (ycoords[i] - h/2));
                    marker.set("visible", this.get("visible"));
                    marker.get("graphic")._redraw();
            }
        };
    }

