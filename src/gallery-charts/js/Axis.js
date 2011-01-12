Y.Axis = Y.Base.create("axis", Y.Widget, [Y.Renderer], {
    /**
     * @private
     * @description Triggered by a change in the dataSet attribute. Removes any old dataSet listeners and sets up listeners for the new dataSet.
     */
    dataSetChangeHandler: function(e)
    {
       var dataSet = e.newVal,
            oldDataSet = e.prevVal;
        if(oldDataSet)
        {
            oldDataSet.detach("dataReady", this._dataChangeHandler);
            oldDataSet.detach("dataUpdate", this._dataChangeHandler);
        }
        dataSet.after("dataReady", Y.bind(this._dataChangeHandler, this));
        dataSet.after("dataUpdate", Y.bind(this._dataChangeHandler, this));
    },

    /**
     * @private
     * @description Handler for data changes.
     */
    _dataChangeHandler: function(e)
    {
        if(this.get("rendered"))
        {
            this._drawAxis();
        }
    },

    /**
     * @private
     */
    _updateHandler: function(e)
    {
        if(this.get("rendered"))
        {
            this._drawAxis();
        }
    },

    /**
     * @private
     */
    _positionChangeHandler: function(e)
    {
        this._layout =this.getLayout(this.get("position"));
        if(this.get("rendered"))
        {
            this._drawAxis();
        }
    },

    /**
     * @private
     */
    renderUI: function()
    {
        this._layout =this.getLayout(this.get("position"));
        this._setCanvas();
    },
    
    /**
     * @private
     */
    bindUI: function()
    {
        var dataSet = this.get("dataSet");
        if(dataSet)
        {
            dataSet.after("dataReady", Y.bind(this._dataChangeHandler, this));
            dataSet.after("dataUpdate", Y.bind(this._dataChangeHandler, this));
        }
        this.after("axisChange", this.dataSetChangeHandler);
        this.after("stylesChange", this._updateHandler);
        this.after("positionChange", this._positionChangeHandler);
        this.after("overlapGraphChange", this._updateHandler);
        this.after("widthChange", this._handleSizeChange);
        this.after("heightChange", this._handleSizeChange);
    },
   
    /**
     * @private
     */
    syncUI: function()
    {
        this._drawAxis();
    },

    /**
     * @private
     * Creates a <code>Graphic</code> instance.
     */
    _setCanvas: function()
    {
        var cb = this.get("contentBox"),
            bb = this.get("boundingBox"),
            p = this.get("position"),
            pn = this._parentNode,
            w = this.get("width"),
            h = this.get("height");
        bb.setStyle("position", "absolute");
        w = w ? w + "px" : pn.getStyle("width");
        h = h ? h + "px" : pn.getStyle("height");
        if(p === "top" || p === "bottom")
        {
            cb.setStyle("width", w);
        }
        else
        {
            cb.setStyle("height", h);
        }
        cb.setStyle("position", "relative");
        cb.setStyle("left", "0px");
        cb.setStyle("top", "0px");
        this.set("graphic", new Y.Graphic());
        this.get("graphic").render(cb);
    },
	
    /**
     * @private
     * @description Returns the default style values for the axis.
     */
    _getDefaultStyles: function()
    {
        var axisstyles = {
            majorTicks: {
                display:"inside",
                length:4,
                color:"#808080",
                weight:1,
                alpha:1
            },
            minorTicks: {
                display:"none",
                length:2,
                color:"#808080",
                weight:1
            },
            line: {
                weight:1,
                color:"#808080",
                alpha:1
            },
            majorUnit: {
                determinant:"count",
                count:11,
                distance:75
            },
            top: "0px",
            left: "0px",
            width: "100px",
            height: "100px",
            label: {
                color:"#808080",
                fontSize:"85%",
                rotation: 0,
                margin: {
                    top:4,
                    right:4,
                    bottom:4,
                    left:4
                }
            },
            hideOverlappingLabelTicks: false
        };
        
        return Y.merge(Y.Renderer.prototype._getDefaultStyles(), axisstyles); 
    },

    _handleSizeChange: function(e)
    {
        var type = e.type,
            pos = this.get("position"),
            vert = pos == "left" || pos == "right",
            cb = this.get("contentBox"),
            hor = pos == "bottom" || pos == "top";
        cb.setStyle("width", this.get("width"));
        cb.setStyle("height", this.get("height"));
        if((hor && type == "widthChange") || (vert && type == "heightChange"))
        {
            this._drawAxis();
        }
    },

    /**
     * @private
     * @description Strategy for drawing the axis dependent upon the axis position.
     */
    _layout: null,

    /**
     * @private 
     * @description Returns the correct _layout class instance to be used for drawing the
     * axis.
     */
    getLayout: function(pos)
    {
        var l;
        switch(pos)
        {
            case "top" :
                l = new Y.TopAxisLayout({axisRenderer:this});
            break;
            case "bottom" : 
                l = new Y.BottomAxisLayout({axisRenderer:this});
            break;
            case "left" :
                l = new Y.LeftAxisLayout({axisRenderer:this});
            break;
            case "right" :
                l = new Y.RightAxisLayout({axisRenderer:this});
            break;
        }
        return l;
    },
    
    /**
     * @private
     * @description Draws line based on start point, end point and line object.
     */
    drawLine: function(startPoint, endPoint, line)
    {
        var graphic = this.get("graphic");
        graphic.lineStyle(line.weight, line.color, line.alpha);
        graphic.moveTo(startPoint.x, startPoint.y);
        graphic.lineTo(endPoint.x, endPoint.y);
        graphic.end();
    },

    /**
     * @private
     * Basic logic for drawing an axis.
     */
    _drawAxis: function ()
    {
        var styles = this.get("styles"),
            majorTickStyles = styles.majorTicks,
            drawTicks = majorTickStyles.display != "none",
            tickPoint,
            majorUnit = styles.majorUnit,
            dataSet = this.get("dataSet"),
            len,
            majorUnitDistance,
            i = 0,
            layoutLength,
            position,
            lineStart,
            label,
            layout = this._layout,
            labelFunction = this.get("labelFunction") || dataSet.get("labelFunction"),
            labelFunctionScope = this.get("labelFunctionScope") || this,
            labelFormat = this.get("labelFormat") || dataSet.get("labelFormat"),
            graphic = this.get("graphic");
        graphic.clear();
		layout.setTickOffsets();
        layoutLength = this.getLength();
        lineStart = layout.getLineStart();
        len = dataSet.getTotalMajorUnits(majorUnit, layoutLength);
        majorUnitDistance = dataSet.getMajorUnitDistance(len, layoutLength, majorUnit);
        this.set("edgeOffset", dataSet.getEdgeOffset(len, layoutLength) * 0.5);
        tickPoint = this.getFirstPoint(lineStart);
        this.drawLine(lineStart, this.getLineEnd(tickPoint), styles.line);
        if(drawTicks) 
        {
           layout.drawTick(tickPoint, majorTickStyles);
        }
        if(len < 1) 
        {
            return;
        }
        this._createLabelCache();
        this._tickPoints = [];
        layout.set("maxLabelSize", 0); 
        for(; i < len; ++i)
	    {
            if(drawTicks) 
            {
                layout.drawTick(tickPoint, majorTickStyles);
            }
            position = this.getPosition(tickPoint);
            label = this.getLabel(tickPoint);
            label.innerHTML = labelFunction.apply(labelFunctionScope, [dataSet.getLabelByIndex(i, len), labelFormat]);
            tickPoint = this.getNextPoint(tickPoint, majorUnitDistance);
        }
        layout.setSizeAndPosition();
        this._clearLabelCache();
        if(this.get("overlapGraph"))
        {
           layout.offsetNodeForTick(this.get("contentBox"));
        }
        layout.setCalculatedSize();
        for(i = 0; i < len; ++i)
        {
            layout.positionLabel(this.get("labels")[i], this._tickPoints[i]);
        }
        this.fire("axisRendered");
    },
    
    /**
     * @private
     * @description Collection of labels used in creating an axis.
     */
    _labels: null,

    /**
     * @private 
     * @description Collection of labels to be reused in creating an axis.
     */
    _labelCache: null,

    /**
     * @private
     * @description Draws and positions a label based on its style properties.
     */
    getLabel: function(pt, pos)
    {
        var i,
            label,
            cache = this._labelCache,
            styles = this.get("styles").label;
        if(cache.length > 0)
        {
            label = cache.shift();
        }
        else
        {
            label = document.createElement("span");
            label.style.whiteSpace = "nowrap";
            Y.one(label).addClass("axisLabel");
        }
        label.style.display = "block";
        label.style.position = "absolute";
        this.get("contentBox").appendChild(label);
        this._labels.push(label);
        this._tickPoints.push({x:pt.x, y:pt.y});
        this._layout.updateMaxLabelSize(label);
        for(i in styles)
        {
            if(styles.hasOwnProperty(i) && i != "rotation" && i != "margin")
            {
                label.style[i] = styles[i];
            }
        }
        return label;
    },   
    
    /**
     * @private
     * Creates a cache of labels for reuse.
     */
    _createLabelCache: function()
    {
        if(this._labels)
        {
            this._labelCache = this._labels.concat();
        }
        else
        {
            this._labelCache = [];
        }
        this._labels = [];
    },
    
    /**
     * @private
     * Removes unused labels from the label cache
     */
    _clearLabelCache: function()
    {
        var len = this._labelCache.length,
            i = 0,
            label,
            labelCache;
        for(; i < len; ++i)
        {
            label = labelCache[i];
            label.parentNode.removeChild(label);
        }
        this._labelCache = [];
    },

    /**
     * @private
     * Indicates how to include tick length in the size calculation of an
     * axis. If set to true, the length of the tick is used to calculate
     * this size. If false, the offset of tick will be used.
     */
    _calculateSizeByTickLength: true,

    /**
     * Indicate the end point of the axis line
     */
    getLineEnd: function(pt)
    {
        var w = this.get("width"),
            h = this.get("height"),
            pos = this.get("position");
        if(pos === "top" || pos === "bottom")
        {
            return {x:w, y:pt.y};
        }
        else
        {
            return {x:pt.x, y:h};
        }
    },

    /**
     * Returns the distance between the first and last data points.
     */
    getLength: function()
    {
        var l,
            style = this.get("styles"),
            padding = style.padding,
            w = this.get("width"),
            h = this.get("height"),
            pos = this.get("position");
        if(pos === "top" || pos === "bottom")
        {
            l = w - (padding.left + padding.right);
        }
        else
        {
            l = h - (padding.top + padding.bottom);
        }
        return l;
    },

    /**
     * Calculates the coordinates for the first point on an axis.
     */
    getFirstPoint:function(pt)
    {
        var style = this.get("styles"),
            pos = this.get("position"),
            padding = style.padding,
            np = {x:pt.x, y:pt.y};
        if(pos === "top" || pos === "bottom")
        {
            np.x += padding.left + this.get("edgeOffset");
        }
        else
        {
            np.y += this.get("height") - (padding.top + this.get("edgeOffset"));
        }
        return np;
    },

    /**
     * Returns the next majorUnit point.
     */
    getNextPoint: function(point, majorUnitDistance)
    {
        var pos = this.get("position");
        if(pos === "top" || pos === "bottom")
        {
            point.x = point.x + majorUnitDistance;		
        }
        else
        {
            point.y = point.y - majorUnitDistance;
        }
        return point;
    },

    /**
     * Calculates the coordinates for the last point on an axis.
     */
    getLastPoint: function()
    {
        var style = this.get("styles"),
            padding = style.padding,
            w = this.get("width"),
            pos = this.get("position");
        if(pos === "top" || pos === "bottom")
        {
            return {x:w - padding.right, y:padding.top};
        }
        else
        {
            return {x:padding.left, y:padding.top};
        }
    },

    /**
     * Calculates the position of a point on the axis.
     */
    getPosition: function(point)
    {
        var p,
            h = this.get("height"),
            style = this.get("styles"),
            padding = style.padding,
            pos = this.get("position"),
            dataType = this.get("dataSet").get("dataType");
        if(pos === "left" || pos === "right") 
        {
            //Numeric data on a vertical axis is displayed from bottom to top.
            //Categorical and Timeline data is displayed from top to bottom.
            if(dataType === "numeric")
            {
                p = (h - (padding.top + padding.bottom)) - (point.y - padding.top);
            }
            else
            {
                p = point.y - padding.top;
            }
        }
        else
        {
            p = point.x - padding.left;
        }
        return p;
    }
}, {
    ATTRS: 
    {
        edgeOffset: 
        {
            value: 0
        },

        /**
         * The graphic in which the axis line and ticks will be rendered.
         */
        graphic: {},
        
        /**
         * Reference to the <code>Axis</code> instance used for assigning 
         * <code>Axis</code>.
         */
        dataSet: {},

        /**
         * Contains the contents of the axis. 
         */
        node: {},

        /**
         * Direction of the axis.
         */
        position: {
            value: "bottom",

            validator: function(val)
            {
                return ((val === "bottom" || val === "top" || val === "left" || val === "right"));
            }
        },

        /**
         * Distance determined by the tick styles used to calculate the distance between the axis
         * line in relation to the top of the axis.
         */
        topTickOffset: {
            value: 0
        },

        /**
         * Distance determined by the tick styles used to calculate the distance between the axis
         * line in relation to the bottom of the axis.
         */
        bottomTickOffset: {
            value: 0
        },

        /**
         * Distance determined by the tick styles used to calculate the distance between the axis
         * line in relation to the left of the axis.
         */
        leftTickOffset: {
            value: 0
        },

        /**
         * Distance determined by the tick styles used to calculate the distance between the axis
         * line in relation to the right side of the axis.
         */
        rightTickOffset: {
            value: 0
        },
        
        labels: {
            readOnly: true,
            getter: function()
            {
                return this._labels;
            }
        },

        /**
         * Collection of points used for placement of labels and ticks along the axis.
         */
        tickPoints: {
            readOnly: true,

            getter: function()
            {
                return this._tickPoints;
            }
        },

        /**
         * Indicates whether the axis overlaps the graph. If an axis is the inner most axis on a given
         * position and the tick position is inside or cross, the axis will need to overlap the graph.
         */
        overlapGraph: {
            value:true,

            validator: function(val)
            {
                return Y.Lang.isBoolean(val);
            }
        },

        /**
         * Function used to format labels.
         */
        labelFunction: {},

        /**
         * Object which should have by the labelFunction
         */
        labelFunctionScope: {},

        /**
         * Pattern to be used by a labelFunction
         */
        labelFormat: {}
    }
});
