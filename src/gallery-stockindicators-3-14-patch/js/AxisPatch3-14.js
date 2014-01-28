    if(Y.Axis) {
        GETCATEGORYCOORDFROMVALUE = function(min, max, length, dataValue, offset)
        {
            var range,
                multiplier,
                valuecoord;
            if(Y.Lang.isNumber(dataValue))
            {
                range = max - min;
                multiplier = length/range;
                valuecoord = (dataValue - min) * multiplier;
                valuecoord = offset + valuecoord;
            }
            else
            {
                valuecoord = NaN;
            }
            return valuecoord;
        };
        Y.CategoryAxisBase.prototype._getCoordFromValue = GETCATEGORYCOORDFROMVALUE;
        Y.CategoryAxis.prototype._getCoordFromValue = GETCATEGORYCOORDFROMVALUE;
        Y.CategoryAxis.prototype._getLabelData = function(
            constantVal,
            staticCoord,
            dynamicCoord,
            min,
            max,
            edgeOffset,
            layoutLength,
            count,
            dataValues
        )
        {
            var labelValue,
                i,
                points = [],
                values = [],
                point,
                labelIndex,
                data = this.get("data"),
                offset = edgeOffset;
            dataValues = dataValues || data;
            for(i = 0; i < count; i = i + 1)
            {
                labelValue = dataValues[i];
                labelIndex = Y.Array.indexOf(data, labelValue);
                if(Y.Lang.isNumber(labelIndex) && labelIndex > -1)
                {
                    point = {};
                    point[staticCoord] = constantVal;
                    point[dynamicCoord] = this._getCoordFromValue(
                        min,
                        max,
                        layoutLength,
                        labelIndex,
                        offset
                    );
                    points.push(point);
                    values.push(labelValue);
                }
            }
            return {
                points: points,
                values: values
            };
        };
        
        GETNUMERICCOORDFROMVALUE = function(min, max, length, dataValue, offset, reverse)
        {
            var range,
                multiplier,
                valuecoord,
                isNumber = Y.Lang.isNumber;
            dataValue = parseFloat(dataValue);
            if(isNumber(dataValue))
            {
                if(this.get("scaleType") === "logarithmic" && min > 0)
                {
                    min = Math.log(min);
                    max = Math.log(max);
                    dataValue = Math.log(dataValue);
                }
                range = max - min;
                multiplier = length/range;
                valuecoord = (dataValue - min) * multiplier;
                valuecoord = reverse ? offset - valuecoord : offset + valuecoord;
            }
            else
            {
                valuecoord = NaN;
            }
            return valuecoord;
        };
        
        Y.NumericAxisBase.prototype._getCoordFromValue = GETNUMERICCOORDFROMVALUE;
        Y.NumericAxis.prototype._getCoordFromValue = GETNUMERICCOORDFROMVALUE;
        
        Y.NumericAxis.prototype._getDataValuesByCount = function(count, min, max)
        {
            var dataValues = [],
                dataValue = min,
                len = count - 1,
                range = max - min,
                increm = range/len,
                i;
            for(i = 0; i < len; i = i + 1)
            {
                dataValues.push(dataValue);
                dataValue = dataValue + increm;
            }
            dataValues.push(max);
            return dataValues;
        };

        Y.NumericAxis.prototype._getLabelData = function(
            constantVal,
            staticCoord,
            dynamicCoord,
            min,
            max,
            edgeOffset,
            layoutLength,
            count,
            dataValues
        )
        {
            var dataValue,
                i,
                points = [],
                values = [],
                point,
                isVertical = staticCoord === "x",
                offset = isVertical ? layoutLength + edgeOffset : edgeOffset;
            dataValues = dataValues || this._getDataValuesByCount(count, min, max);
            for(i = 0; i < count; i = i + 1)
            {
                dataValue = parseFloat(dataValues[i]);
                if(dataValue <= max && dataValue >= min)
                {
                    point = {};
                    point[staticCoord] = constantVal;
                    point[dynamicCoord] = this._getCoordFromValue(
                        min,
                        max,
                        layoutLength,
                        dataValue,
                        offset,
                        isVertical
                    );
                    points.push(point);
                    values.push(dataValue);
                }
            }
            return {
                points: points,
                values: values
            };
        };
       
        Y.BottomAxisLayout.prototype.positionLabel = function(label, pt, styles, i)
        {
            var host = this,
                offset = parseFloat(styles.label.offset),
                tickOffset = host.get("bottomTickOffset"),
                labelStyles = styles.label,
                margin = 0,
                props = host._labelRotationProps,
                rot = props.rot,
                absRot = props.absRot,
                leftOffset = Math.round(pt.x),
                topOffset = Math.round(pt.y),
                labelWidth = host._labelWidths[i],
                labelHeight = host._labelHeights[i];
            if(labelStyles.margin && labelStyles.margin.top)
            {
                margin = labelStyles.margin.top;
            }
            if(rot === 90)
            {
                topOffset -= labelHeight/2 * rot/90;
                leftOffset = leftOffset + labelHeight/2 - (labelHeight * offset);
            }
            else if(rot === -90)
            {
                topOffset -= labelHeight/2 * absRot/90;
                leftOffset = leftOffset - labelWidth + labelHeight/2 - (labelHeight * offset);
            }
            else if(rot > 0)
            {
                leftOffset = leftOffset + labelHeight/2 - (labelHeight * offset);
                topOffset -= labelHeight/2 * rot/90;
            }
            else if(rot < 0)
            {
                leftOffset = leftOffset - labelWidth + labelHeight/2 - (labelHeight * offset);
                topOffset -= labelHeight/2 * absRot/90;
            }
            else
            {
                leftOffset -= labelWidth * offset;
            }
            topOffset += margin;
            topOffset += tickOffset;
            props.labelWidth = labelWidth;
            props.labelHeight = labelHeight;
            props.x = leftOffset;
            props.y = topOffset;
            host._rotate(label, props);
        };
       
        Y.LeftAxisLayout.prototype.positionLabel = function(label, pt, styles, i)
        {
            var host = this,
                offset = parseFloat(styles.label.offset),
                tickOffset = host.get("leftTickOffset"),
                totalTitleSize = this._totalTitleSize,
                leftOffset = pt.x + totalTitleSize - tickOffset,
                topOffset = pt.y,
                props = this._labelRotationProps,
                rot = props.rot,
                absRot = props.absRot,
                maxLabelSize = host._maxLabelSize,
                labelWidth = this._labelWidths[i],
                labelHeight = this._labelHeights[i];
            if(rot === 0)
            {
                leftOffset -= labelWidth;
                topOffset -= labelHeight * offset;
            }
            else if(rot === 90)
            {
                leftOffset -= labelWidth * 0.5;
                topOffset = topOffset + labelWidth/2 - (labelWidth * offset);
            }
            else if(rot === -90)
            {
                leftOffset -= labelWidth * 0.5;
                topOffset = topOffset - labelHeight + labelWidth/2 - (labelWidth * offset);
            }
            else
            {
                leftOffset -= labelWidth + (labelHeight * absRot/360);
                topOffset -= labelHeight * offset;
            }
            props.labelWidth = labelWidth;
            props.labelHeight = labelHeight;
            props.x = Math.round(maxLabelSize + leftOffset);
            props.y = Math.round(topOffset);
            this._rotate(label, props);
        };

        Y.TopAxisLayout.prototype.positionLabel = function(label, pt, styles, i)
        {
            var host = this,
                offset = parseFloat(styles.label.offset),
                totalTitleSize = this._totalTitleSize,
                maxLabelSize = host._maxLabelSize,
                leftOffset = pt.x,
                topOffset = pt.y + totalTitleSize + maxLabelSize,
                props = this._labelRotationProps,
                rot = props.rot,
                absRot = props.absRot,
                labelWidth = this._labelWidths[i],
                labelHeight = this._labelHeights[i];
            if(rot === 0)
            {
                leftOffset -= labelWidth * offset;
                topOffset -= labelHeight;
            }
            else
            {
                if(rot === 90)
                {
                    leftOffset = leftOffset - labelWidth + labelHeight/2 - (labelHeight * offset);
                    topOffset -= (labelHeight * 0.5);
                }
                else if (rot === -90)
                {
                    leftOffset = leftOffset + labelHeight/2 - (labelHeight * offset);
                    topOffset -= (labelHeight * 0.5);
                }
                else if(rot > 0)
                {
                    leftOffset = leftOffset - labelWidth + labelHeight/2 - (labelHeight * offset);
                    topOffset -= labelHeight - (labelHeight * rot/180);
                }
                else
                {
                    leftOffset = leftOffset + labelHeight/2 - (labelHeight * offset);
                    topOffset -= labelHeight - (labelHeight * absRot/180);
                }
            }
            props.x = Math.round(leftOffset);
            props.y = Math.round(topOffset);
            props.labelWidth = labelWidth;
            props.labelHeight = labelHeight;
            this._rotate(label, props);
        };

        Y.RightAxisLayout.prototype.positionLabel = function(label, pt, styles, i)
        {
            var host = this,
                offset = parseFloat(styles.label.offset),
                tickOffset = host.get("rightTickOffset"),
                labelStyles = styles.label,
                margin = 0,
                leftOffset = pt.x,
                topOffset = pt.y,
                props = this._labelRotationProps,
                rot = props.rot,
                absRot = props.absRot,
                labelWidth = this._labelWidths[i],
                labelHeight = this._labelHeights[i];
            if(labelStyles.margin && labelStyles.margin.left)
            {
                margin = labelStyles.margin.left;
            }
            if(rot === 0)
            {
                topOffset -= labelHeight * offset;
            }
            else if(rot === 90)
            {
                leftOffset -= labelWidth * 0.5;
                topOffset = topOffset - labelHeight + labelWidth/2 - (labelWidth * offset);
            }
            else if(rot === -90)
            {
                topOffset = topOffset + labelWidth/2 - (labelWidth * offset);
                leftOffset -= labelWidth * 0.5;
            }
            else
            {
                topOffset -= labelHeight * offset;
                leftOffset += labelHeight/2 * absRot/90;
            }
            leftOffset += margin;
            leftOffset += tickOffset;
            props.labelWidth = labelWidth;
            props.labelHeight = labelHeight;
            props.x = Math.round(leftOffset);
            props.y = Math.round(topOffset);
            this._rotate(label, props);
        };
        DRAWAXIS = function ()
        {
            if(this._drawing)
            {
                this._callLater = true;
                return;
            }
            this._drawing = true;
            this._callLater = false;
            if(this._layout)
            {
                var styles = this.get("styles"),
                    line = styles.line,
                    labelStyles = styles.label,
                    majorTickStyles = styles.majorTicks,
                    drawTicks = majorTickStyles.display !== "none",
                    len,
                    i = 0,
                    layout = this._layout,
                    layoutLength,
                    lineStart,
                    label,
                    labelWidth,
                    labelHeight,
                    labelFunction = this.get("labelFunction"),
                    labelFunctionScope = this.get("labelFunctionScope"),
                    labelFormat = this.get("labelFormat"),
                    graphic = this.get("graphic"),
                    path = this.get("path"),
                    tickPath,
                    explicitlySized,
                    position = this.get("position"),
                    labelData,
                    labelValues,
                    point,
                    points,
                    firstPoint,
                    lastPoint,
                    firstLabel,
                    lastLabel,
                    staticCoord,
                    dynamicCoord,
                    edgeOffset,
                    explicitLabels = this._labelValuesExplicitlySet ? this.get("labelValues") : null,
                    direction = (position === "left" || position === "right") ? "vertical" : "horizontal";
                this._labelWidths = [];
                this._labelHeights = [];
                graphic.set("autoDraw", false);
                path.clear();
                path.set("stroke", {
                    weight: line.weight,
                    color: line.color,
                    opacity: line.alpha
                });
                this._labelRotationProps = this._getTextRotationProps(labelStyles);
                this._labelRotationProps.transformOrigin = layout._getTransformOrigin(this._labelRotationProps.rot);
                layout.setTickOffsets.apply(this);
                layoutLength = this.getLength();

                len = this.getTotalMajorUnits();
                edgeOffset = this.getEdgeOffset(len, layoutLength);
                this.set("edgeOffset", edgeOffset);
                lineStart = layout.getLineStart.apply(this);

                if(direction === "vertical")
                {
                    staticCoord = "x";
                    dynamicCoord = "y";
                }
                else
                {
                    staticCoord = "y";
                    dynamicCoord = "x";
                }

                labelData = this._getLabelData(
                    lineStart[staticCoord],
                    staticCoord,
                    dynamicCoord,
                    this.get("minimum"),
                    this.get("maximum"),
                    edgeOffset,
                    layoutLength - edgeOffset - edgeOffset,
                    len,
                    explicitLabels
                );

                points = labelData.points;
                labelValues = labelData.values;
                len = points.length;
                if(!this._labelValuesExplicitlySet)
                {
                    this.set("labelValues", labelValues, {src: "internal"});
                }

                //Don't create the last label or tick.
                if(this.get("hideFirstMajorUnit"))
                {
                    firstPoint = points.shift();
                    firstLabel = labelValues.shift();
                    len = len - 1;
                }

                //Don't create the last label or tick.
                if(this.get("hideLastMajorUnit"))
                {
                    lastPoint = points.pop();
                    lastLabel = labelValues.pop();
                    len = len - 1;
                }

                if(len < 1)
                {
                    this._clearLabelCache();
                }
                else
                {
                    this.drawLine(path, lineStart, this.getLineEnd(lineStart));
                    if(drawTicks)
                    {
                        tickPath = this.get("tickPath");
                        tickPath.clear();
                        tickPath.set("stroke", {
                            weight: majorTickStyles.weight,
                            color: majorTickStyles.color,
                            opacity: majorTickStyles.alpha
                        });
                        for(i = 0; i < len; i = i + 1)
                        {
                            point = points[i];
                            if(point)
                            {
                                layout.drawTick.apply(this, [tickPath, points[i], majorTickStyles]);
                            }
                        }
                    }
                    this._createLabelCache();
                    this._maxLabelSize = 0;
                    this._totalTitleSize = 0;
                    this._titleSize = 0;
                    this._setTitle();
                    explicitlySized = layout.getExplicitlySized.apply(this, [styles]);
                    for(i = 0; i < len; i = i + 1)
                    {
                        point = points[i];
                        if(point)
                        {
                            label = this.getLabel(labelStyles);
                            this._labels.push(label);
                            this.get("appendLabelFunction")(label, labelFunction.apply(labelFunctionScope, [labelValues[i], labelFormat]));
                            labelWidth = Math.round(label.offsetWidth);
                            labelHeight = Math.round(label.offsetHeight);
                            if(!explicitlySized)
                            {
                                this._layout.updateMaxLabelSize.apply(this, [labelWidth, labelHeight]);
                            }
                            this._labelWidths.push(labelWidth);
                            this._labelHeights.push(labelHeight);
                        }
                    }
                    this._clearLabelCache();
                    if(this.get("overlapGraph"))
                    {
                       layout.offsetNodeForTick.apply(this, [this.get("contentBox")]);
                    }
                    layout.setCalculatedSize.apply(this);
                    if(this._titleTextField)
                    {
                        this._layout.positionTitle.apply(this, [this._titleTextField]);
                    }
                    len = this._labels.length;
                    for(i = 0; i < len; ++i)
                    {
                        layout.positionLabel.apply(this, [this.get("labels")[i], points[i], styles, i]);
                    }
                    if(firstPoint)
                    {
                        points.unshift(firstPoint);
                    }
                    if(lastPoint)
                    {
                        points.push(lastPoint);
                    }
                    if(firstLabel)
                    {
                        labelValues.unshift(firstLabel);
                    }
                    if(lastLabel)
                    {
                        labelValues.push(lastLabel);
                    }
                    this._tickPoints = points;
                }
            }
            this._drawing = false;
            if(this._callLater)
            {
                this._drawAxis();
            }
            else
            {
                this._updatePathElement();
                this.fire("axisRendered");
            }
        };

        GETDEFAULTAXISSTYLES = function() {
            var axisstyles = {
                majorTicks: {
                    display:"inside",
                    length:4,
                    color:"#dad8c9",
                    weight:1,
                    alpha:1
                },
                minorTicks: {
                    display:"none",
                    length:2,
                    color:"#dad8c9",
                    weight:1
                },
                line: {
                    weight:1,
                    color:"#dad8c9",
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
                    alpha: 1,
                    fontSize:"85%",
                    rotation: 0,
                    offset: 0.5,
                    margin: {
                        top: undefined,
                        right: undefined,
                        bottom: undefined,
                        left: undefined
                    }
                },
                title: {
                    color:"#808080",
                    alpha: 1,
                    fontSize:"85%",
                    rotation: undefined,
                    margin: {
                        top: undefined,
                        right: undefined,
                        bottom: undefined,
                        left: undefined
                    }
                },
                hideOverlappingLabelTicks: false
            };

            return Y.merge(Y.Renderer.prototype._getDefaultStyles(), axisstyles);
        };
        GETAXISLABEL =  function(styles)
        {
            var i,
                label,
                labelCache = this._labelCache,
                customStyles = {
                    rotation: "rotation",
                    margin: "margin",
                    alpha: "alpha"
                };
            if(labelCache && labelCache.length > 0)
            {
                label = labelCache.shift();
            }
            else
            {
                label = DOCUMENT.createElement("span");
                label.className = Y.Lang.trim([label.className, "axisLabel"].join(' '));
                this.get("contentBox").append(label);
            }
            if(!DOCUMENT.createElementNS)
            {
                if(label.style.filter)
                {
                    label.style.filter = null;
                }
            }
            label.style.display = "block";
            label.style.whiteSpace = "nowrap";
            label.style.position = "absolute";
            for(i in styles)
            {
                if(styles.hasOwnProperty(i) && !customStyles.hasOwnProperty(i))
                {
                    label.style[i] = styles[i];
                }
            }
            return label;
        };
        Y.CategoryAxis.prototype._getDefaultStyles = GETDEFAULTAXISSTYLES;
        Y.NumericAxis.prototype._getDefaultStyles = GETDEFAULTAXISSTYLES;
        Y.CategoryAxis.prototype._drawAxis = DRAWAXIS;
        Y.NumericAxis.prototype._drawAxis = DRAWAXIS;
        Y.CategoryAxis.prototype.getLabel = GETAXISLABEL;
        Y.NumericAxis.prototype.getLabel = GETAXISLABEL;
    }

